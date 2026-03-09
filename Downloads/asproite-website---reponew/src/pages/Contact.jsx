import { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';
import { WEB3FORMS_KEY as API_W3KEY } from '../data/api.js';

/* ─── Globe canvas decoration ──────────────────────────────── */
function GlobeCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext('2d');
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    let angle = 0, animId;
    const draw = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      const cx2 = cv.width / 2, cy2 = cv.height / 2;
      const R = Math.min(cv.width, cv.height) * 0.4;
      for (let lon = 0; lon < 180; lon += 20) {
        const a = (lon + angle) * Math.PI / 180;
        cx.beginPath(); cx.strokeStyle = 'rgba(0,212,255,0.08)'; cx.lineWidth = 1;
        for (let lat = -90; lat <= 90; lat += 5) {
          const phi = lat * Math.PI / 180;
          const x = cx2 + R * Math.cos(phi) * Math.sin(a);
          const y = cy2 + R * Math.sin(phi);
          lat === -90 ? cx.moveTo(x, y) : cx.lineTo(x, y);
        }
        cx.stroke();
      }
      for (let lat = -60; lat <= 60; lat += 20) {
        const phi = lat * Math.PI / 180;
        const r = R * Math.cos(phi);
        cx.beginPath(); cx.strokeStyle = 'rgba(0,212,255,0.06)'; cx.lineWidth = 1;
        cx.ellipse(cx2, cy2 + R * Math.sin(phi), r, r * 0.15, 0, 0, Math.PI * 2);
        cx.stroke();
      }
      [{ lon: 0, lat: 51.5 }, { lon: 72, lat: 22 }].forEach(d => {
        const a2 = (d.lon + angle) * Math.PI / 180;
        const phi = d.lat * Math.PI / 180;
        const x = cx2 + R * Math.cos(phi) * Math.sin(a2);
        const y = cy2 + R * Math.sin(phi);
        if (Math.cos(a2) > 0) {
          cx.beginPath(); cx.arc(x, y, 4, 0, Math.PI * 2); cx.fillStyle = '#00d4ff'; cx.fill();
          cx.beginPath(); cx.arc(x, y, 8, 0, Math.PI * 2); cx.fillStyle = 'rgba(0,212,255,0.25)'; cx.fill();
        }
      });
      angle += 0.12;
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} />;
}

/* ─── Constants ─────────────────────────────────────────────── */
const INITIAL_FORM = {
  firstName: '', lastName: '', email: '',
  phone: '', company: '', service: '', budget: '', message: ''
};

// Web3Forms key — set via Admin → Settings & Publish, then click Publish to bake it in
const WEB3FORMS_KEY = API_W3KEY || localStorage.getItem('asproite_web3key') || 'YOUR_WEB3FORMS_ACCESS_KEY';

