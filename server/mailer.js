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

  const mail = {
    from: `"Asproite Careers" <${process.env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `Job Application: ${position} — ${fullName}`,
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

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

module.exports = { isConfigured, sendApplication };
