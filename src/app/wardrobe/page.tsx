// app/wardrobe/page.tsx - PREMIUM REDESIGN
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navigation from '@/components/shared/Navigation';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Footer from '@/components/shared/Footer';
import ImageWithOptimization from '@/components/wardrobe/ImageWithOptimization';
import { Filter, Search, Check, Plus, X, ArrowRight, Shirt } from 'lucide-react';

interface Outfit {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  tags: string[];
  available: boolean;
}

// Minimal header - no hero section
function WardrobeContent() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const returnToStep = searchParams.get('returnToStep');
  const packageSlots = parseInt(searchParams.get('slots') || '0');
  const isIntegratedMode = returnToStep !== null;

  // Fixed categories for consistent UX
  const categories = ['All', 'Professional', 'Casual', 'Cultural', 'Formal', 'Traditional'];

  // Load saved outfits
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
          // Silent error handling
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
        setOutfits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOutfits();
  }, [activeFilter, searchQuery]);

  // Handle outfit selection
  const handleSelectOutfit = (outfit: Outfit) => {
    const isAlreadySelected = selectedOutfits.find(o => o.id === outfit.id);
    
    if (isAlreadySelected) {
      setSelectedOutfits(prev => prev.filter(o => o.id !== outfit.id));
    } else if (!isIntegratedMode || selectedOutfits.length < packageSlots) {
      setSelectedOutfits(prev => [...prev, outfit]);
    }
  };

  // Save and continue
  const handleContinue = () => {
    const selectionData = {
      outfits: selectedOutfits,
      selectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('radikal_selected_outfits', JSON.stringify(selectionData));

    if (isIntegratedMode && returnToStep) {
      router.push(`/individuals/style-journey?step=4`);
    } else {
      router.push('/individuals/style-journey?step=1');
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
    
    if (updated.length === 0) {
      localStorage.removeItem('radikal_selected_outfits');
    } else {
      localStorage.setItem('radikal_selected_outfits', JSON.stringify({
        outfits: updated,
        selectedAt: new Date().toISOString()
      }));
    }
  };

  return (
    <>
      <Navigation />
      
      <main className="pt-16 min-h-screen bg-white">
        {/* Minimal Header */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Wardrobe</h1>
                  <p className="text-sm text-gray-500">
                    {isIntegratedMode 
                      ? `Choose ${packageSlots} outfit${packageSlots > 1 ? 's' : ''}`
                      : 'Browse outfits'
                    }
                  </p>
                </div>
              </div>
              
              {/* Selection Counter */}
              {selectedOutfits.length > 0 && (
                <div className="bg-[#D4AF37] text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedOutfits.length}
                  {isIntegratedMode && `/${packageSlots}`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Clean Search & Filter */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-100 py-4">
          <div className="container mx-auto px-4">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search outfits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                    ${activeFilter === category
                      ? 'bg-[#D4AF37] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Outfits Grid */}
            <div className="lg:w-3/4">
              {loading ? (
                // Enhanced Loading Skeleton
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Results Summary */}
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-sm text-gray-600">
                      {outfits.length} items
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                    
                    {selectedOutfits.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  {/* Outfits Grid */}
                  {outfits.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {outfits.map((outfit) => {
                        const isSelected = selectedOutfits.find(o => o.id === outfit.id);
                        const isDisabled = isIntegratedMode && 
                                          !isSelected && 
                                          selectedOutfits.length >= packageSlots;

                        return (
                          <div
                            key={outfit.id}
                            onClick={() => !isDisabled && handleSelectOutfit(outfit)}
                            className={`
                              group relative bg-white rounded-xl overflow-hidden cursor-pointer
                              transition-all duration-300 transform
                              ${isSelected ? 'ring-2 ring-[#D4AF37] scale-105' : 'hover:scale-102'}
                              ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {/* Image Container */}
                            <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                              <ImageWithOptimization
                                src={outfit.imageUrl}
                                alt={outfit.name}
                                className="group-hover:scale-105 transition-transform duration-700"
                              />
                              
                              {/* Selection Overlay */}
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                                  <div className="bg-[#D4AF37] text-white rounded-full p-2">
                                    <Check className="w-4 h-4" />
                                  </div>
                                </div>
                              )}

                              {/* Selection Badge */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {selectedOutfits.findIndex(o => o.id === outfit.id) + 1}
                                </div>
                              )}

                              {/* Category Tag */}
                              <div className="absolute top-2 left-2">
                                <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                                  {outfit.category}
                                </span>
                              </div>
                            </div>

                            {/* Outfit Info */}
                            <div className="p-3">
                              <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                                {outfit.name}
                              </h3>
                              <div className="flex flex-wrap gap-1">
                                {outfit.tags.slice(0, 2).map(tag => (
                                  <span 
                                    key={tag}
                                    className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Empty State
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shirt className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No outfits found</h3>
                      <p className="text-gray-500 text-sm mb-4">
                        {searchQuery || activeFilter !== 'All' 
                          ? 'Try different search terms or filters'
                          : 'Check back later for new outfits'
                        }
                      </p>
                      {(searchQuery || activeFilter !== 'All') && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setActiveFilter('All');
                          }}
                          className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-medium"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Selection Panel - Minimal Design */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-32">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Selected</h3>
                  <span className="text-[#D4AF37] font-medium text-sm">
                    {selectedOutfits.length}
                    {isIntegratedMode && `/${packageSlots}`}
                  </span>
                </div>

                {selectedOutfits.length > 0 ? (
                  <>
                    {/* Selected Items List */}
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {selectedOutfits.map((outfit, index) => (
                        <div key={outfit.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <ImageWithOptimization
                              src={outfit.imageUrl}
                              alt={outfit.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 text-sm truncate">{outfit.name}</div>
                            <div className="text-gray-500 text-xs">{outfit.category}</div>
                          </div>
                          <button
                            onClick={() => handleRemoveOutfit(outfit.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={handleContinue}
                        disabled={isIntegratedMode && selectedOutfits.length === 0}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <span>
                          {isIntegratedMode 
                            ? selectedOutfits.length > 0 
                              ? 'Continue' 
                              : `Select ${packageSlots} outfit${packageSlots > 1 ? 's' : ''}`
                            : 'Start Style Journey'
                          }
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {isIntegratedMode && selectedOutfits.length < packageSlots && (
                        <p className="text-xs text-gray-500 text-center">
                          Select {packageSlots - selectedOutfits.length} more
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  // Empty Selection State
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      {isIntegratedMode
                        ? `Select ${packageSlots} outfit${packageSlots > 1 ? 's' : ''} to continue`
                        : 'No outfits selected'
                      }
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

// Main page with suspense
export default function WardrobePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading Awesome Outfits...</p>
        </div>
      </div>
    }>
      <WardrobeContent />
    </Suspense>
  );
}