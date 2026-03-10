import { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

// Web3Forms key — priority order:
// 1. From sitedata.json (admin-managed, synced via GitHub)
// 2. Hardcoded fallback (set via Admin → Settings & Publish)
// 3. localStorage (legacy)
const WEB3FORMS_FALLBACK = 'a7e6530d-9477-40ec-b325-1a8c1b77d24d';
function getWeb3Key(siteData) {
  return (siteData && siteData.web3formsKey && siteData.web3formsKey !== '')
    ? siteData.web3formsKey
    : (localStorage.getItem('asproite_web3key') || WEB3FORMS_FALLBACK);
}
function GlobeCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext('2d');
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    let angle = 0, animId, last = 0;
    const FPS = 30, INTERVAL = 1000 / FPS; // throttle to 30fps — plenty for a decorative globe
    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      if (ts - last < INTERVAL) return; // skip frame if too soon
      last = ts;
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
      angle += 0.18; // slightly faster to compensate for 30fps
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} />;
}

/* ─── Constants ─────────────────────────────────────────────── */
const INITIAL_FORM = {
  firstName: '', lastName: '', email: '',
  phone: '', company: '', service: '', budget: '', message: ''
};

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

    const fullName = `${form.firstName} ${form.lastName}`;
    const htmlEmail = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 0;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#070b12 0%,#0a1628 100%);padding:36px 40px;text-align:center;">
            <div style="font-size:28px;font-weight:900;letter-spacing:3px;color:#ffffff;font-family:'Courier New',monospace;">ASPRO<span style="color:#00d4ff;">ITE</span></div>
            <div style="color:#00d4ff;font-size:12px;letter-spacing:2px;margin-top:6px;text-transform:uppercase;">New Website Enquiry</div>
          </td>
        </tr>

        <!-- Alert bar -->
        <tr>
          <td style="background:#00d4ff;padding:12px 40px;text-align:center;">
            <span style="color:#070b12;font-weight:700;font-size:13px;letter-spacing:1px;">📬 NEW ENQUIRY RECEIVED — PLEASE RESPOND WITHIN 24 HOURS</span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 24px;color:#333;font-size:15px;line-height:1.6;">
              Hello Asproite Team,<br><br>
              A new enquiry has been submitted via the website contact form. Details are below.
            </p>

            <!-- Contact Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f8fafc;border-radius:10px;padding:24px;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#00d4ff;text-transform:uppercase;margin-bottom:16px;">Contact Information</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;width:40%;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Full Name</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <strong style="color:#1a1a2e;font-size:14px;">${fullName}</strong>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Email</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <a href="mailto:${form.email}" style="color:#00d4ff;font-size:14px;text-decoration:none;">${form.email}</a>
                      </td>
                    </tr>
                    ${form.phone ? `<tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Phone</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <a href="tel:${form.phone}" style="color:#1a1a2e;font-size:14px;text-decoration:none;">${form.phone}</a>
                      </td>
                    </tr>` : ''}
                    ${form.company ? `<tr>
                      <td style="padding:8px 0;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Company</span>
                      </td>
                      <td style="padding:8px 0;">
                        <strong style="color:#1a1a2e;font-size:14px;">${form.company}</strong>
                      </td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Enquiry Details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#f8fafc;border-radius:10px;padding:24px;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#00d4ff;text-transform:uppercase;margin-bottom:16px;">Enquiry Details</div>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${form.service ? `<tr>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;width:40%;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Service Interest</span>
                      </td>
                      <td style="padding:8px 0;border-bottom:1px solid #eef0f3;">
                        <span style="background:#e8f9ff;color:#0099bb;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600;">${form.service}</span>
                      </td>
                    </tr>` : ''}
                    ${form.budget ? `<tr>
                      <td style="padding:8px 0;">
                        <span style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Budget Range</span>
                      </td>
                      <td style="padding:8px 0;">
                        <span style="background:#e8fff4;color:#00aa55;padding:3px 10px;border-radius:20px;font-size:13px;font-weight:600;">${form.budget}</span>
                      </td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
            </table>

            <!-- Message -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="background:#f8fafc;border-radius:10px;padding:24px;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:#00d4ff;text-transform:uppercase;margin-bottom:12px;">Message</div>
                  <p style="margin:0;color:#444;font-size:14px;line-height:1.8;white-space:pre-wrap;">${form.message}</p>
                </td>
              </tr>
            </table>

            <!-- CTA Button -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="mailto:${form.email}?subject=Re: Your Enquiry to Asproite&body=Dear ${fullName},%0A%0AThank you for reaching out to Asproite.%0A%0A"
                     style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#0099bb);color:#070b12;padding:14px 36px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:0.5px;">
                    ✉️ Reply to ${form.firstName}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #eef0f3;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
              This enquiry was submitted via <strong>asproite.com</strong><br>
              Asproite Cloud and Consultancy Ltd · London, UK · Vadodara, India<br>
              <span style="color:#00d4ff;">info@asproite.com</span> · +44 (0)7555185061
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: getWeb3Key(data),
          subject: `New Enquiry from ${fullName}${form.company ? ' — ' + form.company : ''} | Asproite Website`,
          from_name: fullName,
          replyto: form.email,
          message: htmlEmail,
          botcheck: '',
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');
      setSubmitted(true);
      setForm(INITIAL_FORM);
      setTimeout(() => setSubmitted(false), 6000);
    } catch(err) {
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
