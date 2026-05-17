const express = require('express');
const router  = express.Router();
const Visitor = require('../models/Visitor');

// ── In-memory online tracker ──────────────────────────────────────────────────
// Maps sessionId → last ping timestamp. A visitor is "online" if they pinged
// within the last 30 seconds.
const activeSessions = new Map();
const ONLINE_TTL_MS  = 30_000; // 30 seconds

// Cleanup stale sessions every 15 seconds
setInterval(() => {
  const now = Date.now();
  for (const [id, ts] of activeSessions) {
    if (now - ts > ONLINE_TTL_MS) activeSessions.delete(id);
  }
}, 15_000);

// POST /api/visitors/ping — heartbeat to keep session alive
router.post('/ping', (req, res) => {
  const sid = req.body.sid;
  if (!sid) return res.status(400).json({ error: 'sid required' });
  activeSessions.set(sid, Date.now());
  res.json({ online: activeSessions.size });
});

// GET /api/visitors/online — current online count
router.get('/online', (_req, res) => {
  res.json({ online: activeSessions.size });
});

// POST /api/visitors/hit — increment and return total count
router.post('/hit', async (_req, res, next) => {
  try {
    const doc = await Visitor.findOneAndUpdate(
      { key: 'global' },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    res.json({ count: doc.count });
  } catch (err) {
    next(err);
  }
});

// GET /api/visitors — return current total count without incrementing
router.get('/', async (_req, res, next) => {
  try {
    const doc = await Visitor.findOne({ key: 'global' });
    res.json({ count: doc ? doc.count : 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
