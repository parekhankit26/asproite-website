import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/index.js';

/* ─── Theme ──────────────────────────────────────────────────── */
const C = {
  bg:'#070b12', surface:'#0a0f1a', surface2:'#0e1525', surface3:'#121b2e',
  border:'rgba(0,212,255,0.12)', borderHover:'rgba(0,212,255,0.3)',
  cyan:'#00d4ff', cyanDim:'rgba(0,212,255,0.08)', cyanGlow:'rgba(0,212,255,0.18)',
  text:'#e2eaf5', muted:'#5a6a82', mutedLight:'#8899aa',
  success:'#00ff88', successDim:'rgba(0,255,136,0.1)',
  warning:'#f4b942', warningDim:'rgba(244,185,66,0.1)',
  danger:'#ff4757', dangerDim:'rgba(255,71,87,0.1)',
};

/* ─── Questions ─────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: 'size', icon: '🏢', category: 'Overview',
    question: 'How many employees does your organisation have?',
    subtitle: 'This helps us tailor recommendations to your scale.',
    type: 'single',
    options: [
      { label: '1–10 (Micro)', value: 'micro', score: { support: 30, cloud: 40 } },
      { label: '11–50 (Small)', value: 'small', score: { support: 50, cloud: 50 } },
      { label: '51–200 (Medium)', value: 'medium', score: { support: 60, cloud: 60 } },
      { label: '201–500 (Large)', value: 'large', score: { support: 70, cloud: 70 } },
      { label: '500+ (Enterprise)', value: 'enterprise', score: { support: 80, cloud: 80 } },
    ],
  },
  {
    id: 'support', icon: '🛡️', category: 'IT Support',
    question: 'How is your IT support currently managed?',
    subtitle: 'Honest answers give you a more accurate health score.',
    type: 'single',
    options: [
      { label: 'We have no formal IT support', value: 'none', score: { support: 5 } },
      { label: 'Staff sort it out themselves', value: 'diy', score: { support: 15 } },
      { label: 'Occasional freelancer / break-fix', value: 'freelance', score: { support: 30 } },
      { label: 'Part-time IT person in-house', value: 'parttime', score: { support: 55 } },
      { label: 'Dedicated IT team in-house', value: 'inhouse', score: { support: 75 } },
      { label: 'Managed IT provider (MSP)', value: 'msp', score: { support: 95 } },
    ],
  },
  {
    id: 'downtime', icon: '⚠️', category: 'Reliability',
    question: 'How often do you experience IT downtime or disruptions?',
    subtitle: 'Downtime costs the average UK SME £3,000+ per hour.',
    type: 'single',
    options: [
      { label: 'Multiple times a week', value: 'very_often', score: { reliability: 5 } },
      { label: 'Once a week', value: 'weekly', score: { reliability: 20 } },
      { label: 'A few times a month', value: 'monthly', score: { reliability: 45 } },
      { label: 'Rarely — a few times a year', value: 'rarely', score: { reliability: 75 } },
      { label: 'Almost never', value: 'never', score: { reliability: 95 } },
    ],
  },
  {
    id: 'cloud', icon: '☁️', category: 'Cloud',
    question: 'How would you describe your current cloud adoption?',
    subtitle: 'Cloud-first businesses grow 2.5x faster on average.',
    type: 'single',
    options: [
      { label: 'Everything is on local servers/hardware', value: 'none', score: { cloud: 10 } },
      { label: 'We use some cloud apps (email, Drive etc.)', value: 'basic', score: { cloud: 35 } },
      { label: 'Mix of cloud and on-premise', value: 'hybrid', score: { cloud: 60 } },
      { label: 'Mostly cloud-based', value: 'mostly', score: { cloud: 80 } },
      { label: 'Fully cloud-native', value: 'full', score: { cloud: 98 } },
    ],
  },
  {
    id: 'security', icon: '🔒', category: 'Security',
    question: 'Which security measures does your business have in place?',
    subtitle: 'Select all that apply. 43% of cyberattacks target SMEs.',
    type: 'multi',
    options: [
      { label: 'Antivirus / endpoint protection', value: 'av', score: { security: 15 } },
      { label: 'Regular data backups', value: 'backup', score: { security: 20 } },
      { label: 'Multi-factor authentication (MFA)', value: 'mfa', score: { security: 20 } },
      { label: 'Firewall / network monitoring', value: 'firewall', score: { security: 15 } },
      { label: 'Staff cybersecurity training', value: 'training', score: { security: 15 } },
      { label: 'Cyber insurance', value: 'insurance', score: { security: 10 } },
      { label: 'None of the above', value: 'none', score: { security: 0 }, exclusive: true },
    ],
  },
  {
    id: 'pain', icon: '💢', category: 'Pain Points',
    question: 'What are your biggest IT headaches right now?',
    subtitle: 'Select all that apply — be honest!',
    type: 'multi',
    options: [
      { label: 'Slow or unreliable systems', value: 'slow', score: { reliability: -10 } },
      { label: 'Cybersecurity concerns', value: 'cyber', score: { security: -10 } },
      { label: 'High IT costs', value: 'costs', score: { support: -10 } },
      { label: 'Remote/hybrid working challenges', value: 'remote', score: { cloud: -10 } },
      { label: 'Outdated hardware or software', value: 'outdated', score: { reliability: -15 } },
      { label: 'No visibility over IT assets', value: 'visibility', score: { support: -15 } },
      { label: 'Poor IT support response times', value: 'slowsupport', score: { support: -20 } },
      { label: 'None — we\'re in good shape!', value: 'none', score: {}, exclusive: true },
    ],
  },
  {
    id: 'hardware', icon: '🖥️', category: 'Hardware',
    question: 'How old is the majority of your IT hardware?',
    subtitle: 'Old hardware is the #1 cause of IT downtime in UK SMEs.',
    type: 'single',
    options: [
      { label: 'Less than 2 years old', value: 'new', score: { reliability: 25 } },
      { label: '2–4 years old', value: 'ok', score: { reliability: 15 } },
      { label: '4–6 years old', value: 'aging', score: { reliability: 5 } },
      { label: '6+ years old', value: 'old', score: { reliability: 0 } },
      { label: 'We mostly use cloud / no local hardware', value: 'cloud', score: { cloud: 15, reliability: 20 } },
    ],
  },
  {
    id: 'digital', icon: '🤖', category: 'Digital Transformation',
    question: 'Which digital transformation areas are you exploring?',
    subtitle: 'Select all that apply.',
    type: 'multi',
    options: [
      { label: 'AI / automation tools', value: 'ai', score: { digital: 25 } },
      { label: 'Moving to the cloud', value: 'cloud', score: { cloud: 15, digital: 15 } },
      { label: 'New website or web app', value: 'web', score: { digital: 15 } },
      { label: 'Mobile app development', value: 'mobile', score: { digital: 15 } },
      { label: 'Data analytics / dashboards', value: 'data', score: { digital: 20 } },
      { label: 'Not currently exploring any', value: 'none', score: { digital: 0 }, exclusive: true },
    ],
  },
  {
    id: 'budget', icon: '💷', category: 'Budget',
    question: 'What is your approximate annual IT budget?',
    subtitle: 'UK average for SMEs is £1,200 per employee per year.',
    type: 'single',
    options: [
      { label: 'Under £5,000', value: 'tiny', score: { support: 0 } },
      { label: '£5,000 – £20,000', value: 'small', score: { support: 10 } },
      { label: '£20,000 – £50,000', value: 'medium', score: { support: 20 } },
      { label: '£50,000 – £150,000', value: 'large', score: { support: 30 } },
      { label: '£150,000+', value: 'enterprise', score: { support: 40 } },
    ],
  },
  {
    id: 'priority', icon: '🎯', category: 'Priorities',
    question: 'What is your #1 IT priority for the next 12 months?',
    subtitle: 'This determines your personalised action plan.',
    type: 'single',
    options: [
      { label: 'Reduce costs', value: 'costs', score: {} },
      { label: 'Improve security & compliance', value: 'security', score: { security: 10 } },
      { label: 'Modernise infrastructure', value: 'modernise', score: { reliability: 10 } },
      { label: 'Migrate to cloud', value: 'cloud', score: { cloud: 10 } },
      { label: 'Scale up for growth', value: 'scale', score: { digital: 10 } },
      { label: 'Better IT support & response times', value: 'support', score: { support: 10 } },
    ],
  },
];

/* ─── Score calculator ──────────────────────────────────────── */
function calcScores(answers) {
  const scores = { support: 50, cloud: 50, security: 0, reliability: 50, digital: 20 };

  QUESTIONS.forEach(q => {
    const ans = answers[q.id];
    if (!ans) return;
    const vals = Array.isArray(ans) ? ans : [ans];
    vals.forEach(v => {
      const opt = q.options.find(o => o.value === v);
      if (!opt) return;
      Object.entries(opt.score || {}).forEach(([key, delta]) => {
        scores[key] = Math.max(0, Math.min(100, (scores[key] || 0) + delta));
      });
    });
  });

  // Normalise
  Object.keys(scores).forEach(k => { scores[k] = Math.max(0, Math.min(100, Math.round(scores[k]))); });
  scores.overall = Math.round(
    scores.support * 0.25 + scores.cloud * 0.20 +
    scores.security * 0.25 + scores.reliability * 0.20 + scores.digital * 0.10
  );
  return scores;
}

