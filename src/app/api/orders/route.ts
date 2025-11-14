// src/app/api/orders/route.ts
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

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
  let body;
  
  try {
    // Parse the request body first
    body = await request.json();
    console.log('📦 Received order data:', body);
  } catch (parseError) {
    console.error('❌ Failed to parse request body:', parseError);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      },
      { status: 400 }
    );
  }

  try {
    const sheets = initializeSheets();
    
    // Validate required environment variables
    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('GOOGLE_SHEET_ID environment variable is missing');
    }

    // Extract and format order data
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
    } = body;

    // Validate required fields
    if (!orderId || !whatsappNumber || !pkg?.name) {
      throw new Error('Missing required fields: orderId, whatsappNumber, or package name');
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

    // Prepare row data for Google Sheets
    const rowData = [
      orderId,                                   // OrderID
      whatsappNumber,                           // CustomerPhone
      pkg.name,                                 // Package
      outfitsString,                            // Outfits
      finalTotal || 0,                          // Amount
      hairstyle,                                // Hairstyle
      makeup,                                   // Makeup
      background,                               // Background
      'Received',                               // Status (default: Received)
      timestamp,                                // Timestamp
      shootTypeName || shootType || 'Not specified', // Shoot Type
      addOnsString,                             // Add-ons
      specialRequests                           // Special Requests
    ];

    console.log('📝 Formatted row data for Google Sheets:', rowData);

    // Append to Google Sheets with better error handling
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Orders!A:M', // A to M columns
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    // Check if response is valid
    if (!response.data) {
      throw new Error('No response data from Google Sheets API');
    }

    console.log('✅ Order successfully saved to Google Sheets');
    console.log('📊 Updated range:', response.data.updates?.updatedRange);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Order saved successfully',
        orderId,
        updatedRange: response.data.updates?.updatedRange
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error saving order to Google Sheets:');
    console.error('Error details:', error);
    console.error('Request body was:', body);
    
    // More detailed error information
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save order',
        message: errorMessage,
        details: errorDetails,
        receivedBody: body // Include the received body for debugging
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve orders (for testing)
export async function GET() {
  try {
    const sheets = initializeSheets();

    if (!process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json(
        { error: 'GOOGLE_SHEET_ID environment variable is missing' },
        { status: 500 }
      );
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Orders!A:M',
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      return NextResponse.json({ orders: [], message: 'No orders found' });
    }

    // Convert rows to objects
    const headers = rows[0];
    const orders = rows.slice(1).map((row, index) => {
      const order: any = {};
      headers.forEach((header, colIndex) => {
        order[header] = row[colIndex] || '';
      });
      order.rowNumber = index + 2; // +2 because header is row 1 and we start from row 2
      return order;
    });

    return NextResponse.json({ 
      orders,
      total: orders.length,
      headers 
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}