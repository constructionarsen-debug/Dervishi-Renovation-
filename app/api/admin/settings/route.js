import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') return NextResponse.json({ ok: false }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const qaPriceCents = Number(body.qaPriceCents);
  if (!Number.isFinite(qaPriceCents) || qaPriceCents < 0) {
    return NextResponse.json({ ok: false, error: 'bad price' }, { status: 400 });
  }

  const existing = await prisma.siteSettings.findFirst();
  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data: { qaPriceCents } });
  } else {
    await prisma.siteSettings.create({ data: { qaPriceCents, currency: 'EUR' } });
  }

  return NextResponse.json({ ok: true });
}
