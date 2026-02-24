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

  if (action === 'toggle') {
    const id = String(form.get('id') || '');
    const isActive = String(form.get('isActive') || 'true') === 'true';
    await prisma.ebook.update({ where: { id }, data: { isActive } });
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  const slug = String(form.get('slug') || '').trim();
  const title = String(form.get('title') || '').trim();
  const shortDesc = String(form.get('shortDesc') || '').trim();
  const longDesc = String(form.get('longDesc') || '').trim();
  const priceLek = Number(form.get('priceLek') || 0);
  const coverImage = String(form.get('coverImage') || '').trim();
  const previewRaw = String(form.get('previewMedia') || '').trim();
  const contentMediaRaw = String(form.get('contentMedia') || '').trim();
  const contentUrl = String(form.get('contentUrl') || '').trim();

  const previewMedia = previewRaw ? previewRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];
  const contentMedia = contentMediaRaw ? contentMediaRaw.split('\n').map((s) => s.trim()).filter(Boolean) : [];

  if (!slug || !title || !shortDesc || !Number.isFinite(priceLek)) {
    return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
  }

  await prisma.ebook.upsert({
    where: { slug },
    update: { title, shortDesc, longDesc: longDesc || null, priceLek, coverImage: coverImage || null, previewMedia, contentMedia, contentUrl: contentUrl || null, isActive: true },
    create: { slug, title, shortDesc, longDesc: longDesc || null, priceLek, coverImage: coverImage || null, previewMedia, contentMedia, contentUrl: contentUrl || null, isActive: true }
  });

  return NextResponse.redirect(new URL('/admin', req.url));
}
