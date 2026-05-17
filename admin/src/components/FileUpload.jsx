import { useState, useRef } from 'react';
import { C } from '../styles/theme';

const CLOUD  = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function FileUpload({ label, currentUrl, onUpload, accept = '.pdf', hint = 'PDF · max 10 MB' }) {
  const [progress,  setProgress]  = useState(null);
  const [error,     setError]     = useState('');
  const [fileName,  setFileName]  = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file) return;
    setError('');
    setFileName(file.name);

    if (!CLOUD || !PRESET) {
      setError('Cloudinary env vars not set.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { setError('File must be under 10 MB.'); return; }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', PRESET);

    setProgress(0);
    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100));
      };
      const data = await new Promise((resolve, reject) => {
        xhr.onload  = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try { resolve(JSON.parse(xhr.responseText)); }
            catch { reject(new Error('Invalid response')); }
          } else { reject(new Error('Upload failed')); }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/raw/upload`);
        xhr.send(fd);
      });
      onUpload(data.secure_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setProgress(null);
    }
  };

  const displayUrl = currentUrl;
  const displayName = fileName || (displayUrl ? displayUrl.split('/').pop() : '');

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>}

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${C.border}`, borderRadius: 10, padding: '16px',
          cursor: 'pointer', background: C.panel2, display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{ fontSize: 20, color: C.faint }}>📄</div>
        <div style={{ flex: 1 }}>
          {displayName ? (
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 2 }}>{displayName}</div>
          ) : (
            <div style={{ fontSize: 13, color: C.muted }}>Click to upload file</div>
          )}
          <div style={{ fontSize: 11, color: C.faint }}>{progress !== null ? `Uploading… ${progress}%` : hint}</div>
        </div>
        {displayUrl && (
          <a href={displayUrl} target="_blank" rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 12, color: C.blue, fontWeight: 600, textDecoration: 'none' }}>
            View ↗
          </a>
        )}
      </div>

      {error && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>{error}</div>}
      {progress !== null && (
        <div style={{ marginTop: 6, height: 3, borderRadius: 3, background: C.border }}>
          <div style={{ height: '100%', borderRadius: 3, width: `${progress}%`, background: C.blue, transition: 'width 0.2s' }} />
        </div>
      )}
      {displayUrl && (
        <button onClick={() => { setFileName(''); onUpload(''); }}
          style={{ marginTop: 6, background: 'transparent', border: 'none', color: C.red,
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          × Remove file
        </button>
      )}

      <input ref={inputRef} type="file" accept={accept}
        style={{ display: 'none' }} onChange={(e) => { const f = e.target.files[0]; if (f) upload(f); e.target.value = ''; }} />
    </div>
  );
}
