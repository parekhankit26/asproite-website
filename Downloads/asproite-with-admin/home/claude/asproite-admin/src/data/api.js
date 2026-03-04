// API base URL
const BASE = '';

// ── Public API ────────────────────────────────────────────
export async function fetchSiteData() {
  try {
    const res = await fetch(`${BASE}/api/data`);
    if (!res.ok) throw new Error('Failed');
    return await res.json();
  } catch (e) {
    return null;
  }
}

// ── Admin API ─────────────────────────────────────────────
function getToken() { return localStorage.getItem('adminToken'); }

function headers() {
  return { 'Content-Type': 'application/json', 'x-admin-token': getToken() };
}

export async function adminLogin(password) {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('adminToken', data.token);
  return data;
}

export async function adminLogout() {
  await fetch(`${BASE}/api/admin/logout`, { method: 'POST', headers: headers() });
  localStorage.removeItem('adminToken');
}

export async function adminGetData() {
  const res = await fetch(`${BASE}/api/admin/data`, { headers: headers() });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function adminSave(section, data) {
  const res = await fetch(`${BASE}/api/admin/${section}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Save failed');
  return res.json();
}

export async function adminUpload(file) {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE}/api/admin/upload`, {
    method: 'POST',
    headers: { 'x-admin-token': getToken() },
    body: formData,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export function isLoggedIn() { return !!localStorage.getItem('adminToken'); }
