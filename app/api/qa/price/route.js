import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const s = await prisma.siteSettings.findFirst();
    return NextResponse.json({
      qaPriceCents: s?.qaPriceCents ?? 1500,
      currency: s?.currency ?? "EUR",
    });
  } catch (err) {
    // ✅ During build/export or if DB not reachable, return safe defaults
    return NextResponse.json({
      qaPriceCents: 1500,
      currency: "EUR",
      fallback: true,
    });
  }
}