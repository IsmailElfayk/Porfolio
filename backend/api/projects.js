module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const projects = JSON.parse(process.env.PROJECTS_JSON || '[]');
    return res.status(200).json(projects);
  } catch (err) {
    console.error('[projects] JSON parse error:', err);
    return res.status(500).json({ error: 'Failed to parse PROJECTS_JSON — check Vercel env var' });
  }
};
