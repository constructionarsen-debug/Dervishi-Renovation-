import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Legacy client helper endpoint.
// The actual Paysera redirect is handled by /payment/order/[token] page.

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const body = await req.json().catch(() => ({}));

  if (!session?.user?.email) {
    const callbackUrl = body?.type === 'EBOOK' ? '/ebooks' : '/qa';
    return NextResponse.json({ ok: false, redirectUrl: `/login?from=${encodeURIComponent(callbackUrl)}` }, { status: 401 });
  }

  const email = String(session.user.email).toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ ok: false, redirectUrl: `/login?from=${encodeURIComponent('/ebooks')}` }, { status: 401 });
  }

  const type = String(body?.type || '');
  if (type !== 'EBOOK' && type !== 'QA') {
    return NextResponse.json({ ok: false, error: 'Bad type' }, { status: 400 });
  }

  if (type === 'EBOOK') {
    const ebookId = String(body?.ebookId || '').trim();
    const ebook = ebookId ? await prisma.ebook.findUnique({ where: { id: ebookId } }) : null;
    if (!ebook || !ebook.isActive) return NextResponse.json({ ok: false, error: 'Ebook not found' }, { status: 404 });

    const accessToken = crypto.randomBytes(24).toString('hex');
    await prisma.order.create({
      data: {
        type: 'EBOOK',
        amountLek: ebook.priceLek,
        customerName: user.name || email,
        customerEmail: email,
        accessToken,
        paymentStatus: 'UNPAID',
        user: { connect: { id: user.id } },
        ebook: { connect: { id: ebook.id } }
      }
    });

    const redirectUrl = `/payment/order/${accessToken}`;
    return NextResponse.json({ ok: true, redirectUrl, payUrl: redirectUrl });
  }

  // QA purchase: prefer /api/qa/buy. Kept for backwards compatibility.
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

  const redirectUrl = `/payment/order/${accessToken}`;
  return NextResponse.json({ ok: true, redirectUrl, payUrl: redirectUrl });
}
