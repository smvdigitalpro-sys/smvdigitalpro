export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
 
  const { name, email, phone, message, orderSummary, cartTotal } = req.body;
 
  // Email to YOU (notification)
  const notifyEmail = {
    from: "SMV DigitalPro <hello@smvdigitalpro.com>",
    to: "hello@smvdigitalpro.com",
    subject: `New Order — $${cartTotal} — ${name}`,
    html: `
      <h2>New Order from SMV DigitalPro</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone/WhatsApp:</strong> ${phone || "N/A"}</p>
      <hr/>
      <h3>Order:</h3>
      <pre>${orderSummary}</pre>
      <p><strong>Total Setup: $${cartTotal}</strong></p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
    `,
  };
 
  // Confirmation email to CLIENT
  const confirmEmail = {
    from: "SMV DigitalPro <hello@smvdigitalpro.com>",
    to: email,
    subject: "We received your order — SMV DigitalPro",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c6cf0;">Thank you, ${name}! 🎉</h2>
        <p>We've received your order and will contact you within <strong>24 hours</strong> to confirm details and start setup.</p>
        <hr style="border: 1px solid #eee;" />
        <h3>Your Order:</h3>
        <pre style="background: #f5f5f5; padding: 16px; border-radius: 8px;">${orderSummary}</pre>
        <p><strong>Total Setup: $${cartTotal}</strong></p>
        <hr style="border: 1px solid #eee;" />
        <p>Questions? Reply to this email or message us on <a href="https://t.me/smvdigitalpro">Telegram</a>.</p>
        <p style="color: #999; font-size: 12px;">SMV DigitalPro · AI-Powered Digital Agency · smvdigitalpro.com</p>
      </div>
    `,
  };
 
  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    };
 
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify(notifyEmail),
    });
 
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify(confirmEmail),
    });
 
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
}
