import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory store — swap for a DB if you want persistence
const subscribers = new Set<string>();

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  if (subscribers.has(email)) {
    return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
  }

  subscribers.add(email);

  await resend.emails.send({
    from: 'sarah.paluszny@gmail.com',
    to: email,
    subject: "You're subscribers!",
    html: "<p>Thanks for subscribing! You'll get notified when new photos are posted.</p>",
  });

  return NextResponse.json({ success: true });
}