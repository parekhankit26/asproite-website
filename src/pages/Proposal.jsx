import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader, SectionHeader } from '../components/index.jsx';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';
import Seo from '../components/Seo.jsx';
import { generateProposal } from '../data/api.js';

const BUDGET_OPTIONS = ['Under £5,000', '£5,000 – £15,000', '£15,000 – £50,000', '£50,000 – £100,000', '£100,000+'];

const INITIAL_FORM = {
  businessName: '', contactName: '', contactEmail: '', contactPhone: '',
  industry: '', budgetRange: '', description: '',
};

function ProposalResults({ pp, businessName, proposal, onReset }) {
  return (
    <div className="reveal">
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div className="section-label" style={{ justifyContent: 'center', marginBottom: 14 }}>{pp.resultsTitle || 'Your Custom Roadmap'}</div>
        <h2>{businessName}</h2>
      </div>

      <div style={{
        background: 'linear-gradient(135deg,rgba(0,212,255,0.06) 0%,rgba(11,16,25,0.9) 60%)',
        border: '1px solid rgba(0,212,255,0.18)', borderRadius: 14, padding: 40, marginBottom: 32,
      }}>
        <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '0.98rem' }}>{proposal.summary}</p>
      </div>

      <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
        Recommended Services
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {(proposal.recommendedServices || []).map((s, i) => (
          <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)' }}>{s.service}</h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan)', whiteSpace: 'nowrap' }}>{s.estimatedRange}</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.65 }}>{s.reasoning}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }} className="proposal-stats-grid">
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Estimated Total</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan)' }}>{proposal.totalEstimatedRange}</div>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Suggested Timeline</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan)' }}>{proposal.suggestedTimeline}</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: 32, marginBottom: 20 }}>
        <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: 1.7, marginBottom: 20 }}>{proposal.nextSteps}</p>
        <Link to="/contact" className="btn-primary">{pp.ctaText || 'Book a Free Consultation'}</Link>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
        {pp.disclaimerNote}
      </p>

      <div style={{ textAlign: 'center' }}>
        <button onClick={onReset} className="btn-ghost" style={{ cursor: 'pointer' }}>Start Over</button>
      </div>
    </div>
  );
}

