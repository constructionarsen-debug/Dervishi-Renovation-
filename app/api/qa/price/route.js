import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const s = await prisma.siteSettings.findFirst();
  return NextResponse.json({ qaPriceCents: s?.qaPriceCents ?? 1500, currency: s?.currency ?? 'EUR' });
}
