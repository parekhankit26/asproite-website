import { useState, useEffect, useRef } from 'react';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

// Careers applications use their own Web3Forms key so they land in
// career@asproite.com, separate from general Contact page enquiries.
const CAREERS_WEB3FORMS_FALLBACK = '3f2dc4b4-590b-49c2-9ec3-20fa3d70445f';
function getWeb3Key(siteData) {
  return (siteData && siteData.careersWeb3formsKey && siteData.careersWeb3formsKey !== '')
    ? siteData.careersWeb3formsKey
    : CAREERS_WEB3FORMS_FALLBACK;
}

function OrbitCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const cx = cv.getContext('2d');
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    let angle = 0, animId, last = 0;
    const FPS = 30, INTERVAL = 1000 / FPS;
    const draw = (ts) => {
      animId = requestAnimationFrame(draw);
      if (ts - last < INTERVAL) return;
      last = ts;
      cx.clearRect(0, 0, cv.width, cv.height);
      const cx2 = cv.width / 2, cy2 = cv.height / 2;
      [0.22, 0.32, 0.42].forEach((f, i) => {
        const R = Math.min(cv.width, cv.height) * f;
        cx.beginPath();
        cx.strokeStyle = 'rgba(0,212,255,0.1)';
        cx.lineWidth = 1;
        cx.ellipse(cx2, cy2, R, R * 0.32, angle * (i % 2 === 0 ? 1 : -1) * 0.01, 0, Math.PI * 2);
        cx.stroke();
        const a = angle * (i % 2 === 0 ? 1 : -1) * 0.03 + i * 2;
        const x = cx2 + R * Math.cos(a);
        const y = cy2 + R * 0.32 * Math.sin(a);
        cx.beginPath(); cx.arc(x, y, 3, 0, Math.PI * 2); cx.fillStyle = '#00d4ff'; cx.fill();
      });
      angle += 0.6;
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }} />;
}

const INITIAL_FORM = { fullName: '', email: '', phone: '', linkedin: '', resumeLink: '', message: '' };

function ApplicationForm({ job, siteData, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setSubmitError('');

    const formData = new FormData();
    formData.append('access_key', getWeb3Key(siteData));
    formData.append('subject', `Job Application: ${job ? job.title : 'General Application'} — ${form.fullName}`);
    formData.append('from_name', form.fullName);
    formData.append('replyto', form.email);
    formData.append('Full Name', form.fullName);
    formData.append('Email', form.email);
    formData.append('Phone', form.phone || 'Not provided');
    formData.append('Position Applied For', job ? job.title : 'General Application');
    formData.append('LinkedIn / Portfolio', form.linkedin || 'Not provided');
    formData.append('Resume / CV Link', form.resumeLink || 'Not provided');
    formData.append('Cover Letter', form.message || 'Not provided');
    formData.append('botcheck', '');

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const result = await res.json();
      if (!result.success) throw new Error(result.message || 'Submission failed');
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      setSubmitError('Could not submit application. Please email your CV directly to info@asproite.com');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>✅</div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', marginBottom: 10 }}>Application Sent!</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 22 }}>
          Thanks for applying{job ? ` for ${job.title}` : ''}. Our team will review your application and be in touch within 5 working days.
        </p>
        <button onClick={onClose} className="btn-ghost" style={{ cursor: 'pointer' }}>Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="apply-form-grid">
        <div>
          <label className="contact-label">Full Name *</label>
          <input name="fullName" type="text" placeholder="Jane Doe" value={form.fullName} onChange={handleChange}
            className={`contact-input${errors.fullName ? ' err' : ''}`} />
          {errors.fullName && <span className="err-msg">{errors.fullName}</span>}
        </div>
        <div>
          <label className="contact-label">Email Address *</label>
          <input name="email" type="email" placeholder="jane@email.com" value={form.email} onChange={handleChange}
            className={`contact-input${errors.email ? ' err' : ''}`} />
          {errors.email && <span className="err-msg">{errors.email}</span>}
        </div>
        <div>
          <label className="contact-label">Phone Number</label>
          <input name="phone" type="tel" placeholder="+44 ..." value={form.phone} onChange={handleChange} className="contact-input" />
        </div>
        <div>
          <label className="contact-label">LinkedIn / Portfolio</label>
          <input name="linkedin" type="text" placeholder="linkedin.com/in/..." value={form.linkedin} onChange={handleChange} className="contact-input" />
        </div>
        <div className="full">
          <label className="contact-label">Resume / CV Link</label>
          <input name="resumeLink" type="text" placeholder="Google Drive, Dropbox, or LinkedIn link to your CV" value={form.resumeLink} onChange={handleChange} className="contact-input" />
        </div>
        <div className="full">
          <label className="contact-label">Cover Letter / Message</label>
          <textarea name="message" rows={4} placeholder="Tell us why you'd be a great fit..." value={form.message} onChange={handleChange}
            className="contact-input" style={{ resize: 'vertical' }} />
        </div>
      </div>

      <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

      <button type="submit" disabled={loading} style={{
        marginTop: 20, width: '100%',
        background: loading ? 'var(--cyan2)' : 'var(--cyan)',
        color: 'var(--bg)', border: 'none', borderRadius: 5,
        padding: '15px 0', fontFamily: 'var(--font-body)',
        fontWeight: 700, fontSize: '1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s', letterSpacing: '0.04em',
      }}>
        {loading ? '⟳ Submitting...' : 'Submit Application →'}
      </button>

      {submitError && (
        <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, color: '#ff6b7a', fontSize: '0.83rem' }}>
          ⚠️ {submitError}
        </div>
      )}
    </form>
  );
}

