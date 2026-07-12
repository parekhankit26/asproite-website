import { useState, useEffect, useRef } from 'react';

/* ── Theme matches site exactly ─────────────────────────────── */
const C = {
  bg:'#070b12', surface:'#0a0f1a', surface2:'#0e1525', surface3:'#121b2e',
  border:'rgba(0,212,255,0.12)', borderHover:'rgba(0,212,255,0.3)',
  cyan:'#00d4ff', cyanDim:'rgba(0,212,255,0.08)', cyanGlow:'rgba(0,212,255,0.15)',
  text:'#e2eaf5', muted:'#5a6a82', mutedLight:'#8899aa',
  success:'#00ff88',
};

/* ── Typing dots animation ──────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, padding:'10px 14px', background:C.surface2, borderRadius:'16px 16px 16px 4px', width:'fit-content', alignItems:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.cyan,
          animation:`aiai-bounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Single message bubble ──────────────────────────────────── */
function Bubble({ msg }) {
  const isBot = msg.role === 'assistant';
  // Convert **bold** and bullet points
  const formatted = msg.content
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#00d4ff">$1</strong>')
    .replace(/^[•\-]\s(.+)/gm, '<span style="display:block;padding-left:12px;position:relative"><span style="position:absolute;left:0;color:#00d4ff">•</span>$1</span>');

  return (
    <div style={{ display:'flex', justifyContent:isBot?'flex-start':'flex-end', marginBottom:10, alignItems:'flex-end', gap:8 }}>
      {isBot && (
        <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900,
          color:'#000', flexShrink:0, fontFamily:'monospace', letterSpacing:-1 }}>AI</div>
      )}
      <div style={{
        maxWidth:'80%', padding:'10px 14px',
        borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        background: isBot ? C.surface2 : `linear-gradient(135deg,${C.cyan},#0099bb)`,
        color: isBot ? C.text : '#000',
        fontSize:13, lineHeight:1.6,
        boxShadow: isBot ? 'none' : `0 2px 12px rgba(0,212,255,0.25)`,
      }} dangerouslySetInnerHTML={{ __html: formatted }} />
    </div>
  );
}

