// src/app/api/orders/confirm/route.ts
// Confirms payment for a pending order

import { NextRequest, NextResponse } from 'next/server';
import { confirmOrder } from '@/lib/orderUtils';
import { logger } from '@/lib/logger';

// Helper to verify Paystack payment
async function verifyPaystackPayment(reference: string): Promise<boolean> {
    if (!reference) return false;
    try {
        const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
        if (!SECRET_KEY) {
            console.error('❌ PAYSTACK_SECRET_KEY not configured');
            return false;
        }

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${SECRET_KEY}`,
            },
        });

        const data = await response.json();
        return data.status && data.data.status === 'success';
    } catch (error) {
        console.error('❌ Paystack verification error:', error);
        return false;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, paymentReference } = body;

        if (!orderId || !paymentReference) {
            return NextResponse.json(
                { success: false, error: 'Missing orderId or paymentReference' },
                { status: 400 }
            );
        }

        logger.info('🔄 Confirming pending order', { metadata: { orderId } });

        // Extract the actual reference string
        const refString = typeof paymentReference === 'object'
            ? paymentReference.reference || paymentReference.trxref
            : paymentReference;

        if (!refString) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment reference format' },
                { status: 400 }
            );
        }

        // Verify payment with Paystack
        const isVerified = await verifyPaystackPayment(refString);
        if (!isVerified) {
            logger.warn('❌ Payment verification failed for order confirmation', { metadata: { orderId } });
            return NextResponse.json(
                { success: false, error: 'Payment verification failed. If you were charged, please contact support.' },
                { status: 400 }
            );
        }

        logger.info('✅ Payment verified, confirming order', { metadata: { orderId } });

        // Confirm the order (Telegram + Sheets update)
        const result = await confirmOrder(orderId, refString);

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error || 'Order confirmation failed' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error) {
        console.error('❌ Error confirming order:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error while confirming order' },
            { status: 500 }
        );
    }
}
