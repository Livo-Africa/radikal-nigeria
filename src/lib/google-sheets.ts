// src/lib/google-sheets.ts
import { google } from 'googleapis';

// Vercel-compatible Google Sheets initialization
function initializeSheets() {
  // Check if we're in production and credentials exist
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    ;
    throw new Error('Google Sheets configuration error');
  }

  // Fix private key formatting for Vercel
  const privateKey = process.env.GOOGLE_PRIVATE_KEY
    .replace(/\\n/g, '\n')
    .replace(/"/g, '') // Remove any quotes
    .trim();

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getTestimonials() {
  try {
    const sheets = initializeSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Testimonials!A:F',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Process all testimonials
    const allTestimonials = rows.slice(1).map((row) => ({
      name: row[0] || '',
      category: row[1] || '',
      text: row[2] || '',
      imageUrl: row[3] || '',
      rating: parseFloat(row[4]) || 5,
      visible: (row[5] || '').toString().toUpperCase() === 'TRUE',
    })).filter(item => item.visible && item.name);


    // Smart limiting logic - max 6 per category, highest rated first
    const categories = ['Individuals', 'Business', 'Creators', 'WhatsApp'];
    const limitedTestimonials: any[] = [];

    categories.forEach(category => {
      // Filter by category (case insensitive)
      const categoryTestimonials = allTestimonials.filter(t =>
        t.category.toLowerCase().includes(category.toLowerCase())
      );

      // Sort by rating (highest first) and take top 6
      const sorted = categoryTestimonials.sort((a, b) => b.rating - a.rating);
      const topSix = sorted.slice(0, 6);

      limitedTestimonials.push(...topSix);
    });

    // Fallback: If any category has insufficient testimonials, fill with highest rated from other categories
    const targetTotal = 24; // 6 per category × 4 categories
    if (limitedTestimonials.length < targetTotal) {
      const remainingSlots = targetTotal - limitedTestimonials.length;
      const remainingTestimonials = allTestimonials
        .filter(t => !limitedTestimonials.includes(t)) // Exclude already selected
        .sort((a, b) => b.rating - a.rating) // Highest rated first
        .slice(0, remainingSlots);

      limitedTestimonials.push(...remainingTestimonials);
    }

    // Ensure we don't exceed 24 total
    const finalTestimonials = limitedTestimonials.slice(0, 24);

    return finalTestimonials;
  } catch (error) {
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}

export async function getAllTestimonials() {
  try {
    const sheets = initializeSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Testimonials!A:F',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Process all testimonials without limits
    const allTestimonials = rows.slice(1).map((row) => ({
      name: row[0] || '',
      category: row[1] || '',
      text: row[2] || '',
      imageUrl: row[3] || '',
      rating: parseFloat(row[4]) || 5,
      visible: (row[5] || '').toString().toUpperCase() === 'TRUE',
    })).filter(item => item.visible && item.name);

    return allTestimonials;
  } catch (error) {
    return [];
  }
}

export async function getTransformations() {
  try {
    const sheets = initializeSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Transformations!A:F',
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    const transformations = rows.slice(1).map((row) => ({
      title: row[0] || '',
      beforeUrl: row[1] || '',
      afterUrl: row[2] || '',
      service: row[3] || '',
      metrics: row[4] || '',
      visible: (row[5] || '').toString().toUpperCase() === 'TRUE',
    })).filter(item => item.visible && item.title);


    return transformations;
  } catch (error) {
    return [];
  }
}


// ADD NEW OUTFITS FUNCTION
export async function getOutfits(category?: string, search?: string) {
  const sheets = initializeSheets();

  try {
    console.log('Fetching outfits from sheet...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Outfits!A:G', // ID, Name, Category, Image_URL, Tags, Available, Gender
    });

    const rows = response.data.values;
    console.log('Raw outfits data:', rows);

    if (!rows || rows.length === 0) {
      console.log('No outfits data found');
      return [];
    }

    // Process outfit data - same pattern as existing functions
    let outfits = rows.slice(1).map((row) => ({
      id: (row[0] || '').trim(),
      name: (row[1] || '').trim(),
      category: (row[2] || '').trim(),
      imageUrl: row[3] || '',
      tags: (row[4] || '').split(',').map(tag => tag.trim()),
      available: (row[5] || '').toString().trim().toUpperCase() === 'TRUE',
      gender: (row[6] || 'Unisex').toString().trim(), // Column G
    })).filter(item => item.available && item.id);

    // Apply filters if provided
    if (category && category !== 'All') {
      outfits = outfits.filter(item => item.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      outfits = outfits.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    console.log('Processed outfits:', outfits);
    return outfits;
  } catch (error) {
    console.error('Error fetching outfits:', error);

    // Return empty array instead of mock data for production safety
    return [];
  }
}