/* ── Main widget ────────────────────────────────────────────── */
export default function AsproiteAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Greeting on first open
  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setUnread(0);
      setTimeout(() => {
        setMessages([{
          role:'assistant',
          content:`Hi there! 👋 I'm Asproite AI — I know everything about our services, pricing, and how we can help your business.\n\nWhat can I help you with today?`
        }]);
      }, 600);
    }
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, started]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  // Pulse unread badge after 8s if not opened
  useEffect(() => {
    if (!started) {
      const t = setTimeout(() => { if (!open) setUnread(1); }, 8000);
      return () => clearTimeout(t);
    }
  }, [started, open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput('');

    const newMessages = [...messages, { role:'user', content:userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/site-api/ai-chat', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-10) }), // keep last 10 for context
      });

      if (res.status === 503) {
        setMessages(prev => [...prev, {
          role:'assistant',
          content:`I'm not fully configured yet — but our team is happy to help directly!\n\n📧 **info@asproite.com**\n📞 **+44 (0)7555185061**\n\nOr visit our [Contact page](/contact) to send a message.`
        }]);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const result = await res.json();

      setMessages(prev => [...prev, { role:'assistant', content:result.reply }]);
    } catch(err) {
      setMessages(prev => [...prev, {
        role:'assistant',
        content:`Sorry, I'm having a technical issue right now. Please reach out to us directly:\n\n📧 **info@asproite.com**\n📞 **+44 (0)7555185061**`
      }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const SUGGESTIONS = [
    'What services do you offer?',
    'How much does IT support cost?',
    'Can you migrate us to cloud?',
    'How quickly can you start?',
  ];

  return (
    <>
      <style>{`
        @keyframes aiai-bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes aiai-fadeup { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aiai-pulse { 0%,100%{transform:scale(1);box-shadow:0 4px 20px rgba(0,212,255,0.4)} 50%{transform:scale(1.06);box-shadow:0 6px 28px rgba(0,212,255,0.6)} }
        @keyframes aiai-ping { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.4);opacity:0} }
        .aiai-input:focus { outline:none; border-color:${C.cyan} !important; }
        .aiai-send:hover { background:#33ddff !important; }
        .aiai-close:hover { background:rgba(255,255,255,0.08) !important; }
        .aiai-suggest:hover { background:rgba(0,212,255,0.12) !important; border-color:${C.cyan} !important; color:${C.cyan} !important; }
        .aiai-bubble-btn:hover { transform:scale(1.08) !important; }
        @media (max-width: 480px) {
          .aiai-input { font-size:16px !important; }
        }
      `}</style>

      <div style={{ position:'fixed', bottom:'max(20px, calc(env(safe-area-inset-bottom) + 16px))', right:'max(20px, calc(env(safe-area-inset-right) + 16px))', zIndex:99990 }}>

        {/* ── Chat window ── */}
        {open && (
          <div style={{
            position:'absolute', bottom:72, right:0,
            width:'min(340px, calc(100vw - 40px))', height:'min(500px, calc(100vh - 160px))',
            maxWidth:340, maxHeight:560,
            background:C.surface,
            border:`1px solid ${C.border}`,
            borderRadius:20,
            display:'flex', flexDirection:'column',
            boxShadow:'0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,212,255,0.06)',
            animation:'aiai-fadeup 0.22s ease',
            overflow:'hidden',
          }}>

            {/* Header */}
            <div style={{ background:'linear-gradient(135deg,#081020,#050c18)', padding:'14px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#000', fontFamily:'monospace', letterSpacing:-1 }}>AI</div>
                <div style={{ position:'absolute', bottom:1, right:1, width:9, height:9, borderRadius:'50%', background:C.success, border:'2px solid #081020' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ color:C.text, fontWeight:700, fontSize:13, letterSpacing:0.3 }}>Asproite AI</div>
                <div style={{ color:C.success, fontSize:11, display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:C.success }} />
                  Online · Powered by Claude AI
                </div>
              </div>
              <button className="aiai-close" onClick={() => setOpen(false)} style={{ background:'transparent', border:'none', color:C.muted, cursor:'pointer', padding:'5px 8px', borderRadius:6, fontSize:14, lineHeight:1, transition:'background 0.2s' }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', scrollbarWidth:'thin', scrollbarColor:`${C.surface2} transparent` }}>
              {messages.length === 0 && !loading && (
                <div style={{ textAlign:'center', color:C.muted, fontSize:12, marginTop:24 }}>
                  <div style={{ fontSize:28, marginBottom:8 }}>🤖</div>
                  Starting up...
                </div>
              )}
              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}
              {loading && (
                <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`linear-gradient(135deg,${C.cyan},#0077aa)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#000', fontFamily:'monospace', letterSpacing:-1, flexShrink:0 }}>AI</div>
                  <TypingDots />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (show after first bot message, before user sends anything) */}
            {messages.length === 1 && (
              <div style={{ padding:'0 10px 8px', display:'flex', flexWrap:'wrap', gap:6 }}>
                {SUGGESTIONS.map(s => (
                  <button key={s} className="aiai-suggest" onClick={() => sendMessage(s)} style={{ background:C.cyanDim, border:`1px solid ${C.border}`, color:C.mutedLight, borderRadius:100, padding:'5px 11px', fontSize:11, cursor:'pointer', transition:'all 0.18s', whiteSpace:'nowrap' }}>{s}</button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <div style={{ padding:'10px 12px', borderTop:`1px solid ${C.border}`, display:'flex', gap:8, background:C.bg }}>
              <input
                ref={inputRef}
                className="aiai-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything about Asproite..."
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'9px 13px', color:C.text, fontSize:13, transition:'border-color 0.2s', fontFamily:'inherit' }}
                disabled={loading}
              />
              <button className="aiai-send" onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ width:38, height:38, borderRadius:9, background:(!input.trim()||loading) ? C.surface2 : C.cyan, border:'none', cursor:(!input.trim()||loading)?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, transition:'background 0.18s', flexShrink:0, opacity:(!input.trim()||loading)?0.5:1 }}>➤</button>
            </div>

            {/* Footer */}
            <div style={{ textAlign:'center', padding:'5px 0 9px', fontSize:10, color:C.muted }}>
              Powered by <span style={{ color:C.cyan }}>Claude AI</span> · Asproite Cloud & Consultancy
            </div>
          </div>
        )}

        {/* ── Floating bubble button ── */}
        <div style={{ position:'relative' }}>
          {/* Tooltip shown before first open */}
          {!started && !open && (
            <div style={{ position:'absolute', bottom:'110%', right:0, maxWidth:'calc(100vw - 40px)', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'8px 14px', whiteSpace:'nowrap', fontSize:12, color:C.text, boxShadow:'0 8px 24px rgba(0,0,0,0.4)', pointerEvents:'none', animation:'aiai-fadeup 0.3s ease' }}>
              <span style={{ color:C.cyan, fontWeight:700 }}>Ask Asproite AI</span> — instant answers ✨
              <div style={{ position:'absolute', bottom:-5, right:16, width:10, height:10, background:C.surface, borderRight:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, transform:'rotate(45deg)' }} />
            </div>
          )}

          <button
            className="aiai-bubble-btn"
            onClick={() => setOpen(o => !o)}
            style={{
              width:56, height:56, borderRadius:'50%',
              background: open ? C.surface2 : `linear-gradient(135deg,${C.cyan},#0088bb)`,
              border:`2px solid ${open ? C.border : 'transparent'}`,
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: open ? 'none' : `0 4px 24px rgba(0,212,255,0.45)`,
              transition:'all 0.25s',
              animation: open ? 'none' : 'aiai-pulse 3s ease-in-out infinite',
              fontWeight:900, fontSize:open?14:20, color:open?C.cyan:'#000',
              fontFamily:'monospace', letterSpacing:-1,
            }}>
            {open ? '✕' : 'AI'}
          </button>

          {/* Unread badge */}
          {!open && unread > 0 && (
            <div style={{ position:'absolute', top:-3, right:-3, width:18, height:18, borderRadius:'50%', background:'#ff4757', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.bg}` }}>
              {unread}
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#ff4757', animation:'aiai-ping 1.8s ease-out infinite' }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
