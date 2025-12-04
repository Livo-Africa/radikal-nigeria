// src/app/api/telegram/notify/route.ts
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  try {
    // Check for environment variables
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Telegram environment variables missing');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    // Extract basic fields
    const shootTypeName = formData.get('shootTypeName') as string;
    const packageName = formData.get('packageName') as string;
    const price = formData.get('price') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const vibe = formData.get('vibe') as string;
    const editingStyle = formData.get('editingStyle') as string;
    const outfitDescription = formData.get('outfitDescription') as string;
    const specialRequests = formData.get('specialRequests') as string;
    const orderId = formData.get('orderId') as string || 'N/A';

    // Parse JSON fields safely
    let addOns: string[] = [];
    try {
      addOns = JSON.parse(formData.get('addOns') as string || '[]');
    } catch (e) {
      console.error('Error parsing addOns:', e);
    }

    let musicGenre: string[] = [];
    try {
      musicGenre = JSON.parse(formData.get('musicGenre') as string || '[]');
    } catch (e) {
      console.error('Error parsing musicGenre:', e);
    }

    // Construct Message
    let message = `📸 *NEW BOOKING RECEIVED*\n`;
    message += `🆔 *Order ID:* \`${orderId}\`\n\n`;
    message += `👤 *Customer:* \`${whatsappNumber}\`\n`;
    message += `📷 *Shoot:* ${shootTypeName}\n`;
    message += `📦 *Package:* ${packageName} (₵${price})\n\n`;

    message += `🎨 *Style Preferences*\n`;
    if (vibe) message += `• Vibe: ${vibe}\n`;
    if (editingStyle) message += `• Edit: ${editingStyle}\n`;
    if (musicGenre.length) message += `• Music: ${musicGenre.join(', ')}\n`;

    if (outfitDescription) {
      message += `\n👗 *Outfit Notes:*\n${outfitDescription}\n`;
    }

    if (addOns.length > 0) {
      message += `\n➕ *Add-ons:*\n${addOns.join(', ')}\n`;
    }

    if (specialRequests) {
      message += `\n📝 *Special Requests:*\n${specialRequests}\n`;
    }

    // 1. Send Text Message
    const textRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!textRes.ok) {
      const errorText = await textRes.text();
      console.error('Telegram Text Error:', errorText);

      // Fallback to HTML if Markdown fails
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message.replace(/\*/g, '').replace(/`/g, ''), // Strip markdown chars
        }),
      });
    }

    // 2. Send Images (Outfits & User Photos)
    const imageKeys = Array.from(formData.keys()).filter(key =>
      key.startsWith('outfit_') || key.startsWith('user_photo_')
    );

    for (const key of imageKeys) {
      const file = formData.get(key);

      try {
        if (file instanceof File) {
          const imageFormData = new FormData();
          imageFormData.append('chat_id', TELEGRAM_CHAT_ID);
          imageFormData.append('photo', file);
          imageFormData.append('caption', `📎 ${key.replace(/_/g, ' ').toUpperCase()}`);

          const imgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: imageFormData,
          });

          if (!imgRes.ok) console.error(`Failed to send image ${key}:`, await imgRes.text());

        } else if (typeof file === 'string' && file.startsWith('http')) {
          // Handle URL images (if any)
          await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              photo: file,
              caption: `📎 ${key.replace(/_/g, ' ').toUpperCase()}`
            }),
          });
        }
      } catch (imgError) {
        console.error(`Error processing image ${key}:`, imgError);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Telegram Notification Error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// Optional: Test endpoint (GET)
export async function GET() {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: 'Telegram environment variables not set' },
        { status: 500 }
      );
    }

    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );

    const botInfo = await botInfoResponse.json();

    if (!botInfo.ok) {
      throw new Error('Failed to connect to Telegram Bot');
    }

    return NextResponse.json({
      success: true,
      bot: botInfo.result,
      chatId: TELEGRAM_CHAT_ID,
      message: 'Telegram bot is connected and ready'
    });

  } catch (error) {
    console.error('Telegram test error:', error);
    return NextResponse.json(
      { error: 'Telegram bot test failed' },
      { status: 500 }
    );
  }
}