import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/requireAdmin';
import { revalidatePath } from 'next/cache';

function normalizeUrls(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => String(v || '').trim()).filter(Boolean);

  const raw = String(val).trim();
  if (!raw) return [];

  if ((raw.startsWith('[') && raw.endsWith(']')) || (raw.startsWith('{') && raw.endsWith('}'))) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return normalizeUrls(parsed);
      if (parsed?.urls && Array.isArray(parsed.urls)) return normalizeUrls(parsed.urls);
    } catch {}
  }

  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function revalidateAll(id) {
  revalidatePath('/');
  revalidatePath('/ebooks');
  revalidatePath('/admin');
  revalidatePath('/admin/ebooks');
  if (id) revalidatePath(`/admin/ebooks/${id}`);
}

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
    revalidateAll(id);
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  const id = String(form.get('id') || '').trim();
  const slug = String(form.get('slug') || '').trim();
  const title = String(form.get('title') || '').trim();
  const shortDesc = String(form.get('shortDesc') || '').trim();
  const longDesc = String(form.get('longDesc') || '').trim();
  const priceLek = Number(form.get('priceLek') || 0);
  const coverImage = String(form.get('coverImage') || '').trim();
  const previewMedia = normalizeUrls(form.get('previewMedia'));
  const contentMedia = normalizeUrls(form.get('contentMedia'));
  const contentUrl = String(form.get('contentUrl') || '').trim();
  const isActive = form.get('isActive') === 'on' || String(form.get('isActive') || '') === 'true';

  if (!slug || !title || !shortDesc || !Number.isFinite(priceLek)) {
    return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
  }

  if (action === 'update') {
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    await prisma.ebook.update({
      where: { id },
      data: {
        slug,
        title,
        shortDesc,
        longDesc: longDesc || null,
        priceLek,
        coverImage: coverImage || null,
        previewMedia,
        contentMedia,
        contentUrl: contentUrl || null,
        isActive,
      },
    });

    revalidateAll(id);
    return NextResponse.redirect(new URL(`/admin/ebooks/${id}`, req.url));
  }

  await prisma.ebook.upsert({
    where: { slug },
    update: { title, shortDesc, longDesc: longDesc || null, priceLek, coverImage: coverImage || null, previewMedia, contentMedia, contentUrl: contentUrl || null, isActive: true },
    create: { slug, title, shortDesc, longDesc: longDesc || null, priceLek, coverImage: coverImage || null, previewMedia, contentMedia, contentUrl: contentUrl || null, isActive: true }
  });

  revalidateAll();
  return NextResponse.redirect(new URL('/admin', req.url));
}
