import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GraphForce from '../components/math/GraphForce';
import { C, F } from '../styles/theme';
import { getAbout, getProfile } from '../api/index';

const FALLBACK_ABOUT = {
  bio: "Moroccan Master's student in Applied Mathematics and Intelligent Systems at Sidi Mohamed Ben Abdellah University (Fès). Passionate about numerical analysis, partial differential equations, and artificial intelligence, I aim to pursue a PhD exploring the connections between mathematical modeling, numerical methods, and machine learning. I combine mathematical rigor with computational innovation, and also build web applications using the MERN stack.",
  image: '',
  cvFileUrl: '#',
  experience: [],
  education: [
    { degree: "Master's Degree in Applied Mathematics & Intelligent Systems (ongoing)", institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2024 — 2026', description: '' },
    { degree: "Bachelor's Degree in Applied Mathematics (Numerical Analysis)", institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2024', description: '' },
    { degree: 'DEUG in Applied Mathematics', institution: 'Faculty of Sciences Dhar El Mahraz — SMSBU, Fès', period: '2020 — 2023', description: '' },
    { degree: 'High School Diploma in Mathematical Sciences A', institution: 'Ibn Khaldoun High School, Karia Ba Mohamed, Taounate', period: '2020', description: '' },
  ],
  skills: [
    { name: 'MATLAB', level: 'Expert', category: 'Scientific Computing' },
    { name: 'Python', level: 'Expert', category: 'Scientific Computing' },
    { name: 'C / C++', level: 'Advanced', category: 'Scientific Computing' },
    { name: 'React.js', level: 'Advanced', category: 'Web Development' },
    { name: 'Node.js', level: 'Advanced', category: 'Web Development' },
    { name: 'Express.js', level: 'Advanced', category: 'Web Development' },
    { name: 'HTML / CSS', level: 'Expert', category: 'Web Development' },
    { name: 'Tailwind CSS', level: 'Advanced', category: 'Web Development' },
    { name: 'Machine Learning', level: 'Intermediate', category: 'Artificial Intelligence' },
    { name: 'Neural Networks', level: 'Intermediate', category: 'Artificial Intelligence' },
    { name: 'Git & GitHub', level: 'Advanced', category: 'Tools' },
    { name: 'OOP', level: 'Advanced', category: 'Tools' },
  ],
  strengths: [
    { icon: '∂', title: 'Mathematical Modeling' },
    { icon: '∫', title: 'Numerical Analysis & Scientific Computing' },
    { icon: '</>', title: 'Web Development (MERN Stack)' },
    { icon: '🧩', title: 'Problem Solving' },
  ],
  deskItems: [
    { label: 'Reading', value: 'Trefethen — Approximation Theory and Approximation Practice' },
    { label: 'Building', value: 'PDE solver with interactive web visualizations (FreeFEM + React)' },
    { label: 'Learning', value: 'Parallel computing & Fluid mechanics' },
    { label: 'Working', value: "Master's Thesis on Nonsmooth Multiobjective Optimization" },
  ],
};

const Tag = ({ children }) => (
  <span style={{ fontSize: 12.5, padding: '5px 10px', background: C.panel2, borderRadius: 6, fontWeight: 500 }}>
    {children}
  </span>
);

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key] || 'Other';
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {});
}