/* ─── Recommendations engine ────────────────────────────────── */
function getRecommendations(answers, scores) {
  const recs = [];

  if (scores.support < 60)
    recs.push({ icon: '🛡️', service: 'IT Support & Helpdesk', urgency: scores.support < 30 ? 'critical' : 'high',
      why: 'Your current support setup leaves your business exposed. Gaps in IT support directly cause downtime and lost productivity.',
      saving: 'Businesses with managed IT support reduce downtime by up to 85%.' });

  if (scores.security < 60)
    recs.push({ icon: '🔒', service: 'Cybersecurity & Compliance', urgency: scores.security < 25 ? 'critical' : 'high',
      why: 'Your security posture has significant gaps. A single breach costs UK SMEs an average of £8,460.',
      saving: 'Proper cybersecurity prevents 94% of malware attacks.' });

  if (scores.cloud < 50)
    recs.push({ icon: '☁️', service: 'Cloud Migration & Services', urgency: 'medium',
      why: 'Moving workloads to cloud reduces hardware costs, improves reliability, and enables remote working.',
      saving: 'Cloud adoption reduces IT infrastructure costs by 30–40% on average.' });

  if (scores.reliability < 55)
    recs.push({ icon: '⚡', service: 'Infrastructure Modernisation', urgency: scores.reliability < 25 ? 'critical' : 'medium',
      why: 'Ageing or unreliable infrastructure is costing you productivity every day.',
      saving: 'Modern infrastructure reduces IT incidents by up to 60%.' });

  if (scores.digital < 40 || (answers.digital && !answers.digital.includes('none')))
    recs.push({ icon: '🤖', service: 'AI & Digital Transformation', urgency: 'low',
      why: 'Competitors are automating. AI tools can save 8–12 hours per employee per week.',
      saving: 'Early AI adopters see 3× faster revenue growth.' });

  if (answers.hardware && ['old','aging'].includes(answers.hardware))
    recs.push({ icon: '🖥️', service: 'Hardware Decommissioning', urgency: 'medium',
      why: 'Old hardware needs secure, WEEE-compliant disposal. We handle certified data destruction and responsible recycling.',
      saving: 'We provide a full audit trail for compliance peace of mind.' });

  // Always suggest web if small/no digital presence
  if (answers.digital && answers.digital.includes('web'))
    recs.push({ icon: '🌐', service: 'Website & Software Development', urgency: 'low',
      why: 'A modern, fast website is your most powerful sales tool.',
      saving: 'Our clients see an average 45% increase in online enquiries.' });

  return recs.slice(0, 5);
}

