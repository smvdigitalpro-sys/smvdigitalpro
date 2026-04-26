import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

// Disable Vercel's default body parser to access raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle successful checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      // Retrieve full session with line items expanded
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      const customerEmail = fullSession.customer_email || fullSession.customer_details?.email || 'unknown';
      const customerName = fullSession.metadata?.customer_name || fullSession.customer_details?.name || 'Customer';
      const itemsList = fullSession.metadata?.items || 'Order';
      const amountTotal = (fullSession.amount_total / 100).toFixed(2);
      const currency = (fullSession.currency || 'usd').toUpperCase();
      const mode = fullSession.mode; // 'subscription' or 'payment'

      // Build order summary from line items
      let orderSummary = '';
      if (fullSession.line_items && fullSession.line_items.data) {
        orderSummary = fullSession.line_items.data
          .map(item => {
            const amount = (item.amount_total / 100).toFixed(2);
            return `${item.description}: $${amount}`;
          })
          .join('\n');
      } else {
        orderSummary = itemsList;
      }

      // 1. Email to OWNER (you)
      await resend.emails.send({
        from: 'SMV DigitalPro <hello@smvdigitalpro.com>',
        to: 'smvdigitalpro@gmail.com',
        subject: `✅ PAID: $${amountTotal} - ${customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #10B981;">💰 Payment Received!</h2>
            <p style="font-size: 18px;"><strong>Amount paid: $${amountTotal} ${currency}</strong></p>
            <hr>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></p>
            <p><strong>Payment type:</strong> ${mode === 'subscription' ? 'Subscription (recurring)' : 'One-time payment'}</p>
            <hr>
            <h3>Order details:</h3>
            <pre style="background: #f4f4f4; padding: 12px; border-radius: 8px; white-space: pre-wrap;">${orderSummary}</pre>
            <hr>
            <p><strong>Stripe Session ID:</strong> ${session.id}</p>
            <p style="color: #666; font-size: 12px;">View full details in your <a href="https://dashboard.stripe.com/payments">Stripe Dashboard</a></p>
          </div>
        `,
      });

      // 2. Email to CLIENT (thank you)
      if (customerEmail && customerEmail !== 'unknown') {
        await resend.emails.send({
          from: 'SMV DigitalPro <hello@smvdigitalpro.com>',
          to: customerEmail,
          subject: 'Payment Confirmed - SMV DigitalPro',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7C6CF0;">Thank you, ${customerName}! 🎉</h2>
              <p>Your payment has been successfully processed.</p>
              <p>We'll contact you within <strong>24 hours</strong> to confirm details and start setup.</p>
              <hr>
              <h3>Your Order:</h3>
              <pre style="background: #f4f4f4; padding: 12px; border-radius: 8px; white-space: pre-wrap;">${orderSummary}</pre>
              <p style="font-size: 18px;"><strong>Amount paid: $${amountTotal} ${currency}</strong></p>
              <hr>
              <p>Questions? Reply to this email or message us on <a href="https://t.me/smvdigitalpro">Telegram</a>.</p>
              <p style="color: #999; font-size: 12px; margin-top: 30px;">SMV DigitalPro · AI-Powered Digital Agency · <a href="https://smvdigitalpro.com">smvdigitalpro.com</a></p>
            </div>
          `,
        });
      }

      console.log('Payment processed and emails sent for session:', session.id);
    } catch (err) {
      console.error('Error processing checkout.session.completed:', err);
      // Don't return error - acknowledge webhook to Stripe to avoid retries
    }
  }

  // Acknowledge receipt of the event
  return res.status(200).json({ received: true });
}
