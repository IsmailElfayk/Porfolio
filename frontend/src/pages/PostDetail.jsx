import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

const fmt = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/posts/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { setPost(data || null); })
      .catch(() => { setPost(null); })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
      Loading…
    </div>
  );

  if (!post) return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '80px 80px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, letterSpacing: '0.1em', marginBottom: 24 }}>ERROR · 404</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 18px' }}>Post not found</h1>
        <Link to="/writing" style={{ color: C.blue, fontWeight: 600, fontSize: 14 }}>← Back to writing</Link>
      </div>
      <Footer />
    </div>
  );

  const p = post;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '32px 80px 60px', maxWidth: 860, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: '0.05em' }}>
          <Link to="/writing" style={{ color: C.muted }}>writing</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{p.title}</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
            {p.tag && (
              <span style={{ fontSize: 11, padding: '4px 10px', background: C.blue + '22', borderRadius: 6,
                color: C.blue, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{p.tag}</span>
            )}
            {p.readTime && (
              <span style={{ fontSize: 12, color: C.muted, fontFamily: F.mono }}>{p.readTime}</span>
            )}
            {p.publishedAt && (
              <span style={{ fontSize: 12, color: C.muted, fontFamily: F.mono }}>{fmt(p.publishedAt)}</span>
            )}
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.2 }}>{p.title}</h1>
          {p.summary && (
            <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.65, margin: 0 }}>{p.summary}</p>
          )}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 32 }} />

        {/* Body (Markdown) */}
        {p.body ? (
          <div style={{ maxWidth: 780, fontSize: 15, lineHeight: 1.8, color: C.text, marginBottom: 40 }}>
            <ReactMarkdown components={mdComponents}>{p.body}</ReactMarkdown>
          </div>
        ) : (
          <div style={{ color: C.muted, fontSize: 14, fontStyle: 'italic', marginBottom: 40 }}>
            No content yet — check back soon.
          </div>
        )}

        {/* Nav */}
        <div style={{ paddingTop: 32, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/writing" style={{ color: C.text, textDecoration: 'none' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>← ALL WRITING</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Back to writing</div>
          </Link>
          <Link to="/projects" style={{ color: C.text, textDecoration: 'none', textAlign: 'right' }}>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', marginBottom: 6 }}>PROJECTS →</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>See all projects</div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
