const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export const api = {
  get:  (path) => fetch(`${BASE_URL}${path}`).then(r => r.json()),
  post: (path, body) => fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
};

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed');
  return res.json();
};

export const getSettings     = () => apiFetch('/settings');
export const getProjects     = (params = '') => apiFetch(`/projects${params ? '?' + params : ''}`);
export const getAbout        = () => apiFetch('/about');
export const getPapers       = () => apiFetch('/papers');
export const getPosts        = (params = '') => apiFetch(`/posts${params ? '?' + params : ''}`);
export const getProfile      = () => apiFetch('/profile');
export const getThemeBySlug  = (slug) => apiFetch(`/themes/${slug}`);
export const getSections     = () => apiFetch('/sections');
export const getSectionItems = (sectionId = '') => apiFetch(`/section-items${sectionId ? '?section=' + sectionId : ''}`);
export const getSectionItem  = (id) => apiFetch(`/section-items/${id}`);
export const hitVisitor      = () => apiFetch('/visitors/hit', { method: 'POST' });
