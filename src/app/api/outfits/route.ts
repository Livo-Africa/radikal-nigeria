// src/app/api/outfits/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

function initializeSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  try {
    const sheets = initializeSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Outfits!A:F', // ID, Name, Category, Image_URL, Tags, Available
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ outfits: [] });
    }

    // Process outfit data
    let outfits = rows.slice(1).map((row) => ({
      id: row[0] || '',
      name: row[1] || '',
      category: row[2] || '',
      imageUrl: row[3] || '',
      tags: (row[4] || '').split(',').map(tag => tag.trim()),
      available: (row[5] || '').toString().toUpperCase() === 'TRUE',
      gender: (row[6] || 'Unisex').toString().trim(),
    })).filter(outfit => outfit.available && outfit.id);

    // Apply filters
    if (category && category !== 'All') {
      outfits = outfits.filter(outfit => outfit.category === category);
    }

    // Gender Filter
    const gender = searchParams.get('gender');
    if (gender && gender !== 'All') {
      const g = gender.toUpperCase();
      outfits = outfits.filter(outfit => {
        const outfitGender = (outfit.gender || '').toUpperCase();
        const isUnisex = outfitGender === 'UNISEX' || outfitGender === 'U';
        if (g === 'M' || g === 'MALE') return outfitGender === 'MALE' || outfitGender === 'M' || isUnisex;
        if (g === 'F' || g === 'FEMALE') return outfitGender === 'FEMALE' || outfitGender === 'F' || isUnisex;
        return true;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      outfits = outfits.filter(outfit =>
        outfit.name.toLowerCase().includes(searchLower) ||
        outfit.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ outfits });
  } catch (error) {
    console.error('Error fetching outfits:', error);

    // Fallback mock data for development
    const mockOutfits = [
      {
        id: '1',
        name: 'Navy Business Suit',
        category: 'Professional',
        imageUrl: 'https://images.unsplash.com/photo-1594938373336-934c6ee549e3?w=400&h=500&fit=crop',
        tags: ['formal', 'business', 'professional'],
        available: true,
        gender: 'Male'
      },
      {
        id: '2',
        name: 'Grey Executive Suit',
        category: 'Professional',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
        tags: ['formal', 'executive', 'professional'],
        available: true,
        gender: 'Male'
      },
      {
        id: '3',
        name: 'Casual Blazer & Jeans',
        category: 'Casual',
        imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=400&h=500&fit=crop',
        tags: ['casual', 'smart-casual', 'modern'],
        available: true,
        gender: 'Unisex'
      },
      {
        id: '4',
        name: 'Designer Evening Dress',
        category: 'Formal',
        imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
        tags: ['elegant', 'formal', 'dress'],
        available: true,
        gender: 'Female'
      },
      {
        id: '5',
        name: 'Trendy Streetwear Set',
        category: 'Casual',
        imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
        tags: ['casual', 'trendy', 'urban'],
        available: true,
        gender: 'Unisex'
      },
      {
        id: '6',
        name: 'Traditional Kente',
        category: 'Cultural',
        imageUrl: 'https://images.unsplash.com/photo-1584917865447-5d7a7deaee7c?w=400&h=500&fit=crop',
        tags: ['cultural', 'traditional', 'colorful'],
        available: true,
        gender: 'Unisex'
      }
    ];

    // Apply filters to mock data too
    let filteredOutfits = mockOutfits;
    if (category && category !== 'All') {
      filteredOutfits = filteredOutfits.filter(outfit => outfit.category === category);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOutfits = filteredOutfits.filter(outfit =>
        outfit.name.toLowerCase().includes(searchLower) ||
        outfit.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ outfits: filteredOutfits, source: 'mock-data' });
  }
}