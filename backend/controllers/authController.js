const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validEmail    = email    === (process.env.ADMIN_EMAIL    || '').trim();
    const validPassword = password === (process.env.ADMIN_PASSWORD || '').trim();
    if (!validEmail || !validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};
