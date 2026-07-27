const nodemailer = require('nodemailer');

// Sends job application emails (with an optional resume attachment)
// directly through career@asproite.com's own mailbox via SMTP — avoids
// depending on a third-party form service's file-upload plan tier.
function isConfigured() {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

let transporter = null;
function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) !== 587, // 465 = implicit TLS, 587 = STARTTLS
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

async function sendApplication({ fullName, email, phone, linkedin, position, message, resumeFile }) {
  if (!isConfigured()) throw Object.assign(new Error('Email not configured'), { code: 'not_configured' });

  const to = process.env.CAREERS_EMAIL || process.env.SMTP_USER;
  const lines = [
    `<p><strong>Position:</strong> ${escapeHtml(position)}</p>`,
    `<p><strong>Full Name:</strong> ${escapeHtml(fullName)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>`,
    `<p><strong>LinkedIn / Portfolio:</strong> ${escapeHtml(linkedin || 'Not provided')}</p>`,
    `<p><strong>Cover Letter:</strong><br>${escapeHtml(message || 'Not provided').replace(/\n/g, '<br>')}</p>`,
  ];
  const text = [
    `Position: ${position}`,
    `Full Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `LinkedIn / Portfolio: ${linkedin || 'Not provided'}`,
    `Cover Letter:\n${message || 'Not provided'}`,
  ].join('\n\n');

  const mail = {
    from: `"Asproite Careers" <${process.env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `Job Application: ${position} — ${fullName}`,
    text,
    html: lines.join('\n'),
    attachments: [],
  };

  if (resumeFile) {
    mail.attachments.push({
      filename: resumeFile.originalname,
      content: resumeFile.buffer,
      contentType: resumeFile.mimetype,
    });
  }

  await getTransporter().sendMail(mail);
}

// Wording matters here: spam filters (SpamAssassin and similar, which most
// shared mail hosting runs) heavily penalize "referral"-style subject
// lines — they closely match affiliate/referral marketing spam patterns.
// A plain "New website enquiry" framing, a text/plain alternative (HTML-only
// mail is itself a spam signal), and a from-name matching the rest of the
// site's mail (not a distinct "Referrals" persona) all measurably reduce
// that risk. Confirmed necessary in production: these were being delivered
// successfully but landing in spam under the old subject/HTML-only format.
async function sendReferral({ referrerName, referrerEmail, referrerPhone, businessName, contactName, contactEmail, contactPhone, message }) {
  if (!isConfigured()) throw Object.assign(new Error('Email not configured'), { code: 'not_configured' });

  const to = (process.env.REFERRAL_EMAIL || 'inquiry@asproite.com').trim();
  const lines = [
    `<p><strong>Referred by:</strong> ${escapeHtml(referrerName)} (${escapeHtml(referrerEmail)}${referrerPhone ? ', ' + escapeHtml(referrerPhone) : ''})</p>`,
    `<p><strong>Business:</strong> ${escapeHtml(businessName)}</p>`,
    `<p><strong>Contact Name:</strong> ${escapeHtml(contactName || 'Not provided')}</p>`,
    `<p><strong>Contact Email:</strong> ${escapeHtml(contactEmail || 'Not provided')}</p>`,
    `<p><strong>Contact Phone:</strong> ${escapeHtml(contactPhone || 'Not provided')}</p>`,
    `<p><strong>Notes:</strong><br>${escapeHtml(message || 'Not provided').replace(/\n/g, '<br>')}</p>`,
  ];
  const text = [
    `Referred by: ${referrerName} (${referrerEmail}${referrerPhone ? ', ' + referrerPhone : ''})`,
    `Business: ${businessName}`,
    `Contact Name: ${contactName || 'Not provided'}`,
    `Contact Email: ${contactEmail || 'Not provided'}`,
    `Contact Phone: ${contactPhone || 'Not provided'}`,
    `Notes:\n${message || 'Not provided'}`,
  ].join('\n\n');

  const mail = {
    from: `"Asproite Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: referrerEmail,
    subject: `Website enquiry: business introduction — ${businessName}`,
    text,
    html: lines.join('\n'),
  };

  await getTransporter().sendMail(mail);
}

async function sendLoginAlert({ ip, time, userAgent }) {
  if (!isConfigured()) return;

  const to = (process.env.ADMIN_NOTIFY_EMAIL || 'info@asproite.com').trim();
  if (!to) return;

  const text = [
    'A successful admin login was just recorded.',
    `Time: ${time}`,
    `IP address: ${ip || 'unknown'}`,
    `Browser: ${userAgent || 'unknown'}`,
    "If this wasn't you, change the admin password immediately.",
  ].join('\n');

  const mail = {
    from: `"Asproite Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Asproite Admin: new login',
    text,
    html: [
      `<p>A successful admin login was just recorded.</p>`,
      `<p><strong>Time:</strong> ${escapeHtml(time)}</p>`,
      `<p><strong>IP address:</strong> ${escapeHtml(ip || 'unknown')}</p>`,
      `<p><strong>Browser:</strong> ${escapeHtml(userAgent || 'unknown')}</p>`,
      `<p>If this wasn't you, change the admin password immediately.</p>`,
    ].join('\n'),
  };

  // Best-effort — a failed alert email must never block or fail the login
  // itself.
  await getTransporter().sendMail(mail).catch(() => {});
}

async function sendPasswordReset({ resetUrl }) {
  if (!isConfigured()) throw Object.assign(new Error('Email not configured'), { code: 'not_configured' });

  const to = (process.env.ADMIN_RECOVERY_EMAIL || 'info@asproite.com').trim();
  const text = [
    'A password reset was requested for the Asproite admin panel.',
    `Set a new password here (expires in 15 minutes): ${resetUrl}`,
    "If you didn't request this, you can safely ignore this email — your password won't change unless the link above is used.",
  ].join('\n\n');

  const mail = {
    from: `"Asproite Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your Asproite admin password',
    text,
    html: [
      `<p>A password reset was requested for the Asproite admin panel.</p>`,
      `<p><a href="${resetUrl}">Click here to set a new password</a> (expires in 15 minutes).</p>`,
      `<p>If you didn't request this, you can safely ignore this email — your password won't change unless the link above is used.</p>`,
    ].join('\n'),
  };

  await getTransporter().sendMail(mail);
}

// Notifies the team of a new AI-generated proposal request — this is the
// actual lead-capture mechanism behind the "instant proposal" feature, not
// just a novelty; every submission with contact details is a qualified,
// self-described sales lead.
async function sendProposalLead({ businessName, contactName, contactEmail, contactPhone, industry, budgetRange, description, proposal }) {
  if (!isConfigured()) throw Object.assign(new Error('Email not configured'), { code: 'not_configured' });

  const to = (process.env.PROPOSAL_EMAIL || 'inquiry@asproite.com').trim();
  const servicesText = (proposal?.recommendedServices || [])
    .map(s => `- ${s.service} (${s.estimatedRange}): ${s.reasoning}`).join('\n');
  const servicesHtml = (proposal?.recommendedServices || [])
    .map(s => `<li><strong>${escapeHtml(s.service)}</strong> (${escapeHtml(s.estimatedRange)}) — ${escapeHtml(s.reasoning)}</li>`).join('');

  const text = [
    `Business: ${businessName}`,
    `Contact: ${contactName} (${contactEmail}${contactPhone ? ', ' + contactPhone : ''})`,
    `Industry: ${industry || 'Not provided'}`,
    `Budget range: ${budgetRange || 'Not provided'}`,
    `Description:\n${description}`,
    `\nAI-recommended services:\n${servicesText}`,
    `\nEstimated total: ${proposal?.totalEstimatedRange || 'n/a'}`,
    `Suggested timeline: ${proposal?.suggestedTimeline || 'n/a'}`,
  ].join('\n\n');

  const mail = {
    from: `"Asproite Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: contactEmail,
    subject: `Website enquiry: AI proposal request — ${businessName}`,
    text,
    html: [
      `<p><strong>Business:</strong> ${escapeHtml(businessName)}</p>`,
      `<p><strong>Contact:</strong> ${escapeHtml(contactName)} (${escapeHtml(contactEmail)}${contactPhone ? ', ' + escapeHtml(contactPhone) : ''})</p>`,
      `<p><strong>Industry:</strong> ${escapeHtml(industry || 'Not provided')}</p>`,
      `<p><strong>Budget range:</strong> ${escapeHtml(budgetRange || 'Not provided')}</p>`,
      `<p><strong>Description:</strong><br>${escapeHtml(description).replace(/\n/g, '<br>')}</p>`,
      `<p><strong>AI-recommended services:</strong></p><ul>${servicesHtml}</ul>`,
      `<p><strong>Estimated total:</strong> ${escapeHtml(proposal?.totalEstimatedRange || 'n/a')}</p>`,
      `<p><strong>Suggested timeline:</strong> ${escapeHtml(proposal?.suggestedTimeline || 'n/a')}</p>`,
    ].join('\n'),
  };

  await getTransporter().sendMail(mail);
}

// Emails the visitor their own copy of the generated proposal — reinforces
// perceived value and gives them something to reference or forward
// internally at their own company.
async function sendProposalCopy({ contactName, contactEmail, businessName, proposal }) {
  if (!isConfigured()) return;

  const servicesHtml = (proposal?.recommendedServices || [])
    .map(s => `<li><strong>${escapeHtml(s.service)}</strong> (${escapeHtml(s.estimatedRange)}) — ${escapeHtml(s.reasoning)}</li>`).join('');
  const servicesText = (proposal?.recommendedServices || [])
    .map(s => `- ${s.service} (${s.estimatedRange}): ${s.reasoning}`).join('\n');

  const mail = {
    from: `"Asproite" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    subject: `Your Asproite roadmap for ${businessName}`,
    text: [
      `Hi ${contactName},`,
      proposal?.summary || '',
      `Recommended services:\n${servicesText}`,
      `Estimated total: ${proposal?.totalEstimatedRange || 'n/a'}`,
      `Suggested timeline: ${proposal?.suggestedTimeline || 'n/a'}`,
      proposal?.nextSteps || '',
    ].join('\n\n'),
    html: [
      `<p>Hi ${escapeHtml(contactName)},</p>`,
      `<p>${escapeHtml(proposal?.summary || '')}</p>`,
      `<p><strong>Recommended services:</strong></p><ul>${servicesHtml}</ul>`,
      `<p><strong>Estimated total:</strong> ${escapeHtml(proposal?.totalEstimatedRange || 'n/a')}</p>`,
      `<p><strong>Suggested timeline:</strong> ${escapeHtml(proposal?.suggestedTimeline || 'n/a')}</p>`,
      `<p>${escapeHtml(proposal?.nextSteps || '')}</p>`,
    ].join('\n'),
  };

  // Best-effort — a failed courtesy copy must never fail the whole request.
  await getTransporter().sendMail(mail).catch(() => {});
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { isConfigured, sendApplication, sendReferral, sendLoginAlert, sendPasswordReset, sendProposalLead, sendProposalCopy };
