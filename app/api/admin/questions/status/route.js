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
  const id = String(form.get('id') || '').trim();
  const status = String(form.get('status') || '').trim();
  const redirectTo = String(form.get('redirectTo') || '').trim();

  if (!id || !['OPEN', 'ANSWERED', 'CLOSED'].includes(status)) {
    return NextResponse.json({ ok: false, message: 'Bad request' }, { status: 400 });
  }

  await prisma.question.update({
    where: { id },
    data: { status }
  });

  return NextResponse.redirect(new URL(redirectTo || `/admin/qa/${id}`, req.url));
}
