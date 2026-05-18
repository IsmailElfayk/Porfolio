require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB().catch((err) => { console.error('DB connection failed:', err.message); });

const allowedOrigins = [
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((o) => o.trim()) : []),
  ...(process.env.ADMIN_URL  ? process.env.ADMIN_URL.split(',').map((o) => o.trim())  : []),
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use((_, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/projects',      require('./routes/projects'));
app.use('/api/papers',        require('./routes/papers'));
app.use('/api/posts',         require('./routes/posts'));
app.use('/api/profile',       require('./routes/profile'));
app.use('/api/settings',      require('./routes/settings'));
app.use('/api/skills',        require('./routes/skills'));
app.use('/api/about',         require('./routes/about'));
app.use('/api/themes',        require('./routes/themeRoutes'));
app.use('/api/sections',      require('./routes/sections'));
app.use('/api/section-items', require('./routes/sectionItems'));
app.use('/api/visitors',      require('./routes/visitors'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use(require('./middleware/errorHandler'));

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
}

module.exports = app;
