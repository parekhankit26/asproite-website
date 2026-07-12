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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { isConfigured, sendApplication, sendReferral, sendLoginAlert };
