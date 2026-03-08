import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isValidEmail, isValidPhone, normalizePhone } from '@/lib/validators';
import { sendEmail } from '@/lib/mailer';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function POST(req) {
  const form = await req.formData();
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const phone = String(form.get('phone') || '').trim();
  const message = String(form.get('message') || '').trim();
  const company = String(form.get('company') || '').trim(); // honeypot

  if (company) {
    return NextResponse.redirect(new URL('/contact?sent=1', req.url));
  }

  if (!name || !email || !phone || !message) {
    return NextResponse.redirect(new URL('/contact?error=missing', req.url));
  }

  if (!isValidEmail(email)) {
    return NextResponse.redirect(new URL('/contact?error=email', req.url));
  }
  if (!isValidPhone(phone)) {
    return NextResponse.redirect(new URL('/contact?error=phone', req.url));
  }

  await prisma.contactMessage.create({
    data: { name, email, phone: phone ? normalizePhone(phone) : null, message }
  });

  if (process.env.SMTP_USER) {
    const baseUrl = getBaseUrl(req);
    sendEmail({
      to: process.env.SMTP_USER,
      subject: 'Mesazh i ri (Kontakt) - Dervishi Renovation',
      text: `Nga: ${name} (${email})${phone ? `, ${normalizePhone(phone)}` : ''}\n\n${message}\n\nAdmin: ${baseUrl}/admin`,
      html: `<p><b>Nga:</b> ${name} (${email})${phone ? `, ${normalizePhone(phone)}` : ''}</p><p>${message.replace(/\n/g, '<br/>')}</p><p><a href="${baseUrl}/admin">Hap Admin</a></p>`
    }).catch(() => null);
  }

  return NextResponse.redirect(new URL('/contact?sent=1', req.url));
}
