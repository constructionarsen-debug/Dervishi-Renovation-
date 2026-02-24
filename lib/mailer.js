import nodemailer from 'nodemailer';

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host) return null;

  const secure = port === 465;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined
  });
}

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.SMTP_FROM;
  const transport = getTransport();
  if (!from || !transport) {
    // Fail silently in dev; keep server functional.
    return { ok: false, skipped: true };
  }

  await transport.sendMail({
    from,
    to,
    subject,
    text,
    html
  });
  return { ok: true };
}
