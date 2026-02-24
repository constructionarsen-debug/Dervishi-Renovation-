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
  const handled = String(form.get('handled') || 'false') === 'true';

  if (!id) return NextResponse.json({ ok: false }, { status: 400 });

  await prisma.contactMessage.update({ where: { id }, data: { handled } });
  return NextResponse.redirect(new URL('/admin', req.url));
}
