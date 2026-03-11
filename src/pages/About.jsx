import { useEffect } from 'react';
import { PageHeader, SectionHeader, CTABox, AnimatedCounter } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

export default function About() {
  const { data } = useSiteData();
  const team = data?.team || [];
  const timeline = data?.timeline || [];
  const stats = data?.stats || [];
  const ap = data?.aboutPage || {};
  const si = data?.siteInfo || {};
  useScrollReveal();

  const mvv = [
    { icon: ap.missionIcon||'🎯', title: ap.missionTitle||'Our Mission', text: ap.missionText||'' },
    { icon: ap.visionIcon||'👁️',  title: ap.visionTitle||'Our Vision',  text: ap.visionText||'' },
    { icon: ap.valuesIcon||'💎',  title: ap.valuesTitle||'Our Values',  text: ap.valuesText||'' },
  ];
  const coreValues = ap.coreValues || [];

  return (
    <>
      <PageHeader title={ap.pageTitle||"About"} titleAccent={ap.pageTitleAccent||"Asproite"} breadcrumb="About"
        subtitle={ap.subtitle || "Over 25 years of delivering IT excellence across the UK."}>
        <HexBackground />
      </PageHeader>

      {/* MISSION / VISION / VALUES */}
      <section style={{ padding:'80px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div className="about-mission-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:2 }}>
            {mvv.map((m,i) => (
              <div key={m.title} className={`reveal d${i}`} style={{ padding:'48px 40px', textAlign:'center', borderRight: i<2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:18 }}>{m.icon}</div>
                <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.1rem', fontWeight:600, marginBottom:10, color:'var(--cyan)' }}>{m.title}</h3>
                <p style={{ fontSize:'0.88rem', color:'var(--muted)', lineHeight:1.7 }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding:'100px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:64 }}>
            <SectionHeader label={ap.statsSectionLabel||"By the Numbers"} title={ap.statsSectionTitle||"Asproite in"} titleAccent={ap.statsSectionTitleAccent||"Numbers"} center />
          </div>
          <div className="about-stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
            {stats.map((s,i) => (
              <div key={s.label} className={`reveal d${i}`} style={{ padding:'48px 32px', textAlign:'center', background:'var(--bg2)', border:'1px solid var(--border)', position:'relative', overflow:'hidden', transition:'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ fontFamily:'var(--font-head)', fontSize:'3.4rem', fontWeight:800, color:'var(--cyan)', lineHeight:1 }}>
                  <AnimatedCounter target={s.num} suffix={s.suffix} />
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.09em', marginTop:8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      {coreValues.length > 0 && (
        <section style={{ padding:'80px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign:'center', marginBottom:60 }}>
              <SectionHeader label={ap.coreValuesSectionLabel||"Core Values"} title={ap.coreValuesSectionTitle||"What We"} titleAccent={ap.coreValuesSectionTitleAccent||"Stand For"} center />
            </div>
            <div className="grid-4">
              {coreValues.map((v,i) => (
                <div key={v.id||i} className={`reveal d${i}`} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:'32px 24px', textAlign:'center', transition:'border-color 0.3s, transform 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='translateY(-5px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}>
                  <div style={{ fontSize:'2rem', marginBottom:16 }}>{v.icon}</div>
                  <h4 style={{ fontFamily:'var(--font-head)', fontSize:'0.95rem', fontWeight:600, marginBottom:8 }}>{v.title}</h4>
                  <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:1.65 }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE */}
      <section style={{ padding:'110px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:64 }}>
            <SectionHeader label={ap.timelineSectionLabel||"Our Journey"} title={ap.timelineSectionTitle||"Years of"} titleAccent={ap.timelineSectionTitleAccent||"Innovation"} center />
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'linear-gradient(to bottom,transparent,var(--cyan) 15%,var(--cyan) 85%,transparent)', transform:'translateX(-50%)' }} />
            {timeline.map((item,i) => (
              <div key={item.year} className="reveal" style={{ display:'flex', gap:48, alignItems:'center', marginBottom:52, flexDirection: i%2===0 ? 'row' : 'row-reverse' }}>
                <div style={{ flex:1, background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:10, padding:'28px 32px', maxWidth:440, transition:'border-color 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'0.7rem', fontWeight:600, color:'var(--cyan)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:8 }}>{item.year}</div>
                  <h4 style={{ fontFamily:'var(--font-head)', fontSize:'1rem', fontWeight:600, marginBottom:8 }}>{item.title}</h4>
                  <p style={{ fontSize:'0.85rem', color:'var(--muted)', lineHeight:1.65 }}>{item.body}</p>
                </div>
                <div style={{ flexShrink:0, width:16, height:16, background:'var(--cyan)', borderRadius:'50%', boxShadow:'0 0 20px var(--cyan)', zIndex:1, position:'relative' }}>
                  <div style={{ position:'absolute', inset:-6, border:'1px solid rgba(0,212,255,0.3)', borderRadius:'50%' }} />
                </div>
                <div style={{ flex:1, maxWidth:440 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section style={{ padding:'110px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign:'center', marginBottom:60 }}>
            <SectionHeader label={ap.teamSectionLabel||"Our People"} title={ap.teamSectionTitle||"Meet the"} titleAccent={ap.teamSectionTitleAccent||"Team"} center />
          </div>
          <div className="grid-4">
            {team.map((member,i) => (
              <div key={member.name} className={`reveal d${i}`} style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', transition:'border-color 0.3s, transform 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border2)'; e.currentTarget.style.transform='translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; }}>
                <div style={{ aspectRatio:'1', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem', position:'relative' }}>
                  <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at bottom,rgba(0,212,255,0.12) 0%,transparent 60%)' }} />
                  {member.image
                    ? <img src={member.image} alt={member.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : member.avatar}
                </div>
                <div style={{ padding:20 }}>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'0.95rem', fontWeight:600, marginBottom:4 }}>{member.name}</div>
                  <div style={{ fontSize:'0.76rem', color:'var(--cyan)', letterSpacing:'0.06em', marginBottom:8 }}>{member.role}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--muted)', lineHeight:1.6 }}>{member.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFICES */}
      <section style={{ padding:'80px 0', background:'var(--bg2)', borderTop:'1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal"><SectionHeader label={ap.officesSectionLabel||"Our Offices"} title={ap.officesSectionTitle||"Where We"} titleAccent={ap.officesSectionTitleAccent||"Operate"} /></div>
          <div className="about-core-values-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginTop:48 }}>
            {[
              { flag:'🇬🇧', name:'London, United Kingdom', addr: si.londonAddress || 'Kingsland Road\nLondon, E13 9PA' },
              { flag:'🇮🇳', name:'Vadodara, India', addr: si.indiaAddress || 'Gotri Road\nVadodara, 390001' },
            ].map((o,i) => (
              <div key={o.name} className={`reveal d${i+1}`} style={{ background:'var(--bg)', border:'1px solid var(--border)', borderRadius:10, padding:'36px 32px', display:'flex', gap:20, transition:'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ fontSize:'2.2rem', flexShrink:0 }}>{o.flag}</div>
                <div>
                  <div style={{ fontFamily:'var(--font-head)', fontSize:'0.7rem', fontWeight:600, color:'var(--cyan)', letterSpacing:'0.14em', textTransform:'uppercase', marginBottom:6 }}>{o.name}</div>
                  <div style={{ fontSize:'0.88rem', color:'var(--muted)', lineHeight:1.65, whiteSpace:'pre-line' }}>{o.addr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABox label={ap.ctaLabel||"Work With Us"} title={ap.ctaTitle||"Ready to"} titleAccent={ap.ctaTitleAccent||"Partner?"} subtitle={ap.ctaSubtitle||"Let's talk about how Asproite can support your technology journey."} primaryText={ap.ctaPrimaryText||"Contact Us →"} primaryTo="/contact" ghostText={ap.ctaGhostText||"Our Services"} ghostTo="/services" />
    </>
  );
}

function HexBackground() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@keyframes hexFloat{0%{opacity:0;transform:translateY(20px) scale(0.9)}30%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateY(-30px) scale(1.05)}}`;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const hexes = Array.from({ length:14 }, (_,i) => ({ id:i, left:Math.random()*100, top:Math.random()*100, size:40+Math.random()*80, delay:Math.random()*6, dur:7+Math.random()*5 }));
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      {hexes.map(h => (
        <div key={h.id} style={{ position:'absolute', left:`${h.left}%`, top:`${h.top}%`, opacity:0, animation:`hexFloat ${h.dur}s ease-in-out ${h.delay}s infinite` }}>
          <svg width={h.size} height={h.size*1.15} viewBox="0 0 100 115" fill="none" stroke="rgba(0,212,255,0.15)" strokeWidth="1">
            <polygon points="50,5 95,27.5 95,87.5 50,110 5,87.5 5,27.5" />
          </svg>
        </div>
      ))}
    </div>
  );
}
