import { useState, useEffect, useRef } from 'react';

/* ── Theme ──────────────────────────────────────────────────── */
const C = {
  bg:'#070b12', surface:'#0a0f1a', surface2:'#0e1525',
  border:'rgba(0,212,255,0.12)', borderHover:'rgba(0,212,255,0.3)',
  cyan:'#00d4ff', cyanDim:'rgba(0,212,255,0.08)',
  text:'#e2eaf5', muted:'#5a6a82', mutedLight:'#8899aa',
  success:'#00ff88',
};

/* ── Knowledge base — everything about Asproite ─────────────── */
const KB = [
  // Services
  { keys:['services','offer','provide','do you do','what do','help with'],
    answer:`We offer 9 services:\n\n• **Website Development** — bespoke, high-performance websites\n• **Software Solutions** — custom enterprise software & APIs\n• **Web Design** — UI/UX, branding & design systems\n• **IT Support** — 24/7 helpdesk & on-site support across the UK\n• **Cloud Services** — AWS, Azure & GCP migration & management\n• **Digital Marketing** — SEO, PPC & content strategy\n• **Mobile Apps** — iOS & Android (React Native & Flutter)\n• **AI Solutions** — custom ML, chatbots & automation\n• **Hardware Decommissioning** — certified data destruction & WEEE recycling\n\nWhich service interests you most?` },

  // IT Support
  { keys:['it support','helpdesk','help desk','support package','managed it','msp'],
    answer:`Our **IT Support** service includes:\n\n• 24/7 helpdesk & remote support\n• Proactive monitoring & alerts\n• On-site support across the UK\n• Patch management & security updates\n\n**Pricing:** from £150/month for small teams — exact pricing depends on team size and needs.\n\nWould you like a free 30-minute consultation to get an accurate quote?` },

  // Cloud
  { keys:['cloud','aws','azure','gcp','migrate','migration','office 365','microsoft 365'],
    answer:`Our **Cloud Services** cover:\n\n• Full cloud migration strategy & planning\n• AWS, Azure & Google Cloud setup & management\n• Managed cloud operations & cost optimisation\n• Disaster recovery & business continuity\n\n**Pricing:** from £2,000 for small setups — larger migrations quoted per project.\n\nCloud adoption typically reduces IT infrastructure costs by 30–40%. Want to find out how much you could save?` },

  // Website / web dev
  { keys:['website','web development','web dev','build a site','new website','redesign','wordpress','cms'],
    answer:`Our **Website Development** service delivers:\n\n• Custom-built, fast & responsive websites\n• CMS solutions (headless, WordPress, bespoke)\n• SEO-ready & performance optimised\n• Mobile-first design\n\n**Pricing:** from £1,500 for small business sites, £5,000–£20,000+ for custom builds.\n\nEvery website comes with a post-launch support period. Want to discuss your project?` },

  // Mobile app
  { keys:['mobile','app','ios','android','react native','flutter','smartphone'],
    answer:`Our **Mobile App Solutions** include:\n\n• Native iOS & Android development\n• Cross-platform apps (React Native & Flutter)\n• App Store & Google Play deployment\n• Ongoing maintenance & updates\n\n**Pricing:** from £5,000 for simple apps — complex apps quoted on scope.\n\nHappy to discuss your app idea in a free consultation!` },

  // AI / automation
  { keys:['ai','artificial intelligence','automation','chatbot','machine learning','ml','nlp'],
    answer:`Our **AI Solutions** service covers:\n\n• Custom machine learning model development\n• NLP, chatbots & virtual assistants\n• AI-driven process automation\n• Data analysis & predictive tools\n\nAI tools can save your team 8–12 hours per week. Want to explore what's possible for your business?` },

  // Hardware decommissioning
  { keys:['hardware','decommission','dispose','disposal','old computers','weee','data destruction','recycle it'],
    answer:`Our **Hardware Decommissioning** service includes:\n\n• Full IT asset inventory & audit\n• **Certified data destruction** (NIST & HMG standards)\n• WEEE-compliant responsible recycling\n• Full audit documentation for compliance\n\nThis is especially important for businesses handling sensitive data — healthcare, finance, legal.\n\nWant a quote for your hardware volume?` },

  // Digital marketing
  { keys:['marketing','seo','ppc','social media','google ads','content','digital marketing'],
    answer:`Our **Digital Marketing** service includes:\n\n• Technical SEO & search optimisation\n• PPC campaign management (Google & Meta)\n• Content strategy & social media management\n• Analytics & performance reporting\n\nOur clients typically see measurable results within 90 days. Want to discuss your goals?` },

  // Pricing / cost
  { keys:['price','pricing','cost','how much','charge','quote','budget','affordable'],
    answer:`Here's a rough guide to our pricing:\n\n• **IT Support:** from £150/month\n• **Website Development:** from £1,500\n• **Software / Apps:** from £5,000\n• **Cloud Migration:** from £2,000\n• **Hardware Decommissioning:** quoted per volume\n• **Digital Marketing:** from £500/month\n\nEvery project is different — we always offer a **free 30-minute consultation** to give you an accurate, no-obligation quote.\n\nWould you like to book one?` },

  // Timeline / how long
  { keys:['how long','timeline','turnaround','when can you','start','begin','timeframe','deadline'],
    answer:`We can typically **start within 1–2 weeks** of agreeing the scope.\n\nTimelines vary by project:\n• Simple websites: 2–4 weeks\n• Custom software: 6–16 weeks\n• Cloud migration: 4–12 weeks\n• IT support: can begin within days\n\nUrgent projects can often be fast-tracked — just let us know your deadline!` },

  // Location / where
  { keys:['where','location','office','london','uk','india','vadodara','based','local'],
    answer:`Asproite has offices in:\n\n• 🇬🇧 **London, UK** — Kingsland Road, E13 9PA\n• 🇮🇳 **Vadodara, India** — Gotri Road, 390001\n\nWe serve clients across the **whole of the UK** — both remotely and on-site. Our London team handles UK visits directly.` },

  // Contact / speak to someone
  { keys:['contact','speak','call','phone','email','human','person','talk','reach'],
    answer:`You can reach us directly:\n\n• 📧 **info@asproite.com**\n• 📧 **inquiry@asproite.com** (new enquiries)\n• 📞 **+44 (0)7555 185061**\n• 🌐 **asproite.com/#/contact**\n\nOr **[Book a free 30-minute consultation](#/contact)** — we'll call you at a time that suits you.` },

  // Small business
  { keys:['small business','startup','sole trader','freelance','sme','smb','small company'],
    answer:`Absolutely — we work with businesses of **all sizes**, from sole traders to enterprise.\n\nFor small businesses we offer:\n• Flexible, affordable IT support packages\n• Websites from £1,500\n• Free initial consultation to understand your needs\n• No long-term contracts required\n\nWhat are you looking to achieve?` },

  // Security / cyber
  { keys:['security','cyber','hacked','breach','compliance','gdpr','firewall','antivirus','protect'],
    answer:`Great question — cybersecurity is one of our core focuses.\n\n• **43% of cyberattacks target SMEs** — most are preventable\n• We offer endpoint protection, firewall setup & monitoring\n• Staff cybersecurity training\n• GDPR compliance support\n• Incident response if you've already been affected\n\nWant us to assess your current security posture? We offer a **free IT Health Check** at asproite.com/#/it-health-check` },

  // IT Health Check
  { keys:['health check','it audit','audit','score','assessment','health'],
    answer:`We have a **free IT Health Check** tool at:\n\n🔗 **asproite.com/#/it-health-check**\n\nIt takes 3 minutes and gives you:\n• An IT Health Score out of 100\n• Your biggest risk areas identified\n• A personalised action plan\n• Cost-saving estimates\n\nCompletely free, no obligation!` },

  // About Asproite
  { keys:['about','who are','company','asproite','experience','years','background','team'],
    answer:`**Asproite Cloud and Consultancy** is a UK-based IT managed service provider.\n\n• Based in London with an office in India\n• Serving organisations across the UK\n• Services span the full IT lifecycle — from web & software development to cloud, support & secure hardware disposal\n• Trusted by businesses in finance, healthcare, retail and more\n\nWant to know more about a specific service?` },

  // Thanks / goodbye
  { keys:['thank','thanks','cheers','brilliant','perfect','great','bye','goodbye'],
    answer:`You're very welcome! 😊\n\nIf you have any more questions, I'm here anytime. You can also reach the team directly at **info@asproite.com** or **+44 (0)7555 185061**.\n\nHave a great day! 🚀` },
];

