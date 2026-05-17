import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';
import { getProjects, getPapers, getPosts } from '../api/index';

const FALLBACK = [
  { _id: '1', type: 'project', tags: ['PDEs', 'MATLAB'], title: 'Numerical Simulation of the Laplace Equation', description: 'Finite volumes in MATLAB on triangular mesh — comparison with exact solution.', stack: ['MATLAB'], year: 2024 },
  { _id: '2', type: 'project', tags: ['FEM', 'FreeFEM'], title: 'PDE Resolution using Finite Elements', description: 'Anisotropic diffusion elliptic equation — P1 FEM in FreeFEM & MATLAB, L² and H¹ error analysis.', stack: ['FreeFEM', 'MATLAB'], year: 2025 },
  { _id: '3', type: 'project', tags: ['Neuroscience', 'Modeling'], title: 'Mathematical Modeling of Brain Function (Hodgkin–Huxley)', description: 'Implementation of neuronal action potential model with numerical visualization.', stack: ['MATLAB', 'Python'], year: 2024 },
  { _id: '4', type: 'project', tags: ['Linear Algebra', 'Numerics'], title: 'Approximation of Eigenvalues & Eigenvectors', description: 'MATLAB comparison of Power iteration, Jacobi, QR, SVD, Lanczos methods.', stack: ['MATLAB'], year: 2024 },
  { _id: '5', type: 'project', tags: ['AI', 'ML'], title: 'Generative AI & Algorithm Classification', description: 'GAN, VAE, Transformers — study of generative models and learning paradigms.', stack: ['Python'], year: 2024 },
  { _id: '6', type: 'paper', tags: ['Optimization', 'Research'], title: 'Nonsmooth Multiobjective Optimization', description: "Tangential subdifferentials and convexificators — optimality conditions and duality theory. Master's thesis.", stack: ['LaTeX'], year: 2025 },
];

const CATEGORY_FILTERS = [
  { label: 'All',     value: 'all' },
  { label: 'Projects', value: 'project' },
  { label: 'Papers',  value: 'paper' },
  { label: 'Writing', value: 'writing' },
];

const MATH_SYMBOLS = ['∫', '⬡', '∂', '∇', '∮', 'Σ'];
const CARD_BGSYMBOLS = [
  'linear-gradient(135deg,#0a2a1a,#0a1a0a)',
  'linear-gradient(135deg,#1a2a3a,#0a1422)',
  'linear-gradient(135deg,#0a3a3a,#0a1a1a)',
];

export default function Projects() {
  const [projects, setProjects]     = useState(FALLBACK);
  const [category, setCategory]     = useState('all');
  const [activeTags, setActiveTags] = useState([]);
  const [search, setSearch]         = useState('');
  const [query, setQuery]           = useState('');
  const debounceRef = useRef(null);

  useEffect(() => {
    Promise.all([
      getProjects('status=published').catch(() => []),
      getPapers().catch(() => []),
      getPosts('status=published').catch(() => []),
    ]).then(([projData, paperData, postData]) => {
      const all = [];

      // Add projects as-is
      if (projData && projData.length) all.push(...projData);

      // Normalize papers → project card shape
      if (paperData && paperData.length) {
        all.push(...paperData.map((p) => ({
          _id: p._id,
          type: 'paper',
          title: p.title,
          description: p.abstract || `${p.authors || ''} · ${p.venue || ''}`.trim(),
          shortDescription: p.shortDescription || p.abstract || `${p.authors || ''} · ${p.venue || ''}`.trim(),
          tags: p.tags || [],
          stack: [],
          year: p.year,
          image: p.image || '',
        })));
      }

      // Normalize posts → project card shape
      if (postData && postData.length) {
        all.push(...postData.map((p) => ({
          _id: p._id,
          type: 'writing',
          title: p.title,
          description: p.summary || '',
          shortDescription: p.summary || '',
          tags: p.tag ? [p.tag] : [],
          stack: [],
          year: p.publishedAt ? new Date(p.publishedAt).getFullYear() : new Date().getFullYear(),
          image: '',
        })));
      }

      if (all.length) setProjects(all);
    });
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(search.trim().toLowerCase()), 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  const allTags = [...new Set(projects.flatMap((p) => [...(p.tags || []), ...(p.stack || [])]))].sort();

  const toggleTag = (tag) =>
    setActiveTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const visible = projects.filter((p) => {
    const matchCat   = category === 'all' || (p.type || 'project') === category;
    const matchTags  = activeTags.length === 0 || activeTags.some((t) => (p.tags || []).includes(t) || (p.stack || []).includes(t));
    const matchQuery = !query || p.title.toLowerCase().includes(query);
    return matchCat && matchTags && matchQuery;
  });

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div style={{ padding: '32px 80px 60px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Projects</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 22px' }}>A showcase of my work, blending mathematical rigor with full-stack development.</p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 420, background: C.panel2, border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '9px 14px', fontSize: 13, color: C.text, outline: 'none',
            fontFamily: 'inherit', marginBottom: 16,
          }}
        />

        {/* Category filter row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {CATEGORY_FILTERS.map(({ label, value }) => (
            <button key={value} onClick={() => setCategory(value)} style={{
              background: category === value ? C.blue : C.panel,
              color: category === value ? '#fff' : C.text,
              border: 'none', borderRadius: 8, padding: '8px 16px',
              fontFamily: 'inherit', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'background 0.15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Tag / stack filter row */}
        {allTags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
            {allTags.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)} style={{
                fontSize: 11, padding: '4px 10px',
                background: activeTags.includes(tag) ? C.blue + '33' : C.panel2,
                border: `1px solid ${activeTags.includes(tag) ? C.blue : C.border}`,
                borderRadius: 5, color: activeTags.includes(tag) ? C.blue : C.muted,
                fontFamily: F.mono, letterSpacing: '0.04em', textTransform: 'uppercase',
                fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
              }}>{tag}</button>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 32 }}>
          {visible.map((p, i) => {
            const detailPath = (p.type === 'paper') ? `/papers/${p._id}`
              : (p.type === 'writing') ? `/writing/${p._id}`
              : `/projects/${p._id}`;
            return (
            <Link key={p._id} to={detailPath} style={{ textDecoration: 'none', color: C.text }}>
              <div style={{ position: 'relative', height: 220, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: CARD_BGSYMBOLS[i % 3], transition: 'border-color 0.15s' }}>
                {p.image
                  ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: 32, color: '#7DD8C8' }}>{MATH_SYMBOLS[i % 6]}</div>
                }
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)', padding: '40px 16px 14px' }}>
                  {p.tags && p.tags.length > 0 && (
                    <div style={{ marginBottom: 6, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {p.tags.slice(0, 2).map((t) => (
                        <span key={t} style={{ fontSize: 10, padding: '1px 7px', background: 'rgba(125,216,200,0.18)', borderRadius: 3,
                          color: '#7DD8C8', fontFamily: F.mono, letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.3 }}>{p.title}</div>
                  {(p.shortDescription || p.description) && (
                    <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, lineHeight: 1.4, marginTop: 4 }}>{p.shortDescription || p.description}</div>
                  )}
                </div>
              </div>
            </Link>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div style={{ textAlign: 'center', color: C.muted, padding: '60px 0', fontSize: 14 }}>
            No results found.
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
