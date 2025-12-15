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

export async function sendTelegramPhoto(photo: string | Blob | File, caption?: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return false;
    }

    try {
        const formData = new FormData();
        formData.append('chat_id', TELEGRAM_CHAT_ID);

        if (photo instanceof File) {
            console.log(`📤 Sending File: ${photo.name} (${photo.size} bytes)`);
            formData.append('photo', photo, photo.name);
        } else if (photo instanceof Blob) {
            console.log(`📤 Sending Blob (${photo.size} bytes)`);
            formData.append('photo', photo, 'blob_photo');
        } else if (typeof photo === 'string') {
            console.log(`📤 Sending URL: ${photo}`);
            formData.append('photo', photo);
        } else {
            console.error('❌ Invalid photo format passed to sendTelegramPhoto');
            return false;
        }

        if (caption) {
            formData.append('caption', caption);
        }

        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!data.ok) {
            console.error('❌ Telegram API Error:', data);
        } else {
            console.log('✅ Telegram Photo Sent Successfully');
        }

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
        shootType,
        package: pkg,
        finalTotal,
        outfits = [],
        style = {},
        specialRequests,
        addOns = [],
        groupSize
    } = order;

    // Handle outfits - could be wardrobe selections with urls, uploads, or auto-selected
    let outfitList = 'None selected';
    if (Array.isArray(outfits) && outfits.length > 0) {
        outfitList = outfits.map((o: any) => {
            if (o.uploaded) {
                return `- 📤 ${o.name} (Uploaded)`;
            } else if (o.autoSelected) {
                return `- ✨ ${o.name}`;
            } else if (o.image) {
                // Wardrobe selection with link
                return `- <b>${o.name}</b> (${o.category || 'Wardrobe'})\n   🔗 ${o.image}`;
            } else {
                return `- <b>${o.name || 'Unnamed'}</b>`;
            }
        }).join('\n');
    }

    const addOnsList = addOns.length > 0
        ? addOns.join(', ')
        : 'None';

    // Detect currency based on Order ID prefix (RAD-GH means Ghana)
    const isGhana = orderId?.toString().includes('RAD-GH');
    const currency = isGhana ? 'GHS' : 'NGN';

    // Group size info
    const groupInfo = groupSize ? `\n👥 <b>Group Size:</b> ${groupSize} people` : '';

    return `
🆕 <b>NEW ORDER RECEIVED</b>

🆔 <b>Order ID:</b> <code>${orderId}</code>
📱 <b>Phone:</b> ${whatsappNumber}
📸 <b>Shoot Type:</b> ${shootTypeName || shootType || 'Not specified'}
📦 <b>Package:</b> ${pkg?.name || 'Unknown'}
💰 <b>Total:</b> ${currency} ${finalTotal?.toLocaleString() || 0}${groupInfo}

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
