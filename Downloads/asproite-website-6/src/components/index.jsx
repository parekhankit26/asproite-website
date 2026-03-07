import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// ── Custom Cursor (Portal — always above everything) ──────
export function Cursor() {
  const curRef = useRef(null);
  const trailRef = useRef(null);
  const pos = useRef({ mx: -200, my: -200, tx: -200, ty: -200 });
  const rafRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => { pos.current.mx = e.clientX; pos.current.my = e.clientY; };
    document.addEventListener('mousemove', onMove, { passive: true });

    const loop = () => {
      const p = pos.current;
      if (curRef.current) {
        curRef.current.style.left = p.mx + 'px';
        curRef.current.style.top  = p.my + 'px';
      }
      p.tx += (p.mx - p.tx) * 0.12;
      p.ty += (p.my - p.ty) * 0.12;
      if (trailRef.current) {
        trailRef.current.style.left = p.tx + 'px';
        trailRef.current.style.top  = p.ty + 'px';
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Portal to document.body — bypasses ALL stacking contexts
  return ReactDOM.createPortal(
    <>
      <div id="cursor" ref={curRef} />
      <div id="cursor-trail" ref={trailRef} />
    </>,
    document.body
  );
}

// ── Page Header ───────────────────────────────────────────
export function PageHeader({ title, titleAccent, subtitle, breadcrumb, children }) {
  return (
    <div className="page-header">
      <div className="page-header-bg" />
      <div className="page-header-grid" />
      {children}
      <div className="container">
        <div className="page-header-content">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">›</span>
            <span>{breadcrumb}</span>
          </div>
          <h1>{title} {titleAccent && <em>{titleAccent}</em>}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Marquee Bar ───────────────────────────────────────────
const MARQUEE_ITEMS = [
  'Cloud Services','IT Support','AI Solutions','Web Development',
  'Hardware Decommissioning','Digital Marketing','Mobile Apps',
  'Software Solutions','Cybersecurity','IT Consultancy',
];

export function MarqueeBar() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-inner">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────
export function SectionHeader({ label, title, titleAccent, center = false }) {
  return (
    <div style={center ? { textAlign: 'center' } : {}}>
      <div className="section-label" style={center ? { justifyContent: 'center' } : {}}>{label}</div>
      <h2>{title} {titleAccent && <em>{titleAccent}</em>}</h2>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────
export function AnimatedCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ── CTA Box ───────────────────────────────────────────────
export function CTABox({ label, title, titleAccent, subtitle, primaryText, primaryTo, ghostText, ghostTo }) {
  return (
    <section style={{ padding: '100px 0' }}>
      <div className="container">
        <div className="reveal" style={{
          background: 'linear-gradient(135deg,rgba(0,212,255,0.05) 0%,rgba(11,16,25,0.9) 60%)',
          border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 80,
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse,rgba(0,212,255,0.09) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-label" style={{ justifyContent: 'center', marginBottom: 14, position: 'relative' }}>{label}</div>
          <h2 style={{ position: 'relative', marginBottom: 14 }}>{title} {titleAccent && <em>{titleAccent}</em>}</h2>
          <p style={{ position: 'relative', color: 'var(--muted)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>{subtitle}</p>
          <div style={{ position: 'relative', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={primaryTo} className="btn-primary">{primaryText}</Link>
            <Link to={ghostTo} className="btn-ghost">{ghostText}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
