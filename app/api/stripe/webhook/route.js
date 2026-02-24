import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { sendEmail } from '@/lib/mailer';
import { computeActiveUntil } from '@/lib/qaAccess';

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function POST(req) {
  if (!isStripeConfigured()) return NextResponse.json({ ok: false }, { status: 500 });
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ ok: false }, { status: 500 });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ ok: false }, { status: 400 });

  const stripe = getStripe();

  let event;
  const payload = await req.text();
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // We only need to handle successful payments.
  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object;
  const orderId = session?.metadata?.orderId || session?.client_reference_id;
  if (!orderId) return NextResponse.json({ received: true });

  const order = await prisma.order.findUnique({
    where: { id: String(orderId) },
    include: { ebook: true, user: true }
  });

  if (!order) return NextResponse.json({ received: true });

  // Idempotent: if already paid, do nothing.
  if (order.paymentStatus !== 'PAID') {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        // stored in payseraRef for backwards compatibility
        payseraRef: session.id
      }
    });
  }

  // Auto-create EbookAccess on successful payment
  if (order.type === 'EBOOK' && order.userId && order.ebookId) {
    await prisma.ebookAccess.upsert({
      where: { userId_ebookId: { userId: order.userId, ebookId: order.ebookId } },
      update: {},
      create: { userId: order.userId, ebookId: order.ebookId }
    });
  }

  // Email confirmations (best effort)
  if (order.customerEmail) {
    const baseUrl = getBaseUrl(req);

    if (order.type === 'QA') {
      const until = computeActiveUntil(order.createdAt);
      sendEmail({
        to: order.customerEmail,
        subject: 'Q&A aktiv u konfirmua - Dervishi Renovation',
        text: `Pagesa u konfirmua. Q&A është aktiv deri më ${until.toLocaleDateString('sq-AL')}. Hap: ${baseUrl}/qa`,
        html: `<p>Pagesa u konfirmua.</p><p>Q&amp;A është aktiv deri më <b>${until.toLocaleDateString('sq-AL')}</b>.</p><p><a href="${baseUrl}/qa">Shko te Q&amp;A</a></p>`
      }).catch(() => null);
    }

    if (order.type === 'EBOOK' && order.accessToken) {
      sendEmail({
        to: order.customerEmail,
        subject: 'Ebook u konfirmua - Dervishi Renovation',
        text: `Pagesa u konfirmua. Aksesoni materialin: ${baseUrl}/download/${order.accessToken}`,
        html: `<p>Pagesa u konfirmua.</p><p><a href="${baseUrl}/download/${order.accessToken}">Akseso / Shkarko materialin</a></p>`
      }).catch(() => null);
    }
  }

  return NextResponse.json({ received: true });
}
