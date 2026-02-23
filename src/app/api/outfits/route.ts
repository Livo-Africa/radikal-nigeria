// src/app/api/outfits/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// ─── In-memory cache ──────────────────────────────────────────────
interface CacheEntry {
  data: OutfitRaw[];
  timestamp: number;
}

interface OutfitRaw {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  available: boolean;
  gender: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let sheetsCache: CacheEntry | null = null;

function isCacheValid(): boolean {
  return sheetsCache !== null && Date.now() - sheetsCache.timestamp < CACHE_TTL_MS;
}

// ─── Google Sheets init ───────────────────────────────────────────
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

// ─── Fetch all outfits (cached) ──────────────────────────────────
async function getAllOutfits(): Promise<OutfitRaw[]> {
  if (isCacheValid()) {
    return sheetsCache!.data;
  }

  const sheets = initializeSheets();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Outfits!A:G', // ID, Name, Category, Image_URL, Tags, Available, Gender
  });

  const rows = response.data.values;

  if (!rows || rows.length === 0) {
    sheetsCache = { data: [], timestamp: Date.now() };
    return [];
  }

  const outfits = rows.slice(1).map((row) => ({
    id: (row[0] || '').trim(),
    name: (row[1] || '').trim(),
    category: (row[2] || '').trim(),
    imageUrl: row[3] || '',
    tags: (row[4] || '').split(',').map((tag: string) => tag.trim()),
    available: (row[5] || '').toString().trim().toUpperCase() === 'TRUE',
    gender: (row[6] || 'Unisex').toString().trim(),
  })).filter(outfit => outfit.available && outfit.id);

  sheetsCache = { data: outfits, timestamp: Date.now() };
  return outfits;
}

// ─── Filter helpers ──────────────────────────────────────────────
function filterByCategory(outfits: OutfitRaw[], category: string | null): OutfitRaw[] {
  if (!category || category === 'All') return outfits;
  return outfits.filter(outfit => outfit.category === category);
}

function filterByGender(outfits: OutfitRaw[], gender: string | null): OutfitRaw[] {
  if (!gender || gender === 'All') return outfits;
  const g = gender.toUpperCase();

  return outfits.filter(outfit => {
    const outfitGender = (outfit.gender || '').toUpperCase().trim();
    // Unisex items always show
    const isUnisex = outfitGender === 'UNISEX' || outfitGender === 'U' || outfitGender === '';
    if (isUnisex) return true;

    // Match Male variations
    if (g === 'M' || g === 'MALE' || g === 'MEN') {
      return outfitGender === 'MALE' || outfitGender === 'M' || outfitGender === 'MEN';
    }
    // Match Female variations
    if (g === 'F' || g === 'FEMALE' || g === 'WOMEN') {
      return outfitGender === 'FEMALE' || outfitGender === 'F' || outfitGender === 'WOMEN';
    }
    // Match Unisex explicitly
    if (g === 'U' || g === 'UNISEX') {
      return isUnisex;
    }
    return true;
  });
}

function filterBySearch(outfits: OutfitRaw[], search: string | null): OutfitRaw[] {
  if (!search) return outfits;
  const searchLower = search.toLowerCase();
  return outfits.filter(outfit =>
    outfit.name.toLowerCase().includes(searchLower) ||
    outfit.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}

// ─── GET handler ─────────────────────────────────────────────────
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const gender = searchParams.get('gender');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  try {
    let outfits = await getAllOutfits();

    // Apply filters
    outfits = filterByCategory(outfits, category);
    outfits = filterByGender(outfits, gender);
    outfits = filterBySearch(outfits, search);

    // Pagination
    const total = outfits.length;
    const startIndex = (page - 1) * limit;
    const paginatedOutfits = outfits.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      outfits: paginatedOutfits,
      total,
      page,
      hasMore: startIndex + limit < total,
    });
  } catch (error) {
    console.error('Error fetching outfits:', error);

    // Fallback mock data for development
    const mockOutfits: OutfitRaw[] = [
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
    let filteredOutfits = filterByCategory(mockOutfits, category);
    filteredOutfits = filterByGender(filteredOutfits, gender);
    filteredOutfits = filterBySearch(filteredOutfits, search);

    // Pagination on mock data
    const total = filteredOutfits.length;
    const startIndex = (page - 1) * limit;
    const paginatedOutfits = filteredOutfits.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      outfits: paginatedOutfits,
      total,
      page,
      hasMore: startIndex + limit < total,
      source: 'mock-data',
    });
  }
}