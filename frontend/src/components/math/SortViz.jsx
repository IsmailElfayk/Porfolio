import { useState, useEffect } from 'react';

const mk = (N) => Array.from({ length: N }, (_, i) => ({ v: i + 1, key: i })).sort(() => Math.random() - 0.5);

export default function SortViz({ width = 500, height = 200, ink = '#fff', accent = '#4A7AFF' }) {
  const [bars, setBars] = useState(() => mk(48));
  const [active, setActive] = useState([-1, -1]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    let cancelled = false;
    (async () => {
      const arr = bars.slice();
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          if (cancelled) return;
          setActive([j, j + 1]);
          if (arr[j].v > arr[j + 1].v) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setBars([...arr]);
          }
          await new Promise((r) => setTimeout(r, 18));
        }
      }
      setActive([-1, -1]);
      setRunning(false);
    })();
    return () => { cancelled = true; };
  }, [running]);

  const bw = width / bars.length;
  return (
    <div style={{ width, position: 'relative' }}>
      <svg width={width} height={height} style={{ display: 'block' }}>
        {bars.map((b, i) => {
          const h = (b.v / bars.length) * (height - 4);
          return (
            <rect key={b.key} x={i * bw + 1} y={height - h} width={bw - 2} height={h}
              fill={active.includes(i) ? accent : 'rgba(255,255,255,0.5)'} />
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
        <button onClick={() => setRunning(true)} disabled={running}
          style={{ background: ink, color: '#101418', border: 'none', padding: '6px 12px',
            cursor: running ? 'default' : 'pointer', opacity: running ? 0.5 : 1,
            letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'inherit' }}>
          ▸ run sort
        </button>
        <button onClick={() => { setRunning(false); setBars(mk(48)); }} disabled={running}
          style={{ background: 'transparent', color: ink, border: `1px solid ${ink}`,
            padding: '6px 12px', cursor: 'pointer', letterSpacing: '0.05em',
            textTransform: 'uppercase', fontFamily: 'inherit' }}>
          ↻ shuffle
        </button>
        <span style={{ marginLeft: 'auto', color: '#9AA3AE' }}>O(n²) · bubble</span>
      </div>
    </div>
  );
}
