import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

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

const INITIAL_FORM = { firstName: '', lastName: '', email: '', phone: '', company: '', service: '', budget: '', message: '' };

export default function Contact() {
  const { data } = useSiteData();
  const faqs = data?.faqs || [];
  const siteInfo = data?.siteInfo || {};
  useScrollReveal();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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
    await new Promise(r => setTimeout(r, 1200)); // simulate API call
    setLoading(false);
    setSubmitted(true);
    setForm(INITIAL_FORM);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const cp = data?.contactPage || {};
  const infoCards = cp.infoCards || [
    { id:1, label:'Email', value: siteInfo.email || 'info@asproite.com' },
    { id:2, label:'Phone', value: siteInfo.phone || '+44 (0)7555185061' },
    { id:3, label:'Response Time', value:'Within 24 hours — usually much faster.' },
    { id:4, label:'London HQ', value: siteInfo.londonAddress || 'Kingsland Road, London, E13 9PA' },
    { id:5, label:'Vadodara, India', value: siteInfo.indiaAddress || 'Gotri Road, Vadodara, 390001' },
  ];

  return (
    <>
      <PageHeader title={cp.pageTitle||"Get in"} titleAccent={cp.pageTitleAccent||"Touch"} breadcrumb="Contact"
        subtitle={cp.subtitle || "Whether you have a project in mind or just want to learn more — our team is ready to help."}>
        <GlobeCanvas />
      </PageHeader>

      {/* CONTACT LAYOUT */}
      <section style={{ padding: '90px 0 110px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }}>

            {/* Left: Info */}
            <div className="reveal-left" style={{ position: 'sticky', top: 120 }}>
              <div className="section-label" style={{ marginBottom: 20 }}>Reach Us</div>
              <h2 style={{ marginBottom: 28 }}>{cp.infoTitle||"Let's Start a"} <em>{cp.infoTitleAccent||'Conversation'}</em></h2>

              {infoCards.map(({ id, label, value }) => (
                <div key={id} style={{ marginBottom: 24 }}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.68rem', fontWeight: 600, color: 'var(--cyan)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '12px 16px' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Right: Form */}
            <div className="reveal-right" style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 48, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,var(--cyan),transparent)' }} />
              
              {submitted && (
                <div style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid var(--green)', borderRadius: 8, padding: '16px 20px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.3rem' }}>✅</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>Message sent! We'll get back to you within 24 hours.</span>
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>{cp.formTitle||'Send Us a Message'}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 32 }}>Fill in the form below and we'll get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  {[
                    { name: 'firstName', label: 'First Name *', placeholder: 'John', type: 'text' },
                    { name: 'lastName', label: 'Last Name *', placeholder: 'Smith', type: 'text' },
                    { name: 'email', label: 'Email Address *', placeholder: 'john@company.com', type: 'email' },
                    { name: 'phone', label: 'Phone Number', placeholder: '+44 ...', type: 'tel' },
                    { name: 'company', label: 'Company', placeholder: 'Your company name', type: 'text' },
                  ].map(f => (
                    <div key={f.name}>
                      <label style={labelStyle}>{f.label}</label>
                      <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange}
                        style={{ ...inputStyle, borderColor: errors[f.name] ? '#ff4757' : 'var(--border)' }} />
                      {errors[f.name] && <span style={{ fontSize: '0.73rem', color: '#ff4757' }}>{errors[f.name]}</span>}
                    </div>
                  ))}

                  <div>
                    <label style={labelStyle}>Service Interested In</label>
                    <select name="service" value={form.service} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select a service...</option>
                      {['Website Development','Software Solutions','Web Design','IT Support','Cloud Services','Digital Marketing','Mobile App Solutions','AI Solutions','Hardware Decommissioning','General Enquiry'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Project Budget</label>
                    <select name="budget" value={form.budget} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                      <option value="">Select budget range...</option>
                      {['Under £5,000','£5,000 – £15,000','£15,000 – £50,000','£50,000 – £100,000','£100,000+'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={labelStyle}>Message *</label>
                    <textarea name="message" placeholder="Tell us about your project, goals, or any questions you have..." value={form.message} onChange={handleChange} rows={5}
                      style={{ ...inputStyle, resize: 'vertical', borderColor: errors.message ? '#ff4757' : 'var(--border)' }} />
                    {errors.message && <span style={{ fontSize: '0.73rem', color: '#ff4757' }}>{errors.message}</span>}
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: 24, width: '100%', background: loading ? 'var(--cyan2)' : 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 5, padding: 16, fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s, transform 0.2s', letterSpacing: '0.04em' }}>
                  {loading ? '⟳ Sending...' : 'Send Message →'}
                </button>
                <p style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>By submitting this form, you agree to our privacy policy. We never share your data with third parties.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — Accordion */}
      <section style={{ padding: '90px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionHeader label={cp.faqSectionLabel||"FAQs"} title={cp.faqSectionTitle||"Common"} titleAccent={cp.faqSectionTitleAccent||"Questions"} center />
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="reveal" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', transition: 'border-color 0.3s', borderColor: openFaq === i ? 'var(--border2)' : 'var(--border)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-head)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>
                  {faq.q}
                  <span style={{ color: 'var(--cyan)', fontSize: '1.2rem', transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 26px 22px', fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.7, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
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

const inputStyle = {
  width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5,
  padding: '13px 16px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  outline: 'none', transition: 'border-color 0.2s', display: 'block',
};

const labelStyle = {
  fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
  color: 'var(--muted)', display: 'block', marginBottom: 7,
};
