import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/index.js';
import { useSiteData } from '../data/SiteDataContext.jsx';

// ─── Theme ────────────────────────────────────────────────────
const C = {
  bg:'#070b12', surface:'#0a0f1a', surface2:'#0e1525',
  border:'rgba(0,212,255,0.12)', borderHover:'rgba(0,212,255,0.3)',
  cyan:'#00d4ff', cyanDim:'rgba(0,212,255,0.08)',
  text:'#e2eaf5', muted:'#5a6a82',
  success:'#00ff88', warning:'#f4b942', danger:'#ff4757',
};

// ─── Questions ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1, category: 'reliability',
    icon: '⚡',
    question: 'How often does your business experience IT downtime or technical issues?',
    options: [
      { label: 'Daily or multiple times a week',   score: 1 },
      { label: 'A few times a month',              score: 2 },
      { label: 'Occasionally — a few times a year',score: 3 },
      { label: 'Rarely or never',                  score: 4 },
    ],
  },
  {
    id: 2, category: 'reliability',
    icon: '🛠️',
    question: 'When an IT issue occurs, how quickly is it typically resolved?',
    options: [
      { label: 'Days to weeks — very slow',        score: 1 },
      { label: '24–48 hours',                      score: 2 },
      { label: 'Same day',                         score: 3 },
      { label: 'Within hours — proactively managed',score: 4 },
    ],
  },
  {
    id: 3, category: 'security',
    icon: '🔒',
    question: 'How would you describe your current cybersecurity posture?',
    options: [
      { label: 'No formal security measures in place',     score: 1 },
      { label: 'Basic antivirus and firewall only',        score: 2 },
      { label: 'Policies exist but inconsistently applied',score: 3 },
      { label: 'Comprehensive security with regular audits',score: 4 },
    ],
  },
  {
    id: 4, category: 'security',
    icon: '💾',
    question: 'How is your critical business data backed up?',
    options: [
      { label: 'We have no formal backup strategy',             score: 1 },
      { label: 'Local backups only — no offsite copy',          score: 2 },
      { label: 'Cloud backups in place but never tested',       score: 3 },
      { label: 'Regular tested cloud + offsite backups',        score: 4 },
    ],
  },
  {
    id: 5, category: 'infrastructure',
    icon: '🖥️',
    question: 'How old is most of your IT hardware (computers, servers, networking)?',
    options: [
      { label: '5+ years old — significantly outdated',  score: 1 },
      { label: '3–5 years old',                          score: 2 },
      { label: '1–3 years old',                          score: 3 },
      { label: 'Less than 1 year — recently refreshed',  score: 4 },
    ],
  },
  {
    id: 6, category: 'infrastructure',
    icon: '☁️',
    question: 'How much of your business infrastructure is cloud-based?',
    options: [
      { label: 'None — everything is on-premise',             score: 1 },
      { label: 'Some cloud (email, storage) — mostly on-prem',score: 2 },
      { label: 'Hybrid — mix of cloud and on-premise',        score: 3 },
      { label: 'Mostly or fully cloud-based',                 score: 4 },
    ],
  },
  {
    id: 7, category: 'strategy',
    icon: '🔄',
    question: 'Does your business have a disaster recovery / business continuity plan?',
    options: [
      { label: 'No plan at all',                               score: 1 },
      { label: "We've discussed it but nothing is documented", score: 2 },
      { label: 'We have a plan but it is rarely tested',       score: 3 },
      { label: 'Tested, documented DR plan reviewed annually', score: 4 },
    ],
  },
  {
    id: 8, category: 'strategy',
    icon: '📊',
    question: 'How satisfied are you with the value from your current IT investment?',
    options: [
      { label: 'Very unsatisfied — overpaying for poor service',score: 1 },
      { label: 'Somewhat unsatisfied',                          score: 2 },
      { label: 'Neutral — it works but could be better',        score: 3 },
      { label: 'Very satisfied — great value and performance',   score: 4 },
    ],
  },
];

