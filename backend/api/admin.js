module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) return res.status(500).json({ error: 'ADMIN_SECRET not configured' });

    const auth = req.headers['authorization'] || '';
    if (auth !== `Bearer ${secret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const projects = JSON.parse(process.env.PROJECTS_JSON || '[]');
    return res.status(200).json({
      totalProjects: projects.length,
      lastUpdated:   new Date().toISOString(),
    });
  } catch (err) {
    console.error('[admin]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
