import { useState, useEffect, useRef } from 'react';
import { adminLogin, adminLogout, adminGetData, adminSave, adminUpload, isLoggedIn } from '../data/api.js';

// ── DESIGN TOKENS ─────────────────────────────────────────
const C = {
  bg: '#05080f',
  surface: '#0a0f1a',
  surface2: '#0e1525',
  border: 'rgba(0,212,255,0.1)',
  borderHover: 'rgba(0,212,255,0.25)',
  cyan: '#00d4ff',
  cyanDim: 'rgba(0,212,255,0.08)',
  cyanGlow: 'rgba(0,212,255,0.15)',
  text: '#e2eaf5',
  muted: '#5a6a82',
  danger: '#ff4757',
  dangerDim: 'rgba(255,71,87,0.1)',
  success: '#00ff88',
  successDim: 'rgba(0,255,136,0.1)',
  warning: '#f4b942',
};

const font = { head: "'Oxanium', sans-serif", body: "'DM Sans', sans-serif" };

// ── SHARED STYLES ─────────────────────────────────────────
const input = {
  width: '100%', background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 6, padding: '10px 14px', color: C.text,
  fontFamily: font.body, fontSize: '0.88rem', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
};
const textarea = { ...input, resize: 'vertical', minHeight: 80 };
const label = {
  fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 6,
};
const card = {
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 12, padding: 22, marginBottom: 16,
  transition: 'border-color 0.2s',
};
const btnPrimary = {
  background: `linear-gradient(135deg, ${C.cyan}, #0099bb)`,
  color: '#000', border: 'none', borderRadius: 7, padding: '10px 22px',
  fontFamily: font.body, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap',
};
const btnGhost = {
  background: 'transparent', color: C.muted, border: `1px solid ${C.border}`,
  borderRadius: 7, padding: '9px 18px', fontFamily: font.body,
  fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s',
  display: 'inline-flex', alignItems: 'center', gap: 6,
};
const btnDanger = {
  background: C.dangerDim, color: C.danger, border: `1px solid rgba(255,71,87,0.2)`,
  borderRadius: 7, padding: '8px 14px', fontFamily: font.body,
  fontSize: '0.8rem', cursor: 'pointer',
};
const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 };
const grid3 = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 };

