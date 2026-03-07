import { useState, useEffect, useRef } from 'react';
import { adminLogin, adminLogout, adminGetData, adminSave, adminUpload, isLoggedIn, changeAdminPassword, resetAdminPassword } from '../data/api.js';
import { Cursor } from '../components/index.jsx';

const C = {
  bg:'#05080f', surface:'#0a0f1a', surface2:'#0e1525',
  border:'rgba(0,212,255,0.1)', borderHover:'rgba(0,212,255,0.25)',
  cyan:'#00d4ff', cyanDim:'rgba(0,212,255,0.08)', cyanGlow:'rgba(0,212,255,0.15)',
  text:'#e2eaf5', muted:'#5a6a82',
  danger:'#ff4757', dangerDim:'rgba(255,71,87,0.1)',
  success:'#00ff88', successDim:'rgba(0,255,136,0.1)',
  warning:'#f4b942',
};
const font = { head:"'Oxanium', sans-serif", body:"'DM Sans', sans-serif" };
const inp = { width:'100%', background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:'10px 14px', color:C.text, fontFamily:font.body, fontSize:'0.88rem', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' };
const txa = { ...inp, resize:'vertical', minHeight:80 };
const lbl = { fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:C.muted, display:'block', marginBottom:6 };
const crd = { background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:22, marginBottom:16 };
const bP = { background:`linear-gradient(135deg,${C.cyan},#0099bb)`, color:'#000', border:'none', borderRadius:7, padding:'10px 22px', fontFamily:font.body, fontWeight:700, fontSize:'0.85rem', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:7, whiteSpace:'nowrap' };
const bG = { background:'transparent', color:C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:'9px 18px', fontFamily:font.body, fontSize:'0.82rem', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 };
const bD = { background:C.dangerDim, color:C.danger, border:`1px solid rgba(255,71,87,0.2)`, borderRadius:7, padding:'8px 14px', fontFamily:font.body, fontSize:'0.8rem', cursor:'pointer' };

const SECTIONS = [
  { id:'homePage',     label:'Home Page',      icon:'🏠', desc:'Hero, about section, CTA' },
  { id:'servicesPage', label:'Services Page',  icon:'⚙️', desc:'Headings, process, why us' },
  { id:'portfolioPage',label:'Portfolio Page', icon:'🖼️', desc:'Headings, stats bar, CTA' },
  { id:'aboutPage',    label:'About Page',     icon:'📖', desc:'Mission, values, sections' },
  { id:'contactPage',  label:'Contact Page',   icon:'📞', desc:'Headings, info cards, form' },
  { id:'footer',       label:'Footer',         icon:'📌', desc:'Links, newsletter, socials' },
  { id:'siteInfo',     label:'Site Info',      icon:'🏢', desc:'Logo, contact, addresses' },
  { id:'services',     label:'Services (Items)',icon:'🔧',desc:'Add/edit/remove services' },
  { id:'portfolio',    label:'Portfolio (Items)',icon:'📂',desc:'Projects & case studies' },
  { id:'team',         label:'Team',           icon:'👥', desc:'Team members & bios' },
  { id:'testimonials', label:'Testimonials',   icon:'💬', desc:'Client quotes' },
  { id:'faqs',         label:'FAQs',           icon:'❓', desc:'Questions & answers' },
  { id:'stats',        label:'Stats',          icon:'📊', desc:'Counter numbers' },
  { id:'timeline',     label:'Timeline',       icon:'📅', desc:'Company milestones' },
  { id:'effects',      label:'Visual Effects', icon:'✨', desc:'Animations & effects' },
  { id:'password',     label:'Security',       icon:'🔐', desc:'Change admin password' },
];

function Toggle({ value, onChange, label:lbl2 }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <button onClick={() => onChange(!value)} style={{ position:'relative', width:46, height:26, background:value?`linear-gradient(135deg,${C.cyan},#0099bb)`:'#1a2535', border:'none', borderRadius:100, cursor:'pointer', flexShrink:0, transition:'background 0.3s' }}>
        <div style={{ position:'absolute', top:3, left:value?23:3, width:20, height:20, background:'#fff', borderRadius:'50%', transition:'left 0.3s' }} />
      </button>
      {lbl2 && <span style={{ fontSize:'0.85rem', color:value?C.cyan:C.muted }}>{lbl2}</span>}
    </div>
  );
}

function Badge({ children, color=C.cyan }) {
  return <span style={{ display:'inline-block', background:`${color}18`, color, border:`1px solid ${color}35`, borderRadius:100, padding:'2px 10px', fontSize:'0.65rem', fontWeight:700 }}>{children}</span>;
}