function ProposalForm({ pp, onGenerated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
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
    if (!form.businessName.trim()) e.businessName = 'Required';
    if (!form.contactName.trim()) e.contactName = 'Required';
    if (!form.contactEmail.trim() || !/\S+@\S+\.\S+/.test(form.contactEmail)) e.contactEmail = 'Valid email required';
    if (!form.description.trim() || form.description.trim().length < 20) e.description = 'Please provide at least 20 characters of detail';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setSubmitError('');

    try {
      const result = await generateProposal(form);
      if (result.notConfigured) { setNotConfigured(true); setLoading(false); return; }
      onGenerated(form.businessName, result.proposal);
    } catch (err) {
      setSubmitError(err.message || 'Could not generate your roadmap. Please try again or email us directly at inquiry@asproite.com');
    } finally {
      setLoading(false);
    }
  };

  if (notConfigured) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
          The AI roadmap tool isn't fully set up yet — please email us directly at <strong style={{ color: 'var(--cyan)' }}>inquiry@asproite.com</strong> and we'll build your roadmap personally.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: '2.4rem', marginBottom: 20 }}>⟳</div>
        <p style={{ color: 'var(--cyan)', fontSize: '0.95rem' }}>{pp.loadingText || 'Analysing your business and building your roadmap...'}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="proposal-form-grid">
        <div>
          <label className="contact-label">Business Name *</label>
          <input name="businessName" type="text" placeholder="Acme Ltd" value={form.businessName} onChange={handleChange}
            className={`contact-input${errors.businessName ? ' err' : ''}`} />
          {errors.businessName && <span className="err-msg">{errors.businessName}</span>}
        </div>
        <div>
          <label className="contact-label">Industry</label>
          <input name="industry" type="text" placeholder="e.g. Healthcare, Retail, Law" value={form.industry} onChange={handleChange} className="contact-input" />
        </div>
        <div>
          <label className="contact-label">Your Name *</label>
          <input name="contactName" type="text" placeholder="Jane Doe" value={form.contactName} onChange={handleChange}
            className={`contact-input${errors.contactName ? ' err' : ''}`} />
          {errors.contactName && <span className="err-msg">{errors.contactName}</span>}
        </div>
        <div>
          <label className="contact-label">Your Email *</label>
          <input name="contactEmail" type="email" placeholder="jane@company.com" value={form.contactEmail} onChange={handleChange}
            className={`contact-input${errors.contactEmail ? ' err' : ''}`} />
          {errors.contactEmail && <span className="err-msg">{errors.contactEmail}</span>}
        </div>
        <div>
          <label className="contact-label">Phone Number</label>
          <input name="contactPhone" type="tel" placeholder="+44 ..." value={form.contactPhone} onChange={handleChange} className="contact-input" />
        </div>
        <div>
          <label className="contact-label">Budget Range</label>
          <select name="budgetRange" value={form.budgetRange} onChange={handleChange} className="contact-input">
            <option value="">Select budget range...</option>
            {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="full">
          <label className="contact-label">Tell Us About Your Business & What You Need *</label>
          <textarea name="description" rows={5} placeholder="e.g. We're a 20-person law firm, our current website looks dated and we're worried about data security, also thinking about using AI to speed up document review..."
            value={form.description} onChange={handleChange} className="contact-input" style={{ resize: 'vertical' }} />
          {errors.description && <span className="err-msg">{errors.description}</span>}
        </div>
      </div>

      <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

      <button type="submit" style={{
        marginTop: 24, width: '100%',
        background: 'var(--cyan)', color: 'var(--bg)', border: 'none', borderRadius: 5,
        padding: '15px 0', fontFamily: 'var(--font-body)',
        fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
        transition: 'background 0.2s', letterSpacing: '0.04em',
      }}>
        {pp.formSubmitText || 'Generate My Roadmap →'}
      </button>

      {submitError && (
        <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: 8, color: '#ff6b7a', fontSize: '0.83rem' }}>
          ⚠️ {submitError}
        </div>
      )}
    </form>
  );
}

export default function Proposal() {
  const { data } = useSiteData();
  const pp = data?.proposalPage || {};
  const [result, setResult] = useState(null);
  useScrollReveal();

  return (
    <>
      <style>{`
        .proposal-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .proposal-form-grid .full { grid-column: 1 / -1; }
        .proposal-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

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
          .proposal-form-grid { grid-template-columns: 1fr; }
          .proposal-form-grid .full { grid-column: 1; }
          .proposal-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <Seo
        title={`${pp.pageTitle || 'Get Your Custom IT'} ${pp.pageTitleAccent || 'Roadmap in 60 Seconds'}`}
        description={pp.subtitle || "Describe your business and get an instant, AI-generated multi-service IT roadmap and quote estimate."}
        path="/get-proposal"
      />

      <PageHeader
        title={pp.pageTitle || 'Get Your Custom IT'}
        titleAccent={pp.pageTitleAccent || 'Roadmap in 60 Seconds'}
        breadcrumb="AI Roadmap"
        subtitle={pp.subtitle || "Describe your business and what you need — our AI builds a real, itemised proposal on the spot, pulling only from services we actually offer. No sales call required to get started."} />

      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: 48,
            maxWidth: 860, margin: '0 auto',
          }}>
            {result ? (
              <ProposalResults pp={pp} businessName={result.businessName} proposal={result.proposal} onReset={() => setResult(null)} />
            ) : (
              <>
                <div className="reveal" style={{ marginBottom: 8 }}>
                  <SectionHeader label="" title={pp.formTitle || 'Tell Us About Your Business'} titleAccent="" />
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 28 }}>{pp.formSubtitle || "The more detail you give, the more useful your roadmap will be."}</p>
                <ProposalForm pp={pp} onGenerated={(businessName, proposal) => setResult({ businessName, proposal })} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
