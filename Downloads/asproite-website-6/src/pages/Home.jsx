import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MarqueeBar, SectionHeader, CTABox } from '../components/index.jsx';
import { useScrollReveal, useNeuralCanvas, useTyping } from '../hooks/index.js';
import { techStack } from '../data/siteData.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

function FloatBadge({ icon, val, label, style }) {
  return (
    <div style={{ position:'absolute', zIndex:2, background:'rgba(11,16,25,0.88)', border:'1px solid var(--border)', borderRadius:8, padding:'12px 18px', backdropFilter:'blur(16px)', display:'flex', alignItems:'center', gap:10, animation:'floatBadge 4s ease-in-out infinite', ...style }}>
      <div style={{ fontSize:'1.3rem' }}>{icon}</div>
      <div>
        <div style={{ fontFamily:'var(--font-head)', fontWeight:600, fontSize:'0.88rem' }}>{val}</div>
        <div style={{ color:'var(--muted)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data } = useSiteData();
  const services = data?.services || [];
  const hp = data?.homePage || {};
  const phrases = hp.typingPhrases?.length ? hp.typingPhrases : ['UK IT Managed Service Provider','Cloud & AI Experts','25+ Years of Excellence'];
  useScrollReveal();
  const canvasRef = useRef(null);
  useNeuralCanvas(canvasRef);
  const typedText = useTyping(phrases);

  return (
    <>
      <style>{`
        @keyframes floatBadge { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spinRing { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .orbit-ring { position:absolute; border-radius:50%; border:1px solid rgba(0,212,255,0.18); }
        .r1 { width:60%; height:60%; top:20%; left:20%; animation:spinRing 8s linear infinite; }
        .r2 { width:82%; height:82%; top:9%; left:9%; animation:spinRing 14s linear infinite reverse; }
        .r3 { width:100%; height:100%; top:0; left:0; animation:spinRing 20s linear infinite; }
        .orbit-dot { position:absolute; width:8px; height:8px; border-radius:50%; top:0; left:50%; transform:translate(-50%,-50%); box-shadow:0 0 10px currentColor; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* HERO */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', padding:'120px 0 80px', overflow:'hidden' }}>
        <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.65 }} />
        <FloatBadge icon="⚡" val="24/7" label="Always On" style={{ right:'10%', top:'22%', animationDelay:'0s' }} />
        <FloatBadge icon="☁️" val="Cloud" label="Solutions" style={{ right:'7%', top:'52%', animationDelay:'1.2s' }} />
        <FloatBadge icon="🔒" val="Secure" label="IT Systems" style={{ right:'19%', bottom:'20%', animationDelay:'2.4s' }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:750, padding:'0 64px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(0,212,255,0.07)', border:'1px solid var(--border)', borderRadius:100, padding:'6px 18px', fontSize:'0.72rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--cyan)', marginBottom:28, animation:'fadeUp 0.8s ease both' }}>
            <span className="tag-dot" />
            <span style={{ minWidth:260 }}>{typedText}<span style={{ animation:'blink 0.8s infinite' }}>|</span></span>
          </div>

          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'clamp(2.8rem,5.5vw,5rem)', fontWeight:800, letterSpacing:'-0.025em', lineHeight:1.04, marginBottom:26, animation:'fadeUp 0.9s 0.2s ease both' }}>
            {hp.heroTitle || 'Transform Your'}<br />
            <span style={{ color:'var(--cyan)' }}>{hp.heroTitleAccent || 'Digital Future'}</span>
          </h1>

          <p style={{ fontSize:'1.05rem', lineHeight:1.75, color:'var(--muted)', maxWidth:560, marginBottom:44, animation:'fadeUp 0.9s 0.35s ease both' }}>
            {hp.heroSubtitle || 'Asproite delivers end-to-end IT solutions trusted by organisations across the UK for over 25 years.'}
          </p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', animation:'fadeUp 0.9s 0.5s ease both' }} className="hero-btns">
            <Link to="/services" className="btn-primary">{hp.heroPrimaryText || 'Explore Services →'}</Link>
            <Link to="/portfolio" className="btn-ghost">{hp.heroGhostText || 'View Portfolio'}</Link>
          </div>

          <div style={{ display:'flex', gap:48, marginTop:70, paddingTop:40, borderTop:'1px solid var(--border)', animation:'fadeUp 0.9s 0.65s ease both', flexWrap:'wrap' }}>
            {[['25+','Years Experience'],['40+','IT Services'],['24/7','Support'],['500+','Clients Served']].map(([n,l]) => (
              <div key={l}><div className="stat-num">{n}</div><div className="stat-lbl">{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <MarqueeBar />

      {/* ABOUT PREVIEW */}
      <section style={{ padding:'110px 0' }}>
        <div className="container">
          <div className="grid-2">
            <div className="reveal-left">
              <div style={{ position:'relative', maxWidth:460, aspectRatio:'1/1' }}>
                <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(circle at center, rgba(0,212,255,0.07) 0%,transparent 65%)', borderRadius:'50%', fontSize:'7rem', position:'relative' }}>
                  <div className="orbit-ring r1"><div className="orbit-dot" style={{ background:'var(--cyan)', color:'var(--cyan)' }} /></div>
                  <div className="orbit-ring r2"><div className="orbit-dot" style={{ background:'var(--gold)', color:'var(--gold)' }} /></div>
                  <div className="orbit-ring r3"><div className="orbit-dot" style={{ background:'var(--green)', color:'var(--green)' }} /></div>
                  🖥️
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:24 }}>
                {[['25+','Years Active'],['40+','Services'],['500+','Clients'],['2','Global Offices']].map(([n,l],i) => (
                  <div key={l} className={`reveal d${i+1}`} style={{ background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8, padding:'22px 18px' }}>
                    <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800, color:'var(--cyan)' }}>{n}</div>
                    <div style={{ fontSize:'0.75rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-right">
              <div className="section-label">About Asproite</div>
              <h2 style={{ marginBottom:20 }}>{hp.aboutTitle || "The UK's Most Trusted"} <em>{hp.aboutTitleAccent || 'IT Partner'}</em></h2>
              <p style={{ color:'var(--muted)', lineHeight:1.8, marginBottom:14, fontSize:'0.95rem' }}>{hp.aboutText1 || 'Welcome to Asproite Cloud and Consultancy — a dynamic IT solutions provider.'}</p>
              <p style={{ color:'var(--muted)', lineHeight:1.8, marginBottom:24, fontSize:'0.95rem' }}>{hp.aboutText2 || 'Our experts craft innovative, scalable digital solutions.'}</p>
              {(hp.aboutBullets || ['ISO-certified processes','24/7 dedicated helpdesk','Offices in London & India','Full lifecycle IT']).map(item => (
                <div key={item} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                  <span style={{ color:'var(--cyan)', flexShrink:0, marginTop:2 }}>→</span>
                  <span style={{ fontSize:'0.9rem', color:'var(--text)', lineHeight:1.6 }}>{item}</span>
                </div>
              ))}
              <div style={{ marginTop:36, display:'flex', gap:14, flexWrap:'wrap' }}>
                <Link to="/about" className="btn-primary">Learn About Us →</Link>
                <Link to="/contact" className="btn-ghost">Get a Quote</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section style={{ padding:'110px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:56 }} className="reveal">
            <div><div className="section-label">What We Do</div><h2>Our <em>Core Services</em></h2></div>
            <Link to="/services" className="btn-ghost">All Services →</Link>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
            {services.slice(0,6).map((s,i) => <ServiceCard key={s.id} service={s} delay={i%3} />)}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section style={{ padding:'80px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center' }}>
            <SectionHeader label="Technologies" title="Powered by" titleAccent="World-Class Tech" center />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:12, marginTop:40 }} className="reveal d1">
            {techStack.map(t => (
              <div key={t.name} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:6, padding:'9px 18px', fontSize:'0.82rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:8, cursor:'default', transition:'border-color 0.2s, color 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.color='var(--cyan)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.color=''; e.currentTarget.style.transform=''; }}>
                <span>{t.icon}</span>{t.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox label="Get Started" title="Ready to" titleAccent="Elevate Your IT?" subtitle="Talk to our team today and discover how Asproite can modernise, secure, and scale your technology." primaryText="Get a Free Quote →" primaryTo="/contact" ghostText="See Our Work" ghostTo="/portfolio" />
    </>
  );
}

function ServiceCard({ service, delay }) {
  return (
    <div className={`reveal d${delay}`} style={{ background:'var(--bg)', padding:'36px 32px', position:'relative', overflow:'hidden', transition:'background 0.3s, transform 0.3s', border:'1px solid transparent', cursor:'default', ...(service.isNew ? { borderColor:'rgba(0,212,255,0.2)' } : {}) }}
      onMouseEnter={e => { e.currentTarget.style.background='var(--bg3)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--border)'; }}
      onMouseLeave={e => { e.currentTarget.style.background='var(--bg)'; e.currentTarget.style.transform=''; e.currentTarget.style.borderColor=service.isNew?'rgba(0,212,255,0.2)':'transparent'; }}>
      {service.isNew && <span className="new-badge" style={{ position:'absolute', top:14, right:14 }}>New</span>}
      <div style={{ width:46, height:46, borderRadius:8, background:'rgba(0,212,255,0.06)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', marginBottom:20 }}>{service.icon}</div>
      <h3 style={{ fontFamily:'var(--font-head)', fontSize:'0.97rem', fontWeight:600, marginBottom:10 }}>{service.title}</h3>
      <p style={{ fontSize:'0.84rem', lineHeight:1.7, color:'var(--muted)' }}>{service.description}</p>
      <Link to="/services" style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--cyan)', fontSize:'0.74rem', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase', textDecoration:'none', marginTop:16 }}>Learn More →</Link>
    </div>
  );
}
