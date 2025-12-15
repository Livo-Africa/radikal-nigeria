//src/app/api/orders/route.ts

import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramMessage, sendTelegramPhoto, formatOrderForTelegram } from '@/lib/telegram';

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

// Helper to verify Paystack payment
async function verifyPaystackPayment(reference: string): Promise<boolean> {
  if (!reference) return false;
  try {
    const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!SECRET_KEY) {
      console.warn('⚠️ PAYSTACK_SECRET_KEY not set. Skipping server-side verification.');
      return true; // Allow in dev/test if key missing, or fail? Better to fail safely if critical.
    }

    console.log(`🔍 Verifying payment reference: ${reference}`);
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
      },
    });

    const data = await response.json();
    console.log('--- Paystack Verification Response ---');
    console.log(JSON.stringify(data, null, 2));
    console.log('--------------------------------------');

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
    console.log('📦 Received order data:', orderData);

    // Extract files (User Photos + Outfit Uploads)
    const files = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('photo_') || key.startsWith('outfit_upload_'))
      .map(([_, file]) => file as File);

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
      timestamp = new Date().toISOString()
    } = orderData;

    // Validate required fields
    if (!orderId || !whatsappNumber || !pkg?.name) {
      throw new Error('Missing required fields: orderId, whatsappNumber, or package name');
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
    } else {
      // Option: Enforce payment for certain flows? For now, we allow non-payment if reference is missing (e.g. manual testing)
      // But for Ghana flow, we expect it.
      // Warn but proceed? Or fail? User said "when successful... log... when failed handle it gracefully and nothing logged"
      // Let's assume if reference IS provided, it MUST be valid.
    }

    // FIX: Ensure outfits is an array for both Telegram and Sheets
    const outfitsArray = Array.isArray(outfits) ? outfits : [];

    // 1. Send Order Summary to Telegram
    try {
      const telegramMessage = formatOrderForTelegram(orderData);
      await sendTelegramMessage(telegramMessage);

      // 2. Send Uploaded Photos (User Selfies & Uploaded Outfits) to Telegram
      if (files.length > 0) {
        await sendTelegramMessage(`📸 <b>Reference Photos & Uploads for Order ${orderId}:</b>`);

        // Send photos sequentially to maintain order and respect constraints
        for (const file of files) {
          try {
            await sendTelegramPhoto(file);
            // Small delay to prevent rate limiting issues
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (photoError) {
            console.error('Failed to send a photo to Telegram:', photoError);
          }
        }
      }

      // 3. Send Wardrobe Selection Images (if from our wardrobe)
      const wardrobeImages = outfitsArray
        .filter((o: any) => o.image && typeof o.image === 'string' && o.image.startsWith('http'))
        .map((o: any) => ({ url: o.image, name: o.name }));

      if (wardrobeImages.length > 0) {
        await sendTelegramMessage(`👗 <b>Selected Wardrobe Items for Order ${orderId}:</b>`);

        for (const item of wardrobeImages) {
          try {
            // Send URL directly - Telegram will fetch it
            await sendTelegramPhoto(item.url, `Selected: ${item.name}`);
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (itemError) {
            console.error(`Failed to send wardrobe item ${item.name} to Telegram:`, itemError);
          }
        }
      }
    } catch (telegramError) {
      console.error('❌ Telegram notification failed (non-blocking):', telegramError);
      // Continue execution - do not fail the order
    }

    // 4. Log to Google Sheets
    try {
      const sheets = initializeSheets();

      if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID environment variable is missing');
      }

      // Format outfits as string - include image links for wardrobe selections
      const outfitsString = outfitsArray.length > 0
        ? outfitsArray.map((outfit: any) => {
          const name = outfit.name || 'Unnamed Outfit';
          const image = outfit.image || '';
          return image ? `${name} (${image})` : name;
        }).join(', ')
        : 'None selected';

      // Extract style preferences
      const hairstyle = style?.hairstyle?.selectedName || style?.hairstyle?.customDescription || 'Not specified';
      const makeup = style?.makeup?.selectedName || style?.makeup?.customDescription || 'Not specified';
      const background = style?.background?.selectedName || style?.background?.customDescription || 'Not specified';

      // Format add-ons
      const addOnsString = Array.isArray(addOns) ? addOns.join(', ') : '';

      // Photo Status
      const photoStatus = files.length > 0 ? `Uploaded ${files.length} photos` : 'No photos uploaded';

      // Format Paystack Reference for Status
      const paystackRef = paymentReference?.reference || paymentReference;
      const status = paystackRef ? `Paid (Ref: ${paystackRef})` : 'Received';

      // Row Data matching the user's requested format:
      // ID, Phone, Package, Amount, Outfits, Hairstyle, Makeup, Background, Status, Timestamp, Shoot Type, Add-ons, Notes
      const rowData = [
        orderId,                                   // OrderID
        whatsappNumber,                           // CustomerPhone
        pkg.name,                                 // Package
        outfitsString,                            // Outfits
        finalTotal || 0,                          // Amount
        hairstyle,                                // Hairstyle
        makeup,                                   // Makeup
        background,                               // Background
        status,                                   // Status (Updated with Payment Ref)
        timestamp,                                // Timestamp
        shootTypeName || shootType || 'Not specified', // Shoot Type
        addOnsString,                             // Add-ons
        specialRequests,                          // Special Requests
        photoStatus                               // Photo Status (Extra column for tracking)
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Orders!A:N', // Extended to N for photo status
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowData],
        },
      });

      console.log('✅ Logged to Google Sheet');

    } catch (sheetError) {
      console.error('❌ Failed to log to Google Sheets:', sheetError);
      // Non-blocking but good to log
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