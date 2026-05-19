import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';
import { getPosts } from '../api/index';

const FALLBACK = [
  { _id: '1', title: 'Understanding Finite Element Methods for Elliptic PDEs', summary: 'A practical guide to P1 finite elements — from weak formulation to FreeFEM implementation.', readTime: '10 min', tag: 'Numerics', publishedAt: '2026-04-12', featured: true },
  { _id: '2', title: 'Building a PDE Solver with React and FreeFEM', summary: 'How I connected a FreeFEM backend to a React frontend for interactive PDE visualizations.', readTime: '8 min', tag: 'MERN', publishedAt: '2026-03-03' },
  { _id: '3', title: 'Convergence of Random Variables — Weak vs Strong Laws', summary: 'A clear explanation of the different types of convergence in probability and measure theory.', readTime: '12 min', tag: 'Probability', publishedAt: '2026-01-28' },
  { _id: '4', title: 'Nonsmooth Optimization — An Introduction to Subdifferentials', summary: 'What happens when your objective function is not differentiable? An overview of tangential subdifferentials.', readTime: '10 min', tag: 'Optimization', publishedAt: '2025-11-17' },
  { _id: '5', title: 'Getting Started with the MERN Stack as a Math Student', summary: 'How a background in applied mathematics helps (and sometimes hinders) web development.', readTime: '6 min', tag: 'Career', publishedAt: '2025-09-02' },
];

const fmt = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function Blog() {
  const [posts, setPosts] = useState(FALLBACK);

  useEffect(() => {
    getPosts('status=published')
      .then((data) => { if (data && data.length) setPosts(data); })
      .catch(() => {});
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p._id !== featured._id);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '40px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Writing</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 36px' }}>Notes on the seam between mathematics and software. Updated when something is worth saying.</p>

        {/* Featured */}
        <div className="blog-featured" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 28,
          background: C.panel, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 32 }}>
          <div style={{ aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden',
            background: 'radial-gradient(circle at 30% 40%, #1a4040 0%, #0c1a1c 80%)' }}>
            <svg viewBox="0 0 400 300" width="100%" height="100%" style={{ opacity: 0.7 }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <circle key={i} cx={50 + (i % 8) * 45} cy={50 + Math.floor(i / 8) * 60}
                  r={3 + (i % 4)} fill="#7DD8C8" opacity={0.3 + (i % 5) * 0.12} />
              ))}
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, color: C.muted, fontFamily: F.mono, marginBottom: 12 }}>
              <span style={{ color: C.blue, fontWeight: 600 }}>FEATURED</span>
              <span>·</span>
              <span>{fmt(featured.publishedAt)}</span>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 12px', lineHeight: 1.2 }}>{featured.title}</h2>
            <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, margin: '0 0 16px' }}>{featured.summary}</p>
            <div style={{ color: C.blue, fontSize: 14, fontWeight: 600 }}>Read post →</div>
          </div>
        </div>

        {/* List */}
        <div>
          {rest.map((p, i) => (
            <div key={p._id} className="blog-post-row" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 80px',
              padding: '22px 4px', borderTop: `1px solid ${C.border}`, alignItems: 'baseline', gap: 22 }}>
              <span style={{ color: C.muted, fontSize: 13, fontFamily: F.mono }}>{fmt(p.publishedAt)}</span>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 5 }}>{p.title}</div>
                <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.55 }}>{p.summary}</div>
              </div>
              <span style={{ fontSize: 11, padding: '4px 10px', background: C.panel2, borderRadius: 6,
                color: C.muted, fontWeight: 600, justifySelf: 'start' }}>{p.tag}</span>
              <span style={{ color: C.muted, fontSize: 12, fontFamily: F.mono, justifySelf: 'end' }}>{p.readTime}</span>
            </div>
          ))}
          <div style={{ borderBottom: `1px solid ${C.border}` }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
