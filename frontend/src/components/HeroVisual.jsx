import { C } from '../styles/theme';

export default function HeroVisual({ children, height = 420 }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: 12, overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 50%, #1a3a3a 0%, #0c1a1c 70%)',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1200 420" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <path
            key={i}
            d={`M0,${210 + Math.sin(i * 0.4) * 60} Q300,${100 + Math.cos(i * 0.3) * 80} 600,${210 + Math.sin(i * 0.5) * 60} T1200,${210 + Math.cos(i * 0.4) * 60}`}
            stroke="#7DD8C8" strokeWidth="0.6" fill="none"
            opacity={0.3 + (i % 7) * 0.05}
          />
        ))}
      </svg>
      {children}
    </div>
  );
}
