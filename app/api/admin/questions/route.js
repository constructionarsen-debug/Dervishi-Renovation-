import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { sendEmail } from '@/lib/mailer';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const id = String(form.get('id') || '');
  const answer = String(form.get('answer') || '').trim();
  const redirectTo = String(form.get('redirectTo') || '').trim();

  if (!id || !answer) {
    return NextResponse.json({ ok: false, message: 'Missing id/answer' }, { status: 400 });
  }

  await prisma.question.update({
    where: { id },
    data: {
      answer,
      answeredAt: new Date(),
      status: 'ANSWERED',
      messages: {
        create: {
          sender: 'ADMIN',
          content: answer
        }
      }
    },
    select: { id: true, email: true }
  });

  const ticket = await prisma.question.findUnique({ where: { id }, select: { email: true } });
  const baseUrl = getBaseUrl(req);
  const userLink = `${baseUrl}/profile/qa/${id}`;

  if (ticket?.email) {
    sendEmail({
      to: ticket.email,
      subject: 'Përgjigje e re - Dervishi Renovation (Q&A)',
      text: `Keni një përgjigje të re. Hape bisedën: ${userLink}`,
      html: `<p>Keni një përgjigje të re.</p><p><a href="${userLink}">Hap bisedën</a></p>`
    }).catch(() => null);
  }

  return NextResponse.redirect(new URL(redirectTo || `/admin/qa/${id}`, req.url));
}