/* ─── Main Component ─────────────────────────────────────────── */
export default function Contact() {
  const { data } = useSiteData();
  const siteInfo = data?.siteInfo || {};
  const cp = data?.contactPage || {};
  const faqs = data?.faqs || [];
  useScrollReveal();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const infoCards = [
    { id: 1, label: 'Email', value: siteInfo.email || 'info@asproite.com' },
    { id: 2, label: 'Phone', value: siteInfo.phone || '+44 (0)7555185061' },
    { id: 3, label: 'Response Time', value: 'Within 24 hours — usually much faster.' },
    { id: 4, label: 'London HQ', value: siteInfo.londonAddress || 'Kingsland Road, London, E13 9PA' },
    { id: 5, label: 'Vadodara, India', value: siteInfo.indiaAddress || 'Gotri Road, Vadodara, 390001' },
  ];

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.message.trim() || form.message.length < 20) e.message = 'Please provide more detail (min 20 chars)';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setSubmitError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Enquiry from ${form.firstName} ${form.lastName}${form.company ? ' — ' + form.company : ''}`,
          from_name: `${form.firstName} ${form.lastName}`,
          replyto: form.email,
          'Full Name': `${form.firstName} ${form.lastName}`,
          'Email': form.email,
          'Phone': form.phone || 'Not provided',
          'Company': form.company || 'Not provided',
          'Service': form.service || 'Not specified',
          'Budget': form.budget || 'Not specified',
          'Message': form.message,
          botcheck: '',
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setTimeout(() => setSubmitted(false), 6000);
    } catch {
      setSubmitError('Could not send message. Please email us directly at inquiry@asproite.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Page-scoped CSS (beats inline styles, safe to use here) ── */}
      <style>{`
        /* Contact section layout */
        .contact-outer { display: grid; grid-template-columns: 1fr 1.4fr; gap: 64px; align-items: start; }

        /* Form fields grid */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-grid .full { grid-column: 1 / -1; }

        /* Input / label shared styles */
        .contact-label {
          display: block; font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--muted); margin-bottom: 7px;
        }
        .contact-input {
          width: 100%; display: block;
          background: var(--bg); border: 1px solid var(--border); border-radius: 5px;
          padding: 13px 16px; color: var(--text);
          font-family: var(--font-body); font-size: 0.9rem;
          outline: none; transition: border-color 0.2s; box-sizing: border-box;
        }
        .contact-input:focus { border-color: var(--cyan); }
        .contact-input.err { border-color: #ff4757; }
        .err-msg { font-size: 0.73rem; color: #ff4757; margin-top: 4px; display: block; }

        /* Form box padding */
        .contact-form-box { padding: 44px; }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .contact-outer { grid-template-columns: 1fr; gap: 36px; }
          .form-grid { grid-template-columns: 1fr; }
          .form-grid .full { grid-column: 1; }
          .contact-form-box { padding: 24px 18px; }
        }
      `}</style>

      <PageHeader
        title={cp.pageTitle || 'Get in'}
        titleAccent={cp.pageTitleAccent || 'Touch'}
        breadcrumb="Contact"
        subtitle={cp.subtitle || 'Whether you have a project in mind or just want to learn more — our team is ready to help.'}>
        <GlobeCanvas />
      </PageHeader>

      {/* ── Contact layout ── */}
      <section style={{ padding: '90px 0 110px' }}>
        <div className="container">
          <div className="contact-outer">

            {/* LEFT — Info */}
            <div className="reveal-left">
              <div className="section-label" style={{ marginBottom: 20 }}>Reach Us</div>
              <h2 style={{ marginBottom: 28 }}>
                {cp.infoTitle || "Let's Start a"} <em>{cp.infoTitleAccent || 'Conversation'}</em>
              </h2>

              {infoCards.map(({ id, label, value }) => (
                <div key={id} style={{ marginBottom: 20 }}>
                  <div className="contact-label">{label}</div>
                  <div style={{
                    fontSize: '0.9rem', color: 'var(--text)',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '12px 16px', lineHeight: 1.55,
                  }}>{value}</div>
                </div>
              ))}
            </div>

            {/* RIGHT — Form */}
            <div className="reveal-right contact-form-box" style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 14, position: 'relative', overflow: 'hidden',
            }}>
              {/* Top glow line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              }} />

              {/* Success message */}
              {submitted && (
                <div style={{
                  background: 'rgba(0,255,136,0.08)', border: '1px solid var(--green)',
                  borderRadius: 8, padding: '14px 18px', marginBottom: 24,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '1.3rem' }}>✅</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>
                    Message sent! We'll get back to you within 24 hours.
                  </span>
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>
                {cp.formTitle || 'Send Us a Message'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 28, lineHeight: 1.6 }}>
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">

                  {/* First Name */}
                  <div>
                    <label className="contact-label">First Name *</label>
                    <input name="firstName" type="text" placeholder="John"
                      value={form.firstName} onChange={handleChange}
                      className={`contact-input${errors.firstName ? ' err' : ''}`} />
                    {errors.firstName && <span className="err-msg">{errors.firstName}</span>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="contact-label">Last Name *</label>
                    <input name="lastName" type="text" placeholder="Smith"
                      value={form.lastName} onChange={handleChange}
                      className={`contact-input${errors.lastName ? ' err' : ''}`} />
                    {errors.lastName && <span className="err-msg">{errors.lastName}</span>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="contact-label">Email Address *</label>
                    <input name="email" type="email" placeholder="john@company.com"
                      value={form.email} onChange={handleChange}
                      className={`contact-input${errors.email ? ' err' : ''}`} />
                    {errors.email && <span className="err-msg">{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="contact-label">Phone Number</label>
                    <input name="phone" type="tel" placeholder="+44 ..."
                      value={form.phone} onChange={handleChange}
                      className="contact-input" />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="contact-label">Company</label>
                    <input name="company" type="text" placeholder="Your company name"
                      value={form.company} onChange={handleChange}
                      className="contact-input" />
                  </div>

                  {/* Service */}
                  <div>
                    <label className="contact-label">Service Interested In</label>
                    <select name="service" value={form.service} onChange={handleChange}
                      className="contact-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select a service...</option>
                      {['Website Development','Software Solutions','Web Design','IT Support',
                        'Cloud Services','Digital Marketing','Mobile App Solutions','AI Solutions',
                        'Hardware Decommissioning','General Enquiry'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Budget — full width */}
                  <div className="full">
                    <label className="contact-label">Project Budget</label>
                    <select name="budget" value={form.budget} onChange={handleChange}
                      className="contact-input" style={{ appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select budget range...</option>
                      {['Under £5,000','£5,000 – £15,000','£15,000 – £50,000',
                        '£50,000 – £100,000','£100,000+'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Message — full width */}
                  <div className="full">
                    <label className="contact-label">Message *</label>
                    <textarea name="message" rows={5}
                      placeholder="Tell us about your project, goals, or any questions you have..."
                      value={form.message} onChange={handleChange}
                      className={`contact-input${errors.message ? ' err' : ''}`}
                      style={{ resize: 'vertical' }} />
                    {errors.message && <span className="err-msg">{errors.message}</span>}
                  </div>
                </div>

                {/* Honeypot spam protection */}
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  marginTop: 22, width: '100%',
                  background: loading ? 'var(--cyan2)' : 'var(--cyan)',
                  color: 'var(--bg)', border: 'none', borderRadius: 5,
                  padding: '15px 0', fontFamily: 'var(--font-body)',
                  fontWeight: 700, fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s', letterSpacing: '0.04em',
                }}>
                  {loading ? '⟳ Sending...' : (cp.formSubmitText || 'Send Message →')}
                </button>

                {/* Error */}
                {submitError && (
                  <div style={{
                    marginTop: 14, padding: '12px 16px',
                    background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)',
                    borderRadius: 8, color: '#ff6b7a', fontSize: '0.83rem',
                  }}>
                    ⚠️ {submitError}
                  </div>
                )}

                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
                  By submitting this form, you agree to our privacy policy. We never share your data with third parties.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ Accordion ── */}
      <section style={{ padding: '90px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionHeader
              label={cp.faqSectionLabel || 'FAQs'}
              title={cp.faqSectionTitle || 'Common'}
              titleAccent={cp.faqSectionTitleAccent || 'Questions'}
              center />
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="reveal" style={{
                background: 'var(--bg)', borderRadius: 10, overflow: 'hidden',
                border: `1px solid ${openFaq === i ? 'var(--border2)' : 'var(--border)'}`,
                transition: 'border-color 0.3s',
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none',
                  padding: '20px 24px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-head)', fontSize: '0.95rem',
                  fontWeight: 600, color: 'var(--text)',
                }}>
                  {faq.q}
                  <span style={{
                    color: 'var(--cyan)', fontSize: '1.2rem',
                    transition: 'transform 0.3s',
                    transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    flexShrink: 0, marginLeft: 16,
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{
                    padding: '0 24px 20px', fontSize: '0.88rem',
                    color: 'var(--muted)', lineHeight: 1.7,
                    borderTop: '1px solid var(--border)', paddingTop: 16,
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
