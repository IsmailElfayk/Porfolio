import { useEffect, useRef, useState } from 'react';

export default function LissajousCurve({ width = 400, height = 400, ink = '#fff', accent = '#4A7AFF' }) {
  const canvasRef = useRef(null);
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [phase, setPhase] = useState(0.5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let raf;
    const t0 = performance.now();
    const draw = (now) => {
      const elapsed = (now - t0) / 1000;
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2, cy = height / 2;
      const r = Math.min(width, height) * 0.4;

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let i = -4; i <= 4; i++) {
        const off = (i / 4) * r;
        ctx.beginPath(); ctx.moveTo(cx - r, cy + off); ctx.lineTo(cx + r, cy + off); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + off, cy - r); ctx.lineTo(cx + off, cy + r); ctx.stroke();
      }

      const ph = phase + elapsed * 0.15;
      ctx.strokeStyle = ink; ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= 1400; i++) {
        const t = (i / 1400) * Math.PI * 2;
        const x = cx + r * Math.sin(a * t + ph);
        const y = cy + r * Math.sin(b * t);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      const t = elapsed * 0.6;
      const px = cx + r * Math.sin(a * t + ph);
      const py = cy + r * Math.sin(b * t);
      ctx.fillStyle = accent;
      ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [a, b, phase, width, height, ink, accent]);

  const SliderRow = ({ label, value, set, min, max, step }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9AA3AE', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>
        <span>{label}</span><span style={{ color: ink }}>{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => set(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: accent, height: 2 }} />
    </div>
  );

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, width: 180,
        background: 'rgba(16,20,24,0.9)', backdropFilter: 'blur(6px)',
        padding: '12px 14px', border: '1px solid #262E38', borderRadius: 8 }}>
        <SliderRow label="a (x freq)" value={a} set={setA} min={1} max={9} step={1} />
        <SliderRow label="b (y freq)" value={b} set={setB} min={1} max={9} step={1} />
        <SliderRow label="φ phase" value={phase} set={setPhase} min={0} max={Math.PI} step={0.01} />
      </div>
    </div>
  );
}
