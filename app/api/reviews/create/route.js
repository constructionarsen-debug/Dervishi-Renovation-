import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req) {
  try {
    const form = await req.formData();
    const firstName = String(form.get('firstName') || '').trim();
    const lastName = String(form.get('lastName') || '').trim();
    const email = String(form.get('email') || '').trim();
    const content = String(form.get('content') || '').trim();
    const ratingRaw = String(form.get('rating') || '5').trim();
    const rating = Math.min(5, Math.max(1, Number.parseInt(ratingRaw, 10) || 5));

    if (!firstName || !lastName || !email || !content) {
      return NextResponse.json({ ok: false, message: 'Missing fields' }, { status: 400 });
    }

    await prisma.review.create({
      data: {
        firstName,
        lastName,
        email,
        content,
        rating,
      },
    });

    // If you later show approved reviews on homepage, this will help.
    revalidatePath('/');
    revalidatePath('/review');

    return NextResponse.redirect(new URL('/', req.url));
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