function ImgUpload({ value, onChange, label:lbl2='Image', size=72 }) {
  const ref = useRef();
  const [up, setUp] = useState(false);
  const handle = async (e) => {
    const file = e.target.files[0]; if(!file) return;
    setUp(true);
    try { const r = await adminUpload(file); onChange(r.url); } catch { alert('Upload failed'); }
    setUp(false);
  };
  return (
    <div>
      {lbl2 && <label style={lbl}>{lbl2}</label>}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
        {value ? <img src={value} alt="" style={{ width:size, height:size, objectFit:'cover', borderRadius:8, border:`1px solid ${C.border}` }} onError={e=>e.target.style.display='none'} />
          : <div style={{ width:size, height:size, borderRadius:8, border:`2px dashed ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', color:C.muted, background:C.cyanDim }}>🖼️</div>}
        <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
          <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={handle} />
          <button style={{ ...bG, fontSize:'0.78rem' }} onClick={() => ref.current.click()} disabled={up}>{up?'⟳ Uploading...':value?'🔄 Change':'📤 Upload'}</button>
          {value && <button style={{ ...bD, fontSize:'0.72rem', padding:'5px 10px' }} onClick={()=>onChange('')}>✕ Remove</button>}
        </div>
        <input style={{ ...inp, flex:1, fontSize:'0.75rem', minWidth:120 }} value={value||''} onChange={e=>onChange(e.target.value)} placeholder="Or paste URL..." />
      </div>
    </div>
  );
}

function F({ label:l, children }) { return <div><label style={lbl}>{l}</label>{children}</div>; }
function FG({ children, cols=1 }) { return <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:14, marginBottom:14 }}>{children}</div>; }

function SCard({ title, subtitle, children, actions }) {
  return (
    <div style={{ ...crd, borderColor:C.borderHover }}>
      {(title||actions) && (
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
          <div>
            {title && <div style={{ fontFamily:font.head, fontWeight:700, fontSize:'0.95rem', color:C.text, marginBottom:2 }}>{title}</div>}
            {subtitle && <div style={{ fontSize:'0.75rem', color:C.muted }}>{subtitle}</div>}
          </div>
          {actions && <div style={{ display:'flex', gap:8 }}>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function Toast({ message, type, show }) {
  return (
    <div style={{ position:'fixed', bottom:28, right:28, zIndex:999997, background:type==='error'?'#12080a':'#080f0d', border:`1px solid ${type==='error'?C.danger:C.success}`, borderRadius:10, padding:'14px 20px', display:'flex', alignItems:'center', gap:10, transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)', transform:show?'translateY(0) scale(1)':'translateY(80px) scale(0.9)', opacity:show?1:0, pointerEvents:show?'all':'none' }}>
      <span>{type==='error'?'❌':'✅'}</span>
      <span style={{ color:type==='error'?C.danger:C.success, fontSize:'0.88rem', fontWeight:500 }}>{message}</span>
    </div>
  );
}

function PH({ title, subtitle, onSave, saving, extra }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
      <div>
        <h2 style={{ fontFamily:font.head, fontSize:'1.4rem', fontWeight:800, margin:0, color:C.text }}>{title}</h2>
        {subtitle && <div style={{ fontSize:'0.82rem', color:C.muted, marginTop:4 }}>{subtitle}</div>}
      </div>
      <div style={{ display:'flex', gap:10 }}>
        {extra}
        {onSave && <button style={{ ...bP, boxShadow:`0 4px 16px rgba(0,212,255,0.2)` }} onClick={onSave} disabled={saving}>{saving?'⟳ Saving...':'💾 Save Changes'}</button>}
      </div>
    </div>
  );
}

function AddBtn({ onClick, label:l }) {
  return <button onClick={onClick} style={{ width:'100%', background:C.cyanDim, border:`2px dashed ${C.border}`, borderRadius:10, padding:'14px', color:C.cyan, fontFamily:font.body, fontSize:'0.88rem', cursor:'pointer', marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}><span style={{ fontSize:'1.1rem' }}>+</span> {l}</button>;
}

// Reusable heading editor block
function HeadingBlock({ f, s, labelKey, titleKey, accentKey, labelPlaceholder='Section Label', titlePlaceholder='Section Title', accentPlaceholder='Accent (cyan)' }) {
  return (
    <FG cols={3}>
      {labelKey && <F label="Section Label"><input style={inp} value={f[labelKey]||''} onChange={e=>s(labelKey,e.target.value)} placeholder={labelPlaceholder} /></F>}
      <F label="Title"><input style={inp} value={f[titleKey]||''} onChange={e=>s(titleKey,e.target.value)} placeholder={titlePlaceholder} /></F>
      <F label="Accent (cyan highlight)"><input style={inp} value={f[accentKey]||''} onChange={e=>s(accentKey,e.target.value)} placeholder={accentPlaceholder} /></F>
    </FG>
  );
}

function CTABlock({ f, s, prefix='cta' }) {
  return (
    <SCard title="CTA Section" subtitle="Call-to-action banner at bottom of page">
      <FG cols={2}>
        <F label="Section Label"><input style={inp} value={f[`${prefix}Label`]||''} onChange={e=>s(`${prefix}Label`,e.target.value)} placeholder="e.g. Get Started" /></F>
        <F label="Title"><input style={inp} value={f[`${prefix}Title`]||''} onChange={e=>s(`${prefix}Title`,e.target.value)} /></F>
      </FG>
      <FG cols={2}>
        <F label="Title Accent (cyan)"><input style={inp} value={f[`${prefix}TitleAccent`]||''} onChange={e=>s(`${prefix}TitleAccent`,e.target.value)} /></F>
        <F label="Subtitle"><input style={inp} value={f[`${prefix}Subtitle`]||''} onChange={e=>s(`${prefix}Subtitle`,e.target.value)} /></F>
      </FG>
      <FG cols={2}>
        <F label="Primary Button Text"><input style={inp} value={f[`${prefix}PrimaryText`]||''} onChange={e=>s(`${prefix}PrimaryText`,e.target.value)} /></F>
        <F label="Ghost Button Text"><input style={inp} value={f[`${prefix}GhostText`]||''} onChange={e=>s(`${prefix}GhostText`,e.target.value)} /></F>
      </FG>
    </SCard>
  );
}

// ── LOGIN ──────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setErr('');
    try { await adminLogin(pw); onLogin(); }
    catch { setErr('Incorrect password. Please try again.'); }
    setLoading(false);
  };

  const doReset = async () => {
    if (window.confirm('Reset password back to the default (asproite2024)?')) {
      await resetAdminPassword();
      setForgot(false); setErr('');
      alert('Password reset to default: asproite2024\n\nPlease log in again with the default password.');
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:font.body, position:'relative', overflow:'hidden' }}>
      <Cursor />
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,212,255,0.06) 0%,transparent 70%)` }} />
      <div style={{ width:440, position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:64, height:64, background:C.cyanDim, border:`1px solid ${C.border}`, borderRadius:16, marginBottom:20, fontSize:'1.8rem' }}>⚡</div>
          <div style={{ fontFamily:font.head, fontSize:'2rem', fontWeight:800, color:C.text }}>ASPRO<span style={{ color:C.cyan }}>.</span>ITE</div>
          <div style={{ color:C.muted, fontSize:'0.88rem', marginTop:6 }}>Admin Control Panel</div>
        </div>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:'36px 40px', position:'relative', overflow:'hidden', boxShadow:`0 24px 80px rgba(0,0,0,0.5)` }}>
          <div style={{ position:'absolute', top:0, left:'20%', right:'20%', height:1, background:`linear-gradient(90deg,transparent,${C.cyan},transparent)` }} />
          {!forgot ? (
            <form onSubmit={submit}>
              <div style={{ marginBottom:24 }}>
                <label style={{ ...lbl, marginBottom:8 }}>Admin Password</label>
                <div style={{ position:'relative' }}>
                  <input type="password" style={{ ...inp, paddingLeft:44, fontSize:'1rem' }} placeholder="Enter your password" value={pw} onChange={e=>setPw(e.target.value)} autoFocus />
                  <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:'1rem', opacity:0.4 }}>🔐</span>
                </div>
              </div>
              {err && <div style={{ background:C.dangerDim, border:`1px solid rgba(255,71,87,0.2)`, borderRadius:8, padding:'10px 14px', marginBottom:18, color:C.danger, fontSize:'0.82rem' }}>⚠️ {err}</div>}
              <button type="submit" style={{ ...bP, width:'100%', padding:'13px', fontSize:'0.95rem', justifyContent:'center', borderRadius:9 }} disabled={loading}>{loading?'⟳ Signing in...':'→ Sign In to Admin'}</button>
              <div style={{ textAlign:'center', marginTop:18 }}>
                <button type="button" onClick={() => setForgot(true)} style={{ background:'none', border:'none', color:C.muted, fontSize:'0.8rem', cursor:'pointer', textDecoration:'underline', fontFamily:font.body }}>Forgot Password?</button>
              </div>
            </form>
          ) : (
            <div>
              <h3 style={{ fontFamily:font.head, color:C.text, marginBottom:8, fontSize:'1.1rem' }}>🔑 Reset Password</h3>
              <p style={{ color:C.muted, fontSize:'0.84rem', lineHeight:1.65, marginBottom:20 }}>Resets your admin password back to the default. You can then log in and set a new one from Security.</p>
              <div style={{ background:C.cyanDim, border:`1px solid ${C.border}`, borderRadius:8, padding:'12px 16px', marginBottom:20 }}>
                <div style={{ fontSize:'0.68rem', color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Default password</div>
                <div style={{ fontFamily:'monospace', color:C.cyan, fontSize:'1rem' }}>asproite2024</div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={doReset} style={{ ...bP, flex:1, justifyContent:'center' }}>Reset to Default</button>
                <button onClick={() => setForgot(false)} style={bG}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────
function HomePageSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <PH title="🏠 Home Page" subtitle="Hero, about section, services section, CTA" onSave={()=>onSave('homePage',f)} saving={saving} />

      <SCard title="Hero Section" subtitle="Main headline and call-to-action buttons">
        <FG cols={2}>
          <F label="Hero Title"><input style={inp} value={f.heroTitle||''} onChange={e=>s('heroTitle',e.target.value)} placeholder="Transform Your" /></F>
          <F label="Title Accent (cyan highlight)"><input style={inp} value={f.heroTitleAccent||''} onChange={e=>s('heroTitleAccent',e.target.value)} placeholder="Digital Future" /></F>
        </FG>
        <div style={{marginBottom:14}}><F label="Hero Subtitle / Description"><textarea style={txa} value={f.heroSubtitle||''} onChange={e=>s('heroSubtitle',e.target.value)} /></F></div>
        <FG cols={2}>
          <F label="Primary Button Text"><input style={inp} value={f.heroPrimaryText||''} onChange={e=>s('heroPrimaryText',e.target.value)} /></F>
          <F label="Ghost Button Text"><input style={inp} value={f.heroGhostText||''} onChange={e=>s('heroGhostText',e.target.value)} /></F>
        </FG>
      </SCard>

      <SCard title="Typing Phrases" subtitle="Text that rotates in the hero tag line">
        {(f.typingPhrases||[]).map((p,i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input style={inp} value={p} onChange={e=>{ const a=[...(f.typingPhrases||[])]; a[i]=e.target.value; s('typingPhrases',a); }} />
            <button style={bD} onClick={()=>s('typingPhrases',(f.typingPhrases||[]).filter((_,x)=>x!==i))}>✕</button>
          </div>
        ))}
        <button style={{ ...bG, marginTop:4 }} onClick={()=>s('typingPhrases',[...(f.typingPhrases||[]),'New phrase'])}>+ Add Phrase</button>
      </SCard>

      <SCard title="Hero Stats Bar" subtitle="The 4 stats shown below hero buttons">
        {(f.heroStats||[{value:'25+',label:'Years Experience'},{value:'40+',label:'IT Services'},{value:'24/7',label:'Support'},{value:'500+',label:'Clients Served'}]).map((st,i) => (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:10 }}>
            <div style={{ flex:'0 0 120px' }}><F label={`Stat ${i+1} Value`}><input style={inp} value={st.value||''} onChange={e=>{ const a=[...(f.heroStats||[])]; a[i]={...a[i],value:e.target.value}; s('heroStats',a); }} placeholder="25+" /></F></div>
            <div style={{ flex:1 }}><F label="Label"><input style={inp} value={st.label||''} onChange={e=>{ const a=[...(f.heroStats||[])]; a[i]={...a[i],label:e.target.value}; s('heroStats',a); }} placeholder="Years Experience" /></F></div>
          </div>
        ))}
      </SCard>

      <SCard title="About Mini Stats" subtitle="The 4 small cards beside the orbit graphic (25+ Years Active, 40+ Services, etc.)">
        {(f.aboutMiniStats||[{value:'25+',label:'Years Active'},{value:'40+',label:'Services'},{value:'500+',label:'Clients'},{value:'2',label:'Global Offices'}]).map((st,i) => (
          <div key={i} style={{ display:'flex', gap:10, marginBottom:10 }}>
            <div style={{ flex:'0 0 120px' }}><F label={`Card ${i+1} Value`}><input style={inp} value={st.value||''} onChange={e=>{ const a=[...(f.aboutMiniStats||[])]; a[i]={...a[i],value:e.target.value}; s('aboutMiniStats',a); }} placeholder="25+" /></F></div>
            <div style={{ flex:1 }}><F label="Label"><input style={inp} value={st.label||''} onChange={e=>{ const a=[...(f.aboutMiniStats||[])]; a[i]={...a[i],label:e.target.value}; s('aboutMiniStats',a); }} placeholder="Years Active" /></F></div>
          </div>
        ))}
        <div style={{ fontSize:'0.72rem', color:'rgba(90,106,130,0.8)', marginTop:4 }}>These appear in the 2×2 grid next to the spinning orbit graphic on the homepage.</div>
      </SCard>

      <SCard title="About Section — Mini Stat Boxes" subtitle="The 4 glowing boxes below the orbit graphic (25+, 40+, 500+, 2)">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {(f.aboutMiniStats || [{value:'25+',label:'Years Active'},{value:'40+',label:'Services'},{value:'500+',label:'Clients'},{value:'2',label:'Global Offices'}]).map((st,i) => (
            <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:14 }}>
              <FG cols={2}>
                <F label={`Box ${i+1} Value`}><input style={inp} value={st.value||''} onChange={e=>{ const a=[...(f.aboutMiniStats||[{value:'25+',label:'Years Active'},{value:'40+',label:'Services'},{value:'500+',label:'Clients'},{value:'2',label:'Global Offices'}])]; a[i]={...a[i],value:e.target.value}; s('aboutMiniStats',a); }} placeholder="25+" /></F>
                <F label="Label"><input style={inp} value={st.label||''} onChange={e=>{ const a=[...(f.aboutMiniStats||[{value:'25+',label:'Years Active'},{value:'40+',label:'Services'},{value:'500+',label:'Clients'},{value:'2',label:'Global Offices'}])]; a[i]={...a[i],label:e.target.value}; s('aboutMiniStats',a); }} placeholder="Years Active" /></F>
              </FG>
            </div>
          ))}
        </div>
      </SCard>

      <SCard title="About Preview Section" subtitle="The about section shown on the homepage">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.aboutSectionLabel||''} onChange={e=>s('aboutSectionLabel',e.target.value)} placeholder="About Asproite" /></F>
          <F label="Title"><input style={inp} value={f.aboutTitle||''} onChange={e=>s('aboutTitle',e.target.value)} /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.aboutTitleAccent||''} onChange={e=>s('aboutTitleAccent',e.target.value)} /></F>
        </FG>
        <div style={{marginBottom:14}}><F label="Paragraph 1"><textarea style={txa} value={f.aboutText1||''} onChange={e=>s('aboutText1',e.target.value)} /></F></div>
        <div style={{marginBottom:14}}><F label="Paragraph 2"><textarea style={txa} value={f.aboutText2||''} onChange={e=>s('aboutText2',e.target.value)} /></F></div>
        <div style={{marginBottom:14}}>
          <label style={lbl}>Bullet Points (→ list)</label>
          {(f.aboutBullets||[]).map((b,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
              <input style={inp} value={b} onChange={e=>{ const a=[...(f.aboutBullets||[])]; a[i]=e.target.value; s('aboutBullets',a); }} />
              <button style={bD} onClick={()=>s('aboutBullets',(f.aboutBullets||[]).filter((_,x)=>x!==i))}>✕</button>
            </div>
          ))}
          <button style={{ ...bG, marginTop:4 }} onClick={()=>s('aboutBullets',[...(f.aboutBullets||[]),'New bullet point'])}>+ Add Bullet</button>
        </div>
        <FG cols={2}>
          <F label="Primary Button Text"><input style={inp} value={f.aboutPrimaryBtn||''} onChange={e=>s('aboutPrimaryBtn',e.target.value)} placeholder="Learn About Us →" /></F>
          <F label="Ghost Button Text"><input style={inp} value={f.aboutGhostBtn||''} onChange={e=>s('aboutGhostBtn',e.target.value)} placeholder="Get a Quote" /></F>
        </FG>
      </SCard>

      <SCard title="Services Preview Section" subtitle="The services grid section on homepage">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.servicesSectionLabel||''} onChange={e=>s('servicesSectionLabel',e.target.value)} placeholder="What We Do" /></F>
          <F label="Title"><input style={inp} value={f.servicesSectionTitle||''} onChange={e=>s('servicesSectionTitle',e.target.value)} placeholder="Our" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.servicesSectionTitleAccent||''} onChange={e=>s('servicesSectionTitleAccent',e.target.value)} placeholder="Core Services" /></F>
        </FG>
        <F label="All Services Link Text"><input style={inp} value={f.servicesLinkText||''} onChange={e=>s('servicesLinkText',e.target.value)} placeholder="All Services →" /></F>
      </SCard>

      <CTABlock f={f} s={s} prefix="cta" />
    </div>
  );
}

