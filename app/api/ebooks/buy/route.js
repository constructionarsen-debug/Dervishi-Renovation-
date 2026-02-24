import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', req.headers.get('referer') ? new URL(req.headers.get('referer')).pathname : '/ebooks');
    return NextResponse.redirect(url);
  }

  const form = await req.formData();
  const slug = String(form.get('slug') || '').trim();

  if (!slug) {
    return NextResponse.redirect(new URL('/ebooks?error=missing', req.url));
  }

  const ebook = await prisma.ebook.findUnique({ where: { slug } });
  if (!ebook || !ebook.isActive) {
    return NextResponse.redirect(new URL('/ebooks?error=notfound', req.url));
  }

  const email = session.user.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const url = new URL('/login', req.url);
    url.searchParams.set('from', `/ebooks/${encodeURIComponent(slug)}`);
    return NextResponse.redirect(url);
  }

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

  return NextResponse.redirect(new URL(`/payment/order/${accessToken}`, req.url));
}
