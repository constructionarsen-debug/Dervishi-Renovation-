import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { isValidEmail } from '@/lib/validators';

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name || '').trim();
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '');

  if (!name || !email || !password || password.length < 6) {
    return NextResponse.json({ ok: false, message: 'Plotëso të gjitha fushat (min 6 karaktere për fjalëkalimin).' }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: 'Email i pavlefshëm.' }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ ok: false, message: 'Ky email ekziston. Provo të hyrësh.' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: 'USER'
    }
  });

  return NextResponse.json({ ok: true });
}
