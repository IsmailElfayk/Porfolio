import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { C, F } from '../styles/theme';
import { getProfile } from '../api/index';

const SUBJECTS = ['Freelance project', 'Research collaboration', 'Open source', 'Speaking', 'Just saying hi'];

const FALLBACK_PROFILE = {
  email: 'elfaykismail@gmail.com',
  phone: '+212 6 51 27 55 22',
  location: 'Fès, Morocco',
  timezone: 'UTC+01:00',
  openToWork: true,
  bookingFrom: 'July 2026',
};

const inputStyle = {
  width: '100%', background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8,
  padding: '12px 14px', fontSize: 14, color: C.text, outline: 'none',
  fontFamily: '"Inter Tight","Inter",sans-serif', transition: 'border-color 0.15s',
};

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: 'Freelance project', message: '' });
  const [status,  setStatus]  = useState('idle');
  const [profile, setProfile] = useState(FALLBACK_PROFILE);

  useEffect(() => {
    getProfile().then((d) => { if (d) setProfile({ ...FALLBACK_PROFILE, ...d }); }).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const apiBase = import.meta.env.VITE_BACKEND_URL + '/api';
      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      setForm({ name: '', email: '', subject: 'Freelance project', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const INFO = [
    { l: 'Email',     v: profile.email    || FALLBACK_PROFILE.email },
    { l: 'Phone',     v: profile.phone    || FALLBACK_PROFILE.phone },
    { l: 'Based in',  v: profile.location || FALLBACK_PROFILE.location },
    { l: 'Time zone', v: profile.timezone || FALLBACK_PROFILE.timezone },
  ].filter((row) => row.v);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <Navbar />
      <div className="page-wrap" style={{ padding: '40px 80px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px' }}>Get in touch</h1>
        <p style={{ color: C.muted, fontSize: 14, margin: '0 0 36px', maxWidth: 600 }}>
          Whether it's a freelance project, research collaboration, or just a chat about numerical methods — I read everything.
        </p>

        {status === 'success' && (
          <div style={{ background: '#052e16', border: '1px solid #166534', borderRadius: 8, padding: '14px 18px',
            marginBottom: 24, color: C.green, fontSize: 14, fontWeight: 600 }}>
            ✓ Message sent! I'll get back to you soon.
          </div>
        )}
        {status === 'error' && (
          <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '14px 18px',
            marginBottom: 24, color: C.red, fontSize: 14, fontWeight: 600 }}>
            Something went wrong — please try emailing directly.
          </div>
        )}

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40 }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {[['name', 'Your name', 'ismail elfayk'], ['email', 'Your email', 'ismailelfayk@gmail.com']].map(([k, l, ph]) => (
                <div key={k}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>{l}</div>
                  <input type={k === 'email' ? 'email' : 'text'} placeholder={ph} value={form[k]}
                    onChange={set(k)} required style={inputStyle} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>What's it about?</div>
              <select value={form.subject} onChange={set('subject')} style={{ ...inputStyle, cursor: 'pointer' }}>
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 8 }}>Message</div>
              <textarea placeholder="Hi Ismail, I'd love to work with you on…" value={form.message}
                onChange={set('message')} required rows={6}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            <button type="submit" disabled={status === 'loading'} style={{
              background: C.blue, color: '#fff', border: 'none', borderRadius: 999,
              padding: '12px 26px', fontWeight: 600, fontSize: 14, cursor: status === 'loading' ? 'default' : 'pointer',
              fontFamily: 'inherit', opacity: status === 'loading' ? 0.7 : 1,
            }}>
              {status === 'loading' ? 'Sending…' : 'Send message →'}
            </button>
          </form>

          <div>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Direct</div>
              {INFO.map((c, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                  borderBottom: i < INFO.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ color: C.muted, fontSize: 13 }}>{c.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.v}</span>
                </div>
              ))}
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Availability</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: profile.openToWork ? C.green : C.muted }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {profile.openToWork ? 'Open to new projects' : 'Not currently available'}
                </div>
              </div>
              {profile.bookingFrom && (
                <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.55 }}>
                  Booking from <strong style={{ color: C.text }}>{profile.bookingFrom}</strong>. 2–3 month engagements preferred.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