/* ─── Score label ────────────────────────────────────────────── */
function scoreLabel(s) {
  if (s >= 80) return { label: 'Excellent', color: C.success };
  if (s >= 60) return { label: 'Good', color: '#66dd88' };
  if (s >= 40) return { label: 'Fair', color: C.warning };
  if (s >= 20) return { label: 'Poor', color: '#ff8c42' };
  return { label: 'Critical', color: C.danger };
}

function urgencyColor(u) {
  if (u === 'critical') return C.danger;
  if (u === 'high') return '#ff8c42';
  if (u === 'medium') return C.warning;
  return C.cyan;
}

/* ─── Animated Score Ring ───────────────────────────────────── */
function ScoreRing({ score, size = 160, stroke = 10, label = 'Overall', animated = true }) {
  const [displayed, setDisplayed] = useState(animated ? 0 : score);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const { color } = scoreLabel(displayed);

  useEffect(() => {
    if (!animated) return;
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(step);
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [score, animated]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.surface2} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - displayed / 100)}
          style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${color}88)` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: size > 120 ? '2.2rem' : '1.4rem', fontWeight: 900, color, fontFamily: 'var(--font-head)', lineHeight: 1 }}>{displayed}</div>
        <div style={{ fontSize: '0.65rem', color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color, marginTop: 2 }}>{scoreLabel(displayed).label}</div>
      </div>
    </div>
  );
}

/* ─── Progress bar ──────────────────────────────────────────── */
function ProgressBar({ value, color = C.cyan, animated = false }) {
  const [w, setW] = useState(animated ? 0 : value);
  useEffect(() => {
    if (!animated) { setW(value); return; }
    const t = setTimeout(() => setW(value), 100);
    return () => clearTimeout(t);
  }, [value, animated]);
  return (
    <div style={{ height: 8, background: C.surface2, borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${w}%`, background: `linear-gradient(90deg, ${color}, ${color}aa)`, borderRadius: 4, transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)', boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function ITHealthCheck() {
  useScrollReveal();
  const [step, setStep] = useState(0); // 0 = intro, 1-10 = questions, 11 = email, 12 = results
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState(null);
  const [recs, setRecs] = useState([]);
  const topRef = useRef(null);

  const totalQ = QUESTIONS.length;
  const currentQ = QUESTIONS[step - 1];

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const selectOption = (qid, value, isMulti, exclusive) => {
    setAnswers(prev => {
      const curr = prev[qid] || [];
      if (!isMulti) return { ...prev, [qid]: value };
      // Handle exclusive options
      if (exclusive) return { ...prev, [qid]: [value] };
      const withoutExclusive = curr.filter(v => {
        const opt = QUESTIONS.find(q => q.id === qid)?.options.find(o => o.value === v);
        return !opt?.exclusive;
      });
      if (withoutExclusive.includes(value)) return { ...prev, [qid]: withoutExclusive.filter(v => v !== value) };
      return { ...prev, [qid]: [...withoutExclusive, value] };
    });
  };

  const canNext = () => {
    if (step === 0) return true;
    if (step > totalQ) return true;
    const q = QUESTIONS[step - 1];
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === 'multi') return Array.isArray(ans) && ans.length > 0;
    return true;
  };

  const goNext = () => {
    scrollTop();
    if (step === 0) { setStep(1); return; }
    if (step === totalQ) { setStep(totalQ + 1); return; } // go to email step
    if (step > totalQ) {
      // Calculate and show results
      const s = calcScores(answers);
      const r = getRecommendations(answers, s);
      setScores(s);
      setRecs(r);
      setStep(totalQ + 2);
      return;
    }
    setStep(s => s + 1);
  };

  const goBack = () => { scrollTop(); setStep(s => Math.max(0, s - 1)); };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    // Send to Web3Forms (same as contact page)
    try {
      const w3key = localStorage.getItem('asproite_web3key') || 'a7e6530d-9477-40ec-b325-1a8c1b77d24d';
      const answerSummary = QUESTIONS.map(q => {
        const ans = answers[q.id];
        if (!ans) return '';
        const vals = Array.isArray(ans) ? ans : [ans];
        const labels = vals.map(v => q.options.find(o => o.value === v)?.label || v).join(', ');
        return `${q.category}: ${labels}`;
      }).filter(Boolean).join('\n');

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: w3key,
          subject: `IT Health Check Completed — ${name || email} | Asproite`,
          from_name: name || 'IT Health Check',
          replyto: email,
          'Name': name || 'Not provided',
          'Email': email,
          'Overall Score': `${calcScores(answers).overall}/100`,
          'Answers': answerSummary,
          botcheck: '',
        }),
      });
    } catch(e) {}
    setSubmitting(false);
    setSubmitted(true);
    goNext();
  };

  return (
    <div ref={topRef} style={{ minHeight: '100vh', paddingTop: 80, background: C.bg, position: 'relative' }}>

      {/* ── INTRO ── */}
      {step === 0 && <IntroScreen onStart={() => { scrollTop(); setStep(1); }} />}

      {/* ── QUESTIONS ── */}
      {step >= 1 && step <= totalQ && (
        <QuestionScreen
          q={currentQ} step={step} total={totalQ}
          answers={answers} onSelect={selectOption}
          onNext={goNext} onBack={goBack} canNext={canNext()}
        />
      )}

      {/* ── EMAIL CAPTURE ── */}
      {step === totalQ + 1 && (
        <EmailScreen
          name={name} email={email}
          setName={setName} setEmail={setEmail}
          onSubmit={handleEmailSubmit} submitting={submitting}
          onBack={goBack}
        />
      )}

      {/* ── RESULTS ── */}
      {step === totalQ + 2 && scores && (
        <ResultsScreen scores={scores} recs={recs} answers={answers} name={name} onRestart={() => { setStep(0); setAnswers({}); setEmail(''); setName(''); setScores(null); }} />
      )}
    </div>
  );
}

