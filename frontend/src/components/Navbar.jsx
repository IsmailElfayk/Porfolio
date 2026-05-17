import { Link, useLocation } from 'react-router-dom';
import { C, F } from '../styles/theme';

const NAV_ITEMS = [
  ['Home',     '/'],
  ['Projects', '/projects'],
  ['About',    '/about'],
  ['Contact',  '/contact'],
];

export default function Navbar({ brand = 'I.EL FAYK' }) {
  const { pathname } = useLocation();

  const isActive = (path) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 40px', borderBottom: `1px solid ${C.border}`,
      background: C.bg, position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: C.text }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
        </svg>
        <span style={{ fontWeight: 700, fontSize: 16 }}>{brand}</span>
      </Link>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 36, fontSize: 14, fontWeight: 500 }}>
        {NAV_ITEMS.map(([label, path]) => (
          <Link key={path} to={path} style={{
            color: isActive(path) ? C.text : C.muted,
            textDecoration: 'none',
            transition: 'color 0.15s',
          }}>{label}</Link>
        ))}
      </nav>
    </header>
  );
}
