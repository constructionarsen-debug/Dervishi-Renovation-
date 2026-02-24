import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function GET(req) {
  if (!isStripeConfigured()) {
    return NextResponse.redirect(new URL('/payment/cancel?reason=stripe_not_configured', req.url));
  }

  const { searchParams } = new URL(req.url);
  const token = String(searchParams.get('token') || '').trim();
  if (!token) return NextResponse.redirect(new URL('/payment/cancel?reason=missing_token', req.url));

  const order = await prisma.order.findUnique({
    where: { accessToken: token },
    include: { ebook: true }
  });

  if (!order) return NextResponse.redirect(new URL('/payment/cancel?reason=order_not_found', req.url));

  // If already paid, send user back to the order page.
  if (order.paymentStatus === 'PAID') {
    return NextResponse.redirect(new URL(`/payment/order/${token}`, req.url));
  }

  const stripe = getStripe();
  const baseUrl = getBaseUrl(req);

  // Reuse an existing session (stored in payseraRef for backwards compatibility)
  if (order.payseraRef) {
    try {
      const existing = await stripe.checkout.sessions.retrieve(order.payseraRef);
      if (existing?.url) {
        return NextResponse.redirect(existing.url);
      }
    } catch {
      // ignore and create a new one
    }
  }

  const productName =
    order.type === 'QA'
      ? 'Online Q&A (30 ditë)'
      : order.ebook?.title
        ? `Ebook: ${order.ebook.title}`
        : 'Ebook';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: order.customerEmail,
    client_reference_id: order.id,
    metadata: {
      orderId: order.id,
      accessToken: order.accessToken,
      type: order.type,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'all',
          unit_amount: Math.round(order.amountLek * 100),
          product_data: {
            name: productName,
          },
        },
      },
    ],
    success_url: `${baseUrl}/payment/order/${token}?stripe=success`,
    cancel_url: `${baseUrl}/payment/order/${token}?stripe=cancel`,
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { payseraRef: session.id }
  });

  return NextResponse.redirect(session.url);
}
