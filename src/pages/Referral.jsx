import { useState } from 'react';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';
import Seo from '../components/Seo.jsx';

const INITIAL_FORM = {
  referrerName: '', referrerEmail: '', referrerPhone: '',
  businessName: '', contactName: '', contactEmail: '', contactPhone: '', message: '',
};

function ReferralForm({ rp }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [notConfigured, setNotConfigured] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.referrerName.trim()) e.referrerName = 'Required';
    if (!form.referrerEmail.trim() || !/\S+@\S+\.\S+/.test(form.referrerEmail)) e.referrerEmail = 'Valid email required';
    if (!form.businessName.trim()) e.businessName = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setSubmitError('');

    try {
      const res = await fetch('/site-api/referral/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.status === 503) { setNotConfigured(true); setLoading(false); return; }
      const result = await res.json();
      if (!res.ok || !result.ok) throw new Error(result.error || 'Submission failed');
      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit referral. Please email us directly at info@asproite.com');
    } finally {
      setLoading(false);
    }
  };

  if (notConfigured) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          Referrals aren't fully set up yet — please email the details directly to <strong style={{ color: 'var(--cyan)' }}>info@asproite.com</strong> and we'll take it from there.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 14 }}>✅</div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.15rem', marginBottom: 10 }}>Referral Sent!</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7 }}>
          Thanks for the introduction. Our team will reach out and keep you posted.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan)', marginBottom: 12 }}>Your Details</div>
      <div className="referral-form-grid">
        <div>
          <label className="contact-label">Your Name *</label>
          <input name="referrerName" type="text" placeholder="Jane Doe" value={form.referrerName} onChange={handleChange}
            className={`contact-input${errors.referrerName ? ' err' : ''}`} />
          {errors.referrerName && <span className="err-msg">{errors.referrerName}</span>}
        </div>
        <div>
          <label className="contact-label">Your Email *</label>
          <input name="referrerEmail" type="email" placeholder="jane@email.com" value={form.referrerEmail} onChange={handleChange}
            className={`contact-input${errors.referrerEmail ? ' err' : ''}`} />
          {errors.referrerEmail && <span className="err-msg">{errors.referrerEmail}</span>}
        </div>
        <div className="full">
          <label className="contact-label">Your Phone Number</label>
          <input name="referrerPhone" type="tel" placeholder="+44 ..." value={form.referrerPhone} onChange={handleChange} className="contact-input" />
        </div>
      </div>

      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan)', margin: '28px 0 12px' }}>Business You're Referring</div>
      <div className="referral-form-grid">
        <div className="full">
          <label className="contact-label">Business Name *</label>
          <input name="businessName" type="text" placeholder="Acme Ltd" value={form.businessName} onChange={handleChange}
            className={`contact-input${errors.businessName ? ' err' : ''}`} />
          {errors.businessName && <span className="err-msg">{errors.businessName}</span>}
        </div>
        <div>
          <label className="contact-label">Contact Name</label>
          <input name="contactName" type="text" placeholder="Who should we speak to?" value={form.contactName} onChange={handleChange} className="contact-input" />
        </div>
        <div>
          <label className="contact-label">Contact Email</label>
          <input name="contactEmail" type="email" placeholder="contact@business.com" value={form.contactEmail} onChange={handleChange} className="contact-input" />
        </div>
        <div className="full">
          <label className="contact-label">Contact Phone</label>
          <input name="contactPhone" type="tel" placeholder="+44 ..." value={form.contactPhone} onChange={handleChange} className="contact-input" />
        </div>
        <div className="full">
          <label className="contact-label">Anything We Should Know?</label>
          <textarea name="message" rows={4} placeholder="What do they need help with?" value={form.message} onChange={handleChange}
            className="contact-input" style={{ resize: 'vertical' }} />
        </div>
      </div>

      <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

      <button type="submit" disabled={loading} style={{
        marginTop: 24, width: '100%',
        background: loading ? 'var(--cyan2)' : 'var(--cyan)',
        color: 'var(--bg)', border: 'none', borderRadius: 5,
        padding: '15px 0', fontFamily: 'var(--font-body)',
        fontWeight: 700, fontSize: '1rem',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s', letterSpacing: '0.04em',
      }}>
        {loading ? '⟳ Submitting...' : (rp.formSubmitText || 'Submit Referral →')}
      </button>

      {rp.termsNote && (
        <p style={{ marginTop: 14, fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.6 }}>{rp.termsNote}</p>
      )}

      {submitError && (
        <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, color: '#ff6b7a', fontSize: '0.83rem' }}>
          ⚠️ {submitError}
        </div>
      )}
    </form>
  );
}

export default function Referral() {
  const { data } = useSiteData();
  const rp = data?.referralPage || {};
  const steps = rp.steps || [];
  useScrollReveal();

  return (
    <>
      <style>{`
        .referral-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .referral-form-grid .full { grid-column: 1 / -1; }
        .referral-steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }

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
          .referral-form-grid { grid-template-columns: 1fr; }
          .referral-form-grid .full { grid-column: 1; }
          .referral-steps-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .referral-steps-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>

      <Seo
        title={`${rp.pageTitle || 'Refer a Business,'} ${rp.pageTitleAccent || 'Get Rewarded'}`}
        description={rp.subtitle || "Know a business that could use Asproite? Introduce us and we'll make it worth your while."}
        path="/referral-program"
      />

      <PageHeader
        title={rp.pageTitle || 'Refer a Business,'}
        titleAccent={rp.pageTitleAccent || 'Get Rewarded'}
        breadcrumb="Referral Program"
        subtitle={rp.subtitle || "Know a business that could use Asproite? Introduce us and we'll make it worth your while."} />

      {/* REWARD */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
            <SectionHeader label={rp.rewardLabel || 'The Reward'} title={rp.rewardTitle || 'What You'} titleAccent={rp.rewardTitleAccent || 'Get'} center />
          </div>
          <div className="reveal" style={{
            maxWidth: 700, margin: '0 auto',
            background: 'linear-gradient(135deg,rgba(0,212,255,0.06) 0%,rgba(11,16,25,0.9) 60%)',
            border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 40, textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>🎁</div>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '0.95rem' }}>{rp.rewardText}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      {steps.length > 0 && (
        <section style={{ padding: '100px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
          <div className="container">
            <div className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
              <SectionHeader label={rp.stepsLabel || 'How It Works'} title={rp.stepsTitle || 'Three Simple'} titleAccent={rp.stepsTitleAccent || 'Steps'} center />
            </div>
            <div className="referral-steps-grid">
              {steps.map((s, i) => (
                <div key={s.id || i} className={`reveal d${i % 3}`} style={{
                  background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 28, textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 14 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '0.98rem', fontWeight: 600, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FORM */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="reveal" style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 48,
            maxWidth: 760, margin: '0 auto',
          }}>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.2rem', marginBottom: 6 }}>{rp.formTitle || 'Refer a Business'}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 28 }}>{rp.formSubtitle || "Fill in the details below and we'll take it from there."}</p>
            <ReferralForm rp={rp} />
          </div>
        </div>
      </section>
    </>
  );
}