// ── SERVICES PAGE ─────────────────────────────────────────
function ServicesPageSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data, processSteps:[...(data?.processSteps||[])], whyCards:[...(data?.whyCards||[])] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const sp = (i,k,v) => { const a=[...f.processSteps]; a[i]={...a[i],[k]:v}; s('processSteps',a); };
  const sw = (i,k,v) => { const a=[...f.whyCards]; a[i]={...a[i],[k]:v}; s('whyCards',a); };
  return (
    <div>
      <PH title="⚙️ Services Page" subtitle="Page header, all section headings, process steps, why us, CTA" onSave={()=>onSave('servicesPage',f)} saving={saving} />

      <SCard title="Page Header">
        <FG cols={2}>
          <F label="Page Title"><input style={inp} value={f.pageTitle||''} onChange={e=>s('pageTitle',e.target.value)} placeholder="Our" /></F>
          <F label="Page Title Accent (cyan)"><input style={inp} value={f.pageTitleAccent||''} onChange={e=>s('pageTitleAccent',e.target.value)} placeholder="Services" /></F>
        </FG>
        <F label="Page Subtitle"><textarea style={txa} value={f.subtitle||''} onChange={e=>s('subtitle',e.target.value)} /></F>
      </SCard>

      <SCard title="Services Grid Section Headings">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.sectionLabel||''} onChange={e=>s('sectionLabel',e.target.value)} placeholder="What We Offer" /></F>
          <F label="Title"><input style={inp} value={f.sectionTitle||''} onChange={e=>s('sectionTitle',e.target.value)} placeholder="Complete" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.sectionTitleAccent||''} onChange={e=>s('sectionTitleAccent',e.target.value)} placeholder="IT Solutions" /></F>
        </FG>
      </SCard>

      <SCard title="Process Section" subtitle="How We Work steps" actions={<button style={bG} onClick={()=>s('processSteps',[...f.processSteps,{id:Date.now(),num:`0${f.processSteps.length+1}`,title:'New Step',body:'Description here.'}])}>+ Add Step</button>}>
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.processSectionLabel||''} onChange={e=>s('processSectionLabel',e.target.value)} placeholder="How We Work" /></F>
          <F label="Title"><input style={inp} value={f.processSectionTitle||''} onChange={e=>s('processSectionTitle',e.target.value)} placeholder="Our" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.processSectionTitleAccent||''} onChange={e=>s('processSectionTitleAccent',e.target.value)} placeholder="Process" /></F>
        </FG>
        <div style={{ marginTop:12 }}>
          {f.processSteps.map((step,i) => (
            <div key={step.id||i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:10 }}>
              <FG cols={3}>
                <F label="Step Number"><input style={inp} value={step.num||''} onChange={e=>sp(i,'num',e.target.value)} placeholder="01" /></F>
                <F label="Title"><input style={inp} value={step.title||''} onChange={e=>sp(i,'title',e.target.value)} /></F>
              </FG>
              <div style={{marginBottom:10}}><F label="Body"><textarea style={{...txa,minHeight:60}} value={step.body||''} onChange={e=>sp(i,'body',e.target.value)} /></F></div>
              <button style={bD} onClick={()=>{ if(confirm('Delete step?')) s('processSteps',f.processSteps.filter((_,x)=>x!==i)); }}>🗑️ Delete Step</button>
            </div>
          ))}
          <AddBtn onClick={()=>s('processSteps',[...f.processSteps,{id:Date.now(),num:'0'+String(f.processSteps.length+1),title:'New Step',body:'Description here.'}])} label="Add Process Step" />
        </div>
      </SCard>

      <SCard title="Why Us Section" subtitle="The reasons clients choose Asproite">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.whySectionLabel||''} onChange={e=>s('whySectionLabel',e.target.value)} placeholder="Why Asproite" /></F>
          <F label="Title"><input style={inp} value={f.whySectionTitle||''} onChange={e=>s('whySectionTitle',e.target.value)} placeholder="The Reasons Clients" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.whySectionTitleAccent||''} onChange={e=>s('whySectionTitleAccent',e.target.value)} placeholder="Choose Us" /></F>
        </FG>
        <div style={{marginBottom:14}}><F label="Body Text"><textarea style={txa} value={f.whyText||''} onChange={e=>s('whyText',e.target.value)} /></F></div>
        <FG cols={2}>
          <F label="Primary Button Text"><input style={inp} value={f.whyPrimaryBtn||''} onChange={e=>s('whyPrimaryBtn',e.target.value)} placeholder="Start a Project →" /></F>
          <F label="Ghost Button Text"><input style={inp} value={f.whyGhostBtn||''} onChange={e=>s('whyGhostBtn',e.target.value)} placeholder="See Portfolio" /></F>
        </FG>
        <div style={{marginTop:8}}>
          <label style={lbl}>Why Us Cards</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {f.whyCards.map((w,i) => (
              <div key={w.id||i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:14 }}>
                <FG cols={2}>
                  <F label="Icon"><input style={inp} value={w.icon||''} onChange={e=>sw(i,'icon',e.target.value)} /></F>
                  <F label="Title"><input style={inp} value={w.title||''} onChange={e=>sw(i,'title',e.target.value)} /></F>
                </FG>
                <div style={{marginBottom:8}}><F label="Body"><textarea style={{...txa,minHeight:55}} value={w.body||''} onChange={e=>sw(i,'body',e.target.value)} /></F></div>
                <button style={bD} onClick={()=>{ if(confirm('Delete?')) s('whyCards',f.whyCards.filter((_,x)=>x!==i)); }}>🗑️ Delete</button>
              </div>
            ))}
          </div>
          <AddBtn onClick={()=>s('whyCards',[...f.whyCards,{id:Date.now(),icon:'⚡',title:'New Reason',body:'Description here.'}])} label="Add Why Card" />
        </div>
      </SCard>

      <CTABlock f={f} s={s} prefix="cta" />
    </div>
  );
}

