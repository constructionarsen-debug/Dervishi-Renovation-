import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';
import { isValidEmail, isValidPhone, normalizePhone } from '@/lib/validators';
import { sendEmail } from '@/lib/mailer';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.email) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', '/qa');
    return NextResponse.redirect(url);
  }

  const email = String(session.user.email).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', '/qa');
    return NextResponse.redirect(url);
  }

  const access = await getUserQaAccess(user.id);
  if (!access.active) {
    return NextResponse.redirect(new URL('/qa?error=noaccess', req.url));
  }

  const form = await req.formData();
  const message = String(form.get('message') || '').trim();
  const phoneRaw = String(form.get('phone') || '').trim();

  if (!message) {
    return NextResponse.redirect(new URL('/qa?error=missing', req.url));
  }
  if (!isValidEmail(email)) {
    return NextResponse.redirect(new URL('/qa?error=email', req.url));
  }
  if (!isValidPhone(phoneRaw)) {
    return NextResponse.redirect(new URL('/qa?error=phone', req.url));
  }

  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;

  const ticket = await prisma.question.create({
    data: {
      name: user.name || email,
      email,
      phone,
      message,
      status: 'OPEN',
      user: { connect: { id: user.id } },
      messages: {
        create: {
          sender: 'USER',
          senderUserId: user.id,
          content: message
        }
      }
    }
  });

  const baseUrl = getBaseUrl(req);
  const userLink = `${baseUrl}/profile/qa/${ticket.id}`;
  const adminLink = `${baseUrl}/admin/qa/${ticket.id}`;

  // Notify user
  sendEmail({
    to: email,
    subject: 'Ticket i ri - Dervishi Renovation (Q&A)',
    text: `Kemi marrë pyetjen tuaj. Mund ta shihni bisedën këtu: ${userLink}`,
    html: `<p>Kemi marrë pyetjen tuaj.</p><p><a href="${userLink}">Hap bisedën</a></p>`
  }).catch(() => null);

  // Notify admin
  if (process.env.ADMIN_EMAIL) {
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Ticket i ri (Q&A) - Dervishi Renovation',
      text: `Ticket i ri nga ${email}. Hape këtu: ${adminLink}`,
      html: `<p>Ticket i ri nga <b>${email}</b>.</p><p><a href="${adminLink}">Hap bisedën (Admin)</a></p>`
    }).catch(() => null);
  }

  return NextResponse.redirect(new URL(`/profile/qa/${ticket.id}`, req.url));
}
