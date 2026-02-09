
import { google } from 'googleapis';
import { sendTelegramMessage, sendTelegramPhoto, formatOrderForTelegram } from '@/lib/telegram';
import { verifyOrderPrice } from '@/lib/pricing';

// Initialize Google Sheets
function initializeSheets() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        console.error('❌ Failed to initialize Google Sheets:', error);
        throw new Error('Google Sheets initialization failed');
    }
}

export interface ProcessingResult {
    success: boolean;
    orderId?: string;
    error?: string;
    priceVerified?: boolean;
    warnings?: string[];
}

/**
 * Centrally process an order
 * usable by both the main order endpoint and the Paystack webhook
 */
export async function processOrder(
    orderData: any,
    files: File[] = [],
    source: 'client_upload' | 'webhook' = 'client_upload'
): Promise<ProcessingResult> {
    const warnings: string[] = [];
    const {
        orderId,
        whatsappNumber,
        package: pkg,
        finalTotal,
        paymentReference,
        shootType,
        shootTypeName,
        outfits = [],
        style = {},
        specialRequests = '',
        addOns = [],
        timestamp = new Date().toISOString()
    } = orderData;

    console.log(`🔄 Processing Order ${orderId} from ${source}`);

    // 1. Price Verification
    const priceVerification = verifyOrderPrice(
        {
            orderId,
            shootType,
            package: pkg,
            groupSize: orderData.groupSize,
            addOns
        },
        finalTotal
    );

    if (!priceVerification.valid) {
        console.error(`❌ Price mismatch for ${orderId}: Client=${finalTotal}, Server=${priceVerification.serverTotal}`);
        // For webhooks, we mark it but don't fail, we want to log the fraud attempt
        // For client uploads, we might want to fail hard? 
        // Logic: if money is paid (webhook), we log it. if client is trying to submit, we block.
        if (source === 'client_upload') {
            return {
                success: false,
                error: 'Order validation failed. Price mismatch.',
                priceVerified: false
            };
        }
        warnings.push(`Price mismatch detected! Paid: ${finalTotal}, Should be: ${priceVerification.serverTotal}`);
    } else {
        console.log(`✅ Price verified: ${finalTotal}`);
    }

    // 2. Telegram Notifications
    try {
        let telegramMessage = formatOrderForTelegram(orderData);

        // Add warnings to message
        if (warnings.length > 0) {
            telegramMessage += `\n\n⚠️ <b>WARNINGS:</b>\n${warnings.join('\n')}`;
        }

        if (source === 'webhook') {
            telegramMessage += `\n\nℹ️ <b>Source:</b> Paystack Webhook (Backup Log)\n⚠️ <b>Note:</b> User photos may be missing if they didn't complete the upload. Contact client if photos are needed.`;
        }

        await sendTelegramMessage(telegramMessage);

        const outfitsArray = Array.isArray(outfits) ? outfits : [];

        // Send Files (if available)
        if (files.length > 0) {
            await sendTelegramMessage(`📸 <b>Reference Photos & Uploads for Order ${orderId}:</b>`);
            for (const file of files) {
                try {
                    await sendTelegramPhoto(file);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (e) {
                    console.error('Failed to send photo:', e);
                }
            }
        } else if (source === 'webhook') {
            // Notify that files are missing only if it's a webhook recovery
            // If it's a client upload with no files (and optional), it's fine.
            // But usually files are compulsory.
            // We can check if files were expected.
            await sendTelegramMessage(`⚠️ <b>No photos attached to this webhook event.</b>\nEnsure client completes the upload flow.`);
        }

        // Send Wardrobe Selections
        const wardrobeImages = outfitsArray
            .filter((o: any) => o.image && typeof o.image === 'string' && o.image.startsWith('http'))
            .map((o: any) => ({ url: o.image, name: o.name }));

        if (wardrobeImages.length > 0) {
            await sendTelegramMessage(`👗 <b>Selected Wardrobe Items for Order ${orderId}:</b>`);
            for (const item of wardrobeImages) {
                try {
                    await sendTelegramPhoto(item.url, `Selected: ${item.name}`);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (e) {
                    console.error('Failed to send wardrobe item:', e);
                }
            }
        }

    } catch (telegramError) {
        console.error('❌ Telegram notification failed:', telegramError);
        warnings.push('Telegram notification failed');
    }


    // 3. Google Sheets Logging
    try {
        const sheets = initializeSheets();
        if (!process.env.GOOGLE_SHEET_ID) throw new Error('GOOGLE_SHEET_ID missing');

        // Safe access for nested properties
        const pkgName = pkg?.name || 'Unknown Package';

        const outfitsArray = Array.isArray(outfits) ? outfits : [];
        const outfitsString = outfitsArray.length > 0
            ? outfitsArray.map((outfit: any) => {
                const name = outfit?.name || 'Unnamed Outfit';
                const image = outfit?.image || '';
                return image ? `${name} (${image})` : name;
            }).join(', ')
            : 'None selected';

        // Safe style access
        const hairstyle = style?.hairstyle?.selectedName || style?.hairstyle?.customDescription || 'Not specified';
        const makeup = style?.makeup?.selectedName || style?.makeup?.customDescription || 'Not specified';
        const background = style?.background?.selectedName || style?.background?.customDescription || 'Not specified';

        const addOnsString = Array.isArray(addOns) ? addOns.join(', ') : '';

        const photoStatus = files.length > 0
            ? `Uploaded ${files.length} photos`
            : (source === 'webhook' ? 'MISSING (Webhook Recovery)' : 'No photos uploaded');

        const paystackRef = paymentReference?.reference || paymentReference || 'N/A';
        let status = paystackRef !== 'N/A' ? `Paid (Ref: ${paystackRef})` : 'Received';
        if (source === 'webhook') status += ' [WEBHOOK RECOVERY]';

        // Row Data - Ensure all fields are strings or numbers, no objects/undefined that could break Sheets
        const rowData = [
            orderId || 'N/A',
            whatsappNumber || 'N/A',
            pkgName,
            outfitsString,
            finalTotal || 0,
            hairstyle,
            makeup,
            background,
            status,
            timestamp || new Date().toISOString(),
            shootTypeName || shootType || 'Not specified',
            addOnsString,
            specialRequests || '',
            photoStatus
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Orders!A:N',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            requestBody: { values: [rowData] },
        });

        console.log('✅ Logged to Google Sheet');

    } catch (sheetError: any) {
        // Detailed error logging
        console.error('❌ Failed to log to Google Sheets:', sheetError?.message || sheetError);
        console.error('Diagnostic Data:', {
            orderId,
            hasPkg: !!pkg,
            hasSheetId: !!process.env.GOOGLE_SHEET_ID
        });
        warnings.push(`Google Sheets logging failed: ${sheetError?.message || 'Unknown error'}`);
    }

    return {
        success: true,
        orderId,
        priceVerified: priceVerification.valid,
        warnings
    };
}