// ── PORTFOLIO PAGE ────────────────────────────────────────
function PortfolioPageSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data, statsBar:[...(data?.statsBar||[])] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const ss = (i,k,v) => { const a=[...f.statsBar]; a[i]={...a[i],[k]:v}; s('statsBar',a); };
  return (
    <div>
      <PH title="🖼️ Portfolio Page" subtitle="Page header, stats bar, testimonials heading, CTA" onSave={()=>onSave('portfolioPage',f)} saving={saving} />

      <SCard title="Page Header">
        <FG cols={2}>
          <F label="Page Title"><input style={inp} value={f.pageTitle||''} onChange={e=>s('pageTitle',e.target.value)} placeholder="Our" /></F>
          <F label="Page Title Accent (cyan)"><input style={inp} value={f.pageTitleAccent||''} onChange={e=>s('pageTitleAccent',e.target.value)} placeholder="Portfolio" /></F>
        </FG>
        <F label="Page Subtitle"><textarea style={txa} value={f.subtitle||''} onChange={e=>s('subtitle',e.target.value)} /></F>
      </SCard>

      <SCard title="Stats Bar" subtitle="4 numbers shown below the page header">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {f.statsBar.map((st,i) => (
            <div key={i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:14 }}>
              <FG cols={2}>
                <F label="Value"><input style={inp} value={st.value||''} onChange={e=>ss(i,'value',e.target.value)} placeholder="80+" /></F>
                <F label="Label"><input style={inp} value={st.label||''} onChange={e=>ss(i,'label',e.target.value)} placeholder="Projects Delivered" /></F>
              </FG>
            </div>
          ))}
        </div>
      </SCard>

      <SCard title="Testimonials Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.testimonialsSectionLabel||''} onChange={e=>s('testimonialsSectionLabel',e.target.value)} placeholder="Client Feedback" /></F>
          <F label="Title"><input style={inp} value={f.testimonialsSectionTitle||''} onChange={e=>s('testimonialsSectionTitle',e.target.value)} placeholder="What Clients" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.testimonialsSectionTitleAccent||''} onChange={e=>s('testimonialsSectionTitleAccent',e.target.value)} placeholder="Say" /></F>
        </FG>
      </SCard>

      <CTABlock f={f} s={s} prefix="cta" />
    </div>
  );
}

