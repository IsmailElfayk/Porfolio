import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroVisual from '../components/HeroVisual';
import { C, F } from '../styles/theme';
import { getSettings, getProjects, getSections, getSectionItems } from '../api/index';

const FALLBACK_PROJECTS = [
  { _id: '1', title: 'Numerical Simulation of the Laplace Equation', shortDescription: 'Finite volumes in MATLAB on triangular mesh — comparison with exact solution.', tags: ['MATLAB', 'PDEs'] },
  { _id: '2', title: 'PDE Resolution using Finite Elements', shortDescription: 'Anisotropic diffusion elliptic equation — P1 FEM in FreeFEM & MATLAB, L² and H¹ error analysis.', tags: ['FreeFEM', 'FEM'] },
  { _id: '3', title: 'Nonsmooth Multiobjective Optimization', shortDescription: 'Tangential subdifferentials and convexificators — optimality conditions and duality theory.', tags: ['Optimization', 'Research'] },
];

const FALLBACK_SETTINGS = {
  heroTitle:    'From Mathematical Modeling to Full-Stack Web Applications',
  heroSubtitle: 'Bridging numerical analysis, PDEs, and AI with modern web development — turning rigorous mathematics into working software.',
};

const MATH_BG = [
  'linear-gradient(135deg, #1d2a2a, #0f1a1c)',
  'linear-gradient(135deg, #2a4d4a, #173434)',
  'linear-gradient(135deg, #0a1a1c, #0a0f12)',
];

export default function Home() {
  const navigate = useNavigate();
  const [projects,      setProjects]      = useState([]);
  const [settings,      setSettings]      = useState(FALLBACK_SETTINGS);
  const [sections,      setSections]      = useState([]);
  const [sectionItems,  setSectionItems]  = useState([]);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    getSettings().then((d) => { if (d) setSettings({ ...FALLBACK_SETTINGS, ...d }); }).catch(() => {});
    getProjects('status=published').then((d) => { if (d && d.length) setProjects(d.slice(0, 3)); }).catch(() => {});
    Promise.all([getSections(), getSectionItems()])
      .then(([secs, items]) => { setSections(secs || []); setSectionItems(items || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visibleSections = sections.filter((s) => s.visible).sort((a, b) => a.order - b.order);
  const contentSections = visibleSections.filter((s) => s.slug !== 'projects');
  const projectsSection = visibleSections.find((s) => s.slug === 'projects');
  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const itemsForSection = (sectionId) =>
    sectionItems.filter((it) => {
      const id = it.section?._id || it.section;
      return id === sectionId || id?.toString() === sectionId?.toString();
    }).sort((a, b) => a.order - b.order);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar active="home" />
      <div style={{ padding: '32px 80px 60px' }}>

        <HeroVisual>
          <div style={{ position: 'relative', textAlign: 'center', maxWidth: 800, padding: '0 32px' }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0, marginBottom: 18 }}>
              {settings.heroTitle || FALLBACK_SETTINGS.heroTitle}
            </h1>
            <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: '0 auto 26px', maxWidth: 600 }}>
              {settings.heroSubtitle || FALLBACK_SETTINGS.heroSubtitle}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => navigate('/projects')} style={{
                background: C.blue, color: '#fff', border: 'none', borderRadius: 999,
                padding: '12px 26px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>View Projects</button>
              <button onClick={() => navigate('/about')} style={{
                background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: 999,
                padding: '12px 26px', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
              }}>About Me</button>
            </div>
          </div>
        </HeroVisual>

        {/* Dynamic content sections */}
        {!loading && contentSections.map((sec) => {
          const items = itemsForSection(sec._id);
          if (items.length === 0) return null;
          return (
            <div key={sec._id} style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 14px' }}>{sec.name}</h2>
              {sec.intro && (
                <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 900, margin: '0 0 22px' }}>
                  {sec.intro}
                </p>
              )}
              <div style={{ display: 'flex', gap: 18, overflowX: 'auto', paddingBottom: 8 }}>
                {items.map((item, i) => (
                  <Link key={item._id} to={`/sections/${item._id}`} style={{ textDecoration: 'none', color: C.text, flex: '0 0 auto', width: 'calc((100% - 36px) / 3)', minWidth: 280 }}>
                    <div style={{ position: 'relative', height: 220, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: MATH_BG[i % 3] }}>
                      {item.image
                        ? <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: 28, color: '#7DD8C8' }}>{item.title.slice(0, 2)}</div>
                      }
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)', padding: '36px 16px 14px' }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.3 }}>{item.title}</div>
                        {item.shortDescription && (
                          <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.4, marginTop: 5 }}>{item.shortDescription}</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {/* Featured projects — shown if projects section is visible or no sections configured yet */}
        {(projectsSection?.visible !== false) && displayProjects.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Featured Projects</h2>
                {projectsSection?.intro && (
                  <p style={{ color: C.muted, fontSize: 14, lineHeight: 1.65, maxWidth: 900, margin: '8px 0 0' }}>
                    {projectsSection.intro}
                  </p>
                )}
              </div>
              <Link to="/projects" style={{ color: C.blue, fontSize: 14, fontWeight: 600 }}>See all →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
              {displayProjects.slice(0, 3).map((p, i) => (
                <Link key={p._id} to={`/projects/${p._id}`} style={{ textDecoration: 'none', color: C.text }}>
                  <div style={{ position: 'relative', height: 220, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #1a3a3a, #0a1422)' }}>
                    {p.image
                      ? <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontSize: 28, color: '#7DD8C8' }}>{['∫', '⬡', '∂'][i % 3]}</div>
                    }
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)', padding: '36px 16px 14px' }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.3 }}>{p.title}</div>
                      {(p.shortDescription || p.description) && (
                        <div style={{ color: 'rgba(255,255,255,0.68)', fontSize: 12, lineHeight: 1.4, marginTop: 5 }}>{p.shortDescription || p.description}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
