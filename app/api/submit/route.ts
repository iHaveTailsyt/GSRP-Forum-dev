// pages/api/submit.ts
import { NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.WEBHOOK_URL; 

export async function POST(req: Request) {
  try {
    const { type, content, name, email } = await req.json();

    if (!type || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const embedTitle =
      type === 'Bug'
        ? '🐞 New Bug Report'
        : '📨 New Feedback Submission';

    const embed = {
      title: embedTitle,
      color: type === 'Bug' ? 0xff4c4c : 0x00b0f4,
      fields: [
        {
          name: '📝 Type',
          value: type,
          inline: true,
        },
        ...(name ? [{ name: '👤 Username', value: name, inline: true }] : []),
        ...(email ? [{ name: '📧 Email', value: email, inline: true }] : []),
        {
          name: '📄 Description',
          value: content.length > 1024 ? content.substring(0, 1021) + '...' : content,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Submitted via KSRP Web Form',
      },
    };

    // Ensure the webhook URL is available before making the request
    if (!WEBHOOK_URL) {
      return NextResponse.json({ error: 'Webhook URL is missing' }, { status: 500 });
    }

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook Error]', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}