// ── ABOUT PAGE ────────────────────────────────────────────
function AboutPageSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data, coreValues:[...(data?.coreValues||[])] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const scv = (i,k,v) => { const a=[...f.coreValues]; a[i]={...a[i],[k]:v}; s('coreValues',a); };
  return (
    <div>
      <PH title="📖 About Page" subtitle="Page header, mission/vision/values, section headings, CTA" onSave={()=>onSave('aboutPage',f)} saving={saving} />

      <SCard title="Page Header">
        <FG cols={2}>
          <F label="Page Title"><input style={inp} value={f.pageTitle||''} onChange={e=>s('pageTitle',e.target.value)} placeholder="About" /></F>
          <F label="Page Title Accent (cyan)"><input style={inp} value={f.pageTitleAccent||''} onChange={e=>s('pageTitleAccent',e.target.value)} placeholder="Asproite" /></F>
        </FG>
        <F label="Page Subtitle"><textarea style={txa} value={f.subtitle||''} onChange={e=>s('subtitle',e.target.value)} /></F>
      </SCard>

      <SCard title="Mission / Vision / Values" subtitle="The 3 boxes at the top of the About page">
        {[['Mission','missionIcon','missionTitle','missionText','🎯'],['Vision','visionIcon','visionTitle','visionText','👁️'],['Values','valuesIcon','valuesTitle','valuesText','💎']].map(([name,ik,tk,txtk,def]) => (
          <div key={name} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:18, marginBottom:12 }}>
            <div style={{ fontFamily:font.head, fontSize:'0.78rem', fontWeight:700, color:C.cyan, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.1em' }}>Our {name}</div>
            <FG cols={2}>
              <F label="Icon (Emoji)"><input style={inp} value={f[ik]||def} onChange={e=>s(ik,e.target.value)} /></F>
              <F label="Title"><input style={inp} value={f[tk]||''} onChange={e=>s(tk,e.target.value)} /></F>
            </FG>
            <F label="Description Text"><textarea style={{...txa,minHeight:70}} value={f[txtk]||''} onChange={e=>s(txtk,e.target.value)} /></F>
          </div>
        ))}
      </SCard>

      <SCard title="Stats Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.statsSectionLabel||''} onChange={e=>s('statsSectionLabel',e.target.value)} placeholder="By the Numbers" /></F>
          <F label="Title"><input style={inp} value={f.statsSectionTitle||''} onChange={e=>s('statsSectionTitle',e.target.value)} placeholder="Asproite in" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.statsSectionTitleAccent||''} onChange={e=>s('statsSectionTitleAccent',e.target.value)} placeholder="Numbers" /></F>
        </FG>
      </SCard>

      <SCard title="Core Values Section" subtitle="The value cards grid" actions={<button style={bG} onClick={()=>s('coreValues',[...f.coreValues,{id:Date.now(),icon:'✨',title:'New Value',body:'Description here.'}])}>+ Add Value</button>}>
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.coreValuesSectionLabel||''} onChange={e=>s('coreValuesSectionLabel',e.target.value)} placeholder="Core Values" /></F>
          <F label="Title"><input style={inp} value={f.coreValuesSectionTitle||''} onChange={e=>s('coreValuesSectionTitle',e.target.value)} placeholder="What We" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.coreValuesSectionTitleAccent||''} onChange={e=>s('coreValuesSectionTitleAccent',e.target.value)} placeholder="Stand For" /></F>
        </FG>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:8 }}>
          {f.coreValues.map((cv,i) => (
            <div key={cv.id||i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
              <FG cols={2}><F label="Icon"><input style={inp} value={cv.icon||''} onChange={e=>scv(i,'icon',e.target.value)} /></F><F label="Title"><input style={inp} value={cv.title||''} onChange={e=>scv(i,'title',e.target.value)} /></F></FG>
              <div style={{marginBottom:10}}><F label="Body"><textarea style={{...txa,minHeight:60}} value={cv.body||''} onChange={e=>scv(i,'body',e.target.value)} /></F></div>
              <button style={{...bD,width:'100%'}} onClick={()=>{ if(confirm('Delete?')) s('coreValues',f.coreValues.filter((_,x)=>x!==i)); }}>🗑️ Delete</button>
            </div>
          ))}
        </div>
        <AddBtn onClick={()=>s('coreValues',[...f.coreValues,{id:Date.now(),icon:'✨',title:'New Value',body:'Description.'}])} label="Add Core Value" />
      </SCard>

      <SCard title="Timeline Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.timelineSectionLabel||''} onChange={e=>s('timelineSectionLabel',e.target.value)} placeholder="Our Journey" /></F>
          <F label="Title"><input style={inp} value={f.timelineSectionTitle||''} onChange={e=>s('timelineSectionTitle',e.target.value)} placeholder="Years of" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.timelineSectionTitleAccent||''} onChange={e=>s('timelineSectionTitleAccent',e.target.value)} placeholder="Innovation" /></F>
        </FG>
      </SCard>

      <SCard title="Team Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.teamSectionLabel||''} onChange={e=>s('teamSectionLabel',e.target.value)} placeholder="Our People" /></F>
          <F label="Title"><input style={inp} value={f.teamSectionTitle||''} onChange={e=>s('teamSectionTitle',e.target.value)} placeholder="Meet the" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.teamSectionTitleAccent||''} onChange={e=>s('teamSectionTitleAccent',e.target.value)} placeholder="Team" /></F>
        </FG>
      </SCard>

      <SCard title="Offices Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.officesSectionLabel||''} onChange={e=>s('officesSectionLabel',e.target.value)} placeholder="Our Offices" /></F>
          <F label="Title"><input style={inp} value={f.officesSectionTitle||''} onChange={e=>s('officesSectionTitle',e.target.value)} placeholder="Where We" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.officesSectionTitleAccent||''} onChange={e=>s('officesSectionTitleAccent',e.target.value)} placeholder="Operate" /></F>
        </FG>
      </SCard>

      <CTABlock f={f} s={s} prefix="cta" />
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────
function FooterSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data, serviceLinks:[...(data?.serviceLinks||[])], companyLinks:[...(data?.companyLinks||[])] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <PH title="📌 Footer" subtitle="Description, column headings, links, newsletter, social media" onSave={()=>onSave('footer',f)} saving={saving} />

      <SCard title="Brand Description & Copyright">
        <div style={{marginBottom:14}}><F label="Footer Description"><textarea style={txa} value={f.description||''} onChange={e=>s('description',e.target.value)} /></F></div>
        <F label="Copyright Company Name (shown in © line)"><input style={inp} value={f.copyrightName||''} onChange={e=>s('copyrightName',e.target.value)} /></F>
      </SCard>

      <SCard title="Services Column">
        <div style={{marginBottom:14}}><F label="Column Heading"><input style={inp} value={f.servicesHeading||'Services'} onChange={e=>s('servicesHeading',e.target.value)} placeholder="Services" /></F></div>
        <label style={lbl}>Links</label>
        {f.serviceLinks.map((sl,i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input style={inp} value={sl} onChange={e=>{ const a=[...f.serviceLinks]; a[i]=e.target.value; s('serviceLinks',a); }} />
            <button style={bD} onClick={()=>s('serviceLinks',f.serviceLinks.filter((_,x)=>x!==i))}>✕</button>
          </div>
        ))}
        <button style={{ ...bG, marginTop:4 }} onClick={()=>s('serviceLinks',[...f.serviceLinks,'New Link'])}>+ Add Link</button>
      </SCard>

      <SCard title="Company Column">
        <div style={{marginBottom:14}}><F label="Column Heading"><input style={inp} value={f.companyHeading||'Company'} onChange={e=>s('companyHeading',e.target.value)} placeholder="Company" /></F></div>
        <label style={lbl}>Links</label>
        {f.companyLinks.map((cl,i) => (
          <div key={i} style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input style={inp} value={cl} onChange={e=>{ const a=[...f.companyLinks]; a[i]=e.target.value; s('companyLinks',a); }} placeholder="About Us, Portfolio, Careers, Contact Us..." />
            <button style={bD} onClick={()=>s('companyLinks',f.companyLinks.filter((_,x)=>x!==i))}>✕</button>
          </div>
        ))}
        <div style={{ fontSize:'0.72rem', color:C.muted, marginTop:6 }}>Tip: Use names like "About Us", "Portfolio", "Contact Us", "Services" — they auto-link to the right pages.</div>
        <button style={{ ...bG, marginTop:8 }} onClick={()=>s('companyLinks',[...f.companyLinks,'New Link'])}>+ Add Link</button>
      </SCard>

      <SCard title="Newsletter Section">
        <FG cols={2}>
          <F label="Title"><input style={inp} value={f.newsletterTitle||''} onChange={e=>s('newsletterTitle',e.target.value)} /></F>
          <F label="Subtitle"><input style={inp} value={f.newsletterSubtitle||''} onChange={e=>s('newsletterSubtitle',e.target.value)} /></F>
        </FG>
      </SCard>

      <SCard title="Social Media URLs">
        <FG cols={2}>
          <F label="LinkedIn URL"><input style={inp} value={f.linkedinUrl||''} onChange={e=>s('linkedinUrl',e.target.value)} placeholder="https://linkedin.com/company/..." /></F>
          <F label="Twitter / X URL"><input style={inp} value={f.twitterUrl||''} onChange={e=>s('twitterUrl',e.target.value)} placeholder="https://x.com/..." /></F>
          <F label="Facebook URL"><input style={inp} value={f.facebookUrl||''} onChange={e=>s('facebookUrl',e.target.value)} placeholder="https://facebook.com/..." /></F>
          <F label="Instagram URL"><input style={inp} value={f.instagramUrl||''} onChange={e=>s('instagramUrl',e.target.value)} placeholder="https://instagram.com/..." /></F>
        </FG>
      </SCard>
    </div>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────
function ContactPageSection({ data, onSave, saving }) {
  const [f, setF] = useState({ ...data, infoCards:[...(data?.infoCards||[])] });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const sc = (i,k,v) => { const a=[...f.infoCards]; a[i]={...a[i],[k]:v}; s('infoCards',a); };
  const addCard = () => s('infoCards',[...f.infoCards,{id:Date.now(),label:'New Info',value:'Value here'}]);
  return (
    <div>
      <PH title="📞 Contact Page" subtitle="Page header, info heading, form texts, FAQ heading, info cards" onSave={()=>onSave('contactPage',f)} saving={saving} extra={<button style={bG} onClick={addCard}>+ Add Card</button>} />

      <SCard title="Page Header">
        <FG cols={2}>
          <F label="Page Title"><input style={inp} value={f.pageTitle||''} onChange={e=>s('pageTitle',e.target.value)} placeholder="Get in" /></F>
          <F label="Page Title Accent (cyan)"><input style={inp} value={f.pageTitleAccent||''} onChange={e=>s('pageTitleAccent',e.target.value)} placeholder="Touch" /></F>
        </FG>
        <F label="Page Subtitle"><textarea style={txa} value={f.subtitle||''} onChange={e=>s('subtitle',e.target.value)} /></F>
      </SCard>

      <SCard title="Info Column Heading">
        <FG cols={2}>
          <F label="Title"><input style={inp} value={f.infoTitle||''} onChange={e=>s('infoTitle',e.target.value)} placeholder="Let's Start a" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.infoTitleAccent||''} onChange={e=>s('infoTitleAccent',e.target.value)} placeholder="Conversation" /></F>
        </FG>
      </SCard>

      <SCard title="Contact Info Cards" subtitle="Cards displayed on the left side of the contact page">
        {f.infoCards.map((c,i) => (
          <div key={c.id||i} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:12 }}>
            <FG cols={2}>
              <F label="Label (e.g. Email, Phone)"><input style={inp} value={c.label||''} onChange={e=>sc(i,'label',e.target.value)} /></F>
              <F label="Value (displayed text)"><input style={inp} value={c.value||''} onChange={e=>sc(i,'value',e.target.value)} /></F>
            </FG>
            <div style={{textAlign:'right'}}><button style={bD} onClick={()=>{ if(confirm('Delete?')) s('infoCards',f.infoCards.filter((_,x)=>x!==i)); }}>🗑️ Delete Card</button></div>
          </div>
        ))}
        <AddBtn onClick={addCard} label="Add Info Card" />
      </SCard>

      <SCard title="Contact Form">
        <FG cols={2}>
          <F label="Form Title"><input style={inp} value={f.formTitle||''} onChange={e=>s('formTitle',e.target.value)} placeholder="Send Us a Message" /></F>
          <F label="Submit Button Text"><input style={inp} value={f.formSubmitText||''} onChange={e=>s('formSubmitText',e.target.value)} placeholder="Send Message →" /></F>
        </FG>
        <F label="Form Subtitle / Description"><input style={inp} value={f.formSubtitle||''} onChange={e=>s('formSubtitle',e.target.value)} placeholder="Fill in the form below..." /></F>
      </SCard>

      <SCard title="FAQ Section Heading">
        <FG cols={3}>
          <F label="Section Label"><input style={inp} value={f.faqSectionLabel||''} onChange={e=>s('faqSectionLabel',e.target.value)} placeholder="FAQs" /></F>
          <F label="Title"><input style={inp} value={f.faqSectionTitle||''} onChange={e=>s('faqSectionTitle',e.target.value)} placeholder="Common" /></F>
          <F label="Title Accent (cyan)"><input style={inp} value={f.faqSectionTitleAccent||''} onChange={e=>s('faqSectionTitleAccent',e.target.value)} placeholder="Questions" /></F>
        </FG>
      </SCard>
    </div>
  );
}

