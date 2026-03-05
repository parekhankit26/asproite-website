import { useState, useEffect, useRef } from 'react';
import { adminLogin, adminLogout, adminGetData, adminSave, adminUpload, isLoggedIn } from '../data/api.js';

// ── STYLES ────────────────────────────────────────────────
const S = {
  page: { minHeight: '100vh', background: '#070b12', color: '#dde4f0', fontFamily: "'DM Sans', sans-serif" },
  sidebar: { width: 240, background: '#0b1019', borderRight: '1px solid rgba(0,212,255,0.1)', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflowY: 'auto' },
  main: { marginLeft: 240, padding: 32, minHeight: '100vh' },
  logo: { fontFamily: "'Oxanium', sans-serif", fontSize: '1.4rem', fontWeight: 800, color: '#dde4f0', padding: '0 24px 24px', borderBottom: '1px solid rgba(0,212,255,0.1)', marginBottom: 16 },
  dot: { color: '#00d4ff' },
  navBtn: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, width: '100%', background: active ? 'rgba(0,212,255,0.1)' : 'none', border: 'none', borderLeft: active ? '3px solid #00d4ff' : '3px solid transparent', color: active ? '#00d4ff' : '#6a7d99', padding: '11px 24px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s', textAlign: 'left' }),
  card: { background: '#0b1019', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 10, padding: 24, marginBottom: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  h2: { fontFamily: "'Oxanium', sans-serif", fontSize: '1.3rem', fontWeight: 700, margin: 0 },
  label: { fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6a7d99', display: 'block', marginBottom: 6 },
  input: { width: '100%', background: '#070b12', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 5, padding: '10px 14px', color: '#dde4f0', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', background: '#070b12', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 5, padding: '10px 14px', color: '#dde4f0', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', outline: 'none', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' },
  btnPrimary: { background: '#00d4ff', color: '#070b12', border: 'none', borderRadius: 5, padding: '10px 22px', fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' },
  btnDanger: { background: 'rgba(255,71,87,0.15)', color: '#ff4757', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 5, padding: '8px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', cursor: 'pointer' },
  btnGhost: { background: 'transparent', color: '#6a7d99', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 5, padding: '8px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', cursor: 'pointer' },
  btnAdd: { background: 'rgba(0,212,255,0.07)', color: '#00d4ff', border: '1px dashed rgba(0,212,255,0.3)', borderRadius: 8, padding: '12px', width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '0.88rem', cursor: 'pointer', marginTop: 12 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  itemCard: { background: '#0f1624', border: '1px solid rgba(0,212,255,0.08)', borderRadius: 8, padding: 18, position: 'relative' },
  tag: { display: 'inline-block', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 100, padding: '3px 10px', fontSize: '0.7rem', color: '#00d4ff', margin: '2px' },
  toast: (show, type) => ({ position: 'fixed', bottom: 24, right: 24, background: type === 'error' ? '#1a0a0a' : '#0a1a0f', border: `1px solid ${type === 'error' ? '#ff4757' : '#00ff88'}`, borderRadius: 8, padding: '14px 20px', color: type === 'error' ? '#ff4757' : '#00ff88', fontSize: '0.88rem', zIndex: 9999, transition: 'all 0.3s', transform: show ? 'translateY(0)' : 'translateY(100px)', opacity: show ? 1 : 0 }),
  imgPreview: { width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(0,212,255,0.2)', marginRight: 12 },
  toggle: (on) => ({ position: 'relative', width: 44, height: 24, background: on ? '#00d4ff' : '#1a2030', border: 'none', borderRadius: 100, cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }),
  toggleDot: (on) => ({ position: 'absolute', top: 3, left: on ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.3s' }),
  badge: { background: 'rgba(244,185,66,0.15)', color: '#f4b942', border: '1px solid rgba(244,185,66,0.3)', borderRadius: 100, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em' },
};

const SECTIONS = [
  { id: 'siteInfo', label: 'Site Info', icon: '🏢' },
  { id: 'services', label: 'Services', icon: '⚙️' },
  { id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  { id: 'faqs', label: 'FAQs', icon: '❓' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'effects', label: 'Visual Effects', icon: '✨' },
];

// ── IMAGE UPLOAD COMPONENT ────────────────────────────────
function ImageUpload({ value, onChange, label = 'Image' }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await adminUpload(file);
      onChange(result.url);
    } catch (err) {
      alert('Upload failed: ' + err.message);
    }
    setUploading(false);
  };

  return (
    <div>
      <label style={S.label}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {value && <img src={value} alt="preview" style={S.imgPreview} onError={e => e.target.style.display = 'none'} />}
        <div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
          <button style={{ ...S.btnGhost, fontSize: '0.8rem' }} onClick={() => inputRef.current.click()} disabled={uploading}>
            {uploading ? '⟳ Uploading...' : value ? '🔄 Change Image' : '📤 Upload Image'}
          </button>
          {value && <button style={{ ...S.btnDanger, marginLeft: 8, fontSize: '0.75rem' }} onClick={() => onChange('')}>✕ Remove</button>}
        </div>
        {value && <input style={{ ...S.input, flex: 1, fontSize: '0.75rem' }} value={value} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL" />}
        {!value && <input style={{ ...S.input, flex: 1, fontSize: '0.75rem' }} value="" onChange={e => onChange(e.target.value)} placeholder="Or paste image URL" />}
      </div>
    </div>
  );
}

// ── TOGGLE COMPONENT ──────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button style={S.toggle(value)} onClick={() => onChange(!value)}>
      <div style={S.toggleDot(value)} />
    </button>
  );
}

// ── LOGIN SCREEN ──────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminLogin(password);
      onLogin();
    } catch (err) {
      setError('Wrong password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 400, background: '#0b1019', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 14, padding: 48, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#00d4ff,transparent)' }} />
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: "'Oxanium', sans-serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: 6 }}>ASPRO<span style={{ color: '#00d4ff' }}>.</span>ITE</div>
          <div style={{ color: '#6a7d99', fontSize: '0.88rem' }}>Admin Panel — Sign In</div>
        </div>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label style={S.label}>Admin Password</label>
            <input type="password" style={S.input} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
          </div>
          {error && <div style={{ color: '#ff4757', fontSize: '0.82rem', marginBottom: 14 }}>⚠️ {error}</div>}
          <button type="submit" style={{ ...S.btnPrimary, width: '100%', padding: 14, fontSize: '0.95rem' }} disabled={loading}>
            {loading ? '⟳ Signing in...' : '→ Sign In'}
          </button>
        </form>
        <div style={{ marginTop: 24, padding: 14, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 6 }}>
          <div style={{ fontSize: '0.75rem', color: '#6a7d99', marginBottom: 4 }}>Default password:</div>
          <div style={{ fontSize: '0.82rem', color: '#00d4ff', fontFamily: 'monospace' }}>asproite2024</div>
        </div>
      </div>
    </div>
  );
}

// ── SITE INFO SECTION ─────────────────────────────────────
function SiteInfoSection({ data, onSave, saving }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>🏢 Site Info & Contact Details</h2>
        <button style={S.btnPrimary} onClick={() => onSave('siteInfo', form)} disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
      </div>
      <div style={S.card}>
        <h3 style={{ fontFamily: "'Oxanium',sans-serif", fontSize: '0.9rem', color: '#00d4ff', marginBottom: 16 }}>Company Information</h3>
        <div style={S.grid2}>
          <div><label style={S.label}>Company Name</label><input style={S.input} value={form.companyName || ''} onChange={e => set('companyName', e.target.value)} /></div>
          <div><label style={S.label}>Tagline</label><input style={S.input} value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} /></div>
        </div>
        <div style={{ marginTop: 16 }}>
          <label style={S.label}>Company Description</label>
          <textarea style={S.textarea} value={form.description || ''} onChange={e => set('description', e.target.value)} />
        </div>
        <div style={{ marginTop: 16 }}>
          <ImageUpload label="Company Logo" value={form.logo || ''} onChange={v => set('logo', v)} />
        </div>
      </div>
      <div style={S.card}>
        <h3 style={{ fontFamily: "'Oxanium',sans-serif", fontSize: '0.9rem', color: '#00d4ff', marginBottom: 16 }}>Contact Details</h3>
        <div style={S.grid2}>
          <div><label style={S.label}>Email Address</label><input style={S.input} value={form.email || ''} onChange={e => set('email', e.target.value)} /></div>
          <div><label style={S.label}>Phone Number</label><input style={S.input} value={form.phone || ''} onChange={e => set('phone', e.target.value)} /></div>
          <div><label style={S.label}>London Address</label><input style={S.input} value={form.londonAddress || ''} onChange={e => set('londonAddress', e.target.value)} /></div>
          <div><label style={S.label}>India Address</label><input style={S.input} value={form.indiaAddress || ''} onChange={e => set('indiaAddress', e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}

// ── SERVICES SECTION ──────────────────────────────────────
function ServicesSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const [editing, setEditing] = useState(null);

  const save = (idx, updated) => { const n = [...items]; n[idx] = updated; setItems(n); setEditing(null); };
  const remove = (idx) => { if (confirm('Delete this service?')) { const n = items.filter((_, i) => i !== idx); setItems(n); } };
  const add = () => {
    const newItem = { id: Date.now(), icon: '🔧', title: 'New Service', tagline: 'Service tagline', description: 'Service description', features: ['Feature 1', 'Feature 2', 'Feature 3'], category: 'development', isNew: false };
    setItems([...items, newItem]);
    setEditing(items.length);
  };

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>⚙️ Services ({items.length})</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add Service</button>
          <button style={S.btnPrimary} onClick={() => onSave('services', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={S.card}>
          {editing === idx ? (
            <ServiceEditor item={item} onSave={u => save(idx, u)} onCancel={() => setEditing(null)} />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2rem' }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.title} {item.isNew && <span style={S.badge}>NEW</span>}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#6a7d99', marginBottom: 6 }}>{item.tagline}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6a7d99' }}>{item.description?.substring(0, 80)}...</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button style={S.btnGhost} onClick={() => setEditing(idx)}>✏️ Edit</button>
                <button style={S.btnDanger} onClick={() => remove(idx)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button style={S.btnAdd} onClick={add}>+ Add New Service</button>
    </div>
  );
}

function ServiceEditor({ item, onSave, onCancel }) {
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setFeature = (i, v) => { const f = [...(form.features || [])]; f[i] = v; set('features', f); };
  const addFeature = () => set('features', [...(form.features || []), 'New feature']);
  const removeFeature = (i) => set('features', form.features.filter((_, idx) => idx !== i));

  return (
    <div>
      <div style={S.grid3}>
        <div><label style={S.label}>Icon (Emoji)</label><input style={S.input} value={form.icon || ''} onChange={e => set('icon', e.target.value)} /></div>
        <div><label style={S.label}>Title</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
        <div><label style={S.label}>Tagline</label><input style={S.input} value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} /></div>
      </div>
      <div style={{ marginTop: 12 }}><label style={S.label}>Description</label><textarea style={S.textarea} value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
      <div style={{ marginTop: 12 }}>
        <label style={S.label}>Features</label>
        {(form.features || []).map((f, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input style={S.input} value={f} onChange={e => setFeature(i, e.target.value)} />
            <button style={S.btnDanger} onClick={() => removeFeature(i)}>✕</button>
          </div>
        ))}
        <button style={S.btnGhost} onClick={addFeature}>+ Add Feature</button>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <label style={S.label}>Category</label>
          <select style={{ ...S.input }} value={form.category || 'development'} onChange={e => set('category', e.target.value)}>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="cloud">Cloud</option>
            <option value="marketing">Marketing</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={S.label}>Mark as NEW</label>
          <Toggle value={!!form.isNew} onChange={v => set('isNew', v)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={S.btnPrimary} onClick={() => onSave(form)}>✓ Save Service</button>
        <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── PORTFOLIO SECTION ─────────────────────────────────────
function PortfolioSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const [editing, setEditing] = useState(null);

  const save = (idx, updated) => { const n = [...items]; n[idx] = updated; setItems(n); setEditing(null); };
  const remove = (idx) => { if (confirm('Delete this project?')) setItems(items.filter((_, i) => i !== idx)); };
  const add = () => {
    const newItem = { id: Date.now(), title: 'New Project', icon: '🚀', description: 'Project description', tags: ['Web Dev'], category: 'web', year: '2024', featured: false, image: '' };
    setItems([...items, newItem]);
    setEditing(items.length);
  };

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>🖼️ Portfolio Projects ({items.length})</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add Project</button>
          <button style={S.btnPrimary} onClick={() => onSave('portfolio', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={S.card}>
          {editing === idx ? (
            <PortfolioEditor item={item} onSave={u => save(idx, u)} onCancel={() => setEditing(null)} />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {item.image ? <img src={item.image} alt="" style={{ width: 60, height: 60, borderRadius: 6, objectFit: 'cover', border: '1px solid rgba(0,212,255,0.2)' }} /> : <div style={{ fontSize: '2rem' }}>{item.icon}</div>}
                <div>
                  <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {item.title} {item.featured && <span style={{ ...S.badge, background: 'rgba(0,212,255,0.1)', color: '#00d4ff', borderColor: 'rgba(0,212,255,0.3)' }}>FEATURED</span>}
                  </div>
                  <div style={{ marginBottom: 6 }}>{(item.tags || []).map(t => <span key={t} style={S.tag}>{t}</span>)}</div>
                  <div style={{ fontSize: '0.82rem', color: '#6a7d99' }}>{item.description?.substring(0, 80)}... · {item.year}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button style={S.btnGhost} onClick={() => setEditing(idx)}>✏️ Edit</button>
                <button style={S.btnDanger} onClick={() => remove(idx)}>🗑️ Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button style={S.btnAdd} onClick={add}>+ Add New Project</button>
    </div>
  );
}

function PortfolioEditor({ item, onSave, onCancel }) {
  const [form, setForm] = useState({ ...item });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const [tagInput, setTagInput] = useState((item.tags || []).join(', '));

  return (
    <div>
      <div style={S.grid2}>
        <div><label style={S.label}>Icon (Emoji)</label><input style={S.input} value={form.icon || ''} onChange={e => set('icon', e.target.value)} /></div>
        <div><label style={S.label}>Title</label><input style={S.input} value={form.title || ''} onChange={e => set('title', e.target.value)} /></div>
        <div><label style={S.label}>Year</label><input style={S.input} value={form.year || ''} onChange={e => set('year', e.target.value)} /></div>
        <div>
          <label style={S.label}>Category</label>
          <select style={S.input} value={form.category || 'web'} onChange={e => set('category', e.target.value)}>
            <option value="web">Web Development</option>
            <option value="cloud">Cloud & AI</option>
            <option value="mobile">Mobile Apps</option>
            <option value="design">Design</option>
            <option value="it">IT Infrastructure</option>
          </select>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><label style={S.label}>Description</label><textarea style={S.textarea} value={form.description || ''} onChange={e => set('description', e.target.value)} /></div>
      <div style={{ marginTop: 12 }}><label style={S.label}>Tags (comma separated)</label><input style={S.input} value={tagInput} onChange={e => { setTagInput(e.target.value); set('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean)); }} placeholder="Web Dev, React, Cloud" /></div>
      <div style={{ marginTop: 12 }}><ImageUpload label="Project Image" value={form.image || ''} onChange={v => set('image', v)} /></div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={S.label}>Featured Project</label>
        <Toggle value={!!form.featured} onChange={v => set('featured', v)} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button style={S.btnPrimary} onClick={() => onSave(form)}>✓ Save Project</button>
        <button style={S.btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── TEAM SECTION ──────────────────────────────────────────
function TeamSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const [editing, setEditing] = useState(null);

  const save = (idx, updated) => { const n = [...items]; n[idx] = updated; setItems(n); setEditing(null); };
  const remove = (idx) => { if (confirm('Remove team member?')) setItems(items.filter((_, i) => i !== idx)); };
  const add = () => { setItems([...items, { id: Date.now(), name: 'New Member', role: 'Role Title', avatar: '👤', bio: 'Short bio here.', image: '' }]); setEditing(items.length); };

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>👥 Team Members ({items.length})</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add Member</button>
          <button style={S.btnPrimary} onClick={() => onSave('team', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      <div style={S.grid2}>
        {items.map((item, idx) => (
          <div key={item.id || idx} style={S.card}>
            {editing === idx ? (
              <div>
                <div style={S.grid2}>
                  <div><label style={S.label}>Avatar Emoji</label><input style={S.input} value={item.avatar || ''} onChange={e => { const n = [...items]; n[idx] = { ...n[idx], avatar: e.target.value }; setItems(n); }} /></div>
                  <div><label style={S.label}>Full Name</label><input style={S.input} value={item.name || ''} onChange={e => { const n = [...items]; n[idx] = { ...n[idx], name: e.target.value }; setItems(n); }} /></div>
                  <div style={{ gridColumn: 'span 2' }}><label style={S.label}>Job Title / Role</label><input style={S.input} value={item.role || ''} onChange={e => { const n = [...items]; n[idx] = { ...n[idx], role: e.target.value }; setItems(n); }} /></div>
                  <div style={{ gridColumn: 'span 2' }}><label style={S.label}>Bio</label><textarea style={S.textarea} value={item.bio || ''} onChange={e => { const n = [...items]; n[idx] = { ...n[idx], bio: e.target.value }; setItems(n); }} /></div>
                </div>
                <div style={{ marginTop: 12 }}><ImageUpload label="Photo" value={item.image || ''} onChange={v => { const n = [...items]; n[idx] = { ...n[idx], image: v }; setItems(n); }} /></div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button style={S.btnPrimary} onClick={() => setEditing(null)}>✓ Done</button>
                  <button style={S.btnGhost} onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  {item.image ? <img src={item.image} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }} /> : <div style={{ fontSize: '2rem' }}>{item.avatar}</div>}
                  <div>
                    <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 600, fontSize: '0.92rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#00d4ff' }}>{item.role}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6a7d99', marginBottom: 14 }}>{item.bio}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={S.btnGhost} onClick={() => setEditing(idx)}>✏️ Edit</button>
                  <button style={S.btnDanger} onClick={() => remove(idx)}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button style={S.btnAdd} onClick={add}>+ Add Team Member</button>
    </div>
  );
}

// ── TESTIMONIALS SECTION ──────────────────────────────────
function TestimonialsSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const set = (idx, k, v) => { const n = [...items]; n[idx] = { ...n[idx], [k]: v }; setItems(n); };
  const remove = (idx) => { if (confirm('Delete this testimonial?')) setItems(items.filter((_, i) => i !== idx)); };
  const add = () => setItems([...items, { id: Date.now(), text: 'Client testimonial here.', name: 'Client Name', role: 'Job Title, Company', avatar: '👤' }]);

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>💬 Testimonials ({items.length})</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add</button>
          <button style={S.btnPrimary} onClick={() => onSave('testimonials', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={S.card}>
          <div style={{ marginBottom: 12 }}><label style={S.label}>Quote</label><textarea style={S.textarea} value={item.text || ''} onChange={e => set(idx, 'text', e.target.value)} /></div>
          <div style={S.grid3}>
            <div><label style={S.label}>Name</label><input style={S.input} value={item.name || ''} onChange={e => set(idx, 'name', e.target.value)} /></div>
            <div><label style={S.label}>Role & Company</label><input style={S.input} value={item.role || ''} onChange={e => set(idx, 'role', e.target.value)} /></div>
            <div><label style={S.label}>Avatar Emoji</label><input style={S.input} value={item.avatar || ''} onChange={e => set(idx, 'avatar', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: 12, textAlign: 'right' }}><button style={S.btnDanger} onClick={() => remove(idx)}>🗑️ Delete</button></div>
        </div>
      ))}
      <button style={S.btnAdd} onClick={add}>+ Add Testimonial</button>
    </div>
  );
}

// ── FAQS SECTION ──────────────────────────────────────────
function FaqsSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const set = (idx, k, v) => { const n = [...items]; n[idx] = { ...n[idx], [k]: v }; setItems(n); };
  const remove = (idx) => { if (confirm('Delete this FAQ?')) setItems(items.filter((_, i) => i !== idx)); };
  const add = () => setItems([...items, { id: Date.now(), q: 'Your question here?', a: 'Your answer here.' }]);

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>❓ FAQs ({items.length})</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add FAQ</button>
          <button style={S.btnPrimary} onClick={() => onSave('faqs', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={S.card}>
          <div style={{ marginBottom: 10 }}><label style={S.label}>Question</label><input style={S.input} value={item.q || ''} onChange={e => set(idx, 'q', e.target.value)} /></div>
          <div style={{ marginBottom: 10 }}><label style={S.label}>Answer</label><textarea style={S.textarea} value={item.a || ''} onChange={e => set(idx, 'a', e.target.value)} /></div>
          <div style={{ textAlign: 'right' }}><button style={S.btnDanger} onClick={() => remove(idx)}>🗑️ Delete</button></div>
        </div>
      ))}
      <button style={S.btnAdd} onClick={add}>+ Add FAQ</button>
    </div>
  );
}

// ── STATS SECTION ─────────────────────────────────────────
function StatsSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const set = (idx, k, v) => { const n = [...items]; n[idx] = { ...n[idx], [k]: v }; setItems(n); };

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>📊 Homepage Stats</h2>
        <button style={S.btnPrimary} onClick={() => onSave('stats', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
      </div>
      <div style={S.grid2}>
        {items.map((item, idx) => (
          <div key={idx} style={S.card}>
            <div style={S.grid3}>
              <div><label style={S.label}>Number</label><input style={S.input} type="number" value={item.num} onChange={e => set(idx, 'num', +e.target.value)} /></div>
              <div><label style={S.label}>Suffix (+, %, etc)</label><input style={S.input} value={item.suffix || ''} onChange={e => set(idx, 'suffix', e.target.value)} /></div>
              <div><label style={S.label}>Label</label><input style={S.input} value={item.label || ''} onChange={e => set(idx, 'label', e.target.value)} /></div>
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: '#070b12', borderRadius: 6, textAlign: 'center' }}>
              <span style={{ fontFamily: "'Oxanium',sans-serif", fontSize: '1.5rem', fontWeight: 800, color: '#00d4ff' }}>{item.num}{item.suffix}</span>
              <div style={{ fontSize: '0.72rem', color: '#6a7d99', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TIMELINE SECTION ──────────────────────────────────────
function TimelineSection({ data, onSave, saving }) {
  const [items, setItems] = useState(data);
  const set = (idx, k, v) => { const n = [...items]; n[idx] = { ...n[idx], [k]: v }; setItems(n); };
  const remove = (idx) => { if (confirm('Delete this milestone?')) setItems(items.filter((_, i) => i !== idx)); };
  const add = () => setItems([...items, { id: Date.now(), year: '2025', title: 'New Milestone', body: 'Describe what happened.' }]);

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>📅 Company Timeline</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={S.btnGhost} onClick={add}>+ Add Milestone</button>
          <button style={S.btnPrimary} onClick={() => onSave('timeline', items)} disabled={saving}>{saving ? 'Saving...' : '💾 Save All'}</button>
        </div>
      </div>
      {items.map((item, idx) => (
        <div key={item.id || idx} style={S.card}>
          <div style={S.grid3}>
            <div><label style={S.label}>Year</label><input style={S.input} value={item.year || ''} onChange={e => set(idx, 'year', e.target.value)} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={S.label}>Title</label><input style={S.input} value={item.title || ''} onChange={e => set(idx, 'title', e.target.value)} /></div>
          </div>
          <div style={{ marginTop: 10 }}><label style={S.label}>Description</label><textarea style={S.textarea} value={item.body || ''} onChange={e => set(idx, 'body', e.target.value)} /></div>
          <div style={{ marginTop: 10, textAlign: 'right' }}><button style={S.btnDanger} onClick={() => remove(idx)}>🗑️ Delete</button></div>
        </div>
      ))}
      <button style={S.btnAdd} onClick={add}>+ Add Milestone</button>
    </div>
  );
}

// ── EFFECTS SECTION ───────────────────────────────────────
function EffectsSection({ data, onSave, saving }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const effects = [
    { key: 'neuralCanvas', label: 'Neural Network Animation', desc: 'Animated particle network on homepage hero', icon: '🕸️' },
    { key: 'customCursor', label: 'Custom Cursor', desc: 'Glowing cyan custom mouse cursor', icon: '🖱️' },
    { key: 'scrollReveal', label: 'Scroll Reveal Animations', desc: 'Elements fade in as you scroll', icon: '✨' },
    { key: 'marquee', label: 'Scrolling Marquee Bar', desc: 'Infinite scrolling text banner', icon: '📜' },
    { key: 'orbitRings', label: 'Orbit Ring Animation', desc: 'Spinning orbit rings on about section', icon: '🪐' },
  ];

  return (
    <div>
      <div style={S.header}>
        <h2 style={S.h2}>✨ Visual Effects</h2>
        <button style={S.btnPrimary} onClick={() => onSave('effects', form)} disabled={saving}>{saving ? 'Saving...' : '💾 Save Changes'}</button>
      </div>
      <div style={{ ...S.card, marginBottom: 16, background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.15)' }}>
        <div style={{ fontSize: '0.85rem', color: '#6a7d99' }}>💡 Toggle visual effects on or off. Changes will apply after the next site rebuild and deploy.</div>
      </div>
      {effects.map(({ key, label, desc, icon }) => (
        <div key={key} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ fontSize: '1.8rem' }}>{icon}</div>
            <div>
              <div style={{ fontFamily: "'Oxanium',sans-serif", fontWeight: 600, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: '0.82rem', color: '#6a7d99' }}>{desc}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.78rem', color: form[key] ? '#00d4ff' : '#6a7d99' }}>{form[key] ? 'ON' : 'OFF'}</span>
            <Toggle value={!!form[key]} onChange={v => set(key, v)} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ADMIN PANEL ──────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [activeSection, setActiveSection] = useState('siteInfo');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    adminGetData().then(d => { setData(d); setLoading(false); }).catch(() => { setLoggedIn(false); setLoading(false); });
  }, [loggedIn]);

  const handleSave = async (section, sectionData) => {
    setSaving(true);
    try {
      await adminSave(section, sectionData);
      setData(d => ({ ...d, [section]: sectionData }));
      showToast(`✅ ${section} saved successfully!`);
    } catch (e) {
      showToast('❌ Save failed: ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await adminLogout();
    setLoggedIn(false);
    setData(null);
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  if (loading) return <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: '#00d4ff', fontFamily: "'Oxanium',sans-serif" }}>⟳ Loading Admin Panel...</div></div>;

  const sectionProps = { data: data?.[activeSection], onSave: handleSave, saving };

  return (
    <div style={{ ...S.page, display: 'flex' }}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.logo}>ASPRO<span style={S.dot}>.</span>ITE <span style={{ fontSize: '0.6rem', color: '#6a7d99', fontFamily: "'DM Sans',sans-serif", fontWeight: 400 }}>ADMIN</span></div>
        {SECTIONS.map(s => (
          <button key={s.id} style={S.navBtn(activeSection === s.id)} onClick={() => setActiveSection(s.id)}>
            <span>{s.icon}</span><span>{s.label}</span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,212,255,0.1)' }}>
          <a href="/#/" target="_blank" style={{ display: 'block', color: '#6a7d99', textDecoration: 'none', fontSize: '0.8rem', marginBottom: 10, transition: 'color 0.2s' }}>🌐 View Live Site</a>
          <button style={{ ...S.btnDanger, width: '100%', justifyContent: 'center' }} onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={S.main}>
        {activeSection === 'siteInfo' && data?.siteInfo && <SiteInfoSection {...sectionProps} data={data.siteInfo} />}
        {activeSection === 'services' && data?.services && <ServicesSection {...sectionProps} data={data.services} />}
        {activeSection === 'portfolio' && data?.portfolio && <PortfolioSection {...sectionProps} data={data.portfolio} />}
        {activeSection === 'team' && data?.team && <TeamSection {...sectionProps} data={data.team} />}
        {activeSection === 'testimonials' && data?.testimonials && <TestimonialsSection {...sectionProps} data={data.testimonials} />}
        {activeSection === 'faqs' && data?.faqs && <FaqsSection {...sectionProps} data={data.faqs} />}
        {activeSection === 'stats' && data?.stats && <StatsSection {...sectionProps} data={data.stats} />}
        {activeSection === 'timeline' && data?.timeline && <TimelineSection {...sectionProps} data={data.timeline} />}
        {activeSection === 'effects' && data?.effects && <EffectsSection {...sectionProps} data={data.effects} />}
      </div>

      {/* Toast */}
      <div style={S.toast(toast.show, toast.type)}>{toast.message}</div>
    </div>
  );
}