function JobCard({ job, expanded, onToggle }) {
  return (
    <div className="reveal" style={{
      background: 'var(--bg2)', border: `1px solid ${expanded ? 'var(--border2)' : 'var(--border)'}`,
      borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.3s',
    }}>
      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer',
        padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{job.title}</h3>
            {job.isNew && <span className="new-badge">New</span>}
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--muted)' }}>
            <span>🏢 {job.department}</span>
            <span>📍 {job.location}</span>
            <span>⏱ {job.type}</span>
          </div>
        </div>
        <span style={{ color: 'var(--cyan)', fontSize: '1.3rem', transition: 'transform 0.3s', transform: expanded ? 'rotate(45deg)' : 'none', flexShrink: 0 }}>+</span>
      </button>
      {expanded && (
        <div style={{ padding: '0 28px 28px', borderTop: '1px solid var(--border)', paddingTop: 22 }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.75, marginBottom: 20 }}>{job.description}</p>
          {job.requirements && job.requirements.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>Requirements</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {job.requirements.map((r, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: '0.4rem', color: 'var(--cyan)', marginTop: 7 }}>◆</span>{r}
                  </div>
                ))}
              </div>
            </div>
          )}
          <ApplyBox job={job} />
        </div>
      )}
    </div>
  );
}

function ApplyBox({ job }) {
  const { data } = useSiteData();
  const [open, setOpen] = useState(false);
  if (!open) {
    return <button onClick={() => setOpen(true)} className="btn-primary" style={{ cursor: 'pointer', border: 'none' }}>Apply for This Role →</button>;
  }
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 24, marginTop: 8 }}>
      <ApplicationForm job={job} siteData={data} onClose={() => setOpen(false)} />
    </div>
  );
}

export default function Careers() {
  const { data } = useSiteData();
  const cp = data?.careersPage || {};
  const jobs = data?.careers || [];
  useScrollReveal();

  const [expandedId, setExpandedId] = useState(null);
  const [generalOpen, setGeneralOpen] = useState(false);

  const perks = cp.perks || [];

  return (
    <>
      <style>{`
        .apply-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .apply-form-grid .full { grid-column: 1 / -1; }
        .perks-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }

        /* Form field styles — same pattern as the Contact page, scoped
           here too since page-level <style> tags aren't shared. */
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

        @media (max-width: 768px) {
          .apply-form-grid { grid-template-columns: 1fr; }
          .apply-form-grid .full { grid-column: 1; }
          .perks-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .perks-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <PageHeader
        title={cp.pageTitle || 'Join Our'}
        titleAccent={cp.pageTitleAccent || 'Team'}
        breadcrumb="Careers"
        subtitle={cp.subtitle || 'Help us deliver exceptional IT solutions. Explore our open roles and grow your career with Asproite.'}>
        <OrbitCanvas />
      </PageHeader>

      {/* OPEN POSITIONS */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
            <SectionHeader
              label={cp.sectionLabel || 'Open Positions'}
              title={cp.sectionTitle || 'Current'}
              titleAccent={cp.sectionTitleAccent || 'Openings'}
              center />
          </div>

          {jobs.length > 0 ? (
            <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {jobs.map(job => (
                <JobCard key={job.id} job={job} expanded={expandedId === job.id} onToggle={() => setExpandedId(expandedId === job.id ? null : job.id)} />
              ))}
            </div>
          ) : (
            <div className="reveal" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
              <div style={{ fontSize: '2.4rem', marginBottom: 16 }}>👋</div>
              <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem' }}>
                {cp.noOpeningsText || "We don't have any open positions right now, but we're always happy to hear from talented people. Send us your CV and we'll keep you in mind for future roles."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* PERKS / WHY WORK WITH US */}
      {perks.length > 0 && (
        <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
              <SectionHeader
                label={cp.whySectionLabel || 'Why Asproite'}
                title={cp.whySectionTitle || 'Why Work'}
                titleAccent={cp.whySectionTitleAccent || 'With Us'}
                center />
            </div>
            <div className="perks-grid">
              {perks.map((p, i) => (
                <div key={p.id || i} className={`reveal d${i % 3}`} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12,
                  padding: 28, transition: 'border-color 0.3s, transform 0.3s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 14 }}>{p.icon}</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.98rem', fontWeight: 600, marginBottom: 8 }}>{p.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GENERAL APPLICATION CTA */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{
            background: 'linear-gradient(135deg,rgba(0,212,255,0.05) 0%,rgba(11,16,25,0.9) 60%)',
            border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 56,
            maxWidth: 800, margin: '0 auto',
          }}>
            {!generalOpen ? (
              <div style={{ textAlign: 'center' }}>
                <div className="section-label" style={{ justifyContent: 'center', marginBottom: 14 }}>{cp.ctaLabel || 'Get In Touch'}</div>
                <h2 style={{ marginBottom: 14 }}>{cp.ctaTitle || "Don't See a Role"} <em>{cp.ctaTitleAccent || 'That Fits?'}</em></h2>
                <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
                  {cp.ctaSubtitle || "We're always on the lookout for great people. Send us a speculative application."}
                </p>
                <button onClick={() => setGeneralOpen(true)} className="btn-primary" style={{ cursor: 'pointer', border: 'none' }}>Send Speculative Application →</button>
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', marginBottom: 6 }}>{cp.formTitle || 'Apply Now'}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 24 }}>{cp.formSubtitle || "Fill in your details below and we'll be in touch within 5 working days."}</p>
                <ApplicationForm job={null} siteData={data} onClose={() => setGeneralOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
