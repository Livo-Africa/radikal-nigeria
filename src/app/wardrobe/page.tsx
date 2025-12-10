'use client';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/shared/Navigation';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Footer from '@/components/shared/Footer';
import OptimizedImage from '@/components/shared/OptimizedImage';
import { Search, Filter, X, Check, Shirt, ArrowRight, Home, Grid3X3, List, Loader } from 'lucide-react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface Outfit {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  available: boolean;
}

// Debounce hook for performance
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Create a separate component that uses useSearchParams
function WardrobeContent() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeGender, setActiveGender] = useState<'All' | 'M' | 'F' | 'U'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const searchParams = useSearchParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Use debounce for search to prevent excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Context awareness - get package info from URL
  const returnToStep = searchParams.get('returnToStep');
  // If coming from style journey, we might have a target number of slots
  const packageSlotsParam = searchParams.get('slots');
  const packageSlots = packageSlotsParam ? parseInt(packageSlotsParam) : 0;
  // Integrated mode if we have a return step OR slots defined (meaning we came from a flow that needs specific outfits)
  const isIntegratedMode = returnToStep !== null || packageSlots > 0;

  // Fixed static categories
  const categories = ['All', 'Professional', 'Casual', 'Formal', 'Cultural', 'Creative'];

  // Load any previously selected outfits
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radikal_selected_outfits');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.outfits && Array.isArray(parsed.outfits)) {
            setSelectedOutfits(parsed.outfits);
          }
        } catch (error) {
          console.error('Error loading saved outfits:', error);
        }
      }
    }
  }, []);

  // Load outfits from API
  const fetchOutfits = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      // We'll filter client side for better interactivity on small datasets, 
      // but good to support server filtering too

      const response = await fetch(`/api/outfits?${params}`);
      const data = await response.json();

      if (data.outfits) {
        setOutfits(data.outfits);
      }
    } catch (error) {
      console.error('Failed to load outfits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOutfits();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = outfits;

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter(o => o.category === activeCategory);
    }

    // Filter by Gender (New)
    // Filter by Gender
    if (activeGender !== 'All') {
      result = result.filter(o => {
        const g = (o as any).gender?.toUpperCase() || '';
        const isUnisex = g === 'UNISEX' || g === 'U';
        const isMale = g === 'MALE' || g === 'M';
        const isFemale = g === 'FEMALE' || g === 'F';

        if (activeGender === 'M') return isMale || isUnisex; // Men see Men + Unisex
        if (activeGender === 'F') return isFemale || isUnisex; // Women see Women + Unisex
        if (activeGender === 'U') return isUnisex; // Unisex sees only Unisex
        return true;
      });
    }

    // Filter by Search
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(o =>
        o.name.toLowerCase().includes(searchLower) ||
        o.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredOutfits(result);
  }, [outfits, activeCategory, activeGender, debouncedSearch]);


  // Handle outfit selection
  const handleSelectOutfit = useCallback((outfit: Outfit) => {
    const isAlreadySelected = selectedOutfits.find(o => o.id === outfit.id);

    if (isAlreadySelected) {
      setSelectedOutfits(prev => prev.filter(o => o.id !== outfit.id));
    } else {
      // Logic:
      // If Integrated Mode: Respect slots limit
      // If Standalone Mode: Unlimited selection (user builds their own package)

      if (isIntegratedMode && selectedOutfits.length >= packageSlots) {
        // Optional: Replace last selected or show error? For now, just block.
        // Or maybe replace the oldest selection?
        return;
      }

      setSelectedOutfits(prev => [...prev, outfit]);
    }
  }, [selectedOutfits, isIntegratedMode, packageSlots]);

  // Handle "Use This" / Continue
  const handleContinue = useCallback(() => {
    // Save selections
    const selectionData = {
      outfits: selectedOutfits,
      selectedAt: new Date().toISOString(),
      sessionId: typeof window !== 'undefined' ? localStorage.getItem('radikal_session_id') : null
    };
    localStorage.setItem('radikal_selected_outfits', JSON.stringify(selectionData));

    if (isIntegratedMode) {
      // Case 2: User came from package -> Go to Step 3 (Photos) or back to where they were
      // Actually per "Use case 3", if they select here, they flow.
      // If returnToStep is set, use it (usually Step 4)
      const targetStep = returnToStep || '4';
      router.push(`/individuals/style-journey?step=${targetStep}`);
    } else {
      // Case 1: Standalone -> Start Journey with pre-selected package
      // Calculate derived package based on number of outfits?
      // For now, just push to Style Journey, passing outfit count in URL might be helpful
      router.push(`/individuals/style-journey?fromWardrobe=true&outfitCount=${selectedOutfits.length}`);
    }
  }, [selectedOutfits, isIntegratedMode, returnToStep, router]);

  const handleClearAll = useCallback(() => {
    setSelectedOutfits([]);
    localStorage.removeItem('radikal_selected_outfits');
  }, []);

  // --- Render Components ---

  // ... (Keep existing OutfitCard, LoadingSkeleton) ...
  // [We need to re-declare OutfitCard here to use new state variables if we don't pass them]
  // Ideally, I should simple inline it or update the existing one. 
  // For brevity in this diff, I will assume the structure allows me to reuse the return layout
  // But I will rewrite the JSX to include the Gender Filter and Mobile Layout.

  return (
    <>
      <Navigation />

      <main className="pt-20 min-h-screen bg-gray-50/50">

        {/* Mobile Header (Minified) */}
        <div className="md:hidden px-4 py-4 bg-white sticky top-16 z-20 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">The Wardrobe</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveGender('M')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'M' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100'}`}
              >
                MEN
              </button>
              <button
                onClick={() => setActiveGender('F')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'F' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100'}`}
              >
                WOMEN
              </button>
              <button
                onClick={() => setActiveGender('U')}
                className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'U' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100'}`}
              >
                UNISEX
              </button>
            </div>
          </div>
          {/* Mobile Filters Horizontal Scroll */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Header & Filters */}
        <div className="hidden md:block">
          <section className="bg-white border-b border-gray-200 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Wardrobe Collection</h1>
                  <p className="text-gray-600 mt-1">Curated styles for your perfect shoot</p>
                </div>

                {/* Desktop Gender Switch */}
                <div className="bg-gray-100 p-1 rounded-lg flex">
                  <button
                    onClick={() => setActiveGender('All')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeGender === 'All' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveGender('M')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeGender === 'M' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Men
                  </button>
                  <button
                    onClick={() => setActiveGender('F')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeGender === 'F' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Women
                  </button>
                  <button
                    onClick={() => setActiveGender('U')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeGender === 'U' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Unisex
                  </button>
                </div>
              </div>

              {/* Desktop Search & Categories */}
              <div className="flex items-center space-x-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
                  />
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-4 py-6 max-w-6xl pb-32">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : filteredOutfits.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No outfits found matching your criteria</p>
              <button onClick={() => { setActiveCategory('All'); setActiveGender('All'); setSearchQuery(''); }} className="mt-4 text-[#D4AF37] font-medium hover:underline">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
              {filteredOutfits.map((outfit) => {
                const isSelected = selectedOutfits.some(o => o.id === outfit.id);
                const isDisabled = isIntegratedMode && !isSelected && selectedOutfits.length >= packageSlots;

                return (
                  <div
                    key={outfit.id}
                    onClick={() => !isDisabled && handleSelectOutfit(outfit)}
                    className={`group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-[#D4AF37]' : 'hover:shadow-lg'
                      } ${isDisabled ? 'opacity-50' : ''}`}
                  >
                    {/* Image */}
                    <div className="aspect-[3/4] relative">
                      <OptimizedImage
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                          <div className="bg-[#D4AF37] text-white p-2 rounded-full shadow-lg scale-110">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                      {/* Mobile Mini Badge */}
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                          <p className="text-xs font-bold text-gray-900 truncate">{outfit.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{outfit.category}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Floating Bottom Bar (Mobile & Desktop) */}
        {selectedOutfits.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 p-4 pb-8 md:pb-4">
            <div className="container mx-auto max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">Selected</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">{selectedOutfits.length}</span>
                    {isIntegratedMode && <span className="text-gray-400">/ {packageSlots}</span>}
                    <span className="text-sm text-gray-600">outfits</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {!isMobile && (
                    <button onClick={handleClearAll} className="text-sm text-gray-500 hover:text-red-500 px-4">
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleContinue}
                    className="bg-[#D4AF37] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/20 hover:bg-[#b8941f] active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>{isIntegratedMode ? 'Continue' : 'Use These'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {!isMobile && <Footer />}
    </>
  );
}

// Main page component with Suspense boundary
export default function WardrobePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
          <p className="text-gray-600">Loading wardrobe...</p>
        </div>
      </div>
    }>
      <WardrobeContent />
    </Suspense>
  );
}