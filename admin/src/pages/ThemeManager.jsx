import { useState, useEffect } from 'react';
import { C, F } from '../styles/theme';
import ImageUpload from '../components/ImageUpload';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
};

const inputSt = {
  width: '100%', background: '#1E242C', border: '1px solid #262E38', borderRadius: 8,
  padding: '10px 12px', fontSize: 13, color: '#fff', outline: 'none',
  fontFamily: '"Inter Tight","Inter",sans-serif',
};

const Btn = ({ onClick, variant = 'primary', size = 'sm', children, disabled }) => {
  const bg = variant === 'primary' ? C.blue : variant === 'danger' ? C.red : 'transparent';
  const border = variant === 'ghost' ? `1px solid ${C.border}` : 'none';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: bg, border, color: variant === 'ghost' ? C.text : '#fff',
      borderRadius: 8, padding: size === 'sm' ? '7px 14px' : '10px 18px',
      fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
      fontFamily: 'inherit', opacity: disabled ? 0.6 : 1,
    }}>{children}</button>
  );
};

const Section = ({ title, subtitle, children, action }) => (
  <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 18 }}>
    <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
        {subtitle && <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
    <div style={{ padding: '20px 22px' }}>{children}</div>
  </div>
);

const BLANK = { title: '', image: '', description: '', order: 0 };

export default function ThemeManager() {
  const [themes,  setThemes]  = useState([]);
  const [form,    setForm]    = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => { api('/themes').then(setThemes).catch(() => {}); }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) {
        const t = await api(`/themes/${editing}`, { method: 'PUT', body: payload });
        setThemes((ts) => ts.map((x) => x._id === editing ? t : x));
      } else {
        const t = await api('/themes', { method: 'POST', body: payload });
        setThemes((ts) => [...ts, t]);
      }
      setForm(BLANK); setEditing(null); setPreview(false);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this theme?')) return;
    await api(`/themes/${id}`, { method: 'DELETE' }).catch(alert);
    setThemes((ts) => ts.filter((t) => t._id !== id));
  };

  return (
    <div>
      <Section title={editing ? 'Edit theme' : 'Add theme'} subtitle="Theme cards on the home page — each links to a detail page.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Title</div>
            <input value={form.title} onChange={setF('title')} placeholder="e.g. Mathematical Modeling" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Order</div>
            <input type="number" value={form.order} onChange={setF('order')} style={inputSt} />
          </div>
        </div>

        <ImageUpload label="Image" currentImage={form.image} onUpload={(url) => setForm((f) => ({ ...f, image: url }))} />

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Description (Markdown)</div>
            <button onClick={() => setPreview((p) => !p)} style={{
              background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
              color: C.muted, fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
            }}>{preview ? 'Edit' : 'Preview'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 14 }}>
            <textarea value={form.description} onChange={setF('description')} rows={8}
              style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, fontFamily: F.mono, fontSize: 12 }} />
            {preview && (
              <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '10px 14px', fontSize: 13, color: C.text, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: 260 }}>
                {form.description || <span style={{ color: C.faint }}>Preview will appear here…</span>}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={submit} disabled={saving} size="md">{saving ? 'Saving…' : editing ? 'Update theme' : 'Add theme'}</Btn>
          {editing && <Btn variant="ghost" size="md" onClick={() => { setEditing(null); setForm(BLANK); setPreview(false); }}>Cancel</Btn>}
        </div>
      </Section>

      <Section title="All themes" subtitle={`${themes.length} themes`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {themes.map((t) => (
            <div key={t._id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 52, height: 36, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`,
                flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {t.image
                  ? <img src={t.image} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: F.mono, color: '#7DD8C8', fontSize: 13 }}>∂</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: F.mono }}>/{t.slug} · order {t.order}</div>
              </div>
              <button onClick={() => { setEditing(t._id); setForm({ ...BLANK, ...t }); }}
                style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer' }}>✎</button>
              <button onClick={() => del(t._id)}
                style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 14, cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
        {themes.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No themes yet. Add one above.</div>}
      </Section>
    </div>
  );
}
