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

  // Support both classic <form> submissions (FormData) and JSON fetch()
  const contentType = req.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? await req.json().catch(() => ({})) : null;
  const form = isJson ? null : await req.formData();

  const action = String((isJson ? payload?.action : form?.get('action')) || 'create');

  if (action === 'delete') {
    const id = String((isJson ? payload?.id : form?.get('id')) || '');
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    await prisma.project.delete({ where: { id } });

    // Bust caches so pages update instantly
    revalidatePath('/projects');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${id}`);

    return isJson
      ? NextResponse.json({ ok: true })
      : NextResponse.redirect(new URL('/admin', req.url));
  }

  if (action === 'update') {
    const id = String((isJson ? payload?.id : form?.get('id')) || '').trim();
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const title = String((isJson ? payload?.title : form?.get('title')) || '').trim();
    const location = String((isJson ? payload?.location : form?.get('location')) || '').trim();
    const description = String((isJson ? payload?.description : form?.get('description')) || '').trim();
    const coverImage = String((isJson ? (payload?.coverImage ?? payload?.coverUrl) : form?.get('coverImage')) || '').trim();

    const imagesVal = isJson ? payload?.images : form?.get('images');
    const images = Array.isArray(imagesVal)
      ? imagesVal.filter(Boolean)
      : String(imagesVal || '')
          .trim()
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean);

    if (!title) return NextResponse.json({ ok: false, message: 'Missing title' }, { status: 400 });

    await prisma.project.update({
      where: { id },
      data: { title, location: location || null, description: description || null, coverImage: coverImage || null, images }
    });

    revalidatePath('/projects');
    revalidatePath('/admin');
    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${id}`);

    return isJson
      ? NextResponse.json({ ok: true, id })
      : NextResponse.redirect(new URL(`/admin/projects/${id}`, req.url));
  }

  const title = String((isJson ? payload?.title : form?.get('title')) || '').trim();
  const location = String((isJson ? payload?.location : form?.get('location')) || '').trim();
  const description = String((isJson ? payload?.description : form?.get('description')) || '').trim();
  const coverImage = String((isJson ? (payload?.coverImage ?? payload?.coverUrl) : form?.get('coverImage')) || '').trim();

  const imagesVal = isJson ? payload?.images : form?.get('images');
  const images = Array.isArray(imagesVal)
    ? imagesVal.filter(Boolean)
    : String(imagesVal || '')
        .trim()
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

  if (!title) return NextResponse.json({ ok: false, message: 'Missing title' }, { status: 400 });

  const created = await prisma.project.create({
    data: { title, location: location || null, description: description || null, coverImage: coverImage || null, images }
  });

  revalidatePath('/projects');
  revalidatePath('/admin');
  revalidatePath('/admin/projects');

  return isJson
    ? NextResponse.json({ ok: true, id: created.id })
    : NextResponse.redirect(new URL('/admin', req.url));
}
