import { useState } from 'react';
import { C, F } from '../styles/theme';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const inputSt = {
  width: '100%', background: '#1E242C', border: '1px solid #262E38', borderRadius: 8,
  padding: '10px 12px', fontSize: 14, color: '#fff', outline: 'none',
  fontFamily: '"Inter Tight","Inter",sans-serif', boxSizing: 'border-box',
};

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('adminToken', data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
            <span style={{ fontWeight: 700, fontSize: 17 }}>I.EL FAYK Studio</span>
          </div>
          <div style={{ color: C.muted, fontSize: 13 }}>Sign in to continue</div>
        </div>

        <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Email</div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com" required style={inputSt}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Password</div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required style={inputSt}
              />
            </div>
            {error && (
              <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: 8,
                padding: '8px 12px', fontSize: 13, color: '#ef4444', marginBottom: 14 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: '100%', background: C.blue, border: 'none', color: '#fff',
              borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 600,
              cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