export default function About() {
  const [about, setAbout] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getAbout().then((data) => { if (data) setAbout(data); }).catch(() => { });
    getProfile().then((data) => { if (data) setProfile(data); }).catch(() => { });
  }, []);

  const data = about || FALLBACK_ABOUT;
  const cvUrl = data.cvFileUrl || '#';
  const education = (data.education || []).length > 0 ? data.education : FALLBACK_ABOUT.education;
  const strengths = (data.strengths || []).length > 0 ? data.strengths : FALLBACK_ABOUT.strengths;
  const deskItems = (data.deskItems || []).length > 0 ? data.deskItems : FALLBACK_ABOUT.deskItems;
  const skills = data.skills || [];
  const experience = data.experience || [];

  const displayName = (profile?.name) || 'EL FAYK ISMAIL';
  const displayHeadline = (profile?.headline) || 'Applied Mathematics & MERN Stack Developer';
  const displaySubtitle = (profile?.subtitle) || "Master's Student in Applied Mathematics & Intelligent Systems";

  const skillGroups = groupBy(skills, 'category');

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '40px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Profile header — image + name + Download CV ── */}
        <div className="about-profile" style={{ display: 'flex', gap: 26, alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 130, height: 130, borderRadius: '50%', flexShrink: 0,
            background: data.image ? undefined : 'radial-gradient(circle at 40% 35%, #d4a373, #6b4f3a)',
            overflow: 'hidden',
          }}>
            {data.image ? (
              <img src={data.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <svg viewBox="0 0 130 130" width="100%" height="100%">
                <ellipse cx="65" cy="55" rx="22" ry="26" fill="#e8c4a0" />
                <path d="M 30 130 Q 65 80 100 130 Z" fill="#3a4252" />
                <ellipse cx="65" cy="40" rx="26" ry="14" fill="#3a2818" />
              </svg>
            )}
          </div>
          <div className="about-info" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ flexGrow: 1 }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, margin: '0 0 6px' }}>{displayName}</h1>
              <div style={{ color: C.muted, fontSize: 15, marginBottom: 4 }}>{displayHeadline}{displaySubtitle ? ` | ${displaySubtitle}` : ''}</div>
              {/* <div style={{ color: C.muted, fontSize: 15, marginBottom: 12 }}>Combining analytical rigor with creative coding solutions.</div> */}
            </div>
            <a href={cvUrl} download style={{
              minWidth: "fit-content",
              background: C.blue, color: '#fff', borderRadius: 999,
              padding: '10px 20px', fontWeight: 600, fontSize: 14, textDecoration: 'none', display: 'inline-block',
            }}>Download CV ↓</a>
          </div>
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 36, maxWidth: 880 }}>
          {data.bio || FALLBACK_ABOUT.bio}
        </p>

        {/* ── RESUME SECTION ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 48, marginBottom: 60 }}>

          {/* 1. Experience — only shown when non-empty */}
          {experience.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Experience</h2>
              {experience.map((e, i) => (
                <div key={i} className="resume-row" style={{
                  display: 'grid', gridTemplateColumns: '180px 1fr', padding: '20px 0',
                  borderTop: `1px solid ${C.border}`, gap: 24, alignItems: 'baseline'
                }}>
                  <span style={{ color: C.muted, fontSize: 13, fontFamily: F.mono }}>{e.period || e.y}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 3 }}>{e.title || e.r}</div>
                    <div style={{ color: C.blue, fontSize: 14, marginBottom: 8, fontWeight: 500 }}>{e.company || e.c}</div>
                    <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{e.description || e.d}</div>
                  </div>
                </div>
              ))}
              <div style={{ borderBottom: `1px solid ${C.border}` }} />
            </div>
          )}

          {/* 2. Education */}
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Education</h2>
          {education.map((e, i) => (
            <div key={i} className="resume-row" style={{
              display: 'grid', gridTemplateColumns: '180px 1fr',
              padding: '14px 0', borderTop: `1px solid ${C.border}`, gap: 24
            }}>
              <span style={{ color: C.muted, fontSize: 13, fontFamily: F.mono }}>{e.period || e.y}</span>
              <span style={{ fontSize: 15 }}>{e.degree ? `${e.degree} — ${e.institution}` : e.d}</span>
            </div>
          ))}
          <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 36 }} />

          {/* 3. Core strengths */}
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>Core Strengths</h2>
          <div className="grid-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 48 }}>
            {strengths.map((s, i) => (
              <div key={i} style={{
                border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 16px',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <div style={{ width: 28, height: 28, fontSize: 16 }}>{s.icon || s.i}</div>
                <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>{s.title || s.t}</div>
              </div>
            ))}
          </div>

          {/* 4. Skills — from DB */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>Skills</h2>
              <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
                {Object.entries(skillGroups).map(([cat, items]) => (
                  <div key={cat} style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em',
                      textTransform: 'uppercase', marginBottom: 10
                    }}>{cat}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                      {items.map((it, i) => (
                        <Tag key={i}>{it.name}{it.level ? ` · ${it.level}` : ''}</Tag>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── 5. What's on the desk — LAST section ── */}
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>What's on the desk</h2>
        <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {deskItems.map((item, i) => (
              <li key={i} style={{
                display: 'grid', gridTemplateColumns: '120px 1fr', padding: '14px 0',
                borderBottom: `1px solid ${C.border}`, alignItems: 'baseline'
              }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {item.label || item[0]}
                </span>
                <span style={{ fontSize: 14, lineHeight: 1.5, color: C.text }}>
                  {item.value || item[1]}
                </span>
              </li>
            ))}
          </ul>
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 24, borderRadius: 10, position: 'relative' }}>
            <GraphForce width={460} height={300} ink={C.text} />
            <div style={{ position: 'absolute', bottom: 12, left: 24, fontFamily: F.mono, fontSize: 10, color: C.faint, letterSpacing: '0.05em' }}>
              FIG. — A SMALL, RESTLESS GRAPH.
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}
