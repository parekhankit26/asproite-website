import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
    { to: '/it-health-check', label: 'IT Health Check', highlight: true },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 1000,
        padding: scrolled ? '14px 64px' : '22px 64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7,11,18,0.95)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border)', transition: 'padding 0.3s',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--text)' }}>
            ASPRO<span style={{ color: 'var(--cyan)' }}>.</span>ITE
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul style={{ display: 'flex', gap: 34, listStyle: 'none', alignItems: 'center' }} className="nav-desktop">
          {links.slice(0, 4).map(({ to, label }) => (
            <li key={to}>
              <Link to={to} style={{
                fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: isActive(to) ? 'var(--cyan)' : 'var(--muted)', textDecoration: 'none',
                transition: 'color 0.2s', position: 'relative', paddingBottom: 2,
              }}
                className={isActive(to) ? 'nav-link active' : 'nav-link'}>
                {label}
              </Link>
            </li>
          ))}
          {/* IT Health Check — free tool highlight */}
          <li>
            <Link to="/it-health-check" style={{
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              color: isActive('/it-health-check') ? '#000' : 'var(--cyan)',
              textDecoration: 'none', padding: '7px 14px',
              background: isActive('/it-health-check') ? 'var(--cyan)' : 'rgba(0,212,255,0.08)',
              border: '1px solid var(--cyan)', borderRadius: 4,
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 5,
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--cyan)'; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => {
                if (!isActive('/it-health-check')) {
                  e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
                  e.currentTarget.style.color = 'var(--cyan)';
                }
              }}>
              <span>⚡</span> Free IT Audit
            </Link>
          </li>
          <li>
            <Link to="/contact" style={{
              fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--cyan)', textDecoration: 'none', padding: '9px 20px',
              border: '1px solid var(--cyan)', borderRadius: 3,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none', background: 'none',
            border: '1px solid var(--border)', borderRadius: 4,
            padding: '8px 12px', cursor: 'pointer',
            color: 'var(--text)', fontSize: '1.2rem', lineHeight: 1,
          }}
          className="hamburger">
          {menuOpen ? '✕' : '☰'}
        </button>

        <style>{`
          .nav-link::after {
            content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px;
            background: var(--cyan); transition: width 0.3s;
          }
          .nav-link:hover { color: var(--cyan) !important; }
          .nav-link:hover::after, .nav-link.active::after { width: 100%; }
          @media (max-width: 768px) {
            nav { padding: 16px 20px !important; }
            .nav-desktop { display: none !important; }
            .hamburger { display: flex !important; align-items: center; justify-content: center; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu — rendered OUTSIDE nav so it sits above everything */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(7,11,18,0.98)',
          zIndex: 1100,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 0,
        }}>
          {/* Close button */}
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 4, color: 'var(--text)',
              fontSize: '1.2rem', padding: '8px 12px', cursor: 'pointer',
              lineHeight: 1,
            }}>
            ✕
          </button>

          {/* Logo at top */}
          <div style={{ position: 'absolute', top: 20, left: 20 }}>
            <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>
              ASPRO<span style={{ color: 'var(--cyan)' }}>.</span>ITE
            </span>
          </div>

          {/* Nav links */}
          {links.map(({ to, label }, i) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: '2rem',
                fontWeight: 700,
                color: isActive(to) ? 'var(--cyan)' : 'var(--text)',
                textDecoration: 'none',
                padding: '16px 0',
                width: '100%',
                textAlign: 'center',
                borderBottom: i < links.length - 1 ? '1px solid rgba(0,212,255,0.08)' : 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.color = isActive(to) ? 'var(--cyan)' : 'var(--text)'}
            >
              {label}
            </Link>
          ))}

          {/* Social hint at bottom */}
          <p style={{ position: 'absolute', bottom: 32, color: 'var(--muted)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>
            info@asproite.com
          </p>
        </div>
      )}
    </>
  );
}
