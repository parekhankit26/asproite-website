import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 4000); }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-logo" style={{ textDecoration: 'none', color: 'var(--text)' }}>
              ASPRO<span className="dot">.</span>ITE
            </Link>
            <p className="brand-desc">Asproite Cloud and Consultancy — your end-to-end IT partner for over 25 years. Serving private and public sector organisations across the UK and beyond.</p>
            <div className="footer-office"><strong>London HQ</strong>484a Katherine Road, London, E7 8DP</div>
            <div className="footer-office"><strong>India Office</strong>67c Gotri Road, Vadodara, 390001</div>
          </div>
          <div>
            <h5>Services</h5>
            <ul className="footer-links">
              {['Website Development','Software Solutions','IT Support','Cloud Services','AI Solutions','Hardware Decommissioning'].map(s => (
                <li key={s}><Link to="/services">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/contact">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-newsletter">
            <h5>Stay Updated</h5>
            <p>Get the latest IT insights and news from Asproite.</p>
            <form onSubmit={handleSubscribe}>
              <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit">{subscribed ? '✓ Subscribed!' : 'Subscribe'}</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Asproite Cloud and Consultancy Ltd. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" aria-label="LinkedIn">in</a>
            <a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
