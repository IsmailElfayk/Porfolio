import { useEffect, useRef } from 'react';

export default function GraphForce({ width = 380, height = 280, ink = '#fff' }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const N = 14;
    const nodes = Array.from({ length: N }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 120,
      y: height / 2 + (Math.random() - 0.5) * 120,
      vx: 0, vy: 0,
    }));
    const edges = Array.from({ length: N - 1 }, (_, i) => [i + 1, Math.floor(Math.random() * (i + 1))]);
    for (let k = 0; k < 4; k++) {
      const a = Math.floor(Math.random() * N), b = Math.floor(Math.random() * N);
      if (a !== b) edges.push([a, b]);
    }
    stateRef.current = { nodes, edges };
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    let raf;
    const tick = () => {
      const st = stateRef.current;
      if (!st) { raf = requestAnimationFrame(tick); return; }
      const { nodes, edges } = st;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d2 = dx * dx + dy * dy + 0.01, f = 800 / d2;
          const d = Math.sqrt(d2);
          nodes[i].vx -= f * dx / d; nodes[i].vy -= f * dy / d;
          nodes[j].vx += f * dx / d; nodes[j].vy += f * dy / d;
        }
      }
      for (const [a, b] of edges) {
        const dx = nodes[b].x - nodes[a].x, dy = nodes[b].y - nodes[a].y;
        const d = Math.hypot(dx, dy) || 0.01, f = (d - 60) * 0.02;
        nodes[a].vx += dx / d * f; nodes[a].vy += dy / d * f;
        nodes[b].vx -= dx / d * f; nodes[b].vy -= dy / d * f;
      }
      for (const n of nodes) {
        n.vx += (width / 2 - n.x) * 0.002; n.vy += (height / 2 - n.y) * 0.002;
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      }
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 0.7;
      for (const [a, b] of edges) {
        ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
      }
      ctx.fillStyle = ink;
      for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2); ctx.fill(); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [width, height, ink]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
