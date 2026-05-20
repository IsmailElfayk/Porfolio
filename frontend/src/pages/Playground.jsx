import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LissajousCurve from '../components/math/LissajousCurve';
import SortViz from '../components/math/SortViz';
import { C, F } from '../styles/theme';

const DEMOS = [
  { id: 'lissajous',  t: 'Lissajous curves',    d: 'Tweak frequencies a, b and the phase. Watch the figure close.', g: 'radial-gradient(circle at 50% 50%, #0a3a3a, #0a1a1a)' },
  { id: 'sorting',    t: 'Sorting visualizer',   d: 'Bubble sort — same data, different choreography.', g: 'linear-gradient(135deg, #1a2a3a, #0a1422)' },
  { id: 'voronoi',    t: 'Voronoi playground',   d: 'Click to add sites. The diagram updates in real time.', g: 'radial-gradient(circle at 30% 40%, #2a1828, #0a0a14)' },
  { id: 'phase',      t: 'Phase portrait',       d: 'A 2D dynamical system, drawn one trajectory at a time.', g: 'linear-gradient(135deg, #0a3a2a, #0a1a14)' },
  { id: 'homology',   t: 'Persistent homology',  d: 'Drag points. Watch the barcodes appear and die.', g: 'radial-gradient(circle at 60% 30%, #3a1a1a, #1a0a0a)' },
  { id: 'quadrature', t: 'Quadrature error',     d: 'See where Gauss–Legendre wins, and where it loses.', g: 'linear-gradient(135deg, #2a2a3a, #14141a)' },
];

const SYMBOL = ['∿', '⬛', '⬡', '→', '●', '∫'];

export default function Playground() {
  const [active, setActive] = useState(null);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '40px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Playground</h1>
          <span style={{ fontSize: 11, padding: '4px 10px', background: C.blue, borderRadius: 999,
            color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }}>LIVE</span>
        </div>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 32px', maxWidth: 700 }}>
          Tiny live demos. Interact with the math directly. Each one is open-source.
        </p>

        {/* Active demo panel */}
        {active === 'lissajous' && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Lissajous curves</h2>
              <button onClick={() => setActive(null)} style={{ background: 'transparent', border: `1px solid ${C.border}`,
                color: C.muted, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                Close ×
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LissajousCurve width={480} height={480} ink={C.text} accent={C.blue} />
            </div>
          </div>
        )}

        {active === 'sorting' && (
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Sorting visualizer</h2>
              <button onClick={() => setActive(null)} style={{ background: 'transparent', border: `1px solid ${C.border}`,
                color: C.muted, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>
                Close ×
              </button>
            </div>
            <SortViz width={900} height={220} ink={C.text} accent={C.blue} />
          </div>
        )}

        {/* Demo grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {DEMOS.map((d, i) => (
            <button key={d.id} onClick={() => setActive(active === d.id ? null : d.id)}
              style={{ textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', color: C.text, display: 'block' }}>
              <div style={{ background: active === d.id ? C.blue + '22' : C.panel,
                border: `1px solid ${active === d.id ? C.blue : C.border}`, borderRadius: 12, overflow: 'hidden',
                transition: 'border-color 0.15s, background 0.15s' }}>
                <div style={{ height: 160, background: d.g, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontFamily: F.mono, fontSize: 36, color: '#7DD8C8', opacity: 0.8 }}>
                  {SYMBOL[i]}
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{d.t}</div>
                  <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}>{d.d}</div>
                  {(d.id === 'lissajous' || d.id === 'sorting') && (
                    <div style={{ marginTop: 10, color: C.blue, fontSize: 12, fontWeight: 600, fontFamily: F.mono }}>
                      {active === d.id ? '▲ CLOSE' : '▶ LAUNCH'}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