const SECTIONS = [
  { id: 'siteInfo', label: 'Site Info', icon: '🏢', desc: 'Logo, contact, addresses' },
  { id: 'services', label: 'Services', icon: '⚙️', desc: 'Manage all services' },
  { id: 'portfolio', label: 'Portfolio', icon: '🖼️', desc: 'Projects & case studies' },
  { id: 'team', label: 'Team', icon: '👥', desc: 'Team members & bios' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬', desc: 'Client quotes' },
  { id: 'faqs', label: 'FAQs', icon: '❓', desc: 'Questions & answers' },
  { id: 'stats', label: 'Stats', icon: '📊', desc: 'Homepage numbers' },
  { id: 'timeline', label: 'Timeline', icon: '📅', desc: 'Company milestones' },
  { id: 'effects', label: 'Visual Effects', icon: '✨', desc: 'Animations & effects' },
];

// ── COMPONENTS ────────────────────────────────────────────
function Toggle({ value, onChange, label: lbl }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={() => onChange(!value)} style={{
        position: 'relative', width: 46, height: 26,
        background: value ? `linear-gradient(135deg, ${C.cyan}, #0099bb)` : '#1a2535',
        border: 'none', borderRadius: 100, cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.3s', boxShadow: value ? `0 0 12px ${C.cyanGlow}` : 'none',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: value ? 23 : 3,
          width: 20, height: 20, background: '#fff', borderRadius: '50%',
          transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
      {lbl && <span style={{ fontSize: '0.85rem', color: value ? C.cyan : C.muted }}>{lbl}</span>}
    </div>
  );
}

function Badge({ children, color = C.cyan }) {
  return <span style={{
    display: 'inline-block', background: `${color}18`, color,
    border: `1px solid ${color}35`, borderRadius: 100,
    padding: '2px 10px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
  }}>{children}</span>;
}

function ImageUpload({ value, onChange, label: lbl = 'Image', size = 72 }) {
  const ref = useRef();
  const [uploading, setUploading] = useState(false);
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { const r = await adminUpload(file); onChange(r.url); } catch { alert('Upload failed'); }
    setUploading(false);
  };
  return (
    <div>
      {lbl && <label style={label}>{lbl}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {value
          ? <img src={value} alt="" style={{ width: size, height: size, objectFit: 'cover', borderRadius: 8, border: `1px solid ${C.border}` }} onError={e => e.target.style.display='none'} />
          : <div style={{ width: size, height: size, borderRadius: 8, border: `2px dashed ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: C.muted, background: C.cyanDim }}>🖼️</div>
        }
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
          <button style={{ ...btnGhost, fontSize: '0.78rem' }} onClick={() => ref.current.click()} disabled={uploading}>
            {uploading ? '⟳ Uploading...' : value ? '🔄 Change' : '📤 Upload'}
          </button>
          {value && <button style={{ ...btnDanger, fontSize: '0.72rem', padding: '5px 10px' }} onClick={() => onChange('')}>✕ Remove</button>}
        </div>
        <input style={{ ...input, flex: 1, fontSize: '0.75rem', minWidth: 120 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL..." />
      </div>
    </div>
  );
}

function FieldGroup({ children, columns = 1 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 14, marginBottom: 14 }}>{children}</div>;
}

function Field({ label: lbl, children }) {
  return <div><label style={label}>{lbl}</label>{children}</div>;
}

function SectionCard({ title, subtitle, children, actions }) {
  return (
    <div style={{ ...card, borderColor: C.borderHover }}>
      {(title || actions) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            {title && <div style={{ fontFamily: font.head, fontWeight: 700, fontSize: '0.95rem', color: C.text, marginBottom: 2 }}>{title}</div>}
            {subtitle && <div style={{ fontSize: '0.75rem', color: C.muted }}>{subtitle}</div>}
          </div>
          {actions && <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function Toast({ message, type, show }) {
  return (
    <div style={{
      position: 'fixed', bottom: 28, right: 28, zIndex: 99999,
      background: type === 'error' ? '#12080a' : '#080f0d',
      border: `1px solid ${type === 'error' ? C.danger : C.success}`,
      borderRadius: 10, padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: `0 8px 32px ${type === 'error' ? 'rgba(255,71,87,0.2)' : 'rgba(0,255,136,0.15)'}`,
      transition: 'all 0.35s cubic-bezier(0.34,1.56,0.64,1)',
      transform: show ? 'translateY(0) scale(1)' : 'translateY(80px) scale(0.9)',
      opacity: show ? 1 : 0, pointerEvents: show ? 'all' : 'none',
    }}>
      <span style={{ fontSize: '1.1rem' }}>{type === 'error' ? '❌' : '✅'}</span>
      <span style={{ color: type === 'error' ? C.danger : C.success, fontSize: '0.88rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setErr('');
    try { await adminLogin(pw); onLogin(); }
    catch { setErr('Incorrect password. Please try again.'); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.body, position: 'relative', overflow: 'hidden' }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 70%)` }} />
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: 300, height: 300, background: 'rgba(0,212,255,0.03)', borderRadius: '50%', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: 400, height: 400, background: 'rgba(0,153,187,0.04)', borderRadius: '50%', filter: 'blur(80px)' }} />
      
      <div style={{ width: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo area */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, background: C.cyanDim, border: `1px solid ${C.border}`, borderRadius: 16, marginBottom: 20, fontSize: '1.8rem' }}>⚡</div>
          <div style={{ fontFamily: font.head, fontSize: '2rem', fontWeight: 800, color: C.text, letterSpacing: '-0.02em' }}>
            ASPRO<span style={{ color: C.cyan }}>.</span>ITE
          </div>
          <div style={{ color: C.muted, fontSize: '0.88rem', marginTop: 6 }}>Admin Control Panel</div>
        </div>

        {/* Login card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '36px 40px', position: 'relative', overflow: 'hidden', boxShadow: `0 24px 80px rgba(0,0,0,0.5)` }}>
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)` }} />
          
          <form onSubmit={submit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ ...label, marginBottom: 8 }}>Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input type="password" style={{ ...input, paddingLeft: 44, paddingRight: 14, fontSize: '1rem' }}
                  placeholder="Enter your password" value={pw} onChange={e => setPw(e.target.value)} autoFocus />
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', opacity: 0.4 }}>🔐</span>
              </div>
            </div>
            
            {err && (
              <div style={{ background: C.dangerDim, border: `1px solid rgba(255,71,87,0.2)`, borderRadius: 8, padding: '10px 14px', marginBottom: 18, color: C.danger, fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ {err}
              </div>
            )}
            
            <button type="submit" style={{ ...btnPrimary, width: '100%', padding: '13px', fontSize: '0.95rem', justifyContent: 'center', borderRadius: 9, boxShadow: `0 4px 20px rgba(0,212,255,0.25)` }} disabled={loading}>
              {loading ? '⟳ Signing in...' : '→ Sign In to Admin'}
            </button>
          </form>

          <div style={{ marginTop: 24, padding: '12px 16px', background: C.cyanDim, border: `1px solid ${C.border}`, borderRadius: 8 }}>
            <div style={{ fontSize: '0.7rem', color: C.muted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Default password</div>
            <div style={{ fontSize: '0.88rem', color: C.cyan, fontFamily: 'monospace', letterSpacing: '0.05em' }}>asproite2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SITE INFO ─────────────────────────────────────────────
function SiteInfoSection({ data, onSave, saving }) {
  const [form, setForm] = useState({ ...data });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div>
      <PageHeader title="🏢 Site Info" subtitle="Company details, logo & contact information" onSave={() => onSave('siteInfo', form)} saving={saving} />
      <SectionCard title="Company" subtitle="Brand identity and description">
        <FieldGroup columns={2}>
          <Field label="Company Name"><input style={input} value={form.companyName||''} onChange={e=>set('companyName',e.target.value)} /></Field>
          <Field label="Tagline"><input style={input} value={form.tagline||''} onChange={e=>set('tagline',e.target.value)} /></Field>
        </FieldGroup>
        <Field label="Description"><textarea style={textarea} value={form.description||''} onChange={e=>set('description',e.target.value)} /></Field>
        <div style={{marginTop:14}}><ImageUpload label="Company Logo" value={form.logo||''} onChange={v=>set('logo',v)} size={80} /></div>
      </SectionCard>
      <SectionCard title="Contact Details" subtitle="Email, phone and office addresses">
        <FieldGroup columns={2}>
          <Field label="Email Address"><input style={input} value={form.email||''} onChange={e=>set('email',e.target.value)} /></Field>
          <Field label="Phone Number"><input style={input} value={form.phone||''} onChange={e=>set('phone',e.target.value)} /></Field>
          <Field label="London Address"><input style={input} value={form.londonAddress||''} onChange={e=>set('londonAddress',e.target.value)} /></Field>
          <Field label="India Address"><input style={input} value={form.indiaAddress||''} onChange={e=>set('indiaAddress',e.target.value)} /></Field>
        </FieldGroup>
      </SectionCard>
    </div>
  );
}

// ── SERVICES ──────────────────────────────────────────────
function ServicesSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const save = (i, u) => { const n=[...items]; n[i]=u; setItems(n); setEditing(null); };
  const remove = (i) => { if(confirm('Delete this service?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),icon:'🔧',title:'New Service',tagline:'',description:'',features:['Feature 1'],category:'development',isNew:false}]); setEditing(items.length); };
  return (
    <div>
      <PageHeader title="⚙️ Services" subtitle={`${items.length} services`} onSave={() => onSave('services', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add Service</button>} />
      {items.map((item, i) => (
        <div key={item.id||i} style={{ ...card, borderLeft: editing===i ? `3px solid ${C.cyan}` : `3px solid transparent` }}>
          {editing===i
            ? <ServiceForm item={item} onSave={u=>save(i,u)} onCancel={()=>setEditing(null)} />
            : <ServiceRow item={item} onEdit={()=>setEditing(i)} onDelete={()=>remove(i)} />
          }
        </div>
      ))}
      <AddBtn onClick={add} label="Add New Service" />
    </div>
  );
}

function ServiceRow({ item, onEdit, onDelete }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
      <div style={{ display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ width:44, height:44, borderRadius:10, background:C.cyanDim, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{item.icon}</div>
        <div>
          <div style={{ fontFamily:font.head, fontWeight:600, fontSize:'0.92rem', display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
            {item.title} {item.isNew && <Badge color={C.warning}>NEW</Badge>} <Badge>{item.category}</Badge>
          </div>
          <div style={{ fontSize:'0.78rem', color:C.muted }}>{item.tagline}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        <button style={btnGhost} onClick={onEdit}>✏️ Edit</button>
        <button style={btnDanger} onClick={onDelete}>🗑️</button>
      </div>
    </div>
  );
}

function ServiceForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({...item});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const setFeat = (i,v) => { const a=[...(f.features||[])]; a[i]=v; set('features',a); };
  return (
    <div>
      <FieldGroup columns={3}>
        <Field label="Icon (Emoji)"><input style={input} value={f.icon||''} onChange={e=>set('icon',e.target.value)} /></Field>
        <Field label="Service Title"><input style={input} value={f.title||''} onChange={e=>set('title',e.target.value)} /></Field>
        <Field label="Tagline"><input style={input} value={f.tagline||''} onChange={e=>set('tagline',e.target.value)} /></Field>
      </FieldGroup>
      <div style={{marginBottom:14}}><Field label="Description"><textarea style={textarea} value={f.description||''} onChange={e=>set('description',e.target.value)} /></Field></div>
      <div style={{marginBottom:14}}>
        <label style={label}>Features</label>
        {(f.features||[]).map((feat,i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:7}}>
            <input style={input} value={feat} onChange={e=>setFeat(i,e.target.value)} />
            <button style={btnDanger} onClick={()=>set('features',f.features.filter((_,x)=>x!==i))}>✕</button>
          </div>
        ))}
        <button style={{...btnGhost,marginTop:4}} onClick={()=>set('features',[...(f.features||[]),'New feature'])}>+ Feature</button>
      </div>
      <FieldGroup columns={2}>
        <Field label="Category">
          <select style={input} value={f.category||'development'} onChange={e=>set('category',e.target.value)}>
            {['development','design','cloud','marketing','infrastructure'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Badge">
          <div style={{paddingTop:8}}><Toggle value={!!f.isNew} onChange={v=>set('isNew',v)} label="Mark as NEW" /></div>
        </Field>
      </FieldGroup>
      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button style={btnPrimary} onClick={()=>onSave(f)}>✓ Save Service</button>
        <button style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── PORTFOLIO ─────────────────────────────────────────────
function PortfolioSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const save = (i,u) => { const n=[...items]; n[i]=u; setItems(n); setEditing(null); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),title:'New Project',icon:'🚀',description:'',tags:[],category:'web',year:'2024',featured:false,image:''}]); setEditing(items.length); };
  return (
    <div>
      <PageHeader title="🖼️ Portfolio" subtitle={`${items.length} projects`} onSave={() => onSave('portfolio', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add Project</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={{ ...card, borderLeft: editing===i ? `3px solid ${C.cyan}` : `3px solid transparent` }}>
          {editing===i
            ? <PortfolioForm item={item} onSave={u=>save(i,u)} onCancel={()=>setEditing(null)} />
            : (
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  {item.image ? <img src={item.image} alt="" style={{width:52,height:52,borderRadius:8,objectFit:'cover',border:`1px solid ${C.border}`}} /> : <div style={{width:52,height:52,borderRadius:8,background:C.cyanDim,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>{item.icon}</div>}
                  <div>
                    <div style={{fontFamily:font.head,fontWeight:600,marginBottom:4,display:'flex',alignItems:'center',gap:8}}>
                      {item.title} {item.featured && <Badge color={C.cyan}>FEATURED</Badge>} <Badge>{item.year}</Badge>
                    </div>
                    <div style={{fontSize:'0.78rem',color:C.muted}}>{(item.tags||[]).join(' · ')}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button style={btnGhost} onClick={()=>setEditing(i)}>✏️ Edit</button>
                  <button style={btnDanger} onClick={()=>remove(i)}>🗑️</button>
                </div>
              </div>
            )
          }
        </div>
      ))}
      <AddBtn onClick={add} label="Add New Project" />
    </div>
  );
}

function PortfolioForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({...item});
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <FieldGroup columns={2}>
        <Field label="Icon"><input style={input} value={f.icon||''} onChange={e=>set('icon',e.target.value)} /></Field>
        <Field label="Title"><input style={input} value={f.title||''} onChange={e=>set('title',e.target.value)} /></Field>
        <Field label="Year"><input style={input} value={f.year||''} onChange={e=>set('year',e.target.value)} /></Field>
        <Field label="Category">
          <select style={input} value={f.category||'web'} onChange={e=>set('category',e.target.value)}>
            {['web','cloud','mobile','design','it'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </FieldGroup>
      <div style={{marginBottom:14}}><Field label="Description"><textarea style={textarea} value={f.description||''} onChange={e=>set('description',e.target.value)} /></Field></div>
      <div style={{marginBottom:14}}><Field label="Tags (comma separated)"><input style={input} value={(f.tags||[]).join(', ')} onChange={e=>set('tags',e.target.value.split(',').map(t=>t.trim()).filter(Boolean))} /></Field></div>
      <div style={{marginBottom:14}}><ImageUpload label="Project Image" value={f.image||''} onChange={v=>set('image',v)} /></div>
      <Toggle value={!!f.featured} onChange={v=>set('featured',v)} label="Featured Project" />
      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button style={btnPrimary} onClick={()=>onSave(f)}>✓ Save</button>
        <button style={btnGhost} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── TEAM ──────────────────────────────────────────────────
function TeamSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const set = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Remove member?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),name:'New Member',role:'Role',avatar:'👤',bio:'',image:''}]); setEditing(items.length); };
  return (
    <div>
      <PageHeader title="👥 Team" subtitle={`${items.length} members`} onSave={() => onSave('team', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add Member</button>} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {items.map((item,i) => (
          <div key={item.id||i} style={{ ...card, margin:0 }}>
            {editing===i ? (
              <div>
                <FieldGroup columns={2}>
                  <Field label="Avatar Emoji"><input style={input} value={item.avatar||''} onChange={e=>set(i,'avatar',e.target.value)} /></Field>
                  <Field label="Name"><input style={input} value={item.name||''} onChange={e=>set(i,'name',e.target.value)} /></Field>
                  <Field label="Role" ><input style={input} value={item.role||''} onChange={e=>set(i,'role',e.target.value)} /></Field>
                </FieldGroup>
                <div style={{marginBottom:12}}><Field label="Bio"><textarea style={{...textarea,minHeight:60}} value={item.bio||''} onChange={e=>set(i,'bio',e.target.value)} /></Field></div>
                <ImageUpload label="Photo" value={item.image||''} onChange={v=>set(i,'image',v)} size={60} />
                <button style={{...btnPrimary,marginTop:12}} onClick={()=>setEditing(null)}>✓ Done</button>
              </div>
            ) : (
              <div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                  {item.image ? <img src={item.image} alt="" style={{width:50,height:50,borderRadius:'50%',objectFit:'cover',border:`2px solid ${C.cyanGlow}`}} /> : <div style={{fontSize:'2.2rem'}}>{item.avatar}</div>}
                  <div>
                    <div style={{fontFamily:font.head,fontWeight:700,fontSize:'0.9rem'}}>{item.name}</div>
                    <div style={{fontSize:'0.75rem',color:C.cyan}}>{item.role}</div>
                  </div>
                </div>
                <div style={{fontSize:'0.78rem',color:C.muted,marginBottom:12,lineHeight:1.5}}>{item.bio}</div>
                <div style={{display:'flex',gap:8}}>
                  <button style={btnGhost} onClick={()=>setEditing(i)}>✏️ Edit</button>
                  <button style={btnDanger} onClick={()=>remove(i)}>🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <AddBtn onClick={add} label="Add Team Member" />
    </div>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────
function TestimonialsSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const set = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),text:'',name:'',role:'',avatar:'👤'}]);
  return (
    <div>
      <PageHeader title="💬 Testimonials" subtitle={`${items.length} quotes`} onSave={() => onSave('testimonials', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={card}>
          <div style={{marginBottom:12}}><Field label="Quote"><textarea style={textarea} value={item.text||''} onChange={e=>set(i,'text',e.target.value)} /></Field></div>
          <FieldGroup columns={3}>
            <Field label="Client Name"><input style={input} value={item.name||''} onChange={e=>set(i,'name',e.target.value)} /></Field>
            <Field label="Role & Company"><input style={input} value={item.role||''} onChange={e=>set(i,'role',e.target.value)} /></Field>
            <Field label="Avatar Emoji"><input style={input} value={item.avatar||''} onChange={e=>set(i,'avatar',e.target.value)} /></Field>
          </FieldGroup>
          <div style={{textAlign:'right',marginTop:8}}><button style={btnDanger} onClick={()=>remove(i)}>🗑️ Delete</button></div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Testimonial" />
    </div>
  );
}

// ── FAQS ──────────────────────────────────────────────────
function FaqsSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const set = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),q:'',a:''}]);
  return (
    <div>
      <PageHeader title="❓ FAQs" subtitle={`${items.length} questions`} onSave={() => onSave('faqs', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add FAQ</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={card}>
          <div style={{marginBottom:10}}><Field label={`Q${i+1} — Question`}><input style={input} value={item.q||''} onChange={e=>set(i,'q',e.target.value)} placeholder="Enter question..." /></Field></div>
          <div style={{marginBottom:10}}><Field label="Answer"><textarea style={textarea} value={item.a||''} onChange={e=>set(i,'a',e.target.value)} placeholder="Enter answer..." /></Field></div>
          <div style={{textAlign:'right'}}><button style={btnDanger} onClick={()=>remove(i)}>🗑️ Delete</button></div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add FAQ" />
    </div>
  );
}

// ── STATS ─────────────────────────────────────────────────
function StatsSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const set = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  return (
    <div>
      <PageHeader title="📊 Stats" subtitle="Homepage counter numbers" onSave={() => onSave('stats', items)} saving={saving} />
      <div style={grid2}>
        {items.map((item,i) => (
          <div key={i} style={card}>
            <FieldGroup columns={3}>
              <Field label="Number"><input style={input} type="number" value={item.num} onChange={e=>set(i,'num',+e.target.value)} /></Field>
              <Field label="Suffix"><input style={input} value={item.suffix||''} onChange={e=>set(i,'suffix',e.target.value)} placeholder="+, %, x" /></Field>
              <Field label="Label"><input style={input} value={item.label||''} onChange={e=>set(i,'label',e.target.value)} /></Field>
            </FieldGroup>
            <div style={{marginTop:12,padding:'12px 16px',background:C.bg,borderRadius:8,textAlign:'center',border:`1px solid ${C.border}`}}>
              <div style={{fontFamily:font.head,fontSize:'1.8rem',fontWeight:800,color:C.cyan}}>{item.num}{item.suffix}</div>
              <div style={{fontSize:'0.7rem',color:C.muted,textTransform:'uppercase',letterSpacing:'0.1em',marginTop:2}}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TIMELINE ──────────────────────────────────────────────
function TimelineSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const set = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),year:'2025',title:'',body:''}]);
  return (
    <div>
      <PageHeader title="📅 Timeline" subtitle="Company milestones" onSave={() => onSave('timeline', items)} saving={saving} extra={<button style={btnGhost} onClick={add}>+ Add Milestone</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={{ ...card, display:'flex', gap:16 }}>
          <div style={{ width:80, flexShrink:0 }}>
            <label style={label}>Year</label>
            <input style={{...input,textAlign:'center',fontFamily:font.head,fontWeight:700,color:C.cyan}} value={item.year||''} onChange={e=>set(i,'year',e.target.value)} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{marginBottom:10}}><Field label="Title"><input style={input} value={item.title||''} onChange={e=>set(i,'title',e.target.value)} /></Field></div>
            <Field label="Description"><textarea style={{...textarea,minHeight:60}} value={item.body||''} onChange={e=>set(i,'body',e.target.value)} /></Field>
          </div>
          <div style={{paddingTop:24}}><button style={btnDanger} onClick={()=>remove(i)}>🗑️</button></div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Milestone" />
    </div>
  );
}

// ── EFFECTS ───────────────────────────────────────────────
function EffectsSection({ data, onSave, saving }) {
  const [form, setForm] = useState({...data});
  const effects = [
    { key:'neuralCanvas', label:'Neural Network Animation', desc:'Animated particle network on homepage hero', icon:'🕸️' },
    { key:'customCursor', label:'Custom Cursor', desc:'Glowing cyan custom mouse cursor effect', icon:'🖱️' },
    { key:'scrollReveal', label:'Scroll Reveal Animations', desc:'Elements fade in as you scroll down', icon:'✨' },
    { key:'marquee', label:'Scrolling Marquee Bar', desc:'Infinite scrolling text ticker banner', icon:'📜' },
    { key:'orbitRings', label:'Orbit Ring Animation', desc:'Spinning orbit rings in about section', icon:'🪐' },
  ];
  return (
    <div>
      <PageHeader title="✨ Visual Effects" subtitle="Toggle animations on/off" onSave={() => onSave('effects', form)} saving={saving} />
      <div style={{ ...card, background: 'rgba(0,212,255,0.03)', borderColor: C.cyanGlow, marginBottom:16 }}>
        <div style={{ fontSize:'0.82rem', color:C.muted }}>💡 Toggle visual effects on or off. Changes apply immediately on the website.</div>
      </div>
      {effects.map(({ key, label: lbl, desc, icon }) => (
        <div key={key} style={{ ...card, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:44,height:44,borderRadius:10,background:C.cyanDim,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontFamily:font.head, fontWeight:600, marginBottom:3 }}>{lbl}</div>
              <div style={{ fontSize:'0.78rem', color:C.muted }}>{desc}</div>
            </div>
          </div>
          <Toggle value={!!form[key]} onChange={v=>setForm(f=>({...f,[key]:v}))} label={form[key]?'ON':'OFF'} />
        </div>
      ))}
    </div>
  );
}

// ── SHARED LAYOUT COMPONENTS ──────────────────────────────
function PageHeader({ title, subtitle, onSave, saving, extra }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
      <div>
        <h2 style={{ fontFamily:font.head, fontSize:'1.4rem', fontWeight:800, margin:0, color:C.text }}>{title}</h2>
        {subtitle && <div style={{ fontSize:'0.82rem', color:C.muted, marginTop:4 }}>{subtitle}</div>}
      </div>
      <div style={{ display:'flex', gap:10 }}>
        {extra}
        <button style={{ ...btnPrimary, boxShadow:`0 4px 16px rgba(0,212,255,0.2)` }} onClick={onSave} disabled={saving}>
          {saving ? '⟳ Saving...' : '💾 Save Changes'}
        </button>
      </div>
    </div>
  );
}

function AddBtn({ onClick, label }) {
  return (
    <button onClick={onClick} style={{ width:'100%', background:C.cyanDim, border:`2px dashed ${C.border}`, borderRadius:10, padding:'14px', color:C.cyan, fontFamily:font.body, fontSize:'0.88rem', cursor:'pointer', marginTop:8, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
      <span style={{ fontSize:'1.1rem' }}>+</span> {label}
    </button>
  );
}

// ── MAIN ADMIN ────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [active, setActive] = useState('siteInfo');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show:false, message:'', type:'success' });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const showToast = (msg, type='success') => {
    setToast({ show:true, message:msg, type });
    setTimeout(() => setToast(t=>({...t,show:false})), 3500);
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
      showToast(`${section} saved successfully!`);
    } catch(e) { showToast('Save failed: ' + e.message, 'error'); }
    setSaving(false);
  };

  const handleLogout = async () => { await adminLogout(); setLoggedIn(false); };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:font.head }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2rem', marginBottom:12, animation:'spin 1s linear infinite' }}>⟳</div>
        <div style={{ color:C.cyan }}>Loading Admin Panel...</div>
      </div>
    </div>
  );

  const sp = { data: data?.[active], onSave: handleSave, saving };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', fontFamily:font.body, color:C.text }}>
      {/* Sidebar */}
      <div style={{ width:260, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100, overflowY:'auto' }}>
        {/* Logo */}
        <div style={{ padding:'28px 24px 20px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:font.head, fontSize:'1.3rem', fontWeight:800, letterSpacing:'-0.02em' }}>
            ASPRO<span style={{ color:C.cyan }}>.</span>ITE
          </div>
          <div style={{ fontSize:'0.68rem', color:C.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:3 }}>Admin Panel</div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'12px 0' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              display:'flex', alignItems:'center', gap:12, width:'100%', padding:'11px 20px',
              background: active===s.id ? `linear-gradient(90deg, ${C.cyanDim}, transparent)` : 'none',
              border:'none', borderLeft: active===s.id ? `3px solid ${C.cyan}` : '3px solid transparent',
              color: active===s.id ? C.text : C.muted, cursor:'pointer', textAlign:'left',
              fontFamily:font.body, fontSize:'0.85rem', transition:'all 0.15s',
            }}>
              <span style={{ fontSize:'1rem', opacity: active===s.id ? 1 : 0.7 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight: active===s.id ? 600 : 400, lineHeight:1.2 }}>{s.label}</div>
                <div style={{ fontSize:'0.68rem', opacity:0.6, marginTop:1 }}>{s.desc}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:'16px 20px', borderTop:`1px solid ${C.border}` }}>
          <a href="/#/" target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, color:C.muted, textDecoration:'none', fontSize:'0.8rem', padding:'9px 12px', borderRadius:7, marginBottom:8, background:C.cyanDim, border:`1px solid ${C.border}` }}>
            🌐 <span>View Live Site</span>
          </a>
          <button onClick={handleLogout} style={{ ...btnDanger, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:10 }}>
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ marginLeft:260, flex:1, padding:'36px 40px', maxWidth:'calc(100vw - 260px)', overflowX:'hidden' }}>
        {active==='siteInfo' && data?.siteInfo && <SiteInfoSection {...sp} data={data.siteInfo} />}
        {active==='services' && data?.services && <ServicesSection {...sp} data={data.services} />}
        {active==='portfolio' && data?.portfolio && <PortfolioSection {...sp} data={data.portfolio} />}
        {active==='team' && data?.team && <TeamSection {...sp} data={data.team} />}
        {active==='testimonials' && data?.testimonials && <TestimonialsSection {...sp} data={data.testimonials} />}
        {active==='faqs' && data?.faqs && <FaqsSection {...sp} data={data.faqs} />}
        {active==='stats' && data?.stats && <StatsSection {...sp} data={data.stats} />}
        {active==='timeline' && data?.timeline && <TimelineSection {...sp} data={data.timeline} />}
        {active==='effects' && data?.effects && <EffectsSection {...sp} data={data.effects} />}
      </div>

      <Toast {...toast} />
    </div>
  );
}
