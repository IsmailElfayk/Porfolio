import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';

const BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000') + '/api';

const mdComponents = {
  h1: ({ children }) => <h1 style={{ fontSize: 28, fontWeight: 800, margin: '32px 0 14px', color: C.text }}>{children}</h1>,
  h2: ({ children }) => <h2 style={{ fontSize: 22, fontWeight: 700, margin: '28px 0 12px', color: C.text }}>{children}</h2>,
  h3: ({ children }) => <h3 style={{ fontSize: 18, fontWeight: 700, margin: '22px 0 10px', color: C.text }}>{children}</h3>,
  p:  ({ children }) => <p  style={{ margin: '0 0 16px', color: C.muted, fontSize: 15, lineHeight: 1.75 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: C.text, fontWeight: 700 }}>{children}</strong>,
  em:     ({ children }) => <em style={{ color: C.muted }}>{children}</em>,
  code: ({ inline, children }) => inline
    ? <code style={{ fontFamily: F.mono, fontSize: 13, background: C.panel2, padding: '2px 6px', borderRadius: 4, color: '#7DD8C8' }}>{children}</code>
    : <pre style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, overflowX: 'auto', margin: '16px 0' }}>
        <code style={{ fontFamily: F.mono, fontSize: 13, color: '#7DD8C8' }}>{children}</code>
      </pre>,
  ul: ({ children }) => <ul style={{ paddingLeft: 20, margin: '0 0 16px', color: C.muted }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ paddingLeft: 20, margin: '0 0 16px', color: C.muted }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 6, lineHeight: 1.65 }}>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: `3px solid ${C.blue}`, margin: '16px 0', paddingLeft: 16, color: C.muted }}>{children}</blockquote>
  ),
};

export default function PaperDetail() {
  const { id } = useParams();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/papers/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setPaper(data || null); })
      .catch(() => { setPaper(null); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      Loading…
    </div>
  );

  if (!paper) return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '80px 80px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, letterSpacing: '0.1em', marginBottom: 24 }}>ERROR · 404</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 18px' }}>Paper not found</h1>
        <Link to="/projects" style={{ color: C.blue, fontWeight: 600, fontSize: 14 }}>← Back to projects</Link>
      </div>
      <Footer />
    </div>
  );

  const p = paper;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '32px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: '0.05em' }}>
          <Link to="/projects" style={{ color: C.muted }}>projects</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: C.blue }}>paper</span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{p.title}</span>
        </div>

        {/* Hero */}
        <div style={{ width: '100%', height: 280, borderRadius: 12, overflow: 'hidden', marginBottom: 36,
          background: 'radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0a0a 80%)',
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ position: 'relative', maxWidth: 700, padding: '0 32px' }}>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.blue, fontWeight: 600, letterSpacing: '0.1em', marginBottom: 12 }}>
              PAPER · {p.year}
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.25 }}>{p.title}</h1>
          </div>
        </div>

        {/* Meta info */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32 }}>
          {p.authors && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Authors</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{p.authors}</div>
            </div>
          )}
          {p.venue && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Venue</div>
              <div style={{ fontSize: 15, fontWeight: 500, fontFamily: F.mono }}>{p.venue}</div>
            </div>
          )}
          {p.status && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>Status</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: p.status === 'published' ? C.green : p.status === 'submitted' ? C.amber : C.muted }}>
                ● {p.status}
              </span>
            </div>
          )}
          {p.doi && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>DOI</div>
              <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: C.blue, fontFamily: F.mono }}>{p.doi}</a>
            </div>
          )}
        </div>

        {/* Tags */}
        {(p.tags || []).length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {p.tags.map((t) => (
              <span key={t} style={{ fontSize: 11, padding: '4px 10px', background: C.panel2,
                border: `1px solid ${C.border}`, borderRadius: 6, color: C.muted, fontFamily: F.mono,
                letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        )}

        {/* Abstract */}
        {p.abstract && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 26px', marginBottom: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Abstract</div>
            <div style={{ maxWidth: 780, fontSize: 15, lineHeight: 1.8, color: C.text }}>
              <ReactMarkdown components={mdComponents}>{p.abstract}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* PDF + BibTeX links */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          {p.pdfUrl && (
            <a href={p.pdfUrl} target="_blank" rel="noreferrer"
              style={{ background: C.blue, color: '#fff', borderRadius: 8, padding: '10px 20px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Download PDF ↓</a>
          )}
          {p.bibtex && (
            <button onClick={() => { navigator.clipboard.writeText(p.bibtex); }}
              style={{ background: C.panel2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Copy BibTeX</button>
          )}
        </div>

        {/* Nav */}
        <div style={{ paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/projects" style={{ color: C.text, textDecoration: 'none' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>← ALL PROJECTS</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Back to projects</div>
          </Link>
          <Link to="/research" style={{ color: C.text, textDecoration: 'none', textAlign: 'right' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>RESEARCH →</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>See all papers</div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
