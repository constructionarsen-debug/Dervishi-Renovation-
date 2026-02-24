import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decodePayseraData, md5 } from '@/lib/paysera';
import { sendEmail } from '@/lib/mailer';
import { computeActiveUntil } from '@/lib/qaAccess';

function mapPayseraStatusToPaymentStatus(status) {
  // Paysera status codes: 0..5 (docs). Only 1 = successful.
  if (status === '1') return 'PAID';
  if (status === '0') return 'FAILED';
  if (status === '2' || status === '3' || status === '4') return 'PENDING';
  if (status === '5') return 'CANCELED';
  return 'FAILED';
}

function getBaseUrl(req) {
  return process.env.APP_URL || process.env.NEXTAUTH_URL || new URL(req.url).origin;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get('data') || '';
  const ss1 = searchParams.get('ss1') || '';

  if (!data) return NextResponse.json({ ok: false, message: 'Missing data' }, { status: 400 });

  // Signature verification (required if encryption is disabled)
  const password = process.env.PAYSERA_SIGN_PASSWORD;
  if (!password) return NextResponse.json({ ok: false, message: 'Server not configured' }, { status: 500 });

  const expected = md5(data + password);
  if (!ss1 || ss1.toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json({ ok: false, message: 'Bad signature' }, { status: 401 });
  }

  const params = decodePayseraData(data);
  const projectid = String(params.projectid || '');
  const orderid = String(params.orderid || '');
  const status = String(params.status || '');

  if (process.env.PAYSERA_PROJECT_ID && String(process.env.PAYSERA_PROJECT_ID) !== projectid) {
    return NextResponse.json({ ok: false, message: 'Wrong project' }, { status: 400 });
  }
  if (!orderid) return NextResponse.json({ ok: false, message: 'Missing orderid' }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderid },
    include: { ebook: true, user: true }
  });

  // IMPORTANT: Paysera expects a 200 OK response body "OK" for successful callback handling.
  if (!order) return new NextResponse('OK');

  const paymentStatus = mapPayseraStatusToPaymentStatus(status);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus,
      payseraRef: String(params.payment || params.paytext || '') || null
    }
  });

  // Auto-create EbookAccess on successful payment
  if (paymentStatus === 'PAID' && order.type === 'EBOOK' && order.userId && order.ebookId) {
    await prisma.ebookAccess.upsert({
      where: { userId_ebookId: { userId: order.userId, ebookId: order.ebookId } },
      update: {},
      create: { userId: order.userId, ebookId: order.ebookId }
    });
  }

  // Email confirmations (best effort)
  if (paymentStatus === 'PAID' && order.customerEmail) {
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

  return new NextResponse('OK');
}
