import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { C, F } from '../styles/theme';
import { getThemeBySlug } from '../api/index';

export default function ThemeDetailPage() {
  const { slug } = useParams();
  const [theme,   setTheme]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getThemeBySlug(slug)
      .then((data) => setTheme(data))
      .catch(() => setTheme(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontFamily: F.sans }}>
      Loading…
    </div>
  );

  if (!theme) return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '80px 80px 60px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: F.mono, fontSize: 13, color: C.blue, letterSpacing: '0.1em', marginBottom: 24 }}>ERROR · 404</div>
        <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 18px' }}>Theme not found</h1>
        <Link to="/" style={{ color: C.blue, fontWeight: 600, fontSize: 14 }}>← Back home</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '32px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.muted, marginBottom: 24, letterSpacing: '0.05em' }}>
          <Link to="/" style={{ color: C.muted }}>home</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{theme.title}</span>
        </div>

        {/* Hero image */}
        {theme.image && (
          <div style={{ width: '100%', borderRadius: 12, overflow: 'hidden', marginBottom: 36, maxHeight: 400 }}>
            <img src={theme.image} alt={theme.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {!theme.image && (
          <div style={{ width: '100%', height: 280, borderRadius: 12, marginBottom: 36,
            background: 'linear-gradient(135deg, #1d2a2a, #0f1a1c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F.mono, fontSize: 48, color: '#7DD8C8' }}>
            ∂
          </div>
        )}

        <h1 style={{ fontSize: 40, fontWeight: 800, margin: '0 0 28px', letterSpacing: '-0.01em' }}>{theme.title}</h1>

        {/* Markdown description */}
        {theme.description ? (
          <div style={{ width: '100%' }}>
            <MarkdownRenderer>{theme.description}</MarkdownRenderer>
          </div>
        ) : (
          <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.75 }}>No description available yet.</p>
        )}

        <div style={{ paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
          <Link to="/" style={{ color: C.text, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: 14 }}>
            <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em' }}>← BACK</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
