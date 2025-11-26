// app/api/telegram/notify/route.ts (REPLACE ENTIRE FILE)
import { NextRequest, NextResponse } from 'next/server';

// Helper to convert base64/image URL to blob
async function urlToBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    return await response.blob();
  } catch (error) {
    throw new Error(`Image conversion failed: ${error.message}`);
  }
}

// Send photo to Telegram
async function sendTelegramPhoto(photoBlob: Blob, chatId: string, botToken: string, caption: string) {
  const formData = new FormData();
  formData.append('photo', photoBlob, `customer_photo_${Date.now()}.jpg`);
  formData.append('chat_id', chatId);
  formData.append('caption', caption);
  formData.append('parse_mode', 'HTML');

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendPhoto`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Telegram API error: ${error.description}`);
  }

  return response.json();
}

// Send message to Telegram
async function sendTelegramMessage(chatId: string, botToken: string, message: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Telegram API error: ${error.description}`);
  }

  return response.json();
}

export async function POST(request: NextRequest) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  // Validate environment variables
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json(
      { success: false, error: 'Service configuration error' },
      { status: 500 }
    );
  }

  let orderData;
  try {
    orderData = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }

  const {
    orderId,
    customer,
    package: pkg,
    amount,
    urgent = false,
    photos = [],
    formData = {}
  } = orderData;

  // Validate required fields
  if (!orderId || !customer || !pkg?.name) {
    return NextResponse.json(
      { success: false, error: 'Missing required order information' },
      { status: 400 }
    );
  }

  try {
    // Format main order message
    const orderMessage = `
 <b>NEW RADIKAL ORDER</b> 

<b>Order ID:</b> <code>${orderId}</code>
<b>Customer:</b> <code>${customer}</code>
<b>Package:</b> ${pkg.name}
<b>Amount:</b> ₵${amount}
<b>Status:</b> ${urgent ? ' <b>URGENT - RUSH DELIVERY</b>' : ' Standard Delivery'}

<b>Shoot Type:</b> ${formData.shootTypeName || 'Not specified'}
<b>Outfits Selected:</b> ${formData.outfits?.length || 0}
<b>Special Requests:</b> ${formData.specialRequests ? 'Yes' : 'None'}

<b>Add-ons:</b> ${formData.addOns?.length ? formData.addOns.join(', ') : 'None'}

<b>Timestamp:</b> ${new Date().toLocaleString('en-GH', { 
  timeZone: 'Africa/Accra',
  dateStyle: 'medium',
  timeStyle: 'medium'
})}

${urgent ? '⚡ <b>PRIORITY PROCESSING REQUIRED</b> ⚡' : ''}
    `.trim();

    // 1. Send main order message
    await sendTelegramMessage(TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN, orderMessage);

    // 2. Send customer photos if available
    if (photos.length > 0) {
      // Send photo count summary
      await sendTelegramMessage(
        TELEGRAM_CHAT_ID, 
        TELEGRAM_BOT_TOKEN, 
        `📸 <b>Customer Photos (${photos.length})</b> - Order: <code>${orderId}</code>`
      );

      // Send each photo with delay to avoid rate limits
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        try {
          if (photo.preview) {
            const photoBlob = await urlToBlob(photo.preview);
            const caption = `📸 Photo ${i + 1}/${photos.length} - ${photo.type === 'face' ? 'Face Selfie' : 'Body Photo'}`;
            
            await sendTelegramPhoto(photoBlob, TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN, caption);
            
            // Rate limiting: wait between photos
            if (i < photos.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (photoError) {
          // Continue with next photo if one fails
          await sendTelegramMessage(
            TELEGRAM_CHAT_ID, 
            TELEGRAM_BOT_TOKEN, 
            `⚠️ Failed to send photo ${i + 1} for order <code>${orderId}</code>`
          );
          continue;
        }
      }

      // Send completion message
      await sendTelegramMessage(
        TELEGRAM_CHAT_ID, 
        TELEGRAM_BOT_TOKEN, 
        `✅ All ${photos.length} photos received for order <code>${orderId}</code>`
      );
    } else {
      // No photos notification
      await sendTelegramMessage(
        TELEGRAM_CHAT_ID, 
        TELEGRAM_BOT_TOKEN, 
        `ℹ️ No customer photos uploaded for order <code>${orderId}</code>`
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Order notification sent successfully',
        photosSent: photos.length
      },
      { status: 200 }
    );

  } catch (error) {
    // Log to your error tracking service (Sentry, etc.)
    console.error('Telegram notification error:', error);

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order notification'
      },
      { status: 500 }
    );
  }
}

// Keep the existing GET endpoint for testing
export async function GET() {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return NextResponse.json(
      { error: 'Service not configured' },
      { status: 500 }
    );
  }

  try {
    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`
    );
    const botInfo = await botInfoResponse.json();

    if (!botInfo.ok) {
      throw new Error('Telegram bot connection failed');
    }

    return NextResponse.json({
      success: true,
      bot: botInfo.result,
      chatId: TELEGRAM_CHAT_ID,
      message: 'Telegram service is operational'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Telegram service test failed' },
      { status: 500 }
    );
  }
}