// ─── Score bands ──────────────────────────────────────────────
const BANDS = [
  {
    min:0, max:39,
    label:'Critical Risk', emoji:'🔴', color:'#ff4757',
    headline:'Your IT infrastructure has critical vulnerabilities that could seriously impact your business.',
    summary:'Multiple urgent issues need addressing immediately. You are at high risk of downtime, data loss, and security breaches.',
  },
  {
    min:40, max:59,
    label:'Needs Attention', emoji:'🟡', color:'#f4b942',
    headline:'Your IT setup has several areas that need prompt attention to avoid future problems.',
    summary:'There are meaningful gaps in your IT health. Addressing these now will prevent costly issues later.',
  },
  {
    min:60, max:79,
    label:'Good Foundation', emoji:'🟢', color:'#00d4ff',
    headline:'You have a solid IT foundation — but there are clear opportunities to optimise and strengthen it.',
    summary:'You are doing well in several areas. Targeted improvements will bring you to best-in-class.',
  },
  {
    min:80, max:100,
    label:'Excellent', emoji:'⭐', color:'#00ff88',
    headline:'Your IT infrastructure is well managed. Your business is in a strong position.',
    summary:'You are operating at a high standard. Focus on staying ahead with emerging technology and proactive optimisation.',
  },
];

// ─── Category recommendations ─────────────────────────────────
const CATEGORY_INFO = {
  reliability: {
    label:'Reliability & Support',
    icon:'⚡',
    goodMsg:'Your IT support response is strong.',
    badMsg:'Your IT reliability and support response need urgent improvement.',
    services:['IT Support','Software Solutions'],
  },
  security: {
    label:'Security & Data Protection',
    icon:'🔒',
    goodMsg:'Your security posture is solid.',
    badMsg:'Your business has significant security and data protection gaps.',
    services:['IT Support','Cloud Services'],
  },
  infrastructure: {
    label:'Infrastructure & Cloud',
    icon:'☁️',
    goodMsg:'Your infrastructure and cloud adoption is well managed.',
    badMsg:'Your infrastructure is outdated or under-utilising cloud capabilities.',
    services:['Cloud Services','Hardware Decommissioning'],
  },
  strategy: {
    label:'IT Strategy & Planning',
    icon:'📊',
    goodMsg:'Your IT strategy and planning is well structured.',
    badMsg:'Your disaster recovery and IT investment strategy need attention.',
    services:['AI Solutions','Software Solutions'],
  },
};

// ─── Web3Forms key ─────────────────────────────────────────────
const WEB3_FALLBACK = 'a7e6530d-9477-40ec-b325-1a8c1b77d24d';
function getW3Key(data) {
  return (data?.web3formsKey && data.web3formsKey !== '') ? data.web3formsKey : WEB3_FALLBACK;
}

// ─── Score Dial ───────────────────────────────────────────────
function ScoreDial({ score, color }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  const r = 70, cx = 90, cy = 90;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.75; // 270° arc
  const filled = arc * (animated / 100);
  const rotation = -225; // start from bottom-left

  return (
    <div style={{ position:'relative', width:180, height:180, margin:'0 auto' }}>
      <svg width="180" height="180" style={{ transform:'rotate(0deg)' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surface2} strokeWidth="10"
          strokeDasharray={`${arc} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{ transform:`rotate(${rotation}deg)`, transformOrigin:'50% 50%' }}
        />
        {/* Progress */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset="0"
          strokeLinecap="round"
          style={{ transform:`rotate(${rotation}deg)`, transformOrigin:'50% 50%', transition:'stroke-dasharray 0.05s', filter:`drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'2.4rem', fontWeight:900, color }}>{animated}</div>
        <div style={{ fontSize:'0.65rem', letterSpacing:'0.15em', color:C.muted, textTransform:'uppercase' }}>/ 100</div>
      </div>
    </div>
  );
}

