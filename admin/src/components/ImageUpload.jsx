import { useState, useRef } from 'react';
import { C } from '../styles/theme';

const CLOUD = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUpload({ label, currentImage, onUpload }) {
  const [dragging,  setDragging]  = useState(false);
  const [progress,  setProgress]  = useState(null);
  const [localSrc,  setLocalSrc]  = useState(null);
  const [error,     setError]     = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file || !file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('File must be under 5 MB.'); return; }
    setError('');
    setLocalSrc(URL.createObjectURL(file));

    if (!CLOUD || !PRESET) {
      setError('Cloudinary env vars not set — paste a URL directly.');
      return;
    }

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', PRESET);

    setProgress(0);
    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) setProgress(Math.round(e.loaded / e.total * 100)); };
      await new Promise((resolve, reject) => {
        xhr.onload  = () => { if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error('Upload failed')); };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`);
        xhr.send(fd);
      });
      const data = JSON.parse(xhr.responseText);
      onUpload(data.secure_url);
    } catch (e) {
      setError(e.message);
    } finally {
      setProgress(null);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const displaySrc = localSrc || currentImage;

  return (
    <div style={{ marginBottom: 14 }}>
      {label && <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 6 }}>{label}</div>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? C.blue : C.border}`,
          borderRadius: 10, padding: '22px 16px', textAlign: 'center',
          cursor: 'pointer', transition: 'border-color 0.15s',
          background: dragging ? C.blue + '11' : C.panel2,
          position: 'relative',
        }}
      >
        {displaySrc ? (
          <img src={displaySrc} alt="preview"
            style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 6, objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} />
        ) : (
          <div style={{ fontSize: 24, marginBottom: 6, color: C.faint }}>↑</div>
        )}
        <div style={{ fontSize: 12, color: C.muted }}>
          {progress !== null
            ? `Uploading… ${progress}%`
            : 'Drop an image here, or click to browse'}
        </div>
        <div style={{ fontSize: 11, color: C.faint, marginTop: 4 }}>JPEG · PNG · WebP · GIF · max 5 MB</div>

        {progress !== null && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, borderRadius: '0 0 10px 10px',
            width: `${progress}%`, background: C.blue, transition: 'width 0.2s' }} />
        )}
      </div>

      {error && <div style={{ fontSize: 12, color: C.red, marginTop: 6 }}>{error}</div>}

      {displaySrc && (
        <button onClick={(e) => { e.stopPropagation(); setLocalSrc(null); onUpload(''); }}
          style={{ marginTop: 6, background: 'transparent', border: 'none', color: C.red,
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          × Remove image
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: 'none' }} onChange={(e) => { const f = e.target.files[0]; if (f) upload(f); e.target.value = ''; }} />
    </div>
  );
}
