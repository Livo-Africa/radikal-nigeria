// src/app/wardrobe/page.tsx - FIXED FILTERS
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/shared/Navigation';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Footer from '@/components/shared/Footer';

interface Outfit {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  available: boolean;
}

// FIXED: Static categories that don't disappear
const ALL_CATEGORIES = ['All', 'Professional', 'Casual', 'Cultural', 'Formal', 'Traditional'];

// Create a separate component that uses useSearchParams
function WardrobeContent() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Context awareness - get package info from URL
  const returnToStep = searchParams.get('returnToStep');
  const packageSlots = parseInt(searchParams.get('slots') || '0');
  const isIntegratedMode = returnToStep !== null;

  // FIXED: Use static categories instead of dynamic calculation
  const categories = ALL_CATEGORIES;

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
  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeFilter !== 'All') params.append('category', activeFilter);
        if (searchQuery) params.append('search', searchQuery);
        
        const response = await fetch(`/api/outfits?${params}`);
        const data = await response.json();
        
        setOutfits(data.outfits || []);
      } catch (error) {
        console.error('Failed to load outfits:', error);
        setOutfits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [activeFilter, searchQuery]);

  // Handle outfit selection with context awareness
  const handleSelectOutfit = (outfit: Outfit) => {
    const isAlreadySelected = selectedOutfits.find(o => o.id === outfit.id);
    
    if (isAlreadySelected) {
      // Remove if already selected
      setSelectedOutfits(prev => prev.filter(o => o.id !== outfit.id));
    } else if (!isIntegratedMode || selectedOutfits.length < packageSlots) {
      // Add if in standalone mode or within package limits
      setSelectedOutfits(prev => [...prev, outfit]);
    }
  };

  // FIXED: Save selections and continue - ALWAYS return to step 4
  const handleContinue = () => {
    // Save to localStorage for persistence
    const selectionData = {
      outfits: selectedOutfits,
      selectedAt: new Date().toISOString(),
      sessionId: typeof window !== 'undefined' ? localStorage.getItem('radikal_session_id') : null
    };
    
    localStorage.setItem('radikal_selected_outfits', JSON.stringify(selectionData));

    // FIXED: Always return to step 4 when coming from style journey
    if (isIntegratedMode) {
      // Clear any session recovery that might interfere
      localStorage.removeItem('radikal_booking_progress');
      router.push('/individuals/style-journey?step=4');
    } else {
      // Start new style journey with selected outfits
      router.push('/individuals/style-journey');
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedOutfits([]);
    localStorage.removeItem('radikal_selected_outfits');
  };

  // Remove single outfit
  const handleRemoveOutfit = (outfitId: string) => {
    const updated = selectedOutfits.filter(o => o.id !== outfitId);
    setSelectedOutfits(updated);
    
    // Update localStorage
    if (updated.length === 0) {
      localStorage.removeItem('radikal_selected_outfits');
    } else {
      localStorage.setItem('radikal_selected_outfits', JSON.stringify({
        outfits: updated,
        selectedAt: new Date().toISOString()
      }));
    }
  };

  // Filter outfits based on search and category
  const filteredOutfits = outfits.filter(outfit => {
    const matchesSearch = searchQuery === '' || 
      outfit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outfit.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeFilter === 'All' || outfit.category === activeFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navigation />
      
      <main className="pt-20 min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-black text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
                Virtual Wardrobe
              </h1>
              <p className="text-xl text-[#D4AF37] mb-8">
                {isIntegratedMode 
                  ? `Choose ${packageSlots} outfit${packageSlots > 1 ? 's' : ''} for your photoshoot`
                  : 'Browse professional outfits curated by our stylists'
                }
              </p>
              
              {/* Context Badge */}
              {isIntegratedMode ? (
                <div className="inline-flex items-center space-x-2 bg-[#D4AF37] text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span>🎯</span>
                  <span>Package: {packageSlots} outfit{packageSlots > 1 ? 's' : ''} available</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span>👗</span>
                  <span>Browse freely or start a style journey</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="sticky top-20 z-30 bg-white border-b border-gray-200 py-4 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search outfits... (e.g., 'business', 'casual', 'formal')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
              </div>

              {/* FIXED: Category Filters - Always show all categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                      activeFilter === category
                        ? 'bg-[#D4AF37] text-black shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Selection Info */}
              <div className="text-sm text-gray-600 font-semibold whitespace-nowrap">
                {selectedOutfits.length} 
                {isIntegratedMode && ` / ${packageSlots}`} selected
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Outfits Grid - 75% width */}
            <div className="lg:w-3/4">
              {loading ? (
                // Loading Skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 shadow-lg animate-pulse">
                      <div className="aspect-[3/4] bg-gray-300 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">
                      {filteredOutfits.length} outfit{filteredOutfits.length !== 1 ? 's' : ''} found
                      {searchQuery && ` for "${searchQuery}"`}
                      {activeFilter !== 'All' && ` in ${activeFilter}`}
                    </p>
                    
                    {selectedOutfits.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Outfits Grid */}
                  {filteredOutfits.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredOutfits.map((outfit) => {
                        const isSelected = selectedOutfits.find(o => o.id === outfit.id);
                        const isDisabled = isIntegratedMode && 
                                          !isSelected && 
                                          selectedOutfits.length >= packageSlots;

                        return (
                          <div
                            key={outfit.id}
                            onClick={() => !isDisabled && handleSelectOutfit(outfit)}
                            className={`
                              group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                              transition-all duration-300 transform cursor-pointer
                              ${isSelected ? 'ring-4 ring-[#D4AF37] scale-105' : ''}
                              ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                            `}
                          >
                            {/* Outfit Image */}
                            <div className="aspect-[3/4] relative overflow-hidden">
                              <img
                                src={outfit.imageUrl}
                                alt={outfit.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              
                              {/* Selection Overlay */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                                  <div className="bg-[#D4AF37] text-white rounded-full p-3">
                                    <span className="text-xl">✓</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Disabled Overlay */}
                              {isDisabled && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="bg-white text-black rounded-full px-3 py-1 text-sm font-semibold">
                                    Limit Reached
                                  </div>
                                </div>
                              )}

                              {/* Category Badge */}
                              <div className="absolute top-3 left-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                {outfit.category}
                              </div>

                              {/* Selection Number */}
                              {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-xs">
                                  {selectedOutfits.findIndex(o => o.id === outfit.id) + 1}
                                </div>
                              )}
                            </div>

                            {/* Outfit Info */}
                            <div className="p-4">
                              <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                {outfit.name}
                              </h3>
                              
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {outfit.tags.slice(0, 2).map(tag => (
                                  <span 
                                    key={tag}
                                    className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {outfit.tags.length > 2 && (
                                  <span className="text-gray-400 text-xs">
                                    +{outfit.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Empty State
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                      <div className="text-6xl mb-4">👗</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">No outfits found</h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {searchQuery || activeFilter !== 'All' 
                          ? 'Try adjusting your search or filter criteria'
                          : 'No outfits available at the moment'
                        }
                      </p>
                      {(searchQuery || activeFilter !== 'All') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilter('All');
                          }}
                          className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selection Panel - 25% width */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-32">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center justify-between">
                  <span>Selected Outfits</span>
                  <span className="text-[#D4AF37]">
                    ({selectedOutfits.length}
                    {isIntegratedMode && `/${packageSlots}`})
                  </span>
                </h3>

                {selectedOutfits.length > 0 ? (
                  <>
                    <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                      {selectedOutfits.map((outfit, index) => (
                        <div key={outfit.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={outfit.imageUrl} 
                                alt={outfit.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-sm text-gray-900 truncate">{outfit.name}</div>
                              <div className="text-xs text-gray-500">{outfit.category}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveOutfit(outfit.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold flex-shrink-0 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleClearAll}
                        className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleContinue}
                        disabled={isIntegratedMode && selectedOutfits.length === 0}
                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <span>
                          {isIntegratedMode 
                            ? selectedOutfits.length > 0 
                              ? 'Continue to Styling' 
                              : `Select ${packageSlots} outfit${packageSlots > 1 ? 's' : ''}`
                            : 'Start Style Journey'
                          }
                        </span>
                        <span>→</span>
                      </button>
                    </div>

                    {isIntegratedMode && selectedOutfits.length < packageSlots && (
                      <p className="text-sm text-gray-500 mt-3 text-center">
                        Select {packageSlots - selectedOutfits.length} more
                      </p>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👔</div>
                    <p className="text-gray-600 mb-4">
                      {isIntegratedMode
                        ? `Select ${packageSlots} outfit${packageSlots > 1 ? 's' : ''} to continue`
                        : 'No outfits selected yet'
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      Click on outfits to select them
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFloat />
      <Footer />
    </>
  );
}

// Main page component with Suspense boundary
export default function WardrobePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wonderful outfits...</p>
        </div>
      </div>
    }>
      <WardrobeContent />
    </Suspense>
  );
}