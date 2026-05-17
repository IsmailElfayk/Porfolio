import { useEffect, useState, useRef } from 'react';
import { C } from '../styles/theme';
import { getProfile, getSettings, hitVisitor } from '../api/index';

const FALLBACK_SOCIALS = [
  { key: 'twitter',  url: '#' },
  { key: 'linkedin', url: '#' },
  { key: 'github',   url: '#' },
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generate a random session id (persisted per tab)
const SESSION_ID = Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function Footer() {
  const [footerText, setFooterText] = useState('© 2026 EL FAYK ISMAIL. All rights reserved.');
  const [socials,    setSocials]    = useState(FALLBACK_SOCIALS);
  const [visitors,   setVisitors]   = useState(null);
  const [online,     setOnline]     = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    getSettings()
      .then((d) => { if (d && d.footerText) setFooterText(d.footerText); })
      .catch(() => {});
    getProfile()
      .then((d) => {
        if (!d) return;
        const links = [];
        if (d.twitter)  links.push({ key: 'twitter',  url: d.twitter.startsWith('http') ? d.twitter : `https://twitter.com/${d.twitter.replace('@', '')}` });
        if (d.linkedin) links.push({ key: 'linkedin', url: d.linkedin.startsWith('http') ? d.linkedin : `https://${d.linkedin}` });
        if (d.github)   links.push({ key: 'github',   url: d.github.startsWith('http')   ? d.github   : `https://${d.github}` });
        if (links.length) setSocials(links);
      })
      .catch(() => {});

    // Increment total visitor count once per session
    const alreadyCounted = sessionStorage.getItem('visitor_counted');
    if (!alreadyCounted) {
      hitVisitor()
        .then((d) => { if (d) setVisitors(d.count); sessionStorage.setItem('visitor_counted', '1'); })
        .catch(() => {});
    } else {
      fetch(`${API_BASE}/visitors`)
        .then((r) => r.json())
        .then((d) => { if (d) setVisitors(d.count); })
        .catch(() => {});
    }

    // Heartbeat ping every 15s to track online visitors
    const ping = () => {
      fetch(`${API_BASE}/visitors/ping`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid: SESSION_ID }),
      })
        .then((r) => r.json())
        .then((d) => { if (d) setOnline(d.online); })
        .catch(() => {});
    };

    ping(); // initial ping
    intervalRef.current = setInterval(ping, 15_000);

    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <footer style={{
      padding: '32px 40px 28px', textAlign: 'center',
      color: C.muted, fontSize: 13,
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 14 }}>
        {socials.map((s) => (
          <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: C.muted, textDecoration: 'none' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 4, background: C.panel2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
            }}>
              {s.key[0].toUpperCase()}
            </div>
          </a>
        ))}
      </div>

      {/* Visitor stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        {visitors !== null && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 999,
            padding: '6px 16px', fontSize: 12,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#3b82f6', display: 'inline-block',
              boxShadow: '0 0 6px #3b82f688',
            }} />
            <span style={{ color: C.text, fontWeight: 600 }}>
              {visitors.toLocaleString()}
            </span>
            <span style={{ color: C.muted }}>
              total visits
            </span>
          </div>
        )}

        {online !== null && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.panel, border: `1px solid ${C.border}`, borderRadius: 999,
            padding: '6px 16px', fontSize: 12,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              boxShadow: '0 0 6px #22c55e88',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{ color: C.text, fontWeight: 600 }}>
              {online}
            </span>
            <span style={{ color: C.muted }}>
              online now
            </span>
            <style>{`
              @keyframes pulse-dot {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.4); }
              }
            `}</style>
          </div>
        )}
      </div>

      <div>{footerText}</div>
    </footer>
  );
}
