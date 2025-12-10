// src/app/api/orders/route.ts
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

    // Extract files
    const files = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('photo_'))
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
      addOns = [],
      finalTotal,
      timestamp = new Date().toISOString()
    } = orderData;

    // Validate required fields
    if (!orderId || !whatsappNumber || !pkg?.name) {
      throw new Error('Missing required fields: orderId, whatsappNumber, or package name');
    }

    // 1. Send Order Summary to Telegram
    const telegramMessage = formatOrderForTelegram(orderData);
    await sendTelegramMessage(telegramMessage);

    // 2. Send Uploaded Photos to Telegram
    if (files.length > 0) {
      await sendTelegramMessage(`📸 <b>Reference Photos for Order ${orderId}:</b>`);

      // Send photos sequentially to maintain order and respect constraints
      for (const file of files) {
        await sendTelegramPhoto(file);
        // Small delay to prevent rate limiting issues
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // 3. Send Wardrobe Selection Images (if from our wardrobe)
    const wardrobeImages = outfits
      .filter((o: any) => o.imageUrl && o.imageUrl.startsWith('http'))
      .map((o: any) => o.imageUrl);

    if (wardrobeImages.length > 0) {
      // We can send these as text links or just rely on the summary
      // For now, let's keep it simple in the summary to avoid spamming 
      // or we could send a message with links
    }

    // 4. Log to Google Sheets
    try {
      const sheets = initializeSheets();

      if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID environment variable is missing');
      }

      // Format outfits as string
      const outfitsString = Array.isArray(outfits)
        ? outfits.map((outfit: any) => outfit.name || 'Unnamed Outfit').join(', ')
        : '';

      // Extract style preferences
      const hairstyle = style?.hairstyle?.selectedName || style?.hairstyle?.customDescription || 'Not specified';
      const makeup = style?.makeup?.selectedName || style?.makeup?.customDescription || 'Not specified';
      const background = style?.background?.selectedName || style?.background?.customDescription || 'Not specified';

      // Format add-ons
      const addOnsString = Array.isArray(addOns) ? addOns.join(', ') : '';

      // Photo Status
      const photoStatus = files.length > 0 ? `Uploaded ${files.length} photos` : 'No photos uploaded';

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
        'Received',                               // Status
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

      console.log('✅ Order saved to Google Sheets');
    } catch (sheetError) {
      console.error('❌ Failed to save to Google Sheets:', sheetError);
      // Don't fail the whole request if sheet logging fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order processed successfully',
        orderId
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error processing order:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint remains the same for testing
export async function GET() {
  // ... existing GET ...
  return NextResponse.json({ message: 'Use POST to submit orders' });
}