/* ── Smart response engine ──────────────────────────────────── */
function getResponse(input) {
  const q = input.toLowerCase().trim();

  // Find best matching KB entry
  let bestMatch = null;
  let bestScore = 0;

  KB.forEach(entry => {
    let score = 0;
    entry.keys.forEach(k => {
      if (q.includes(k)) score += k.length; // longer matches score higher
    });
    if (score > bestScore) { bestScore = score; bestMatch = entry; }
  });

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  // Fallback — still helpful, not "contact team"
  return `That's a great question! I want to make sure I give you the right answer.\n\nCould you rephrase or be a bit more specific? Or feel free to ask about:\n\n• Our **services** (IT Support, Cloud, Web, Apps, AI...)\n• **Pricing** and timelines\n• **Getting started** or booking a consultation\n• Our **location** or contact details\n\nAlternatively, reach us at **info@asproite.com** or **+44 (0)7555 185061** — we usually respond within 2 hours.`;
}

/* ── Format text with **bold** and bullet points ────────────── */
function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4ff">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#00d4ff;text-decoration:underline">$1</a>')
    .replace(/\n•/g, '<br>•')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

/* ── Typing animation ───────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, padding:'10px 14px', background:C.surface2, borderRadius:'16px 16px 16px 4px', alignItems:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.cyan,
          animation:`aiai-bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Message bubble ─────────────────────────────────────────── */