// ── SITE INFO ─────────────────────────────────────────────
function SiteInfoSection({ data, onSave, saving }) {
  const [f, setF] = useState({...data});
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <PH title="🏢 Site Info" subtitle="Company details, logo and contact information" onSave={()=>onSave('siteInfo',f)} saving={saving} />
      <SCard title="Company" subtitle="Brand identity">
        <FG cols={2}>
          <F label="Company Name"><input style={inp} value={f.companyName||''} onChange={e=>s('companyName',e.target.value)} /></F>
          <F label="Tagline"><input style={inp} value={f.tagline||''} onChange={e=>s('tagline',e.target.value)} /></F>
        </FG>
        <F label="Description"><textarea style={txa} value={f.description||''} onChange={e=>s('description',e.target.value)} /></F>
        <div style={{marginTop:14}}><ImgUpload label="Company Logo" value={f.logo||''} onChange={v=>s('logo',v)} size={80} /></div>
      </SCard>
      <SCard title="Contact Details">
        <FG cols={2}>
          <F label="Email Address"><input style={inp} value={f.email||''} onChange={e=>s('email',e.target.value)} /></F>
          <F label="Phone Number"><input style={inp} value={f.phone||''} onChange={e=>s('phone',e.target.value)} /></F>
          <F label="London Address"><input style={inp} value={f.londonAddress||''} onChange={e=>s('londonAddress',e.target.value)} /></F>
          <F label="India Address"><input style={inp} value={f.indiaAddress||''} onChange={e=>s('indiaAddress',e.target.value)} /></F>
        </FG>
      </SCard>
    </div>
  );
}

// ── SERVICES ITEMS ────────────────────────────────────────
function ServicesSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const save = (i,u) => { const n=[...items]; n[i]=u; setItems(n); setEditing(null); };
  const remove = (i) => { if(confirm('Delete service?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),icon:'🔧',title:'New Service',tagline:'',description:'',features:['Feature 1'],category:'development',isNew:false}]); setEditing(items.length); };
  return (
    <div>
      <PH title="🔧 Services (Items)" subtitle={`${items.length} services`} onSave={()=>onSave('services',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add Service</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={{ ...crd, borderLeft:editing===i?`3px solid ${C.cyan}`:'3px solid transparent' }}>
          {editing===i ? <ServiceForm item={item} onSave={u=>save(i,u)} onCancel={()=>setEditing(null)} />
            : <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ width:44,height:44,borderRadius:10,background:C.cyanDim,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily:font.head,fontWeight:600,fontSize:'0.92rem',display:'flex',alignItems:'center',gap:8,marginBottom:3 }}>{item.title} {item.isNew&&<Badge color={C.warning}>NEW</Badge>} <Badge>{item.category}</Badge></div>
                    <div style={{ fontSize:'0.78rem',color:C.muted }}>{item.tagline}</div>
                  </div>
                </div>
                <div style={{ display:'flex',gap:8 }}>
                  <button style={bG} onClick={()=>setEditing(i)}>✏️ Edit</button>
                  <button style={bD} onClick={()=>remove(i)}>🗑️</button>
                </div>
              </div>}
        </div>
      ))}
      <AddBtn onClick={add} label="Add New Service" />
    </div>
  );
}
function ServiceForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({...item});
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <FG cols={3}>
        <F label="Icon"><input style={inp} value={f.icon||''} onChange={e=>s('icon',e.target.value)} /></F>
        <F label="Title"><input style={inp} value={f.title||''} onChange={e=>s('title',e.target.value)} /></F>
        <F label="Tagline"><input style={inp} value={f.tagline||''} onChange={e=>s('tagline',e.target.value)} /></F>
      </FG>
      <div style={{marginBottom:14}}><F label="Description"><textarea style={txa} value={f.description||''} onChange={e=>s('description',e.target.value)} /></F></div>
      <div style={{marginBottom:14}}>
        <label style={lbl}>Features</label>
        {(f.features||[]).map((ft,i)=>(<div key={i} style={{display:'flex',gap:8,marginBottom:7}}><input style={inp} value={ft} onChange={e=>{ const a=[...f.features]; a[i]=e.target.value; s('features',a); }} /><button style={bD} onClick={()=>s('features',f.features.filter((_,x)=>x!==i))}>✕</button></div>))}
        <button style={{...bG,marginTop:4}} onClick={()=>s('features',[...(f.features||[]),'New feature'])}>+ Feature</button>
      </div>
      <FG cols={2}>
        <F label="Category"><select style={inp} value={f.category||'development'} onChange={e=>s('category',e.target.value)}>{['development','design','cloud','marketing','infrastructure'].map(c=><option key={c} value={c}>{c}</option>)}</select></F>
        <F label="Badge"><div style={{paddingTop:8}}><Toggle value={!!f.isNew} onChange={v=>s('isNew',v)} label="Mark as NEW" /></div></F>
      </FG>
      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button style={bP} onClick={()=>onSave(f)}>✓ Save Service</button>
        <button style={bG} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── PORTFOLIO ITEMS ───────────────────────────────────────
function PortfolioSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const save = (i,u) => { const n=[...items]; n[i]=u; setItems(n); setEditing(null); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),title:'New Project',icon:'🚀',description:'',tags:[],category:'web',year:'2024',featured:false,image:''}]); setEditing(items.length); };
  return (
    <div>
      <PH title="📂 Portfolio (Items)" subtitle={`${items.length} projects`} onSave={()=>onSave('portfolio',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add Project</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={{ ...crd, borderLeft:editing===i?`3px solid ${C.cyan}`:'3px solid transparent' }}>
          {editing===i ? <PortfolioForm item={item} onSave={u=>save(i,u)} onCancel={()=>setEditing(null)} />
            : <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  {item.image?<img src={item.image} alt="" style={{width:52,height:52,borderRadius:8,objectFit:'cover',border:`1px solid ${C.border}`}}/>:<div style={{width:52,height:52,borderRadius:8,background:C.cyanDim,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>{item.icon}</div>}
                  <div>
                    <div style={{fontFamily:font.head,fontWeight:600,marginBottom:4,display:'flex',alignItems:'center',gap:8}}>{item.title} {item.featured&&<Badge>FEATURED</Badge>} <Badge color={C.muted}>{item.year}</Badge></div>
                    <div style={{fontSize:'0.78rem',color:C.muted}}>{(item.tags||[]).join(' · ')}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:8}}><button style={bG} onClick={()=>setEditing(i)}>✏️ Edit</button><button style={bD} onClick={()=>remove(i)}>🗑️</button></div>
              </div>}
        </div>
      ))}
      <AddBtn onClick={add} label="Add New Project" />
    </div>
  );
}
function PortfolioForm({ item, onSave, onCancel }) {
  const [f, setF] = useState({...item});
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div>
      <FG cols={2}>
        <F label="Icon"><input style={inp} value={f.icon||''} onChange={e=>s('icon',e.target.value)} /></F>
        <F label="Title"><input style={inp} value={f.title||''} onChange={e=>s('title',e.target.value)} /></F>
        <F label="Year"><input style={inp} value={f.year||''} onChange={e=>s('year',e.target.value)} /></F>
        <F label="Category"><select style={inp} value={f.category||'web'} onChange={e=>s('category',e.target.value)}>{['web','cloud','mobile','design','it'].map(c=><option key={c} value={c}>{c}</option>)}</select></F>
      </FG>
      <div style={{marginBottom:14}}><F label="Description"><textarea style={txa} value={f.description||''} onChange={e=>s('description',e.target.value)} /></F></div>
      <div style={{marginBottom:14}}><F label="Tags (comma separated)"><input style={inp} value={(f.tags||[]).join(', ')} onChange={e=>s('tags',e.target.value.split(',').map(t=>t.trim()).filter(Boolean))} /></F></div>
      <div style={{marginBottom:14}}><ImgUpload label="Project Image" value={f.image||''} onChange={v=>s('image',v)} /></div>
      <Toggle value={!!f.featured} onChange={v=>s('featured',v)} label="Featured Project" />
      <div style={{display:'flex',gap:10,marginTop:16}}>
        <button style={bP} onClick={()=>onSave(f)}>✓ Save</button>
        <button style={bG} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── TEAM ──────────────────────────────────────────────────
function TeamSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const [editing, setEditing] = useState(null);
  const si = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Remove?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => { setItems([...items,{id:Date.now(),name:'New Member',role:'Role',avatar:'👤',bio:'',image:''}]); setEditing(items.length); };
  return (
    <div>
      <PH title="👥 Team" subtitle={`${items.length} members`} onSave={()=>onSave('team',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add Member</button>} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {items.map((item,i) => (
          <div key={item.id||i} style={{ ...crd, margin:0 }}>
            {editing===i ? (
              <div>
                <FG cols={2}><F label="Avatar Emoji"><input style={inp} value={item.avatar||''} onChange={e=>si(i,'avatar',e.target.value)} /></F><F label="Name"><input style={inp} value={item.name||''} onChange={e=>si(i,'name',e.target.value)} /></F><F label="Role"><input style={inp} value={item.role||''} onChange={e=>si(i,'role',e.target.value)} /></F></FG>
                <div style={{marginBottom:12}}><F label="Bio"><textarea style={{...txa,minHeight:60}} value={item.bio||''} onChange={e=>si(i,'bio',e.target.value)} /></F></div>
                <ImgUpload label="Photo" value={item.image||''} onChange={v=>si(i,'image',v)} size={60} />
                <div style={{display:'flex',gap:8,marginTop:12}}><button style={bP} onClick={()=>setEditing(null)}>✓ Done</button><button style={bD} onClick={()=>remove(i)}>🗑️ Delete</button></div>
              </div>
            ) : (
              <div>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                  {item.image?<img src={item.image} alt="" style={{width:50,height:50,borderRadius:'50%',objectFit:'cover',border:`2px solid ${C.cyanGlow}`}}/>:<div style={{fontSize:'2.2rem'}}>{item.avatar}</div>}
                  <div><div style={{fontFamily:font.head,fontWeight:700,fontSize:'0.9rem'}}>{item.name}</div><div style={{fontSize:'0.75rem',color:C.cyan}}>{item.role}</div></div>
                </div>
                <div style={{fontSize:'0.78rem',color:C.muted,marginBottom:12,lineHeight:1.5}}>{item.bio}</div>
                <div style={{display:'flex',gap:8}}><button style={bG} onClick={()=>setEditing(i)}>✏️ Edit</button><button style={bD} onClick={()=>remove(i)}>🗑️</button></div>
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
  const si = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),text:'',name:'',role:'',avatar:'👤'}]);
  return (
    <div>
      <PH title="💬 Testimonials" subtitle={`${items.length} quotes`} onSave={()=>onSave('testimonials',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={crd}>
          <div style={{marginBottom:12}}><F label="Quote"><textarea style={txa} value={item.text||''} onChange={e=>si(i,'text',e.target.value)} /></F></div>
          <FG cols={3}><F label="Client Name"><input style={inp} value={item.name||''} onChange={e=>si(i,'name',e.target.value)} /></F><F label="Role & Company"><input style={inp} value={item.role||''} onChange={e=>si(i,'role',e.target.value)} /></F><F label="Avatar Emoji"><input style={inp} value={item.avatar||''} onChange={e=>si(i,'avatar',e.target.value)} /></F></FG>
          <div style={{textAlign:'right',marginTop:8}}><button style={bD} onClick={()=>remove(i)}>🗑️ Delete</button></div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add Testimonial" />
    </div>
  );
}

// ── FAQS ──────────────────────────────────────────────────
function FaqsSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const si = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),q:'',a:''}]);
  return (
    <div>
      <PH title="❓ FAQs" subtitle={`${items.length} questions`} onSave={()=>onSave('faqs',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add FAQ</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={crd}>
          <div style={{marginBottom:10}}><F label={`Q${i+1} — Question`}><input style={inp} value={item.q||''} onChange={e=>si(i,'q',e.target.value)} /></F></div>
          <div style={{marginBottom:10}}><F label="Answer"><textarea style={txa} value={item.a||''} onChange={e=>si(i,'a',e.target.value)} /></F></div>
          <div style={{textAlign:'right'}}><button style={bD} onClick={()=>remove(i)}>🗑️ Delete</button></div>
        </div>
      ))}
      <AddBtn onClick={add} label="Add FAQ" />
    </div>
  );
}

