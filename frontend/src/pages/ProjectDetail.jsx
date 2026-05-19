import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import SortViz from '../components/math/SortViz';
import { C, F } from '../styles/theme';

const BASE = import.meta.env.VITE_BACKEND_URL + '/api';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/projects/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setProject(data || null); })
      .catch(() => { setProject(null); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      Loading…
    </div>
  );

  if (!project) return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '80px 80px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, letterSpacing: '0.1em', marginBottom: 24 }}>ERROR · 404</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 18px' }}>Project not found</h1>
        <Link to="/projects" style={{ color: C.blue, fontWeight: 600, fontSize: 14 }}>← Back to projects</Link>
      </div>
      <Footer />
    </div>
  );

  const p = project;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar showResume={false} />
      <div style={{ padding: '32px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: '0.05em' }}>
          <Link to="/projects" style={{ color: C.muted }}>projects</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{p.title}</span>
        </div>

        {/* Hero */}
        <div style={{ width: '100%', height: 360, borderRadius: 12, overflow: 'hidden', marginBottom: 36,
          background: p.image ? undefined : 'radial-gradient(ellipse at 50% 50%, #2a1108 0%, #0a0a0a 80%)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {p.image ? (
            <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <>
              <svg viewBox="0 0 600 360" width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.85 }}>
                <g fill="none" stroke="#FF5722" strokeWidth="0.8">
                  <polygon points="280,80 360,120 340,200 260,220 220,160" />
                  <polygon points="280,80 360,120 380,180 340,200" fill="#FF5722" opacity="0.5" />
                  <polygon points="220,160 260,220 300,260 240,240" fill="#FF5722" opacity="0.3" />
                </g>
              </svg>
              <div style={{ position: 'relative', maxWidth: 700, padding: '0 32px' }}>
                <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0 }}>{p.title}</h1>
              </div>
            </>
          )}
          {p.image && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h1 style={{ fontSize: 38, fontWeight: 800, margin: 0, color: '#fff', textAlign: 'center', padding: '0 32px' }}>{p.title}</h1>
            </div>
          )}
        </div>

        {/* Tags + stack */}
        {(p.stack || []).length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {p.stack.map((s) => (
              <span key={s} style={{ fontSize: 12, padding: '4px 10px', background: C.panel2,
                border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontFamily: F.mono }}>{s}</span>
            ))}
          </div>
        )}

        {/* Rapport (Markdown) */}
        {p.rapport ? (
          <div style={{ maxWidth: 780, fontSize: 15, lineHeight: 1.8, color: C.text, marginBottom: 40 }}>
            <MarkdownRenderer>{p.rapport}</MarkdownRenderer>
          </div>
        ) : (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 12px' }}>Live Demo</h2>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 28 }}>
              <SortViz width={900} height={200} />
            </div>
          </div>
        )}

        {/* Links */}
        {(p.liveUrl || p.repoUrl) && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noreferrer"
                style={{ background: C.blue, color: '#fff', borderRadius: 8, padding: '8px 18px',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Live ↗</a>
            )}
            {p.repoUrl && (
              <a href={p.repoUrl} target="_blank" rel="noreferrer"
                style={{ background: C.panel2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '8px 18px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Repo ↗</a>
            )}
          </div>
        )}

        {/* Nav */}
        <div style={{ paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/projects" style={{ color: C.text, textDecoration: 'none' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>← ALL PROJECTS</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Back to projects</div>
          </Link>
          <Link to="/contact" style={{ color: C.text, textDecoration: 'none', textAlign: 'right' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>COLLABORATE →</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Get in touch</div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