/* ─── Intro Screen ──────────────────────────────────────────── */
function IntroScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '60px 24px 80px' }}>
      <div className="reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.cyanDim, border: `1px solid ${C.border}`, borderRadius: 100, padding: '6px 18px', marginBottom: 28 }}>
          <span style={{ color: C.cyan, fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Free Tool</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: C.cyan }} />
          <span style={{ color: C.muted, fontSize: '0.7rem', letterSpacing: 1 }}>Takes 3 minutes</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: C.text }}>
          IT Health Check<br /><em style={{ color: C.cyan }}>For Your Business</em>
        </h1>
        <p style={{ color: C.muted, fontSize: '1.05rem', lineHeight: 1.8, maxWidth: 560, margin: '0 auto 40px' }}>
          Answer 10 quick questions and get a personalised IT Health Score — plus a free report showing exactly where your business is at risk and how to fix it.
        </p>

        {/* 3 benefits */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          {[
            { icon: '⚡', text: 'Takes 3 minutes' },
            { icon: '🎯', text: 'Personalised to your business' },
            { icon: '🔓', text: '100% free, no obligation' },
          ].map(b => (
            <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 18px' }}>
              <span style={{ fontSize: '1.1rem' }}>{b.icon}</span>
              <span style={{ color: C.mutedLight, fontSize: '0.85rem' }}>{b.text}</span>
            </div>
          ))}
        </div>

        <button onClick={onStart} className="btn-primary" style={{ fontSize: '1rem', padding: '16px 48px', letterSpacing: 1 }}>
          Start My IT Health Check →
        </button>

        <p style={{ color: C.muted, fontSize: '0.78rem', marginTop: 16 }}>
          No credit card required · No spam · Your data stays private
        </p>
      </div>

      {/* What you'll get */}
      <div className="reveal" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '36px 40px' }}>
        <div style={{ fontSize: '0.7rem', color: C.cyan, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 24 }}>What You'll Receive</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {[
            { icon: '📊', title: 'IT Health Score', body: 'A score out of 100 across 5 key areas of your IT.' },
            { icon: '🔍', title: 'Risk Areas', body: 'We pinpoint exactly where your business is most vulnerable.' },
            { icon: '📋', title: 'Action Plan', body: 'Step-by-step priorities tailored to your size and budget.' },
            { icon: '💰', title: 'Cost Insights', body: 'Real savings estimates based on your current setup.' },
          ].map(w => (
            <div key={w.title}>
              <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{w.icon}</div>
              <div style={{ color: C.text, fontWeight: 700, fontSize: '0.9rem', marginBottom: 6 }}>{w.title}</div>
              <div style={{ color: C.muted, fontSize: '0.82rem', lineHeight: 1.6 }}>{w.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Question Screen ───────────────────────────────────────── */
function QuestionScreen({ q, step, total, answers, onSelect, onNext, onBack, canNext }) {
  const ans = answers[q.id] || (q.type === 'multi' ? [] : null);
  const progress = ((step - 1) / total) * 100;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* Progress */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: '0.72rem', color: C.cyan, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{q.category}</span>
          <span style={{ fontSize: '0.72rem', color: C.muted }}>{step} of {total}</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      {/* Question */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{q.icon}</div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 10 }}>{q.question}</h2>
        <p style={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.6 }}>{q.subtitle}</p>
        {q.type === 'multi' && <p style={{ color: C.cyan, fontSize: '0.78rem', marginTop: 8, letterSpacing: 1 }}>SELECT ALL THAT APPLY</p>}
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 40 }}>
        {q.options.map(opt => {
          const selected = q.type === 'multi' ? (ans || []).includes(opt.value) : ans === opt.value;
          return (
            <button key={opt.value}
              onClick={() => onSelect(q.id, opt.value, q.type === 'multi', opt.exclusive)}
              style={{
                textAlign: 'left', padding: '16px 20px', borderRadius: 10, cursor: 'pointer',
                background: selected ? C.cyanGlow : C.surface,
                border: `1.5px solid ${selected ? C.cyan : C.border}`,
                color: selected ? C.text : C.mutedLight,
                fontSize: '0.92rem', fontWeight: selected ? 600 : 400,
                transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: selected ? `0 0 0 1px ${C.cyan}33, 0 4px 20px rgba(0,212,255,0.12)` : 'none',
              }}
              onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.background = C.surface2; } }}
              onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface; } }}
            >
              <div style={{ width: 22, height: 22, borderRadius: q.type === 'multi' ? 5 : '50%', border: `2px solid ${selected ? C.cyan : C.muted}`, background: selected ? C.cyan : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                {selected && <span style={{ fontSize: q.type === 'multi' ? '0.75rem' : '0.6rem', color: '#000', fontWeight: 900 }}>{q.type === 'multi' ? '✓' : '●'}</span>}
              </div>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: 12 }}>
        {step > 1 && (
          <button onClick={onBack} className="btn-ghost" style={{ padding: '12px 24px', fontSize: '0.88rem' }}>← Back</button>
        )}
        <button onClick={onNext} disabled={!canNext} className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', padding: '14px 24px', fontSize: '0.95rem', opacity: canNext ? 1 : 0.4, cursor: canNext ? 'pointer' : 'not-allowed' }}>
          {step === total ? 'See My Results →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

/* ─── Email Screen ──────────────────────────────────────────── */
function EmailScreen({ name, email, setName, setEmail, onSubmit, submitting, onBack }) {
  const valid = email && email.includes('@') && email.includes('.');
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 24px 80px', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: C.text, marginBottom: 16 }}>
        Your results are <em style={{ color: C.cyan }}>ready!</em>
      </h2>
      <p style={{ color: C.muted, fontSize: '0.95rem', lineHeight: 1.7, marginBottom: 40 }}>
        Enter your details below to see your full IT Health Score and personalised report. We'll also send you a copy by email.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24, textAlign: 'left' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Your Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. James Mitchell"
            style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = C.cyan}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Work Email *</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email"
            placeholder="you@company.com"
            style={{ width: '100%', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '13px 16px', color: C.text, fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }}
            onFocus={e => e.target.style.borderColor = C.cyan}
            onBlur={e => e.target.style.borderColor = C.border}
            onKeyDown={e => { if (e.key === 'Enter' && valid) onSubmit(); }}
          />
        </div>
      </div>

      <button onClick={onSubmit} disabled={!valid || submitting} className="btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '15px', fontSize: '0.98rem', opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'not-allowed' }}>
        {submitting ? '⟳ Processing...' : 'View My IT Health Report →'}
      </button>

      <p style={{ color: C.muted, fontSize: '0.75rem', marginTop: 14, lineHeight: 1.6 }}>
        🔒 No spam, ever. We only use your email to send your report and occasional IT tips. Unsubscribe anytime.
      </p>

      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: '0.82rem', marginTop: 16 }}>← Go back</button>
    </div>
  );
}

