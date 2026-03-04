import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const action = String(form.get('action') || '').trim();
  const id = String(form.get('id') || '').trim();
  const redirectTo = String(form.get('redirectTo') || '/admin').trim() || '/admin';

  if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

  if (action === 'approve') {
    await prisma.review.update({ where: { id }, data: { approved: true } });
  } else if (action === 'unapprove') {
    await prisma.review.update({ where: { id }, data: { approved: false } });
  } else if (action === 'delete') {
    await prisma.review.delete({ where: { id } });
  } else {
    return NextResponse.json({ ok: false, message: 'Invalid action' }, { status: 400 });
  }

  // Homepage shows approved reviews first; bust caches.
  revalidatePath('/');
  revalidatePath('/review');
  revalidatePath('/admin');
  revalidatePath('/admin/reviews');

  // Redirect back
  return NextResponse.redirect(new URL(redirectTo, req.url));
}
