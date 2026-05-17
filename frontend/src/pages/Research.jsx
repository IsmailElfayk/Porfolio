import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';
import { getPapers, getAbout } from '../api/index';

const FALLBACK_PUBS = [
  { _id: '1', year: 2025, title: 'Nonsmooth Multiobjective Optimization via Tangential Subdifferentials and Convexificators', authors: 'I. El Fayk', venue: "Master's Thesis (Ongoing)", tags: ['thesis'] },
  { _id: '2', year: 2025, title: 'PDE Resolution using Finite Elements — Anisotropic Diffusion', authors: 'I. El Fayk', venue: 'FSDM — SMSBU, Fès', tags: ['project'] },
  { _id: '3', year: 2024, title: 'Numerical Simulation of the Laplace Equation via Finite Volumes', authors: 'I. El Fayk', venue: 'FSDM — SMSBU, Fès', tags: ['project'] },
  { _id: '4', year: 2024, title: 'Mathematical Modeling of Brain Function (Hodgkin–Huxley)', authors: 'I. El Fayk', venue: 'FSDM — SMSBU, Fès', tags: ['project'] },
];

const FALLBACK_TALKS = [
  { year: '2025', title: 'International Workshop on Numerical Analysis and Modeling (IWNAM: 3DTS25)', venue: 'Doctoral School — Certificate of Participation' },
  { year: '2024', title: 'English Communication Certificate (9 months)', venue: 'Centre Atlantique de Formation, Fès' },
];

export default function Research() {
  const [papers, setPapers] = useState(FALLBACK_PUBS);
  const [talks,  setTalks]  = useState(FALLBACK_TALKS);

  useEffect(() => {
    getPapers()
      .then((data) => { if (data && data.length) setPapers(data); })
      .catch(() => {});
    getAbout()
      .then((data) => { if (data && data.talks && data.talks.length) setTalks(data.talks); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '40px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Research</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 32px', maxWidth: 700 }}>
          Papers, certificates, and ongoing research. My work focuses on numerical analysis, PDEs, and multiobjective optimization.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>Publications</h2>
        {papers.map((p) => (
          <article key={p._id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 220px',
            padding: '22px 0', borderTop: `1px solid ${C.border}`, gap: 24, alignItems: 'baseline' }}>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{p.year}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>
                {p.authors} · <span style={{ fontFamily: F.mono, fontSize: 12 }}>{p.venue}</span>
              </div>
              {p.abstract && (
                <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6, maxWidth: 640 }}>{p.abstract}</div>
              )}
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                {(p.tags || []).map((t) => (
                  <span key={t} style={{ fontSize: 10.5, padding: '3px 8px', background: C.panel2,
                    borderRadius: 4, color: C.muted, fontFamily: F.mono, letterSpacing: '0.05em',
                    textTransform: 'uppercase', fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
              {p.pdfUrl ? (
                <a href={p.pdfUrl} target="_blank" rel="noopener noreferrer" style={{
                  background: C.blue, color: '#fff', border: 'none', borderRadius: 6,
                  padding: '8px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none', display: 'block',
                }}>PDF ↓</a>
              ) : (
                <button style={{ background: C.blue, color: '#fff', border: 'none', borderRadius: 6,
                  padding: '8px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>PDF ↓</button>
              )}
              <button style={{ background: 'transparent', color: C.text, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: '8px 14px', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit' }}>BibTeX</button>
            </div>
          </article>
        ))}
        <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 36 }} />

        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>Talks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {talks.map((t, i) => (
            <div key={i} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 12, fontFamily: F.mono, color: C.blue, marginBottom: 8, fontWeight: 600 }}>
                {t.year || t.y}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{t.title || t.t}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{t.venue || t.v}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
