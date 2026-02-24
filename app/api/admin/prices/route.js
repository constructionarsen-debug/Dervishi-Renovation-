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
  const key = String(form.get('key') || '').trim();
  const title = String(form.get('title') || '').trim();
  const description = String(form.get('description') || '').trim();
  const priceLek = Number(form.get('priceLek') || 0);

  // Admin should only be able to edit the fixed Q&A price.
  if (key !== 'qa_monthly') {
    return NextResponse.json({ ok: false, message: 'Only qa_monthly is editable.' }, { status: 403 });
  }

  if (!key || !title || !Number.isFinite(priceLek)) {
    return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
  }

  await prisma.priceSetting.upsert({
    where: { key },
    update: { title, description: description || null, priceLek },
    create: { key, title, description: description || null, priceLek }
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
