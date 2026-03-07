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

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 500,
      padding: scrolled ? '14px 64px' : '22px 64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(7,11,18,0.9)', backdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)', transition: 'padding 0.3s',
    }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
        <span style={{ fontFamily: 'var(--font-head)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--text)' }}>
          ASPRO<span style={{ color: 'var(--cyan)' }}>.</span>ITE
        </span>
      </Link>

      {/* Desktop Nav */}
      <ul style={{ display: 'flex', gap: 34, listStyle: 'none', alignItems: 'center' }} className="nav-desktop">
        {links.map(({ to, label }) => (
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
        <li>
          <Link to="/contact" style={{
            fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--cyan)', textDecoration: 'none', padding: '9px 20px',
            border: '1px solid var(--cyan)', borderRadius: 3,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(0,212,255,0.1)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Contact
          </Link>
        </li>
      </ul>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: 'none', background: 'none', border: '1px solid var(--border)', borderRadius: 4, padding: '8px 10px', cursor: 'pointer', color: 'var(--text)', fontSize: '1rem' }}
        className="hamburger">
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--bg2)', zIndex: 499, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 24, right: 24, background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
          {[...links, { to: '/contact', label: 'Contact' }].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              fontFamily: 'var(--font-head)', fontSize: '1.6rem', fontWeight: 700,
              color: isActive(to) ? 'var(--cyan)' : 'var(--text)', textDecoration: 'none',
            }}>
              {label}
            </Link>
          ))}
        </div>
      )}

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
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
