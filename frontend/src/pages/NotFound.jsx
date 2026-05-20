import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';

const RECENT = [
  'Understanding Finite Element Methods for Elliptic PDEs',
  'Building a PDE Solver with React and FreeFEM',
  'Nonsmooth Optimization — An Introduction to Subdifferentials',
];

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '80px 80px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, letterSpacing: '0.1em', marginBottom: 24 }}>
          ERROR · 404
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 800, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
          ∄&nbsp; this page.
        </h1>
        <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.6, margin: '0 0 32px' }}>
          There does not exist a page at that URL. Either it never did, or it was moved when the site got reorganised. Sorry about that.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => navigate('/')} style={{
            background: C.blue, color: '#fff', border: 'none', borderRadius: 999,
            padding: '12px 26px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}>← Back home</button>
          <button onClick={() => navigate('/projects')} style={{
            background: 'transparent', color: '#fff', border: `1px solid ${C.border}`, borderRadius: 999,
            padding: '12px 26px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
          }}>See all projects</button>
        </div>

        <div style={{ marginTop: 64, padding: 28, background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 12, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontFamily: F.mono, color: C.muted, letterSpacing: '0.08em',
            marginBottom: 14, textTransform: 'uppercase' }}>While you're here · recently published</div>
          {RECENT.map((t, i) => (
            <a key={i} href="/writing" style={{ display: 'block', padding: '10px 0',
              borderTop: i > 0 ? `1px solid ${C.border}` : 'none', color: C.text, textDecoration: 'none', fontSize: 14 }}>
              <span style={{ color: C.blue, marginRight: 10 }}>↗</span> {t}
            </a>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
