import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const id = String(form.get('id') || '');
  const paymentStatus = String(form.get('paymentStatus') || '');

  if (!id || !paymentStatus) {
    return NextResponse.json({ ok: false, message: 'Missing id/status' }, { status: 400 });
  }

  await prisma.order.update({ where: { id }, data: { paymentStatus } });
  return NextResponse.redirect(new URL('/admin', req.url));
}
