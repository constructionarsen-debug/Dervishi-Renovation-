import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';
import { isValidPhone, normalizePhone } from '@/lib/validators';

export async function POST(req) {
  const session = await auth();
  if (!session?.user?.email) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', '/qa');
    return NextResponse.redirect(url);
  }

  const form = await req.formData();
  const message = String(form.get('message') || '').trim();
  const phoneRaw = String(form.get('phone') || '').trim();

  if (!message) {
    return NextResponse.redirect(new URL('/qa?error=missing', req.url));
  }

  if (!isValidPhone(phoneRaw)) {
    return NextResponse.redirect(new URL('/qa?error=phone', req.url));
  }

  const email = session.user.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', '/qa');
    return NextResponse.redirect(url);
  }

  const access = await getUserQaAccess(user.id);

  // If user already has active access, create a ticket instead of a payment order.
  if (access.active) {
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
    return NextResponse.redirect(new URL(`/profile/qa/${ticket.id}`, req.url));
  }

  const price = await prisma.priceSetting.findUnique({ where: { key: 'qa_monthly' } });
  const amountLek = price?.priceLek ?? 2500;

  const accessToken = crypto.randomBytes(24).toString('hex');

  await prisma.order.create({
    data: {
      type: 'QA',
      amountLek,
      customerName: user.name || email,
      customerEmail: email,
      accessToken,
      paymentStatus: 'UNPAID',
      user: { connect: { id: user.id } }
    }
  });

  return NextResponse.redirect(new URL(`/payment/order/${accessToken}`, req.url));
}
