module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required: name, email, message' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Log the submission. To enable email delivery, install nodemailer,
    // add CONTACT_EMAIL to Vercel env vars, and replace this block with
    // a nodemailer.createTransport(...).sendMail(...) call.
    console.log('[contact] submission', {
      name, email,
      message: message.slice(0, 200),
      to: process.env.CONTACT_EMAIL || '(CONTACT_EMAIL not set)',
      timestamp: new Date().toISOString(),
    });

    return res.status(200).json({ success: true, message: 'Message received' });
  } catch (err) {
    console.error('[contact]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
