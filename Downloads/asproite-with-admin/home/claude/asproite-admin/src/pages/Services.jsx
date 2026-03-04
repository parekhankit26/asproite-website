import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, SectionHeader, CTABox } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { services } from '../data/siteData.js';

function CircuitCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext('2d');
    cv.width = cv.offsetWidth; cv.height = cv.offsetHeight;
    const grid = 60;
    cx.strokeStyle = 'rgba(0,212,255,0.14)'; cx.lineWidth = 1;
    for (let x = 0; x < cv.width; x += grid) {
      for (let y = 0; y < cv.height; y += grid) {
        if (Math.random() > 0.5) {
          cx.beginPath(); cx.moveTo(x, y);
          const d = Math.random();
          if (d < 0.25) cx.lineTo(x + grid, y);
          else if (d < 0.5) cx.lineTo(x, y + grid);
          else if (d < 0.75) cx.lineTo(x - grid, y);
          else cx.lineTo(x, y - grid);
          cx.stroke();
        }
        if (Math.random() > 0.8) {
          cx.beginPath(); cx.arc(x, y, 3, 0, Math.PI * 2);
          cx.fillStyle = 'rgba(0,212,255,0.4)'; cx.fill();
        }
      }
    }
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} />;
}

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery', body: 'We deep-dive into your business needs, challenges, and goals to build a complete picture.' },
  { num: '02', title: 'Strategy', body: 'Our experts craft a tailored IT roadmap aligned to your objectives and budget.' },
  { num: '03', title: 'Design', body: 'Solutions are architected and designed with security, scalability, and UX in mind.' },
  { num: '04', title: 'Delivery', body: 'We execute with precision — on time, on budget, with continuous communication.' },
  { num: '05', title: 'Support', body: '24/7 ongoing support, monitoring, and optimisation to keep everything running perfectly.' },
];

export default function Services() {
  useScrollReveal();

  return (
    <>
      <PageHeader title="Our" titleAccent="Services" breadcrumb="Services" subtitle="9 specialised IT services covering every stage of your digital journey — from strategy and development to 24/7 support and responsible hardware decommissioning.">
        <CircuitCanvas />
      </PageHeader>

      {/* ALL SERVICES */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
            <SectionHeader label="What We Offer" title="Complete" titleAccent="IT Solutions" center />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {services.map((s, i) => (
              <ServiceFullCard key={s.id} service={s} delay={i % 3} />
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionHeader label="How We Work" title="Our" titleAccent="Process" center />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 30, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,var(--cyan) 20%,var(--cyan) 80%,transparent)' }} />
            {PROCESS_STEPS.map((s, i) => (
              <div key={s.num} className={`reveal d${i}`} style={{ textAlign: 'center', padding: '0 16px' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan)', margin: '0 auto 20px', position: 'relative', zIndex: 1, transition: 'background 0.3s, border-color 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.12)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg3)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
                  {s.num}
                </div>
                <h4 style={{ fontFamily: 'var(--font-head)', fontSize: '0.88rem', fontWeight: 600, marginBottom: 8 }}>{s.title}</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="grid-2">
            <div className="reveal-left">
              <div className="section-label">Why Asproite</div>
              <h2 style={{ marginBottom: 16 }}>The Reasons Clients <em>Choose Us</em></h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: 32 }}>Over 25 years we've built a reputation on delivering what we promise, supported by accreditations, certifications, and most importantly — happy clients.</p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn-primary">Start a Project →</Link>
                <Link to="/portfolio" className="btn-ghost">See Portfolio</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { icon: '⚡', t: '24/7 Support', b: 'Round-the-clock helpdesk means your business never stops.' },
                { icon: '🏆', t: 'Certified', b: 'Wide-reaching technology accreditations and vendor partnerships.' },
                { icon: '🌐', t: 'Full Lifecycle', b: 'From procurement and deployment to secure decommissioning.' },
                { icon: '🔒', t: 'Security First', b: 'Security baked into every solution we deliver, not bolted on.' },
              ].map((w, i) => (
                <div key={w.t} className={`reveal d${i % 2 + 1}`} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: 28, display: 'flex', gap: 18, transition: 'border-color 0.3s, transform 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateX(5px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                  <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{w.icon}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>{w.t}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>{w.b}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTABox label="Ready to Start?" title="Let's Build Something" titleAccent="Remarkable" subtitle="Tell us about your project and we'll put together a tailored proposal — no obligation, no jargon." primaryText="Get a Free Quote →" primaryTo="/contact" ghostText="View Our Work" ghostTo="/portfolio" />
    </>
  );
}

function ServiceFullCard({ service, delay }) {
  return (
    <div className={`reveal d${delay}`} style={{ background: 'var(--bg2)', border: `1px solid ${service.isNew ? 'rgba(244,185,66,0.25)' : 'var(--border)'}`, borderRadius: 12, padding: '36px 32px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = service.isNew ? 'rgba(244,185,66,0.25)' : 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      {service.isNew && <span className="new-badge" style={{ position: 'absolute', top: 16, right: 16 }}>New</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
        <div style={{ width: 50, height: 50, borderRadius: 10, background: 'rgba(0,212,255,0.07)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{service.icon}</div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.14em' }}>0{service.id}</div>
      </div>
      <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.05rem', fontWeight: 600, marginBottom: 12 }}>{service.title}</h3>
      <p style={{ fontSize: '0.87rem', color: 'var(--muted)', lineHeight: 1.72 }}>{service.description}</p>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {service.features.map(f => (
          <div key={f} style={{ fontSize: '0.8rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.4rem', color: 'var(--cyan)' }}>◆</span>{f}
          </div>
        ))}
      </div>
      <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--cyan)', fontSize: '0.76rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', marginTop: 20, transition: 'gap 0.2s' }}>Get a Quote →</Link>
    </div>
  );
}
