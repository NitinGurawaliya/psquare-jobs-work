const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (!token) localStorage.removeItem('token');
  else localStorage.setItem('token', token);
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const t = token ?? getToken();
  if (t) headers.Authorization = `Bearer ${t}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
