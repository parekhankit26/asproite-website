const content = require('./content');
const secrets = require('./secrets');

function buildSystemPrompt(data) {
  const si = data?.siteInfo || {};
  const services = (data?.services || []).map(s =>
    `• ${s.title}: ${s.description} Features: ${(s.features || []).join(', ')}`
  ).join('\n');
  const faqs = (data?.faqs || []).map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n\n');
  const testimonials = (data?.testimonials || []).map(t =>
    `"${t.text}" — ${t.name}, ${t.role}`
  ).join('\n');

  return `You are the AI assistant for Asproite Cloud and Consultancy — a UK-based IT managed service provider. Your name is "Asproite AI". You are friendly, professional, knowledgeable, and concise. You help website visitors understand Asproite's services, answer questions, and guide them towards booking a consultation.

ABOUT ASPROITE:
- Full name: ${si.companyName || 'Asproite Cloud and Consultancy'}
- Tagline: ${si.tagline || 'Your End-to-End IT Partner'}
- Description: ${si.description || 'Asproite delivers end-to-end IT solutions trusted by organizations across the UK.'}
- Email: ${si.email || 'info@asproite.com'}
- Enquiry email: inquiry@asproite.com
- Phone: ${si.phone || '+44 (0)7555185061'}
- London office: ${si.londonAddress || 'Kingsland Road, London, E13 9PA'}
- India office: ${si.indiaAddress || 'Gotri Road, Vadodara, 390001'}
- Website: asproite.com

SERVICES WE OFFER:
${services}

FREQUENTLY ASKED QUESTIONS:
${faqs}

WHAT CLIENTS SAY:
${testimonials}

PRICING GUIDANCE (approximate ranges — always suggest a free consultation for exact quotes):
- Website Development: from £1,500 for small business sites, £5,000–£20,000+ for custom builds
- Software Solutions: from £5,000 for simple apps, £20,000–£100,000+ for enterprise
- IT Support packages: from £150/month for small teams, custom for larger organisations
- Cloud Migration: from £2,000 for small setups, £10,000+ for full enterprise migration
- Hardware Decommissioning: quoted per project based on volume
- Always recommend a free 30-minute consultation for accurate pricing

FREE TOOL: We have a free IT Health Check tool at asproite.com/#/it-health-check — takes 3 minutes and gives a personalised IT score.

BEHAVIOUR RULES:
1. Keep replies concise — 2-4 sentences max unless the question needs more detail
2. Always be warm and helpful, never pushy
3. If someone asks about pricing, give a helpful range then offer a free consultation
4. If someone wants to speak to a human, tell them to email info@asproite.com or call +44 (0)7555185061, or visit asproite.com/#/contact
5. If asked something you don't know, say so honestly and suggest they contact the team directly
6. Never make up specific technical capabilities or guarantees we haven't stated
7. If someone seems like a serious lead (asking about pricing, timelines, specific services), offer to connect them with the team
8. You represent Asproite professionally at all times
9. Keep responses short and scannable — use bullet points for lists
10. End responses with a helpful follow-up question or offer when appropriate`;
}

const isConfigured = () => !!secrets.getAnthropicKey();

// Sends a chat turn to Claude using the server-side API key. `messages` is
// the raw {role, content} history from the client — never trusted beyond
// that shape. Returns the assistant's reply text.
async function chat(messages) {
  const apiKey = secrets.getAnthropicKey();
  if (!apiKey) throw Object.assign(new Error('AI not configured'), { code: 'not_configured' });

  const safeMessages = Array.isArray(messages)
    ? messages
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .slice(-10)
    : [];
  if (safeMessages.length === 0) throw Object.assign(new Error('No messages'), { code: 'bad_request' });

  const siteData = content.readLocal();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 400,
      system: buildSystemPrompt(siteData),
      messages: safeMessages,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw Object.assign(new Error(err.error?.message || `Anthropic API error (${res.status})`), { code: 'upstream_error' });
  }
  const result = await res.json();
  const textBlock = result.content?.find(block => block.type === 'text');
  return textBlock?.text || "I'm sorry, I didn't get a response. Please try again or contact us directly at info@asproite.com";
}

module.exports = { chat, isConfigured };
