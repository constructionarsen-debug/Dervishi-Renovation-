import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';
import { sendEmail } from '@/lib/mailer';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.email) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', '/profile');
    return NextResponse.redirect(url);
  }

  const email = String(session.user.email).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL('/login?from=/profile', req.url));
  }

  const access = await getUserQaAccess(user.id);
  if (!access.active) {
    return NextResponse.redirect(new URL('/qa?error=noaccess', req.url));
  }

  const form = await req.formData();
  const ticketId = String(form.get('ticketId') || '').trim();
  const content = String(form.get('content') || '').trim();

  if (!ticketId || !content) {
    return NextResponse.redirect(new URL('/profile?error=missing', req.url));
  }

  const ticket = await prisma.question.findFirst({
    where: { id: ticketId, userId: user.id }
  });

  if (!ticket) {
    return NextResponse.redirect(new URL('/profile?error=notfound', req.url));
  }

  // Rule: if admin closed the ticket, user can no longer send messages.
  if (ticket.status === 'CLOSED') {
    return NextResponse.redirect(new URL(`/profile/qa/${ticketId}?error=closed`, req.url));
  }

  await prisma.questionMessage.create({
    data: {
      questionId: ticketId,
      sender: 'USER',
      senderUserId: user.id,
      content
    }
  });

  await prisma.question.update({
    where: { id: ticketId },
    data: { status: 'OPEN' }
  });

  const baseUrl = getBaseUrl(req);
  const adminLink = `${baseUrl}/admin/qa/${ticketId}`;

  if (process.env.ADMIN_EMAIL) {
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: 'Mesazh i ri në ticket (Q&A)',
      text: `Ka një mesazh të ri nga ${email}. Hape: ${adminLink}`,
      html: `<p>Ka një mesazh të ri nga <b>${email}</b>.</p><p><a href="${adminLink}">Hap bisedën (Admin)</a></p>`
    }).catch(() => null);
  }

  return NextResponse.redirect(new URL(`/profile/qa/${ticketId}`, req.url));
}
