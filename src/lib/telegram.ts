// src/lib/telegram.ts
import { NextResponse } from 'next/server';
import { escapeHtml } from '@/lib/sanitization';

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

const TELEGRAM_TIMEOUT_MS = 30_000; // 30s timeout per attempt
const MAX_PHOTO_RETRIES = 2; // 2 retries = 3 total attempts

export async function sendTelegramPhoto(photo: string | Blob | File, caption?: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return false;
    }

    for (let attempt = 0; attempt <= MAX_PHOTO_RETRIES; attempt++) {
        try {
            if (attempt > 0) {
                const delay = 1000 * Math.pow(2, attempt - 1);
                console.warn(`🔄 Telegram photo retry ${attempt}/${MAX_PHOTO_RETRIES} in ${delay}ms...`);
                await new Promise(r => setTimeout(r, delay));
            }

            // Rebuild FormData each attempt (some runtimes consume the body)
            const formData = new FormData();
            formData.append('chat_id', TELEGRAM_CHAT_ID);

            if (photo instanceof File) {
                formData.append('photo', photo, photo.name);
            } else if (photo instanceof Blob) {
                formData.append('photo', photo, 'blob_photo');
            } else if (typeof photo === 'string') {
                formData.append('photo', photo);
            } else {
                console.error('❌ Invalid photo format passed to sendTelegramPhoto');
                return false;
            }

            if (caption) {
                formData.append('caption', caption);
            }

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), TELEGRAM_TIMEOUT_MS);

            const response = await fetch(
                `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
                { method: 'POST', body: formData, signal: controller.signal }
            );

            clearTimeout(timeout);
            const data = await response.json();

            if (data.ok) {
                return true;
            }

            console.error(`❌ Telegram API Error (attempt ${attempt + 1}):`, data);

            // Don't retry on client errors (bad file format, etc.)
            if (data.error_code && data.error_code < 500) {
                return false;
            }

        } catch (error) {
            const isTimeout = error instanceof DOMException && error.name === 'AbortError';
            console.error(
                `❌ Telegram photo ${isTimeout ? 'timeout' : 'error'} (attempt ${attempt + 1}):`,
                error
            );
        }
    }

    console.error('❌ All Telegram photo retry attempts exhausted');
    return false;
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
                return `- 📤 ${escapeHtml(o.name)} (Uploaded)`;
            } else if (o.autoSelected) {
                return `- ✨ ${escapeHtml(o.name)}`;
            } else if (o.image) {
                // Wardrobe selection with link - note: URL is not escaped as it's server-provided
                return `- <b>${escapeHtml(o.name)}</b> (${escapeHtml(o.category || 'Wardrobe')})\n   🔗 ${o.image}`;
            } else {
                return `- <b>${escapeHtml(o.name || 'Unnamed')}</b>`;
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
📱 <b>Phone:</b> ${escapeHtml(whatsappNumber)}
📸 <b>Shoot Type:</b> ${escapeHtml(shootTypeName || shootType || 'Not specified')}
📦 <b>Package:</b> ${escapeHtml(pkg?.name || 'Unknown')}
💰 <b>Total:</b> ${currency} ${finalTotal?.toLocaleString() || 0}${groupInfo}

👗 <b>Outfits Selected:</b>
${outfitList}

💇 <b>Style Preferences:</b>
- Hairstyle: ${escapeHtml(style?.hairstyle?.selectedName || style?.hairstyle?.customDescription || 'Not specified')}
- Makeup: ${escapeHtml(style?.makeup?.selectedName || style?.makeup?.customDescription || 'Not specified')}
- Background: ${escapeHtml(style?.background?.selectedName || style?.background?.customDescription || 'Not specified')}

➕ <b>Add-ons:</b> ${escapeHtml(addOnsList)}

📝 <b>Notes:</b>
${escapeHtml(specialRequests || 'No special requests')}

<i>Please check Google Sheets for full details.</i>
`;
}