function Bubble({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div style={{ display:'flex', justifyContent:isBot?'flex-start':'flex-end', marginBottom:10, alignItems:'flex-end', gap:8 }}>
      {isBot && (
        <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:11,
          fontWeight:900, color:'#000', flexShrink:0, fontFamily:'monospace', letterSpacing:-1 }}>AI</div>
      )}
      <div style={{
        maxWidth:'82%', padding:'10px 14px',
        borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        background: isBot ? C.surface2 : `linear-gradient(135deg,${C.cyan},#0099bb)`,
        color: isBot ? C.text : '#000',
        fontSize:13, lineHeight:1.65,
        boxShadow: isBot ? 'none' : `0 2px 12px rgba(0,212,255,0.25)`,
      }} dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────── */
export default function AsproiteAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Greeting on first open
  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setUnread(0);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ role:'bot', text:`Hi there! 👋 I'm **Asproite AI** — I know everything about our services, pricing, and how we can help your business.\n\nWhat can I help you with today?` }]);
      }, 700);
    }
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 150); }
  }, [open, started]);

  // Pulse badge after 10s if not opened
  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => { if (!open) setUnread(1); }, 10000);
      return () => clearTimeout(t);
    }
  }, [started, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userText = (text || input).trim();
    if (!userText || typing) return;
    setInput('');

    setMessages(prev => [...prev, { role:'user', text:userText }]);
    setTyping(true);

    // Simulate thinking delay (0.6–1.2s feels natural)
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      const reply = getResponse(userText);
      setTyping(false);
      setMessages(prev => [...prev, { role:'bot', text:reply }]);
    }, delay);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const SUGGESTIONS = [
    'What services do you offer?',
    'How much does IT support cost?',
    'How quickly can you start?',
    'Where are you based?',
  ];

  return (
    <>
      <style>{`
        @keyframes aiai-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes aiai-fadeup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aiai-pulse  { 0%,100%{box-shadow:0 4px 20px rgba(0,212,255,0.4)} 50%{box-shadow:0 6px 32px rgba(0,212,255,0.65)} }
        @keyframes aiai-ping   { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.4);opacity:0} }
        .aiai-input:focus { outline:none; border-color:${C.cyan} !important; }
        .aiai-send:hover  { background:#33ddff !important; }
        .aiai-close:hover { background:rgba(255,255,255,0.08) !important; }
        .aiai-chip:hover  { background:rgba(0,212,255,0.14) !important; border-color:${C.cyan} !important; color:${C.cyan} !important; }
        .aiai-msg-list::-webkit-scrollbar { width:4px; }
        .aiai-msg-list::-webkit-scrollbar-thumb { background:${C.surface2}; border-radius:4px; }
      `}</style>

      {/* Fixed bottom-LEFT position */}
      <div style={{ position:'fixed', bottom:28, right:28, zIndex:99990 }}>

        {/* ── Chat window ── */}
        {open && (
          <div style={{
            position:'absolute', bottom:72, right:0,
            width:340, height:500,
            background:C.surface,
            border:`1px solid ${C.border}`,
            borderRadius:20,
            display:'flex', flexDirection:'column',
            boxShadow:'0 24px 64px rgba(0,0,0,0.72), 0 0 0 1px rgba(0,212,255,0.06)',
            animation:'aiai-fadeup 0.22s ease',
            overflow:'hidden',
          }}>
            {/* Header */}
            <div style={{ background:'linear-gradient(135deg,#081020,#050c18)', padding:'13px 15px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#000', fontFamily:'monospace', letterSpacing:-1 }}>AI</div>
                <div style={{ position:'absolute', bottom:1, right:1, width:9, height:9, borderRadius:'50%', background:C.success, border:'2px solid #081020' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:C.text, fontWeight:700, fontSize:13 }}>Asproite AI</div>
                <div style={{ color:C.success, fontSize:11, display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:C.success }} />
                  Online · Always available
                </div>
              </div>
              <button className="aiai-close" onClick={() => setOpen(false)} style={{ background:'transparent', border:'none', color:C.muted, cursor:'pointer', padding:'5px 8px', borderRadius:6, fontSize:14, lineHeight:1, transition:'background 0.2s' }}>✕</button>
            </div>

            {/* Messages */}
            <div className="aiai-msg-list" style={{ flex:1, overflowY:'auto', padding:'13px 11px', display:'flex', flexDirection:'column' }}>
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {typing && (
                <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#000', fontFamily:'monospace', letterSpacing:-1, flexShrink:0 }}>AI</div>
                  <TypingDots />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions — only after greeting */}
            {messages.length === 1 && !typing && (
              <div style={{ padding:'0 10px 8px', display:'flex', flexWrap:'wrap', gap:5 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} className="aiai-chip" onClick={() => sendMessage(s)}
                    style={{ background:C.cyanDim, border:`1px solid ${C.border}`, color:C.mutedLight, borderRadius:100, padding:'5px 11px', fontSize:11, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap', fontFamily:'inherit' }}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'10px 11px', borderTop:`1px solid ${C.border}`, display:'flex', gap:8, background:C.bg }}>
              <input
                ref={inputRef}
                className="aiai-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about services, pricing, support..."
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'9px 13px', color:C.text, fontSize:13, transition:'border-color 0.2s', fontFamily:'inherit' }}
                disabled={typing}
              />
              <button className="aiai-send" onClick={() => sendMessage()}
                disabled={typing || !input.trim()}
                style={{ width:38, height:38, borderRadius:9, background:(!input.trim()||typing) ? C.surface2 : C.cyan, border:'none', cursor:(!input.trim()||typing)?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, transition:'background 0.18s', flexShrink:0, opacity:(!input.trim()||typing)?0.45:1 }}>➤</button>
            </div>

            <div style={{ textAlign:'center', padding:'5px 0 9px', fontSize:10, color:C.muted }}>
              Asproite Cloud & Consultancy · <span style={{ color:C.cyan }}>info@asproite.com</span>
            </div>
          </div>
        )}

        {/* ── Bubble button ── */}
        <div style={{ position:'relative' }}>
          {/* Tooltip — shown before first open */}
          {!started && !open && (
            <div style={{ position:'absolute', bottom:'115%', right:0, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'8px 14px', whiteSpace:'nowrap', fontSize:12, color:C.text, boxShadow:'0 8px 24px rgba(0,0,0,0.45)', pointerEvents:'none', animation:'aiai-fadeup 0.3s ease 1s both' }}>
              <span style={{ color:C.cyan, fontWeight:700 }}>Ask Asproite AI</span> — instant answers ✨
              <div style={{ position:'absolute', bottom:-5, right:18, width:10, height:10, background:C.surface, borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, transform:'rotate(45deg)' }} />
            </div>
          )}

          <button
            onClick={() => setOpen(o => !o)}
            style={{
              width:54, height:54, borderRadius:'50%',
              background: open ? C.surface2 : `linear-gradient(135deg,${C.cyan},#0088bb)`,
              border:`2px solid ${open ? C.border : 'transparent'}`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: open ? 'none' : `0 4px 24px rgba(0,212,255,0.45)`,
              transition:'all 0.25s',
              animation: open ? 'none' : 'aiai-pulse 3s ease-in-out infinite',
              fontWeight:900, fontSize:open?14:18, color:open?C.cyan:'#000',
              fontFamily:'monospace', letterSpacing:-1,
            }}>
            {open ? '✕' : 'AI'}
          </button>

          {!open && unread > 0 && (
            <div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:'#ff4757', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.bg}` }}>
              1
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#ff4757', animation:'aiai-ping 1.8s ease-out infinite' }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