// ─── Category Bar ─────────────────────────────────────────────
function CategoryBar({ label, icon, score, maxScore, color }) {
  const pct = Math.round((score / maxScore) * 100);
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(pct), 300); }, [pct]);
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.82rem', color:C.text }}>
          <span>{icon}</span><span>{label}</span>
        </div>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color }}>{pct}%</span>
      </div>
      <div style={{ background:C.surface2, borderRadius:100, height:6, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${width}%`, background:`linear-gradient(90deg,${color},${color}88)`, borderRadius:100, transition:'width 1s cubic-bezier(0.4,0,0.2,1)', boxShadow:`0 0 8px ${color}66` }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────
export default function ITHealthCheck() {
  const { data } = useSiteData();
  useScrollReveal();

  const [phase, setPhase]       = useState('intro');    // intro | quiz | email | results
  const [current, setCurrent]   = useState(0);
  const [answers, setAnswers]   = useState({});          // { qId: optionIndex }
  const [selected, setSelected] = useState(null);
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [company, setCompany]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');
  const topRef = useRef(null);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior:'smooth' });

  // ── Compute scores ──
  const totalScore = (() => {
    const maxRaw = QUESTIONS.length * 4;
    const raw = Object.values(answers).reduce((s, a) => s + a, 0);
    return Math.round((raw / maxRaw) * 100);
  })();

  const categoryScores = (() => {
    const cats = {};
    QUESTIONS.forEach(q => {
      if (!cats[q.category]) cats[q.category] = { score:0, max:0 };
      cats[q.category].max += 4;
      cats[q.category].score += (answers[q.id] || 0);
    });
    return cats;
  })();

  const band = BANDS.find(b => totalScore >= b.min && totalScore <= b.max) || BANDS[0];

  // ── Navigation ──
  const handleAnswer = (score) => {
    setSelected(score);
    setTimeout(() => {
      setAnswers(prev => ({ ...prev, [QUESTIONS[current].id]: score }));
      setSelected(null);
      if (current < QUESTIONS.length - 1) {
        setCurrent(c => c + 1);
        scrollTop();
      } else {
        setPhase('email');
        scrollTop();
      }
    }, 320);
  };

  const handleBack = () => {
    if (current === 0) { setPhase('intro'); return; }
    setCurrent(c => c - 1);
    scrollTop();
  };

  const handleEmailSubmit = async () => {
    if (!name.trim()) { setEmailError('Please enter your name.'); return; }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Please enter a valid email address.'); return; }
    setEmailError('');
    setSubmitting(true);

    const categoryLines = Object.entries(categoryScores).map(([cat, s]) => {
      const info = CATEGORY_INFO[cat];
      const pct = Math.round((s.score / s.max) * 100);
      return `${info.label}: ${pct}%`;
    }).join('\n');

    const answerLines = QUESTIONS.map(q => {
      const optIdx = q.options.findIndex(o => o.score === answers[q.id]);
      return `Q${q.id}: ${q.question}\nAnswer: ${q.options[optIdx]?.label || 'N/A'}`;
    }).join('\n\n');

    try {
      await fetch('https://api.web3forms.com/submit', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept':'application/json' },
        body: JSON.stringify({
          access_key: getW3Key(data),
          subject: `IT Health Check Lead — ${name}${company ? ' ('+company+')' : ''} | Score: ${totalScore}/100`,
          from_name: name,
          replyto: email,
          'Name': name,
          'Email': email,
          'Company': company || 'Not provided',
          'IT Health Score': `${totalScore}/100 — ${band.label}`,
          'Category Scores': categoryLines,
          'Full Answers': answerLines,
          botcheck: '',
        }),
      });
    } catch(e) { /* still show results */ }

    setSubmitting(false);
    setPhase('results');
    scrollTop();
  };

  const restart = () => {
    setPhase('intro'); setCurrent(0); setAnswers({});
    setSelected(null); setName(''); setEmail(''); setCompany('');
    scrollTop();
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse2 { 0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,0.3)} 50%{box-shadow:0 0 0 12px rgba(0,212,255,0)} }
        .hc-option {
          width:100%; text-align:left; background:${C.surface}; border:1px solid ${C.border};
          border-radius:12px; padding:16px 20px; color:${C.text}; cursor:pointer;
          font-size:0.9rem; line-height:1.5; transition:all 0.2s; display:flex; align-items:center; gap:14px;
        }
        .hc-option:hover { border-color:${C.cyan}; background:${C.cyanDim}; transform:translateX(4px); }
        .hc-option.selected { border-color:${C.cyan}; background:${C.cyanDim}; color:${C.cyan}; }
        .hc-input { width:100%; background:${C.surface2}; border:1px solid ${C.border}; border-radius:10px;
          padding:13px 16px; color:${C.text}; font-size:0.9rem; font-family:inherit; box-sizing:border-box; transition:border-color 0.2s; }
        .hc-input:focus { outline:none; border-color:${C.cyan}; }
        .hc-service-tag { display:inline-block; background:${C.cyanDim}; color:${C.cyan};
          border:1px solid rgba(0,212,255,0.25); border-radius:20px; padding:4px 14px; font-size:0.75rem;
          font-weight:600; letter-spacing:0.05em; margin:3px; }
        @media(max-width:600px) {
          .hc-card { padding:24px 18px !important; }
          .hc-results-grid { flex-direction:column !important; }
        }
      `}</style>

      <div ref={topRef} />

      {/* ── Page Header ── */}
      <div style={{ background:`linear-gradient(135deg,${C.bg} 0%,#0a1222 100%)`, padding:'120px 0 60px', textAlign:'center', borderBottom:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:`radial-gradient(circle at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)` }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:C.cyanDim, border:`1px solid ${C.border}`, borderRadius:100, padding:'5px 16px', fontSize:'0.68rem', letterSpacing:'0.15em', textTransform:'uppercase', color:C.cyan, marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.cyan, display:'inline-block', animation:'pulse2 2s infinite' }} />
            Free Assessment Tool
          </div>
          <h1 style={{ fontFamily:'var(--font-head)', fontSize:'clamp(2rem,4vw,3.2rem)', fontWeight:800, marginBottom:16, letterSpacing:'-0.02em' }}>
            IT Health <em style={{ color:C.cyan }}>Check</em>
          </h1>
          <p style={{ color:C.muted, fontSize:'1rem', maxWidth:520, margin:'0 auto', lineHeight:1.75 }}>
            8 questions · 3 minutes · Free personalised IT score report for your business
          </p>
        </div>
      </div>

      <div style={{ padding:'60px 0 100px', minHeight:'60vh' }}>
        <div className="container" style={{ maxWidth:680, margin:'0 auto', padding:'0 24px' }}>

          {/* ════════════════════════════════════════ INTRO */}
          {phase === 'intro' && (
            <div style={{ animation:'fadeUp 0.5s ease' }}>
              <div className="hc-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'40px 44px', marginBottom:24 }}>
                <div style={{ fontSize:'2.8rem', marginBottom:20, textAlign:'center' }}>🩺</div>
                <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.5rem', fontWeight:700, marginBottom:16, textAlign:'center' }}>
                  How healthy is your business IT?
                </h2>
                <p style={{ color:C.muted, lineHeight:1.8, marginBottom:24, textAlign:'center', fontSize:'0.93rem' }}>
                  Answer 8 quick questions about your current IT setup. We'll instantly generate a personalised IT Health Score with a breakdown of your strengths, vulnerabilities, and exactly which actions will have the biggest impact on your business.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:32 }}>
                  {[
                    { icon:'⚡', label:'Reliability & Support' },
                    { icon:'🔒', label:'Security & Data' },
                    { icon:'☁️', label:'Infrastructure & Cloud' },
                    { icon:'📊', label:'IT Strategy' },
                  ].map(item => (
                    <div key={item.label} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, fontSize:'0.82rem', color:C.muted }}>
                      <span style={{ fontSize:'1.1rem' }}>{item.icon}</span>{item.label}
                    </div>
                  ))}
                </div>
                <button onClick={() => { setPhase('quiz'); scrollTop(); }}
                  style={{ width:'100%', background:`linear-gradient(135deg,${C.cyan},#0099cc)`, color:'#000', border:'none', borderRadius:12, padding:'16px', fontSize:'1rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.03em', transition:'opacity 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.opacity='0.88'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                  Start Free Assessment →
                </button>
              </div>
              <div style={{ display:'flex', justifyContent:'center', gap:28, flexWrap:'wrap' }}>
                {['✅ 100% Free','⏱️ 3 Minutes','🔒 No spam — ever','📊 Instant results'].map(t => (
                  <span key={t} style={{ fontSize:'0.78rem', color:C.muted }}>{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════ QUIZ */}
          {phase === 'quiz' && (
            <div style={{ animation:'fadeUp 0.35s ease' }}>
              {/* Progress */}
              <div style={{ marginBottom:32 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontSize:'0.75rem', color:C.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>Question {current + 1} of {QUESTIONS.length}</span>
                  <span style={{ fontSize:'0.75rem', color:C.cyan, fontWeight:700 }}>{Math.round(((current)/QUESTIONS.length)*100)}% complete</span>
                </div>
                <div style={{ background:C.surface2, borderRadius:100, height:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${((current)/QUESTIONS.length)*100}%`, background:`linear-gradient(90deg,${C.cyan},#0099cc)`, borderRadius:100, transition:'width 0.4s ease', boxShadow:`0 0 8px ${C.cyan}66` }} />
                </div>
              </div>

              {/* Category badge */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
                <span style={{ fontSize:'1.2rem' }}>{QUESTIONS[current].icon}</span>
                <span style={{ fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', color:C.cyan }}>
                  {CATEGORY_INFO[QUESTIONS[current].category].label}
                </span>
              </div>

              {/* Question */}
              <div className="hc-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'36px 40px' }}>
                <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.18rem', fontWeight:700, lineHeight:1.45, marginBottom:28, color:C.text }}>
                  {QUESTIONS[current].question}
                </h3>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {QUESTIONS[current].options.map((opt, i) => (
                    <button key={i} className={`hc-option${selected===opt.score?' selected':''}`}
                      onClick={() => handleAnswer(opt.score)} disabled={selected!==null}>
                      <div style={{ width:28, height:28, borderRadius:'50%', border:`1.5px solid ${selected===opt.score?C.cyan:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.75rem', color:selected===opt.score?C.cyan:C.muted, transition:'all 0.2s' }}>
                        {String.fromCharCode(65+i)}
                      </div>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <button onClick={handleBack} style={{ background:'transparent', border:`1px solid ${C.border}`, color:C.muted, borderRadius:8, padding:'9px 18px', cursor:'pointer', fontSize:'0.82rem', transition:'all 0.2s' }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan;}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
                  ← Back
                </button>
                <span style={{ fontSize:'0.75rem', color:C.muted }}>Click an answer to continue</span>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════ EMAIL CAPTURE */}
          {phase === 'email' && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              <div className="hc-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'40px 44px' }}>
                <div style={{ textAlign:'center', marginBottom:32 }}>
                  <div style={{ fontSize:'2.8rem', marginBottom:12 }}>🎯</div>
                  <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.4rem', fontWeight:700, marginBottom:10 }}>
                    Your report is ready!
                  </h2>
                  <p style={{ color:C.muted, fontSize:'0.88rem', lineHeight:1.7 }}>
                    Enter your details to reveal your IT Health Score and personalised recommendations. We'll also send a copy to your inbox.
                  </p>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <label style={{ fontSize:'0.75rem', color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Your Name *</label>
                    <input className="hc-input" type="text" placeholder="e.g. James Mitchell" value={name} onChange={e=>setName(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.75rem', color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Work Email *</label>
                    <input className="hc-input" type="email" placeholder="e.g. james@yourcompany.com" value={email} onChange={e=>setEmail(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize:'0.75rem', color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:6 }}>Company Name <span style={{color:C.muted,fontWeight:400}}>(optional)</span></label>
                    <input className="hc-input" type="text" placeholder="e.g. Acme Ltd" value={company} onChange={e=>setCompany(e.target.value)} />
                  </div>
                  {emailError && <p style={{ color:C.danger, fontSize:'0.8rem', margin:'0' }}>{emailError}</p>}

                  <button onClick={handleEmailSubmit} disabled={submitting}
                    style={{ width:'100%', background:`linear-gradient(135deg,${C.cyan},#0099cc)`, color:'#000', border:'none', borderRadius:12, padding:'16px', fontSize:'1rem', fontWeight:700, cursor:submitting?'wait':'pointer', marginTop:8, transition:'opacity 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.88'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    {submitting ? '⟳ Sending...' : 'Reveal My IT Health Score →'}
                  </button>

                  <p style={{ fontSize:'0.72rem', color:C.muted, textAlign:'center', margin:'4px 0 0' }}>
                    🔒 No spam. Your data is used only to send your report and for Asproite to follow up if you'd like.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════ RESULTS */}
          {phase === 'results' && (
            <div style={{ animation:'fadeUp 0.5s ease' }}>

              {/* Score card */}
              <div className="hc-card" style={{ background:C.surface, border:`2px solid ${band.color}33`, borderRadius:20, padding:'40px 44px', marginBottom:24, textAlign:'center', boxShadow:`0 0 40px ${band.color}12` }}>
                <div style={{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:band.color, marginBottom:16 }}>
                  {band.emoji} IT Health Score — {band.label}
                </div>
                <ScoreDial score={totalScore} color={band.color} />
                <h2 style={{ fontFamily:'var(--font-head)', fontSize:'1.25rem', fontWeight:700, margin:'24px 0 10px', lineHeight:1.4 }}>
                  {band.headline}
                </h2>
                <p style={{ color:C.muted, fontSize:'0.88rem', lineHeight:1.75, maxWidth:460, margin:'0 auto' }}>
                  {band.summary}
                </p>
              </div>

              {/* Category breakdown */}
              <div className="hc-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'32px 40px', marginBottom:24 }}>
                <div style={{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:C.cyan, marginBottom:20 }}>
                  Category Breakdown
                </div>
                {Object.entries(categoryScores).map(([cat, s]) => {
                  const info = CATEGORY_INFO[cat];
                  const pct = Math.round((s.score / s.max) * 100);
                  const col = pct >= 75 ? C.success : pct >= 50 ? C.cyan : pct >= 30 ? C.warning : C.danger;
                  return (
                    <CategoryBar key={cat} label={info.label} icon={info.icon}
                      score={s.score} maxScore={s.max} color={col} />
                  );
                })}
              </div>

              {/* Recommendations */}
              <div className="hc-card" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, padding:'32px 40px', marginBottom:24 }}>
                <div style={{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase', color:C.cyan, marginBottom:20 }}>
                  Personalised Recommendations
                </div>
                {Object.entries(categoryScores).map(([cat, s]) => {
                  const info = CATEGORY_INFO[cat];
                  const pct = Math.round((s.score / s.max) * 100);
                  const isWeak = pct < 75;
                  return (
                    <div key={cat} style={{ marginBottom:18, padding:16, background:C.surface2, borderRadius:12, border:`1px solid ${isWeak ? 'rgba(244,185,66,0.2)' : 'rgba(0,255,136,0.15)'}` }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                        <span>{info.icon}</span>
                        <span style={{ fontWeight:600, fontSize:'0.85rem' }}>{info.label}</span>
                        <span style={{ marginLeft:'auto', fontSize:'0.7rem', color: isWeak ? C.warning : C.success, fontWeight:700 }}>
                          {isWeak ? '⚠ Needs Work' : '✓ Good'}
                        </span>
                      </div>
                      <p style={{ color:C.muted, fontSize:'0.82rem', lineHeight:1.65, margin:'0 0 10px' }}>
                        {isWeak ? info.badMsg : info.goodMsg}
                      </p>
                      {isWeak && (
                        <div>
                          <span style={{ fontSize:'0.7rem', color:C.muted, marginRight:6 }}>Relevant services:</span>
                          {info.services.map(s => <span key={s} className="hc-service-tag">{s}</span>)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div style={{ background:`linear-gradient(135deg,#0a1628,#061020)`, border:`1px solid ${C.border}`, borderRadius:20, padding:'36px 40px', textAlign:'center' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:12 }}>🚀</div>
                <h3 style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', fontWeight:700, marginBottom:10 }}>
                  {totalScore < 60 ? 'Let Asproite fix these issues — free consultation' : 'Ready to take your IT to the next level?'}
                </h3>
                <p style={{ color:C.muted, fontSize:'0.85rem', lineHeight:1.7, marginBottom:24, maxWidth:400, margin:'0 auto 24px' }}>
                  Our experts will review your results and put together a tailored IT improvement plan — no obligation.
                </p>
                <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                  <Link to="/contact" className="btn-primary">Book Free Consultation →</Link>
                  <button onClick={restart} style={{ background:'transparent', border:`1px solid ${C.border}`, color:C.muted, borderRadius:6, padding:'12px 24px', cursor:'pointer', fontSize:'0.88rem', transition:'all 0.2s' }}
                    onMouseOver={e=>{e.currentTarget.style.borderColor=C.cyan;e.currentTarget.style.color=C.cyan;}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.muted;}}>
                    Retake Assessment
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
