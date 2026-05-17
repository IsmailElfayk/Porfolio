module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    return res.status(200).json({
      name:   process.env.PORTFOLIO_NAME   || 'I. El Fayk',
      title:  process.env.PORTFOLIO_TITLE  || 'Full Stack Developer',
      bio:    process.env.PORTFOLIO_BIO    || 'Building things with code.',
      skills: (process.env.PORTFOLIO_SKILLS || 'JavaScript,Node.js,React,CSS')
                .split(',').map(s => s.trim()).filter(Boolean),
    });
  } catch (err) {
    console.error('[about]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
