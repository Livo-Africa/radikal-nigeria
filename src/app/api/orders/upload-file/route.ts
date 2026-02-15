// src/app/api/orders/upload-file/route.ts
// Handles individual file uploads for a pending order.
// Each file is uploaded separately to avoid mobile timeout issues.

import { NextRequest, NextResponse } from 'next/server';
import { validateFile } from '@/lib/fileValidation';
import { sendTelegramMessage, sendTelegramPhoto } from '@/lib/telegram';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const orderId = formData.get('orderId') as string;
        const fileKey = formData.get('fileKey') as string;
        const file = formData.get('file') as File;

        if (!orderId || !fileKey || !file) {
            return NextResponse.json(
                { success: false, error: 'Missing orderId, fileKey, or file' },
                { status: 400 }
            );
        }

        // Validate the file
        const validation = validateFile(file);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: `File validation failed: ${validation.error}` },
                { status: 400 }
            );
        }

        logger.info(`📤 Uploading file for order ${orderId}`, {
            metadata: { fileKey, fileName: file.name, sizeMB: (file.size / 1024 / 1024).toFixed(2) }
        });

        // Send to Telegram
        try {
            const label = fileKey.startsWith('photo_')
                ? `📸 Reference Photo (${fileKey})`
                : `👗 Outfit Upload (${fileKey})`;

            await sendTelegramPhoto(file, `${label} — Order ${orderId}`);
        } catch (telegramError) {
            logger.warn('⚠️ Failed to send file to Telegram, but upload accepted', {
                metadata: { orderId, fileKey, error: String(telegramError) }
            });
            // Don't fail the upload just because Telegram failed
        }

        return NextResponse.json({ success: true, fileKey });

    } catch (error) {
        console.error('❌ Error uploading file:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process file upload' },
            { status: 500 }
        );
    }
}
