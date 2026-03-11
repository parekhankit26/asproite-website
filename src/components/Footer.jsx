import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteData } from '../data/SiteDataContext.jsx';

const PAGE_MAP = { 'About Us': '/about', 'Portfolio': '/portfolio', 'Careers': '/contact', 'Contact Us': '/contact', 'Services': '/services', 'Home': '/' };

export default function Footer() {
  const { data } = useSiteData();
  const ft = data?.footer || {};
  const si = data?.siteInfo || {};
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 4000); }
  };

  const serviceLinks = ft.serviceLinks || ['Website Development','Software Solutions','IT Support','Cloud Services','AI Solutions','Hardware Decommissioning'];
  const companyLinks = ft.companyLinks || ['About Us','Portfolio','Careers','Contact Us'];

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-logo" style={{ textDecoration:'none', color:'var(--text)' }}>
              ASPRO<span className="dot">.</span>ITE
            </Link>
            <p className="brand-desc">{ft.description || 'Asproite Cloud and Consultancy — your end-to-end IT partner for over 25 years.'}</p>
            <div className="footer-office"><strong>London HQ</strong>{si.londonAddress || 'Kingsland Road, London, E13 9PA'}</div>
            <div className="footer-office"><strong>India Office</strong>{si.indiaAddress || 'Gotri Road, Vadodara, 390001'}</div>
          </div>
          <div>
            <h5>{ft.servicesHeading||'Services'}</h5>
            <ul className="footer-links">
              {serviceLinks.map(s => <li key={s}><Link to="/services">{s}</Link></li>)}
            </ul>
          </div>
          <div>
            <h5>{ft.companyHeading||'Company'}</h5>
            <ul className="footer-links">
              {companyLinks.map(s => (
                <li key={s}><Link to={PAGE_MAP[s] || '/'}>{s}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-newsletter">
            <h5>{ft.newsletterTitle || 'Stay Updated'}</h5>
            <p>{ft.newsletterSubtitle || 'Get the latest IT insights and news from Asproite.'}</p>
            <form onSubmit={handleSubscribe}>
              <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit">{subscribed ? '✓ Subscribed!' : 'Subscribe'}</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {ft.copyrightName || 'Asproite Cloud and Consultancy Ltd'}. All rights reserved.</span>
          <div className="footer-socials">
            <a href={ft.linkedinUrl || '#'} aria-label="LinkedIn" target="_blank" rel="noreferrer">in</a>
            <a href={ft.twitterUrl || '#'} aria-label="Twitter" target="_blank" rel="noreferrer">𝕏</a>
            <a href={ft.facebookUrl || '#'} aria-label="Facebook" target="_blank" rel="noreferrer">f</a>
            <a href={ft.instagramUrl || '#'} aria-label="Instagram" target="_blank" rel="noreferrer">ig</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
