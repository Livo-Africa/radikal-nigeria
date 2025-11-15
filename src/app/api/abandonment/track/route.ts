import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      currentStep,
      formData,
      timestamp,
      reason = 'unknown'
    } = body;

    console.log('🚨 Tracking abandonment:', { sessionId, currentStep, reason });

    // Telegram Bot Configuration (SECOND BOT)
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_ABANDONMENT_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ABANDONMENT_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Abandonment Telegram environment variables not set');
      return NextResponse.json(
        { success: false, error: 'Abandonment tracking configuration missing' },
        { status: 500 }
      );
    }

    // Extract relevant data
    const phoneNumber = formData?.whatsappNumber || 'Not provided yet';
    const shootType = formData?.shootTypeName || formData?.shootType || 'Not selected';
    const packageName = formData?.package?.name || 'Not selected';
    const progress = `${currentStep}/7`;

    // Format the abandonment message
    const message = `
🚨 *RADIKAL BOOKING ABANDONED* 🚨

*Progress:* Step ${progress}
*Phone:* \`${phoneNumber}\`
*Shoot Type:* ${shootType}
*Package:* ${packageName}
*Reason:* ${reason}

*Timestamp:* ${new Date(timestamp).toLocaleString('en-GH', { 
  timeZone: 'Africa/Accra',
  dateStyle: 'medium',
  timeStyle: 'medium'
})}

*Session ID:* ${sessionId}

💬 *FOLLOW-UP REQUIRED* 💬
    `.trim();

    // Send message to Telegram (SECOND BOT)
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
      console.error('❌ Abandonment Telegram API error:', telegramResult);
      throw new Error(telegramResult.description || 'Telegram API error');
    }

    console.log('✅ Abandonment alert sent to Telegram');
    console.log('📝 Message ID:', telegramResult.result.message_id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Abandonment tracked successfully',
        messageId: telegramResult.result.message_id
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error tracking abandonment:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to track abandonment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}