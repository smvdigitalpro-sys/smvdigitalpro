import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, customerName } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in cart' });
    }

    // Build line_items dynamically with price_data
    const line_items = [];
    let hasRecurring = false;

    for (const item of items) {
      const setupAmount = parseInt(item.setup) || 0;
      const monthlyAmount = parseInt(item.monthly) || 0;
      const itemName = item.name || 'Service';

      // Setup fee (one-time charge)
      if (setupAmount > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${itemName} - Setup Fee`,
              description: `One-time setup and installation`,
            },
            unit_amount: setupAmount * 100, // Stripe uses cents
          },
          quantity: 1,
        });
      }

      // Monthly subscription (recurring)
      if (monthlyAmount > 0) {
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${itemName} - Monthly Subscription`,
              description: `Monthly hosting, maintenance & support`,
            },
            unit_amount: monthlyAmount * 100,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        });
        hasRecurring = true;
      }
    }

    if (line_items.length === 0) {
      return res.status(400).json({ error: 'Invalid item amounts' });
    }

    // Mode: subscription if any recurring item, otherwise one-time payment
    const mode = hasRecurring ? 'subscription' : 'payment';

    const sessionConfig = {
      mode,
      payment_method_types: ['card'],
      line_items,
      success_url: `${req.headers.origin}/?payment=success`,
      cancel_url: `${req.headers.origin}/?payment=cancelled`,
      billing_address_collection: 'required',
    };

    // Add customer info if provided
    if (customerEmail) {
      sessionConfig.customer_email = customerEmail;
    }

    // Add metadata for tracking
    sessionConfig.metadata = {
      customer_name: customerName || '',
      items: items.map(i => i.name).join(', '),
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ error: error.message });
  }
}
