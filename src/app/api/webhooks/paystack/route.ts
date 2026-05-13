
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processOrder, confirmOrder } from '@/lib/orderUtils';

export async function POST(req: NextRequest) {
    try {
        const secret = process.env.PAYSTACK_SECRET_KEY;
        if (!secret) {
            console.error('❌ PAYSTACK_SECRET_KEY is not defined');
            return NextResponse.json({ error: 'Server Configuration Error' }, { status: 500 });
        }

        const signature = req.headers.get('x-paystack-signature');
        if (!signature) {
            return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
        }

        // Get raw body for verification
        const rawBody = await req.text();

        // Verify signature
        const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

        if (hash !== signature) {
            console.error('❌ Invalid Paystack signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(rawBody);
        console.warn(`🔔 Paystack Webhook received: ${event.event}`);

        if (event.event === 'charge.success') {
            const { data } = event;
            const { metadata, reference } = data;

            if (!metadata || !metadata.orderId) {
                console.warn('⚠️ Webhook received for successful charge but NO metadata/orderId found.', reference);
                return NextResponse.json({ received: true, status: 'no_metadata' });
            }

            console.warn(`✅ Processing webhook for ${metadata.orderId}`);

            // Strategy: Try to confirm a pending order first.
            // If the client already confirmed (dedup), webhook just acknowledges.
            // If confirmOrder truly fails, fall back to full processOrder with webhook_recovery.
            try {
                const confirmResult = await confirmOrder(metadata.orderId, reference);

                if (confirmResult.alreadyConfirmed) {
                    console.warn(`ℹ️ Order ${metadata.orderId} already confirmed by client — webhook skipping`);
                    return NextResponse.json({ received: true, status: 'already_confirmed' });
                }

                if (confirmResult.success) {
                    console.warn(`✅ Webhook confirmed pending order ${metadata.orderId}`);
                    return NextResponse.json({ received: true, status: 'confirmed' });
                }

                // confirmOrder returned success: false — fall through to recovery
                console.error(`⚠️ confirmOrder failed for ${metadata.orderId}, falling back to recovery`);

            } catch (confirmError) {
                console.error(`⚠️ confirmOrder threw for ${metadata.orderId}, falling back to full processOrder:`, confirmError);
            }

            // Fallback: Full processOrder with webhook_recovery status
            // This handles the case where the pending upload never completed
            const orderData = {
                ...metadata,
                paymentReference: reference
            };

            const result = await processOrder(orderData, [], 'webhook', 'webhook_recovery');

            if (result.success) {
                console.warn(`✅ Webhook processed order ${metadata.orderId} (full recovery)`);
                return NextResponse.json({ received: true, status: 'processed' });
            } else {
                console.error(`❌ Webhook failed to process order ${metadata.orderId}:`, result.error);
                return NextResponse.json({ received: true, status: 'processing_failed', error: result.error });
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('❌ Webhook error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
