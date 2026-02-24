import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getUserQaAccess } from '@/lib/qaAccess';

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
  if (access.active) {
    return NextResponse.redirect(new URL('/qa?status=active', req.url));
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
