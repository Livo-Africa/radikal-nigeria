
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processOrder } from '@/lib/orderUtils';

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
        console.log(`🔔 Paystack Webhook received: ${event.event}`);

        if (event.event === 'charge.success') {
            const { data } = event;
            const { metadata, reference } = data;

            if (!metadata || !metadata.orderId) {
                console.warn('⚠️ Webhook received for successful charge but NO metadata/orderId found.', reference);
                // We could log this to a "Lost & Found" sheet if we wanted, but for now just acknowledge
                return NextResponse.json({ received: true, status: 'no_metadata' });
            }

            console.log(`✅ Processing order recovery for ${metadata.orderId} via Webhook`);

            // Inject payment reference if not present in metadata
            const orderData = {
                ...metadata,
                paymentReference: reference
            };

            const result = await processOrder(orderData, [], 'webhook');

            if (result.success) {
                console.log(`✅ Webhook successfully processed order ${metadata.orderId}`);
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
