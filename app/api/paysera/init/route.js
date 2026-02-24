import { NextResponse } from 'next/server';

// OPTIONAL endpoint if you want to generate Paysera payment URLs server-side.
// Right now, UI uses a placeholder URL builder.

export async function POST() {
  return NextResponse.json({ ok: false, message: 'Not implemented. Configure Paysera first.' }, { status: 501 });
}
