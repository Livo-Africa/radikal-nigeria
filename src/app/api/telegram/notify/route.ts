// src/app/api/telegram/notify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      orderId,
      customer,
      package: pkg,
      amount,
      urgent = false
    } = body;

    console.log('📢 Sending Telegram notification for order:', orderId);

    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Telegram environment variables not set');
      return NextResponse.json(
        { success: false, error: 'Telegram configuration missing' },
        { status: 500 }
      );
    }

    // Format the message with emojis and formatting
    const message = `
🎉 *NEW RADIKAL ORDER* 🎉

*Order ID:* ${orderId}
*Customer:* \`${customer}\`
*Package:* ${pkg}
*Amount:* ₵${amount}
*Status:* ${urgent ? '🚨 URGENT - RUSH DELIVERY' : '📦 Standard Delivery'}

*Timestamp:* ${new Date().toLocaleString('en-GH', { 
  timeZone: 'Africa/Accra',
  dateStyle: 'medium',
  timeStyle: 'medium'
 })}

${urgent ? '⚡ *PRIORITY PROCESSING REQUIRED* ⚡' : ''}
    `.trim();

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
          disable_notification: false,
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramResult.ok) {
      console.error('❌ Telegram API error:', telegramResult);
      throw new Error(telegramResult.description || 'Telegram API error');
    }

    console.log('✅ Telegram notification sent successfully');
    console.log('📝 Message ID:', telegramResult.result.message_id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Telegram notification sent',
        messageId: telegramResult.result.message_id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send Telegram notification',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Test endpoint (GET)
export async function GET() {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: 'Telegram environment variables not set' },
        { status: 500 }
      );
    }

    // Test bot connection by getting bot info
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