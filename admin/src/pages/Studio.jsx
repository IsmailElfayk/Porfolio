import { useState, useEffect } from 'react';
import { C, F } from '../styles/theme';
import ImageUpload from '../components/ImageUpload';
import FileUpload  from '../components/FileUpload';

// ── API helper ────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const makeApi = (token) => async (path, opts = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    headers, ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
};

// ── Shared design primitives ──────────────────────────────────────────────────

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

const Field = ({ label, value, onChange, multi, type = 'text', hint }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>
      <span>{label}</span>
      {hint && <span style={{ color: C.faint, fontWeight: 400 }}>{hint}</span>}
    </label>
    {multi ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4}
        style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6 }} />
    ) : (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputSt} />
    )}
  </div>
);

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

// ── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ api }) {
  const [profile, setProfile] = useState({
    name: '', headline: '', subtitle: '', location: '', bio: '',
    heroTitle: '', heroSubtitle: '', email: '', phone: '', timezone: '',
    twitter: '', linkedin: '', github: '', openToWork: true, bookingFrom: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  useEffect(() => { api('/profile').then((p) => setProfile((prev) => ({ ...prev, ...p }))).catch(() => {}); }, []);

  const set = (k) => (v) => setProfile((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await api('/profile', { method: 'PUT', body: profile }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
      <div>
        <Section title="Identity" subtitle="Shown across home, about, and resume pages.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Display name"  value={profile.name}     onChange={set('name')} />
            <Field label="Headline"      value={profile.headline} onChange={set('headline')} />
            <Field label="Subtitle"      value={profile.subtitle} onChange={set('subtitle')} />
            <Field label="Location"      value={profile.location} onChange={set('location')} />
          </div>
          <Field label="Bio" multi value={profile.bio} onChange={set('bio')} hint="Markdown supported" />
        </Section>

        <Section title="Hero section" subtitle="The landing pitch on the home page.">
          <Field label="Hero title"    value={profile.heroTitle}    onChange={set('heroTitle')} />
          <Field label="Hero subtitle" multi value={profile.heroSubtitle} onChange={set('heroSubtitle')} />
        </Section>
      </div>

      <div>
        <Section title="Contact & social">
          <Field label="Email"    type="email" value={profile.email}    onChange={set('email')} />
          <Field label="Phone"               value={profile.phone}    onChange={set('phone')} />
          <Field label="Timezone"            value={profile.timezone} onChange={set('timezone')} />
          <Field label="Twitter"             value={profile.twitter}  onChange={set('twitter')} />
          <Field label="LinkedIn"            value={profile.linkedin} onChange={set('linkedin')} />
          <Field label="GitHub"              value={profile.github}   onChange={set('github')} />
        </Section>

        <Section title="Availability">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div onClick={() => set('openToWork')(!profile.openToWork)}
              style={{ width: 36, height: 20, background: profile.openToWork ? C.green : C.border,
                borderRadius: 99, position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ position: 'absolute', [profile.openToWork ? 'right' : 'left']: 2, top: 2,
                width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'right 0.2s, left 0.2s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Open to projects</span>
          </div>
          <Field label="Booking from" value={profile.bookingFrom} onChange={set('bookingFrom')} />
        </Section>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={save} disabled={saving} size="md">
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Home Settings Tab ─────────────────────────────────────────────────────────

function HomeSettingsTab({ api }) {
  const [settings, setSettings] = useState({
    heroTitle: '', heroSubtitle: '', heroImage: '', seoTitle: '', seoDescription: '', footerText: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const [sections,     setSections]     = useState([]);
  const [editSec,      setEditSec]      = useState(null);
  const [newSecName,   setNewSecName]   = useState('');
  const [addingNew,    setAddingNew]    = useState(false);

  useEffect(() => {
    api('/settings').then((d) => setSettings((p) => ({ ...p, ...d }))).catch(() => {});
    api('/sections').then(setSections).catch(() => {});
  }, []);

  const set = (k) => (v) => setSettings((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try { await api('/settings', { method: 'PUT', body: settings }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const saveSection = async (sec) => {
    try {
      const updated = await api(`/sections/${sec._id}`, { method: 'PUT', body: { name: sec.name, intro: sec.intro, visible: sec.visible } });
      setSections((ss) => ss.map((s) => s._id === sec._id ? updated : s));
      setEditSec(null);
    } catch (e) { alert(e.message); }
  };

  const delSection = async (sec) => {
    if (!sec.isDeletable) return alert('This section cannot be deleted.');
    if (!confirm(`Delete section "${sec.name}"?`)) return;
    await api(`/sections/${sec._id}`, { method: 'DELETE' }).catch((e) => alert(e.message));
    setSections((ss) => ss.filter((s) => s._id !== sec._id));
  };

  const addSection = async () => {
    if (!newSecName.trim()) return;
    try {
      const s = await api('/sections', { method: 'POST', body: { name: newSecName.trim(), order: sections.length } });
      setSections((ss) => [...ss, s]);
      setNewSecName('');
      setAddingNew(false);
    } catch (e) { alert(e.message); }
  };

  const toggleVisible = async (sec) => {
    const updated = await api(`/sections/${sec._id}`, { method: 'PUT', body: { visible: !sec.visible } }).catch(() => null);
    if (updated) setSections((ss) => ss.map((s) => s._id === sec._id ? updated : s));
  };

  return (
    <div>
      <Section title="Hero" subtitle="Main landing section copy.">
        <Field label="Hero title"    value={settings.heroTitle}    onChange={set('heroTitle')} />
        <Field label="Hero subtitle" multi value={settings.heroSubtitle} onChange={set('heroSubtitle')} />
        <ImageUpload label="Hero image" currentImage={settings.heroImage} onUpload={set('heroImage')} />
      </Section>

      <Section title="Dynamic Sections" subtitle="Sections shown on the home page. Drag or reorder by editing the order field."
        action={<Btn onClick={() => setAddingNew(true)} size="sm">+ Add section</Btn>}>
        {sections.map((sec) => (
          <div key={sec._id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10,
            padding: '12px 16px', marginBottom: 10 }}>
            {editSec && editSec._id === sec._id ? (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, marginBottom: 8 }}>
                  <input value={editSec.name} onChange={(e) => setEditSec((s) => ({ ...s, name: e.target.value }))} style={inputSt} />
                  <input type="number" value={editSec.order ?? 0}
                    onChange={(e) => setEditSec((s) => ({ ...s, order: Number(e.target.value) }))} style={inputSt} />
                </div>
                <textarea value={editSec.intro} onChange={(e) => setEditSec((s) => ({ ...s, intro: e.target.value }))}
                  rows={2} placeholder="Intro text shown above items…"
                  style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn onClick={() => saveSection(editSec)} size="sm">Save</Btn>
                  <Btn variant="ghost" size="sm" onClick={() => setEditSec(null)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div onClick={() => toggleVisible(sec)} style={{
                  width: 30, height: 17, background: sec.visible ? C.green : C.border,
                  borderRadius: 99, position: 'relative', cursor: 'pointer', flexShrink: 0,
                }}>
                  <div style={{ position: 'absolute', [sec.visible ? 'right' : 'left']: 2, top: 2,
                    width: 13, height: 13, background: '#fff', borderRadius: '50%' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{sec.name}
                    {!sec.isDeletable && <span style={{ fontSize: 11, color: C.faint, marginLeft: 6 }}>(protected)</span>}
                  </div>
                  {sec.intro && <div style={{ fontSize: 12, color: C.muted, marginTop: 2, lineHeight: 1.4 }}>
                    {sec.intro.length > 80 ? sec.intro.slice(0, 80) + '…' : sec.intro}
                  </div>}
                </div>
                <button onClick={() => setEditSec({ ...sec })}
                  style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer' }}>✎</button>
                {sec.isDeletable && (
                  <button onClick={() => delSection(sec)}
                    style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 14, cursor: 'pointer' }}>×</button>
                )}
              </div>
            )}
          </div>
        ))}
        {addingNew && (
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <input value={newSecName} onChange={(e) => setNewSecName(e.target.value)}
              placeholder="New section name…" style={{ ...inputSt, flex: 1 }}
              onKeyDown={(e) => { if (e.key === 'Enter') addSection(); if (e.key === 'Escape') setAddingNew(false); }} />
            <Btn onClick={addSection} size="sm">Add</Btn>
            <Btn variant="ghost" size="sm" onClick={() => { setAddingNew(false); setNewSecName(''); }}>Cancel</Btn>
          </div>
        )}
        {sections.length === 0 && !addingNew && <div style={{ color: C.faint, fontSize: 13 }}>No sections yet.</div>}
      </Section>

      <Section title="Footer">
        <Field label="Footer copyright text" value={settings.footerText} onChange={set('footerText')} hint="e.g. © 2026 EL FAYK ISMAIL." />
      </Section>

      <Section title="SEO">
        <Field label="SEO title"       value={settings.seoTitle}       onChange={set('seoTitle')} />
        <Field label="SEO description" multi value={settings.seoDescription} onChange={set('seoDescription')} />
      </Section>

      <Btn onClick={save} disabled={saving} size="md">
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save settings'}
      </Btn>
    </div>
  );
}

// ── Section Items Tab (replaces Themes + Skills) ──────────────────────────────

const BLANK_ITEM = { title: '', shortDescription: '', image: '', rapport: '', section: '', order: 0 };

function SectionItemsTab({ api }) {
  const [items,    setItems]    = useState([]);
  const [sections, setSections] = useState([]);
  const [form,     setForm]     = useState(BLANK_ITEM);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [preview,  setPreview]  = useState(false);

  useEffect(() => {
    api('/section-items').then(setItems).catch(() => {});
    api('/sections').then(setSections).catch(() => {});
  }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      const payload = { ...form, order: Number(form.order) };
      if (editing) {
        const it = await api(`/section-items/${editing}`, { method: 'PUT', body: payload });
        setItems((ss) => ss.map((x) => x._id === editing ? it : x));
      } else {
        const it = await api('/section-items', { method: 'POST', body: payload });
        setItems((ss) => [...ss, it]);
      }
      setForm(BLANK_ITEM); setEditing(null); setPreview(false);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this item?')) return;
    await api(`/section-items/${id}`, { method: 'DELETE' }).catch(alert);
    setItems((ss) => ss.filter((s) => s._id !== id));
  };

  return (
    <div>
      <Section title={editing ? 'Edit section item' : 'Add section item'}
        subtitle="Items that appear as clickable cards under each home-page section.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Title</div>
            <input value={form.title} onChange={setF('title')} style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Section</div>
            <select value={form.section} onChange={setF('section')} style={{ ...inputSt, cursor: 'pointer' }}>
              <option value="">— choose section —</option>
              {sections.filter((s) => s.slug !== 'projects').map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Order</div>
            <input type="number" value={form.order} onChange={setF('order')} style={inputSt} />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Short description (card preview)</div>
          <input value={form.shortDescription} onChange={setF('shortDescription')} style={inputSt} placeholder="One-line summary shown on the card…" />
        </div>

        <ImageUpload label="Image" currentImage={form.image} onUpload={(url) => setForm((f) => ({ ...f, image: url }))} />

        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Content / Rapport (Markdown)</div>
            <button onClick={() => setPreview((p) => !p)} style={{
              background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
              color: C.muted, fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
            }}>{preview ? 'Edit' : 'Preview'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 14 }}>
            <textarea value={form.rapport} onChange={setF('rapport')} rows={8}
              style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, fontFamily: F.mono, fontSize: 12 }} />
            {preview && (
              <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '10px 14px', fontSize: 13, color: C.text, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: 260 }}>
                {form.rapport || <span style={{ color: C.faint }}>Preview will appear here…</span>}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={submit} disabled={saving} size="md">{saving ? 'Saving…' : editing ? 'Update item' : 'Add item'}</Btn>
          {editing && <Btn variant="ghost" size="md" onClick={() => { setEditing(null); setForm(BLANK_ITEM); setPreview(false); }}>Cancel</Btn>}
        </div>
      </Section>

      <Section title="All section items" subtitle={`${items.length} items`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {items.map((it) => (
            <div key={it._id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 52, height: 36, borderRadius: 6, background: C.bg, border: `1px solid ${C.border}`,
                flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {it.image
                  ? <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontFamily: F.mono, color: '#7DD8C8', fontSize: 13 }}>∂</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</div>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: F.mono }}>
                  {it.section?.name || 'No section'} · order {it.order}
                </div>
              </div>
              <button onClick={() => { setEditing(it._id); setForm({ ...BLANK_ITEM, ...it, section: it.section?._id || it.section || '' }); }}
                style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer' }}>✎</button>
              <button onClick={() => del(it._id)}
                style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 14, cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
        {items.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No items yet. Add one above.</div>}
      </Section>
    </div>
  );
}

// ── Papers Tab ────────────────────────────────────────────────────────────────

const BLANK_PAPER = { year: new Date().getFullYear(), title: '', shortDescription: '', authors: '', venue: '', tags: '', abstract: '', status: 'published', doi: '' };

function PapersTab({ api }) {
  const [papers, setPapers] = useState([]);
  const [form,   setForm]   = useState(BLANK_PAPER);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { api('/papers').then(setPapers).catch(() => {}); }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      const payload = { ...form, year: Number(form.year), tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
      if (editing) {
        const p = await api(`/papers/${editing}`, { method: 'PUT', body: payload });
        setPapers((ps) => ps.map((x) => x._id === editing ? p : x));
      } else {
        const p = await api('/papers', { method: 'POST', body: payload });
        setPapers((ps) => [p, ...ps]);
      }
      setForm(BLANK_PAPER); setEditing(null);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this paper?')) return;
    await api(`/papers/${id}`, { method: 'DELETE' }).catch(alert);
    setPapers((ps) => ps.filter((p) => p._id !== id));
  };

  return (
    <div>
      <Section title={editing ? 'Edit paper' : 'Add paper'} subtitle="Metadata for the research page.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Year</div>
            <input value={form.year} onChange={setF('year')} type="number" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Status</div>
            <select value={form.status} onChange={setF('status')} style={{ ...inputSt, cursor: 'pointer' }}>
              {['published', 'submitted', 'draft'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>DOI</div>
            <input value={form.doi} onChange={setF('doi')} placeholder="10.xxxx/…" style={{ ...inputSt, fontFamily: F.mono }} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Tags (comma-sep)</div>
            <input value={form.tags} onChange={setF('tags')} placeholder="journal, doi" style={inputSt} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Title</div>
          <input value={form.title} onChange={setF('title')} style={inputSt} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Short description (card preview)</div>
          <input value={form.shortDescription} onChange={setF('shortDescription')} style={inputSt} placeholder="One-line summary shown on the card…" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Authors</div>
            <input value={form.authors} onChange={setF('authors')} placeholder="I. El Fayk" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Venue</div>
            <input value={form.venue} onChange={setF('venue')} placeholder="SIAM J. Numer. Anal." style={inputSt} />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Abstract</div>
          <textarea value={form.abstract} onChange={setF('abstract')} rows={4}
            style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6 }} />
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={submit} disabled={saving} size="md">{saving ? 'Saving…' : editing ? 'Update paper' : 'Add paper'}</Btn>
          {editing && <Btn variant="ghost" size="md" onClick={() => { setEditing(null); setForm(BLANK_PAPER); }}>Cancel</Btn>}
        </div>
      </Section>

      <Section title="All papers" subtitle={`${papers.length} entries`}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: C.muted, fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {['Year', 'Title', 'Venue', 'Status', ''].map((h) => (
                <th key={h} style={{ padding: '8px 10px', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {papers.map((p) => (
              <tr key={p._id} style={{ borderTop: `1px solid ${C.border}` }}>
                <td style={{ padding: '12px 10px', color: C.muted, fontFamily: F.mono }}>{p.year}</td>
                <td style={{ padding: '12px 10px', fontWeight: 500 }}>{p.title}</td>
                <td style={{ padding: '12px 10px', color: C.muted, fontStyle: 'italic' }}>{p.venue}</td>
                <td style={{ padding: '12px 10px' }}>
                  <span style={{ fontSize: 12, fontWeight: 600,
                    color: p.status === 'published' ? C.green : p.status === 'submitted' ? C.amber : C.muted }}>
                    ● {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <button onClick={() => { setEditing(p._id); setForm({ ...BLANK_PAPER, ...p, tags: (p.tags || []).join(', ') }); }}
                    style={{ background: 'transparent', border: 'none', color: C.muted, cursor: 'pointer', padding: '4px 8px', fontSize: 14 }}>✎</button>
                  <button onClick={() => del(p._id)}
                    style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', padding: '4px 8px', fontSize: 14 }}>×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {papers.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No papers yet.</div>}
      </Section>
    </div>
  );
}

// ── Projects Manager Tab ──────────────────────────────────────────────────────

const BLANK_PROJ = { title: '', type: 'project', shortDescription: '', description: '', rapport: '', tags: '', stack: '', year: new Date().getFullYear(), status: 'published', featured: false, image: '', liveUrl: '', repoUrl: '' };

function ProjectsTab({ api }) {
  const [projects, setProjects] = useState([]);
  const [form,     setForm]     = useState(BLANK_PROJ);
  const [editing,  setEditing]  = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [preview,  setPreview]  = useState(false);

  useEffect(() => { api('/projects').then(setProjects).catch(() => {}); }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form, year: Number(form.year),
        description: form.description || form.shortDescription || form.title,
        tags:  typeof form.tags  === 'string' ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)  : form.tags,
        stack: typeof form.stack === 'string' ? form.stack.split(',').map((t) => t.trim()).filter(Boolean) : form.stack,
      };
      if (editing) {
        const p = await api(`/projects/${editing}`, { method: 'PUT', body: payload });
        setProjects((ps) => ps.map((x) => x._id === editing ? p : x));
      } else {
        const p = await api('/projects', { method: 'POST', body: payload });
        setProjects((ps) => [p, ...ps]);
      }
      setForm(BLANK_PROJ); setEditing(null);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api(`/projects/${id}`, { method: 'DELETE' }).catch(alert);
    setProjects((ps) => ps.filter((p) => p._id !== id));
  };

  return (
    <div>
      <Section title={editing ? 'Edit project' : 'Add project'}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Title</div>
            <input value={form.title} onChange={setF('title')} style={inputSt} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Year</div>
              <input type="number" value={form.year} onChange={setF('year')} style={inputSt} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Status</div>
              <select value={form.status} onChange={setF('status')} style={{ ...inputSt, cursor: 'pointer' }}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Short description (card preview)</div>
          <input value={form.shortDescription} onChange={setF('shortDescription')} style={inputSt} />
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Rapport / Content (Markdown — shown on detail page)</div>
            <button onClick={() => setPreview((p) => !p)} style={{
              background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
              color: C.muted, fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
            }}>{preview ? 'Edit' : 'Preview'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 14 }}>
            <textarea value={form.rapport} onChange={setF('rapport')} rows={6}
              style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, fontFamily: F.mono, fontSize: 12 }} />
            {preview && (
              <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '10px 14px', fontSize: 13, color: C.text, lineHeight: 1.7,
                whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: 200 }}>
                {form.rapport || <span style={{ color: C.faint }}>Preview will appear here…</span>}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Tags (comma-sep)</div>
            <input value={typeof form.tags === 'string' ? form.tags : (form.tags || []).join(', ')} onChange={setF('tags')} style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Stack (comma-sep)</div>
            <input value={typeof form.stack === 'string' ? form.stack : (form.stack || []).join(', ')} onChange={setF('stack')} style={inputSt} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Live URL</div>
            <input value={form.liveUrl} onChange={setF('liveUrl')} placeholder="https://…" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Repo URL</div>
            <input value={form.repoUrl} onChange={setF('repoUrl')} placeholder="https://github.com/…" style={inputSt} />
          </div>
        </div>

        <ImageUpload label="Project image" currentImage={form.image} onUpload={(url) => setForm((f) => ({ ...f, image: url }))} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <input type="checkbox" id="featured" checked={!!form.featured} onChange={setF('featured')} />
          <label htmlFor="featured" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Featured</label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <Btn onClick={submit} disabled={saving} size="md">{saving ? 'Saving…' : editing ? 'Update' : 'Add project'}</Btn>
          {editing && <Btn variant="ghost" size="md" onClick={() => { setEditing(null); setForm(BLANK_PROJ); }}>Cancel</Btn>}
        </div>
      </Section>

      <Section title="All projects" subtitle={`${projects.length} projects`}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {projects.map((p) => (
            <div key={p._id} style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
              {p.image && <img src={p.image} alt={p.title} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                <div style={{ display: 'flex', gap: 6, fontSize: 11 }}>
                  <span style={{ color: C.blue, fontWeight: 600 }}>{p.type}</span>
                  {p.featured && <span style={{ background: C.blue + '22', color: C.blue, padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>Featured</span>}
                  <span style={{ color: p.status === 'draft' ? C.amber : C.muted, fontWeight: 600 }}>● {p.status}</span>
                </div>
              </div>
              <button onClick={() => { setEditing(p._id); setForm({ ...BLANK_PROJ, ...p, tags: (p.tags || []).join(', '), stack: (p.stack || []).join(', '), rapport: p.rapport || '' }); }}
                style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer' }}>✎</button>
              <button onClick={() => del(p._id)}
                style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 14, cursor: 'pointer' }}>×</button>
            </div>
          ))}
        </div>
        {projects.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No projects yet.</div>}
      </Section>
    </div>
  );
}

// ── Posts Tab ─────────────────────────────────────────────────────────────────

const BLANK_POST = { title: '', summary: '', body: '', tag: '', readTime: '', status: 'published', featured: false };

function PostsTab({ api }) {
  const [posts, setPosts]     = useState([]);
  const [form,  setForm]      = useState(BLANK_POST);
  const [editing, setEditing] = useState(null);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { api('/posts').then(setPosts).catch(() => {}); }, []);

  const setF = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async () => {
    setSaving(true);
    try {
      if (editing) {
        const p = await api(`/posts/${editing}`, { method: 'PUT', body: form });
        setPosts((ps) => ps.map((x) => x._id === editing ? p : x));
      } else {
        const p = await api('/posts', { method: 'POST', body: form });
        setPosts((ps) => [p, ...ps]);
      }
      setForm(BLANK_POST); setEditing(null);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this post?')) return;
    await api(`/posts/${id}`, { method: 'DELETE' }).catch(alert);
    setPosts((ps) => ps.filter((p) => p._id !== id));
  };

  return (
    <div>
      <Section title={editing ? 'Edit post' : 'New post'}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Title</div>
          <input value={form.title} onChange={setF('title')} style={inputSt} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Tag</div>
            <input value={form.tag} onChange={setF('tag')} placeholder="Numerics, Topology…" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Read time</div>
            <input value={form.readTime} onChange={setF('readTime')} placeholder="8 min" style={inputSt} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Status</div>
            <select value={form.status} onChange={setF('status')} style={{ ...inputSt, cursor: 'pointer' }}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Short description (card preview)</div>
          <textarea value={form.summary} onChange={setF('summary')} rows={2}
            style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6 }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>Body (Markdown)</div>
          <textarea value={form.body} onChange={setF('body')} rows={8}
            style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, fontFamily: F.mono, fontSize: 12 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <input type="checkbox" id="featuredPost" checked={!!form.featured} onChange={setF('featured')} />
          <label htmlFor="featuredPost" style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Featured post</label>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Btn onClick={submit} disabled={saving} size="md">{saving ? 'Saving…' : editing ? 'Update post' : 'Save post'}</Btn>
          {editing && <Btn variant="ghost" size="md" onClick={() => { setEditing(null); setForm(BLANK_POST); }}>Cancel</Btn>}
        </div>
      </Section>

      <Section title="All posts" subtitle={`${posts.length} posts`}>
        {posts.map((p, i) => (
          <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0',
            borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: C.muted }}>
                {p.tag && <span style={{ color: C.blue }}>{p.tag}</span>}
                {p.readTime && <span style={{ marginLeft: 8 }}>{p.readTime}</span>}
              </div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: p.status === 'draft' ? C.amber : C.green }}>● {p.status}</span>
            <button onClick={() => { setEditing(p._id); setForm({ ...BLANK_POST, ...p }); }}
              style={{ background: 'transparent', border: 'none', color: C.muted, fontSize: 14, cursor: 'pointer' }}>✎</button>
            <button onClick={() => del(p._id)}
              style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 14, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {posts.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No posts yet.</div>}
      </Section>
    </div>
  );
}

// ── About / CV Manager Tab ────────────────────────────────────────────────────

const BLANK_EXP      = { title: '', company: '', period: '', description: '' };
const BLANK_EDU      = { degree: '', institution: '', period: '', description: '' };
const BLANK_STRENGTH = { icon: '', title: '' };
const BLANK_DESK     = { label: '', value: '' };
const BLANK_TALK     = { year: '', title: '', venue: '' };
const BLANK_SKILL    = { name: '', level: '', category: '' };

function AboutTab({ api }) {
  const [about,   setAbout]   = useState({ bio: '', image: '', cvFileUrl: '', experience: [], education: [], skills: [], strengths: [], deskItems: [], talks: [] });
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => { api('/about').then((d) => setAbout(d)).catch(() => {}); }, []);

  const set = (k) => (v) => setAbout((a) => ({ ...a, [k]: v }));

  const addExp = () => setAbout((a) => ({ ...a, experience: [...(a.experience || []), { ...BLANK_EXP }] }));
  const setExp = (i, k, v) => setAbout((a) => {
    const exp = [...(a.experience || [])]; exp[i] = { ...exp[i], [k]: v }; return { ...a, experience: exp };
  });
  const delExp = (i) => setAbout((a) => ({ ...a, experience: a.experience.filter((_, idx) => idx !== i) }));

  const addEdu = () => setAbout((a) => ({ ...a, education: [...(a.education || []), { ...BLANK_EDU }] }));
  const setEdu = (i, k, v) => setAbout((a) => {
    const edu = [...(a.education || [])]; edu[i] = { ...edu[i], [k]: v }; return { ...a, education: edu };
  });
  const delEdu = (i) => setAbout((a) => ({ ...a, education: a.education.filter((_, idx) => idx !== i) }));

  const addSkill = () => setAbout((a) => ({ ...a, skills: [...(a.skills || []), { ...BLANK_SKILL }] }));
  const setSkill = (i, k, v) => setAbout((a) => {
    const arr = [...(a.skills || [])]; arr[i] = { ...arr[i], [k]: v }; return { ...a, skills: arr };
  });
  const delSkill = (i) => setAbout((a) => ({ ...a, skills: a.skills.filter((_, idx) => idx !== i) }));

  const addStrength = () => setAbout((a) => ({ ...a, strengths: [...(a.strengths || []), { ...BLANK_STRENGTH }] }));
  const setStrength = (i, k, v) => setAbout((a) => {
    const arr = [...(a.strengths || [])]; arr[i] = { ...arr[i], [k]: v }; return { ...a, strengths: arr };
  });
  const delStrength = (i) => setAbout((a) => ({ ...a, strengths: a.strengths.filter((_, idx) => idx !== i) }));

  const addDesk = () => setAbout((a) => ({ ...a, deskItems: [...(a.deskItems || []), { ...BLANK_DESK }] }));
  const setDesk = (i, k, v) => setAbout((a) => {
    const arr = [...(a.deskItems || [])]; arr[i] = { ...arr[i], [k]: v }; return { ...a, deskItems: arr };
  });
  const delDesk = (i) => setAbout((a) => ({ ...a, deskItems: a.deskItems.filter((_, idx) => idx !== i) }));

  const addTalk = () => setAbout((a) => ({ ...a, talks: [...(a.talks || []), { ...BLANK_TALK }] }));
  const setTalk = (i, k, v) => setAbout((a) => {
    const arr = [...(a.talks || [])]; arr[i] = { ...arr[i], [k]: v }; return { ...a, talks: arr };
  });
  const delTalk = (i) => setAbout((a) => ({ ...a, talks: a.talks.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    try { await api('/about', { method: 'PUT', body: about }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <Section title="About / Bio">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Bio (Markdown)</div>
          <button onClick={() => setPreview((p) => !p)} style={{
            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
            color: C.muted, fontSize: 11, padding: '3px 10px', cursor: 'pointer', fontFamily: 'inherit',
          }}>{preview ? 'Edit' : 'Preview'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 14, marginBottom: 14 }}>
          <textarea value={about.bio} onChange={(e) => set('bio')(e.target.value)} rows={5}
            style={{ ...inputSt, resize: 'vertical', lineHeight: 1.6, fontFamily: F.mono, fontSize: 12 }} />
          {preview && (
            <div style={{ background: C.panel2, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '10px 14px', fontSize: 13, color: C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {about.bio || <span style={{ color: C.faint }}>Preview will appear here…</span>}
            </div>
          )}
        </div>
        <ImageUpload label="About / profile image" currentImage={about.image} onUpload={set('image')} />
        <FileUpload label="CV / Resume (PDF)" currentUrl={about.cvFileUrl || ''} onUpload={set('cvFileUrl')}
          accept=".pdf,application/pdf" hint="PDF only · max 10 MB" />
      </Section>

      <Section title="Skills" subtitle="Shown in the Skills section on the About page." action={<Btn onClick={addSkill} size="sm">+ Add</Btn>}>
        {(about.skills || []).map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={s.name} onChange={(ev) => setSkill(i, 'name', ev.target.value)} placeholder="Skill name" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={s.level} onChange={(ev) => setSkill(i, 'level', ev.target.value)} placeholder="Level (Expert, Advanced…)" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={s.category} onChange={(ev) => setSkill(i, 'category', ev.target.value)} placeholder="Category (e.g. Languages)" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delSkill(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.skills || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No skills yet.</div>}
      </Section>

      <Section title="Experience" action={<Btn onClick={addExp} size="sm">+ Add</Btn>}>
        {(about.experience || []).map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={e.title} onChange={(ev) => setExp(i, 'title', ev.target.value)} placeholder="Title" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={e.company} onChange={(ev) => setExp(i, 'company', ev.target.value)} placeholder="Company" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={e.period} onChange={(ev) => setExp(i, 'period', ev.target.value)} placeholder="2022 — 2024" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={e.description} onChange={(ev) => setExp(i, 'description', ev.target.value)} placeholder="Description" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delExp(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.experience || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No experience entries yet.</div>}
      </Section>

      <Section title="Education" action={<Btn onClick={addEdu} size="sm">+ Add</Btn>}>
        {(about.education || []).map((e, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={e.degree} onChange={(ev) => setEdu(i, 'degree', ev.target.value)} placeholder="Degree" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={e.institution} onChange={(ev) => setEdu(i, 'institution', ev.target.value)} placeholder="Institution" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={e.period} onChange={(ev) => setEdu(i, 'period', ev.target.value)} placeholder="2018 — 2021" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delEdu(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.education || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No education entries yet.</div>}
      </Section>

      <Section title="Strengths" subtitle="Cards shown on the About page." action={<Btn onClick={addStrength} size="sm">+ Add</Btn>}>
        {(about.strengths || []).map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={s.icon} onChange={(ev) => setStrength(i, 'icon', ev.target.value)} placeholder="Icon/emoji" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={s.title} onChange={(ev) => setStrength(i, 'title', ev.target.value)} placeholder="Label" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delStrength(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.strengths || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No strengths yet.</div>}
      </Section>

      <Section title="What's on the desk" subtitle="Tool/gear list at the bottom of the About page." action={<Btn onClick={addDesk} size="sm">+ Add</Btn>}>
        {(about.deskItems || []).map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={d.label} onChange={(ev) => setDesk(i, 'label', ev.target.value)} placeholder="Label (e.g. Editor)" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={d.value} onChange={(ev) => setDesk(i, 'value', ev.target.value)} placeholder="Value (e.g. Neovim)" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delDesk(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.deskItems || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No desk items yet.</div>}
      </Section>

      <Section title="Talks" subtitle="Shown on the Research page." action={<Btn onClick={addTalk} size="sm">+ Add</Btn>}>
        {(about.talks || []).map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr auto', gap: 10, marginBottom: 10,
            padding: 12, background: C.panel2, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input value={t.year} onChange={(ev) => setTalk(i, 'year', ev.target.value)} placeholder="Year" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={t.title} onChange={(ev) => setTalk(i, 'title', ev.target.value)} placeholder="Talk title" style={{ ...inputSt, marginBottom: 0 }} />
            <input value={t.venue} onChange={(ev) => setTalk(i, 'venue', ev.target.value)} placeholder="Venue" style={{ ...inputSt, marginBottom: 0 }} />
            <button onClick={() => delTalk(i)} style={{ background: 'transparent', border: 'none', color: C.red, fontSize: 16, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        {(about.talks || []).length === 0 && <div style={{ color: C.faint, fontSize: 13 }}>No talks yet.</div>}
      </Section>

      <Btn onClick={save} disabled={saving} size="md">
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save about'}
      </Btn>
    </div>
  );
}

// ── Messages Tab ──────────────────────────────────────────────────────────────

function MessagesTab({ api }) {
  const [msgs, setMsgs] = useState([]);

  useEffect(() => { api('/contact').then(setMsgs).catch(() => {}); }, []);

  const del = async (id) => {
    if (!confirm('Delete this message?')) return;
    await api(`/contact/${id}`, { method: 'DELETE' }).catch(alert);
    setMsgs((ms) => ms.filter((m) => m._id !== id));
  };

  return (
    <Section title="Contact messages" subtitle={`${msgs.length} messages`}>
      {msgs.length === 0 && <div style={{ textAlign: 'center', color: C.muted, padding: '24px 0', fontSize: 13 }}>No messages yet.</div>}
      {msgs.map((m, i) => (
        <div key={m._id} style={{ padding: '16px 0', borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <span style={{ fontWeight: 700 }}>{m.name}</span>
              <span style={{ color: C.muted, marginLeft: 10, fontSize: 13 }}>{m.email}</span>
              {m.subject && <span style={{ marginLeft: 10, fontSize: 11, padding: '2px 8px', background: C.panel2, borderRadius: 4, color: C.blue }}>{m.subject}</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: C.muted, fontFamily: F.mono }}>{new Date(m.createdAt).toLocaleDateString()}</span>
              <button onClick={() => del(m._id)}
                style={{ background: 'transparent', border: 'none', color: C.red, cursor: 'pointer', fontSize: 14 }}>×</button>
            </div>
          </div>
          <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.6 }}>{m.message}</div>
        </div>
      ))}
    </Section>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

const TABS = [
  ['profile',  'Profile'],
  ['home',     'Home Settings'],
  ['sections', 'Sections'],
  ['projects', 'Projects'],
  ['about',    'About / CV'],
  ['papers',   'Papers'],
  ['posts',    'Writing'],
  ['messages', 'Messages'],
];

const SIDEBAR = [
  { g: 'Identity', items: [
    ['profile',  'Profile',      '👤'],
    ['about',    'About / CV',   '✎'],
  ]},
  { g: 'Content', items: [
    ['home',     'Home Settings','⌂'],
    ['sections', 'Sections',     '◈'],
    ['projects', 'Projects',     '◧'],
    ['papers',   'Papers & talks','∫'],
    ['posts',    'Writing',      '¶'],
    ['messages', 'Messages',     '✉'],
  ]},
];

export default function Studio({ token, onLogout }) {
  const [tab, setTab] = useState('profile');
  const api = makeApi(token);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: F.sans, minHeight: '100vh' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" /></svg>
          <span style={{ fontWeight: 700, fontSize: 15 }}>I.EL FAYK</span>
          <span style={{ color: C.muted, fontSize: 14 }}>/</span>
          <span style={{ color: C.muted, fontSize: 14 }}>Studio</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 13 }}>
          <a href={import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'} target="_blank" rel="noreferrer"
            style={{ color: C.muted, textDecoration: 'none' }}>Preview ↗</a>
          <button onClick={onLogout} style={{
            background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6,
            color: C.muted, fontSize: 12, padding: '5px 12px', cursor: 'pointer', fontFamily: 'inherit',
          }}>Log out</button>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        <aside style={{ width: 220, borderRight: `1px solid ${C.border}`, padding: '24px 16px', background: C.bg, fontSize: 13 }}>
          {SIDEBAR.map((s) => (
            <div key={s.g} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.faint, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>{s.g}</div>
              {s.items.map(([id, label, icon]) => (
                <button key={id} onClick={() => setTab(id)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', width: '100%',
                  borderRadius: 6, background: tab === id ? C.panel2 : 'transparent',
                  color: tab === id ? C.text : C.muted, fontWeight: tab === id ? 600 : 500,
                  marginBottom: 2, border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13,
                }}>
                  <span style={{ width: 16, textAlign: 'center', color: tab === id ? C.blue : C.faint }}>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </aside>

        <main style={{ flex: 1, padding: '28px 36px 60px', maxHeight: 'calc(100vh - 57px)', overflowY: 'auto' }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 12, color: C.muted, fontFamily: F.mono, marginBottom: 6 }}>STUDIO · CONTENT</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Edit content</h1>
          </div>

          <div style={{ display: 'flex', gap: 4, marginBottom: 22, borderBottom: `1px solid ${C.border}`, overflowX: 'auto' }}>
            {TABS.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                background: 'transparent', border: 'none', whiteSpace: 'nowrap',
                color: tab === k ? C.text : C.muted,
                padding: '10px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                borderBottom: tab === k ? `2px solid ${C.blue}` : '2px solid transparent',
                marginBottom: -1, fontFamily: 'inherit',
              }}>{l}</button>
            ))}
          </div>

          {tab === 'profile'  && <ProfileTab api={api} />}
          {tab === 'home'     && <HomeSettingsTab api={api} />}
          {tab === 'sections' && <SectionItemsTab api={api} />}
          {tab === 'projects' && <ProjectsTab api={api} />}
          {tab === 'about'    && <AboutTab api={api} />}
          {tab === 'papers'   && <PapersTab api={api} />}
          {tab === 'posts'    && <PostsTab api={api} />}
          {tab === 'messages' && <MessagesTab api={api} />}
        </main>
      </div>
    </div>
  );
}
