//src/app/api/orders/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { processOrder } from '@/lib/orderUtils';
import { validateFiles, formatValidationErrors } from '@/lib/fileValidation';
import { sanitizeOrderData, isValidPhoneNumber } from '@/lib/sanitization';
import { logger } from '@/lib/logger';



// Helper to verify Paystack payment
async function verifyPaystackPayment(reference: string): Promise<boolean> {
  if (!reference) return false;
  try {
    const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!SECRET_KEY) {
      console.error('❌ PAYSTACK_SECRET_KEY not configured - payment verification cannot proceed');
      return false; // SECURITY: Always fail if key is missing to prevent unpaid orders
    }

    logger.info('🔍 Verifying payment', { metadata: { reference: 'REF-***' } });
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    });

    const data = await response.json();
    logger.debug('Paystack verification response received', {
      metadata: {
        status: data.status,
        paymentStatus: data.data?.status
      }
    });

    return data.status && data.data.status === 'success';
  } catch (error) {
    console.error('❌ Paystack verification error:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse FormData instead of JSON to handle files
    const formData = await request.formData();

    // Extract JSON data string
    const orderDataString = formData.get('orderData') as string;
    if (!orderDataString) {
      return NextResponse.json({ success: false, error: 'Missing orderData' }, { status: 400 });
    }

    const orderData = JSON.parse(orderDataString);
    logger.info('📦 Received order', { metadata: { orderId: orderData.orderId } });

    // Extract and validate files (User Photos + Outfit Uploads)
    const uploadedFiles = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('photo_') || key.startsWith('outfit_upload_'))
      .map(([_, file]) => file as File);

    // SECURITY: Validate all uploaded files
    const validation = validateFiles(uploadedFiles);

    if (!validation.valid) {
      const errorMessage = formatValidationErrors(validation.errors);
      console.warn('❌ File validation failed:', errorMessage);
      return NextResponse.json(
        {
          success: false,
          error: 'File validation failed: ' + errorMessage
        },
        { status: 400 }
      );
    }

    // Use only validated files
    const files = validation.validFiles;
    logger.info(`✅ ${files.length} files validated`, {
      metadata: {
        fileCount: files.length,
        totalSizeMB: (validation.totalSize / 1024 / 1024).toFixed(2)
      }
    });

    const {
      orderId,
      shootType,
      shootTypeName,
      package: pkg,
      outfits = [],
      style = {},
      whatsappNumber,
      specialRequests = '',
      paymentReference,
      addOns = [],
      finalTotal,
      status: orderStatus = 'confirmed', // 'pending' or 'confirmed'
      timestamp = new Date().toISOString()
    } = orderData;

    // Validate required fields
    if (!orderId || !whatsappNumber || !pkg?.name) {
      throw new Error('Missing required fields: orderId, whatsappNumber, or package name');
    }

    // SECURITY: Validate phone number format
    if (!isValidPhoneNumber(whatsappNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid phone number format. Please provide a valid phone number.'
        },
        { status: 400 }
      );
    }

    // SECURITY: Sanitize all user inputs
    const sanitizedOrderData = sanitizeOrderData(orderData);
    logger.info('✅ Order data sanitized', { metadata: { orderId } });

    // SECURITY: Require payment in production environment (skip for pending orders)
    if (orderStatus !== 'pending') {
      if (process.env.NODE_ENV === 'production' && !paymentReference) {
        console.error('❌ Production order attempted without payment reference');
        return NextResponse.json(
          {
            success: false,
            error: 'Payment required. Please complete payment before submitting your order.'
          },
          { status: 402 } // 402 Payment Required
        );
      }

      // Verify Paystack Payment (Server-side)
      if (paymentReference) {
        const isVerified = await verifyPaystackPayment(paymentReference.reference || paymentReference);
        if (!isVerified) {
          return NextResponse.json(
            { success: false, error: 'Payment verification failed. Please contact support.' },
            { status: 400 }
          );
        }

        logger.info('✅  Payment verified', { metadata: { orderId } });
      } else {
        // Development/testing mode - allow without payment but log it
        logger.warn('⚠️ Order processed without payment (Development mode)', { metadata: { orderId } });
      }
    } else {
      logger.info('⏳ Pending order — skipping payment verification', { metadata: { orderId } });
    }

    // Process Order (Price check, Telegram, Sheets)
    const result = await processOrder(sanitizedOrderData, files, 'client_upload', orderStatus === 'pending' ? 'pending' : 'confirmed');

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Order processing failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, orderId });

  } catch (error) {
    console.error('❌ Error processing order:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing order' },
      { status: 500 }
    );
  }
}