/* ─── Results Screen ────────────────────────────────────────── */
function ResultsScreen({ scores, recs, answers, name, onRestart }) {
  const [animDone, setAnimDone] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimDone(true), 1600); return () => clearTimeout(t); }, []);

  const categories = [
    { key: 'support', label: 'IT Support', icon: '🛡️' },
    { key: 'security', label: 'Security', icon: '🔒' },
    { key: 'reliability', label: 'Reliability', icon: '⚡' },
    { key: 'cloud', label: 'Cloud Readiness', icon: '☁️' },
    { key: 'digital', label: 'Digital Maturity', icon: '🤖' },
  ];

  const { color: overallColor, label: overallLabel } = scoreLabel(scores.overall);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 100px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.successDim, border: '1px solid rgba(0,255,136,0.2)', borderRadius: 100, padding: '6px 18px', marginBottom: 24 }}>
          <span style={{ color: C.success, fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>Your IT Health Report</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: C.text, marginBottom: 12 }}>
          {name ? `${name.split(' ')[0]}'s ` : ''}IT Health Score
        </h1>
        <p style={{ color: C.muted, fontSize: '0.95rem' }}>Assessed {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Overall Score + Category Rings */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '40px 36px', marginBottom: 32, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 40, marginBottom: 36 }}>
          <div>
            <ScoreRing score={scores.overall} size={160} stroke={12} label="Overall" animated={true} />
            <div style={{ marginTop: 12, fontSize: '0.88rem', color: C.muted }}>
              Your business is in <strong style={{ color: overallColor }}>{overallLabel}</strong> IT health
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 240, textAlign: 'left' }}>
            <div style={{ fontSize: '0.7rem', color: C.cyan, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Breakdown by Category</div>
            {categories.map((cat, i) => (
              <div key={cat.key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{cat.icon}</span>
                    <span style={{ fontSize: '0.85rem', color: C.mutedLight }}>{cat.label}</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: scoreLabel(scores[cat.key]).color }}>{scores[cat.key]}/100</span>
                </div>
                <ProgressBar value={scores[cat.key]} color={scoreLabel(scores[cat.key]).color} animated={true} />
              </div>
            ))}
          </div>
        </div>

        {/* Score interpretation */}
        <div style={{ background: `${overallColor}11`, border: `1px solid ${overallColor}33`, borderRadius: 10, padding: '16px 24px' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: C.mutedLight, lineHeight: 1.7 }}>
            {scores.overall >= 80 && '🟢 Your IT setup is strong. You\'re well-protected and modern. Focus on maintaining and optimising what you have.'}
            {scores.overall >= 60 && scores.overall < 80 && '🟡 Your IT is functional but has some gaps that could expose you to risk or lost productivity. The recommendations below will help you close them.'}
            {scores.overall >= 40 && scores.overall < 60 && '🟠 Your IT has significant weaknesses that are likely costing your business money and productivity every day. We strongly recommend acting on the priorities below.'}
            {scores.overall < 40 && '🔴 Your IT health is at a critical level. Without action, you\'re at high risk of downtime, cyberattack, or compliance failure. Please review the urgent recommendations below immediately.'}
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {recs.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.7rem', color: C.cyan, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>
            Your Personalised Action Plan — {recs.length} Priority{recs.length > 1 ? 'ies' : 'y'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recs.map((rec, i) => {
              const uc = urgencyColor(rec.urgency);
              return (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px 28px', borderLeft: `3px solid ${uc}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{rec.icon}</div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: C.text, fontSize: '0.95rem' }}>{rec.service}</span>
                        <span style={{ background: `${uc}18`, color: uc, border: `1px solid ${uc}33`, borderRadius: 100, padding: '2px 10px', fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                          {rec.urgency === 'critical' ? '🚨 Critical' : rec.urgency === 'high' ? '⚠️ High Priority' : rec.urgency === 'medium' ? 'Medium Priority' : 'Recommended'}
                        </span>
                      </div>
                      <p style={{ margin: '0 0 8px', color: C.muted, fontSize: '0.85rem', lineHeight: 1.6 }}>{rec.why}</p>
                      <p style={{ margin: 0, color: C.success, fontSize: '0.82rem', fontWeight: 600 }}>💡 {rec.saving}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ background: `linear-gradient(135deg, ${C.surface} 0%, ${C.surface3} 100%)`, border: `1px solid ${C.border}`, borderRadius: 20, padding: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: C.cyanDim, filter: 'blur(40px)' }} />
        <div style={{ fontSize: '0.7rem', color: C.cyan, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, marginBottom: 16 }}>Next Step</div>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(1.3rem,3vw,1.9rem)', fontWeight: 900, color: C.text, marginBottom: 14 }}>
          Get a <em style={{ color: C.cyan }}>Free 30-Minute</em> IT Consultation
        </h3>
        <p style={{ color: C.muted, fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
          Our engineers will review your results with you, explain exactly what's needed, and give you a no-obligation quote. No jargon, no pressure.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary" style={{ padding: '14px 36px', fontSize: '0.95rem' }}>
            Book Free Consultation →
          </Link>
          <button onClick={onRestart} className="btn-ghost" style={{ padding: '14px 28px', fontSize: '0.88rem' }}>
            Retake Assessment
          </button>
        </div>
        <p style={{ color: C.muted, fontSize: '0.75rem', marginTop: 16 }}>
          Free · No obligation · 30 minutes · Remote or in-person
        </p>
      </div>
    </div>
  );
}