// ── STATS ─────────────────────────────────────────────────
function StatsSection({ data, onSave, saving }) {
  const [items, setItems] = useState([...data]);
  const si = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  return (
    <div>
      <PH title="📊 Stats" subtitle="Counter numbers shown on About page" onSave={()=>onSave('stats',items)} saving={saving} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {items.map((item,i) => (
          <div key={i} style={crd}>
            <FG cols={3}><F label="Number"><input style={inp} type="number" value={item.num} onChange={e=>si(i,'num',+e.target.value)} /></F><F label="Suffix"><input style={inp} value={item.suffix||''} onChange={e=>si(i,'suffix',e.target.value)} placeholder="+, %, x" /></F><F label="Label"><input style={inp} value={item.label||''} onChange={e=>si(i,'label',e.target.value)} /></F></FG>
            <div style={{padding:'12px 16px',background:C.bg,borderRadius:8,textAlign:'center',border:`1px solid ${C.border}`}}>
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
  const si = (i,k,v) => { const n=[...items]; n[i]={...n[i],[k]:v}; setItems(n); };
  const remove = (i) => { if(confirm('Delete?')) setItems(items.filter((_,x)=>x!==i)); };
  const add = () => setItems([...items,{id:Date.now(),year:'2025',title:'',body:''}]);
  return (
    <div>
      <PH title="📅 Timeline" subtitle="Company milestones" onSave={()=>onSave('timeline',items)} saving={saving} extra={<button style={bG} onClick={add}>+ Add Milestone</button>} />
      {items.map((item,i) => (
        <div key={item.id||i} style={{ ...crd, display:'flex', gap:16 }}>
          <div style={{ width:80, flexShrink:0 }}><label style={lbl}>Year</label><input style={{...inp,textAlign:'center',fontFamily:font.head,fontWeight:700,color:C.cyan}} value={item.year||''} onChange={e=>si(i,'year',e.target.value)} /></div>
          <div style={{ flex:1 }}>
            <div style={{marginBottom:10}}><F label="Title"><input style={inp} value={item.title||''} onChange={e=>si(i,'title',e.target.value)} /></F></div>
            <F label="Description"><textarea style={{...txa,minHeight:60}} value={item.body||''} onChange={e=>si(i,'body',e.target.value)} /></F>
          </div>
          <div style={{paddingTop:24}}><button style={bD} onClick={()=>remove(i)}>🗑️</button></div>
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
      <PH title="✨ Visual Effects" subtitle="Toggle animations on/off" onSave={()=>onSave('effects',form)} saving={saving} />
      {effects.map(({ key, label:l, desc, icon }) => (
        <div key={key} style={{ ...crd, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <div style={{ width:44,height:44,borderRadius:10,background:C.cyanDim,border:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem' }}>{icon}</div>
            <div><div style={{ fontFamily:font.head, fontWeight:600, marginBottom:3 }}>{l}</div><div style={{ fontSize:'0.78rem', color:C.muted }}>{desc}</div></div>
          </div>
          <Toggle value={!!form[key]} onChange={v=>setForm(f=>({...f,[key]:v}))} label={form[key]?'ON':'OFF'} />
        </div>
      ))}
    </div>
  );
}

// ── SECURITY / PASSWORD ────────────────────────────────────
function PasswordSection() {
  const [curr, setCurr] = useState('');
  const [newPw, setNewPw] = useState('');
  const [conf, setConf] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const doChange = async () => {
    if (!curr||!newPw||!conf) { setMsg({ type:'error', text:'Please fill in all fields.' }); return; }
    if (newPw !== conf) { setMsg({ type:'error', text:'New passwords do not match.' }); return; }
    if (newPw.length < 6) { setMsg({ type:'error', text:'Password must be at least 6 characters.' }); return; }
    setLoading(true);
    try {
      await changeAdminPassword(curr, newPw);
      setMsg({ type:'success', text:'Password changed! Use the new password next time you log in.' });
      setCurr(''); setNewPw(''); setConf('');
    } catch(e) { setMsg({ type:'error', text:e.message }); }
    setLoading(false);
    setTimeout(() => setMsg(null), 6000);
  };

  return (
    <div>
      <PH title="🔐 Security" subtitle="Manage your admin login password" />
      <SCard title="Change Admin Password">
        <div style={{ maxWidth:480 }}>
          <div style={{marginBottom:16}}><F label="Current Password"><input type="password" style={inp} value={curr} onChange={e=>setCurr(e.target.value)} placeholder="Enter current password" /></F></div>
          <div style={{marginBottom:16}}><F label="New Password"><input type="password" style={inp} value={newPw} onChange={e=>setNewPw(e.target.value)} placeholder="At least 6 characters" /></F></div>
          <div style={{marginBottom:20}}><F label="Confirm New Password"><input type="password" style={inp} value={conf} onChange={e=>setConf(e.target.value)} placeholder="Repeat new password" /></F></div>
          {msg && <div style={{ background:msg.type==='error'?C.dangerDim:C.successDim, border:`1px solid ${msg.type==='error'?C.danger:C.success}40`, borderRadius:8, padding:'12px 16px', marginBottom:16, color:msg.type==='error'?C.danger:C.success, fontSize:'0.84rem' }}>{msg.type==='error'?'⚠️':'✅'} {msg.text}</div>}
          <button style={bP} onClick={doChange} disabled={loading}>{loading?'⟳ Updating...':'🔑 Change Password'}</button>
        </div>
      </SCard>
    </div>
  );
}

// ── MAIN ADMIN ────────────────────────────────────────────
export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [active, setActive] = useState('homePage');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show:false, message:'', type:'success' });

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
      // Re-fetch from server so admin panel reflects actual saved state
      const fresh = await adminGetData();
      setData(fresh);
      showToast(`Saved successfully!`);
    } catch(e) { showToast('Save failed: ' + e.message, 'error'); }
    setSaving(false);
  };

  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;
  if (loading) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:font.head }}>
      <Cursor />
      <div style={{ textAlign:'center' }}><div style={{ fontSize:'2rem', marginBottom:12 }}>⟳</div><div style={{ color:C.cyan }}>Loading...</div></div>
    </div>
  );

  const sp = { data: data?.[active], onSave: handleSave, saving };

  return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', fontFamily:font.body, color:C.text }}>
      <Cursor />

      {/* Sidebar */}
      <div style={{ width:265, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:50, overflowY:'auto' }}>
        <div style={{ padding:'24px 22px 18px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:font.head, fontSize:'1.25rem', fontWeight:800 }}>ASPRO<span style={{ color:C.cyan }}>.</span>ITE</div>
          <div style={{ fontSize:'0.65rem', color:C.muted, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:3 }}>Admin Panel</div>
        </div>
        <nav style={{ flex:1, padding:'8px 0' }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={()=>setActive(s.id)} style={{ display:'flex', alignItems:'center', gap:12, width:'100%', padding:'10px 18px', background:active===s.id?`linear-gradient(90deg,${C.cyanDim},transparent)`:'none', border:'none', borderLeft:active===s.id?`3px solid ${C.cyan}`:'3px solid transparent', color:active===s.id?C.text:C.muted, cursor:'pointer', textAlign:'left', fontFamily:font.body, fontSize:'0.82rem', transition:'all 0.15s' }}>
              <span style={{ fontSize:'1rem', opacity:active===s.id?1:0.7 }}>{s.icon}</span>
              <div><div style={{ fontWeight:active===s.id?600:400, lineHeight:1.2 }}>{s.label}</div><div style={{ fontSize:'0.65rem', opacity:0.6, marginTop:1 }}>{s.desc}</div></div>
            </button>
          ))}
        </nav>
        <div style={{ padding:'14px 18px', borderTop:`1px solid ${C.border}` }}>
          <a href="/#/" target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, color:C.muted, textDecoration:'none', fontSize:'0.78rem', padding:'8px 12px', borderRadius:7, marginBottom:7, background:C.cyanDim, border:`1px solid ${C.border}` }}>🌐 <span>View Live Site</span></a>
          <button onClick={async ()=>{ try { const res = await fetch('/api/admin/data', { headers: { 'x-admin-token': localStorage.getItem('asproite_admin_token')||'' } }); const d = await res.json(); const blob = new Blob([JSON.stringify(d,null,2)],{type:'application/json'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'asproite-backup.json'; a.click(); } catch(e) { alert('Backup failed'); } }} style={{ ...bG, width:'100%', justifyContent:'center', padding:8, marginBottom:7, fontSize:'0.74rem' }}>💾 Backup Data</button>
          <label style={{ ...bG, width:'100%', justifyContent:'center', padding:8, marginBottom:7, fontSize:'0.74rem', cursor:'pointer', boxSizing:'border-box' }}>
            📂 Restore Data
            <input type="file" accept=".json" style={{display:'none'}} onChange={e=>{ const file=e.target.files[0]; if(!file) return; const reader=new FileReader(); reader.onload=async ev=>{ try { const parsed=JSON.parse(ev.target.result); const token=localStorage.getItem('asproite_admin_token')||''; const sections=Object.keys(parsed).filter(k=>!k.startsWith('_')); await Promise.all(sections.map(s=>fetch(`/api/admin/${s}`,{method:'PUT',headers:{'Content-Type':'application/json','x-admin-token':token},body:JSON.stringify(parsed[s])}))); window.dispatchEvent(new Event('asproite_data_updated')); alert('Restored! Refreshing...'); window.location.reload(); } catch{ alert('Invalid backup file!'); } }; reader.readAsText(file); }} />
          </label>
          <button onClick={()=>{ adminLogout(); setLoggedIn(false); }} style={{ ...bD, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:9 }}>🚪 Sign Out</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft:265, flex:1, padding:'36px 40px', maxWidth:'calc(100vw - 265px)', overflowX:'hidden' }}>
        {active==='homePage'     && data?.homePage     && <HomePageSection     {...sp} data={data.homePage} />}
        {active==='servicesPage' && data?.servicesPage && <ServicesPageSection {...sp} data={data.servicesPage} />}
        {active==='portfolioPage'&& data?.portfolioPage&& <PortfolioPageSection{...sp} data={data.portfolioPage} />}
        {active==='aboutPage'    && data?.aboutPage    && <AboutPageSection    {...sp} data={data.aboutPage} />}
        {active==='contactPage'  && data?.contactPage  && <ContactPageSection  {...sp} data={data.contactPage} />}
        {active==='footer'       && data?.footer       && <FooterSection       {...sp} data={data.footer} />}
        {active==='siteInfo'     && data?.siteInfo     && <SiteInfoSection     {...sp} data={data.siteInfo} />}
        {active==='services'     && data?.services     && <ServicesSection     {...sp} data={data.services} />}
        {active==='portfolio'    && data?.portfolio    && <PortfolioSection    {...sp} data={data.portfolio} />}
        {active==='team'         && data?.team         && <TeamSection         {...sp} data={data.team} />}
        {active==='testimonials' && data?.testimonials && <TestimonialsSection {...sp} data={data.testimonials} />}
        {active==='faqs'         && data?.faqs         && <FaqsSection         {...sp} data={data.faqs} />}
        {active==='stats'        && data?.stats        && <StatsSection        {...sp} data={data.stats} />}
        {active==='timeline'     && data?.timeline     && <TimelineSection     {...sp} data={data.timeline} />}
        {active==='effects'      && data?.effects      && <EffectsSection      {...sp} data={data.effects} />}
        {active==='password'     && <PasswordSection />}
      </div>

      <Toast {...toast} />
    </div>
  );
}
