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
  const action = String(form.get('action') || 'create');

  if (action === 'delete') {
    const id = String(form.get('id') || '');
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    await prisma.project.delete({ where: { id } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  if (action === 'update') {
    const id = String(form.get('id') || '').trim();
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const title = String(form.get('title') || '').trim();
    const location = String(form.get('location') || '').trim();
    const description = String(form.get('description') || '').trim();
    const coverImage = String(form.get('coverImage') || '').trim();
    const imagesRaw = String(form.get('images') || '').trim();
    const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

    if (!title) return NextResponse.json({ ok: false, message: 'Missing title' }, { status: 400 });

    await prisma.project.update({
      where: { id },
      data: { title, location: location || null, description: description || null, coverImage: coverImage || null, images }
    });

    // Redirect back to edit page
    return NextResponse.redirect(new URL(`/admin/projects/${id}`, req.url));
  }

  const title = String(form.get('title') || '').trim();
  const location = String(form.get('location') || '').trim();
  const description = String(form.get('description') || '').trim();
  const coverImage = String(form.get('coverImage') || '').trim();
  const imagesRaw = String(form.get('images') || '').trim();
  const images = imagesRaw ? imagesRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  if (!title) return NextResponse.json({ ok: false, message: 'Missing title' }, { status: 400 });

  await prisma.project.create({
    data: { title, location: location || null, description: description || null, coverImage: coverImage || null, images }
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
