// src/lib/telegram.ts
import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(text: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('⚠️ Telegram credentials not found. Skipping message.');
        return false;
    }

    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'HTML',
                disable_web_page_preview: true
            }),
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('❌ Failed to send Telegram message:', error);
        return false;
    }
}

export async function sendTelegramPhoto(photo: Blob | File, caption?: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);
        if (photo instanceof File) {
            formData.append('photo', photo, photo.name);
        } else {
            formData.append('photo', photo);
        }
        if (caption) {
            formData.append('caption', caption);
        }

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error('❌ Failed to send Telegram photo:', error);
        return false;
    }
}

// Helper to format order for Telegram
export function formatOrderForTelegram(order: any) {
    const {
        orderId,
        whatsappNumber,
        shootTypeName,
        package: pkg,
        finalTotal,
        outfits = [],
        style = {},
        specialRequests,
        addOns = []
    } = order;

    const outfitList = outfits.length > 0
        ? outfits.map((o: any) => `- <b>${o.name}</b> (${o.category})`).join('\n')
        : 'None selected';

    const addOnsList = addOns.length > 0
        ? addOns.join(', ')
        : 'None';

    return `
🆕 <b>NEW ORDER RECEIVED</b>

🆔 <b>Order ID:</b> <code>${orderId}</code>
📱 <b>Phone:</b> ${whatsappNumber}
📸 <b>Shoot Type:</b> ${shootTypeName || 'Not specified'}
📦 <b>Package:</b> ${pkg?.name || 'Unknown'}
💰 <b>Total:</b> GHS ${finalTotal}

👗 <b>Outfits Selected:</b>
${outfitList}

💇 <b>Style Preferences:</b>
- Hairstyle: ${style?.hairstyle?.selectedName || style?.hairstyle?.customDescription || 'Not specified'}
- Makeup: ${style?.makeup?.selectedName || style?.makeup?.customDescription || 'Not specified'}
- Background: ${style?.background?.selectedName || style?.background?.customDescription || 'Not specified'}

➕ <b>Add-ons:</b> ${addOnsList}

📝 <b>Notes:</b>
${specialRequests || 'No special requests'}

<i>Please check Google Sheets for full details.</i>
`;
}
