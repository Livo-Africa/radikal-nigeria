// src/components/homepage/Testimonials.tsx - WHATSAPP IMAGE FOCUS
'use client';
import { useState, useEffect } from 'react';
import { Star, MessageCircle, User, ChevronDown, Filter, Quote, ZoomIn } from 'lucide-react';

// Define category keywords for consistent filtering
const CATEGORY_KEYWORDS = {
  Individuals: ['individual', 'personal'],
  Business: ['business', 'corporate', 'brand'],
  Creators: ['creator', 'influencer', 'artist'],
  WhatsApp: ['whatsapp']
};

export default function Testimonials({ testimonials = [] }: { testimonials?: any[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filters = ['All', 'Individuals', 'Business', 'Creators', 'WhatsApp'];

  // Enhanced filtering with exact category matching
  const getFilteredTestimonials = () => {
    if (activeFilter === 'All') {
      return testimonials.slice(0, 6); // Show 6 balanced testimonials for "All"
    }

    if (activeFilter === 'WhatsApp') {
      const whatsappTestimonials = testimonials.filter(t => {
        const category = t.category?.toLowerCase() || '';
        return category.includes('whatsapp');
      });
      return visibleCount > 6 ? whatsappTestimonials.slice(0, visibleCount) : whatsappTestimonials.slice(0, 6);
    }

    // For other categories, use keyword matching
    const keywords = CATEGORY_KEYWORDS[activeFilter as keyof typeof CATEGORY_KEYWORDS] || [];
    const categoryTestimonials = testimonials.filter(t => {
      const category = t.category?.toLowerCase() || '';
      return keywords.some(keyword => category.includes(keyword));
    });

    return categoryTestimonials.slice(0, visibleCount);
  };

  const filteredTestimonials = getFilteredTestimonials();

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const hasMoreTestimonials = () => {
    if (activeFilter === 'All') return false; // No load more for All tab
    
    if (activeFilter === 'WhatsApp') {
      const totalWhatsApp = testimonials.filter(t => 
        t.category?.toLowerCase().includes('whatsapp')
      ).length;
      return totalWhatsApp > filteredTestimonials.length;
    }

    const keywords = CATEGORY_KEYWORDS[activeFilter as keyof typeof CATEGORY_KEYWORDS] || [];
    const totalInCategory = testimonials.filter(t => {
      const category = t.category?.toLowerCase() || '';
      return keywords.some(keyword => category.includes(keyword));
    }).length;

    return totalInCategory > filteredTestimonials.length;
  };

  const hasMore = hasMoreTestimonials();

  // Render loading state during SSR
  if (!isMounted) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            What Our <span className="text-[#D4AF37]">Clients</span> Say
          </h2>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  // Render empty state if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            What Our <span className="text-[#D4AF37]">Clients</span> Say
          </h2>
          <p className="text-gray-600">Client testimonials loading soon...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Image Expansion Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={expandedImage} 
              alt="WhatsApp conversation screenshot"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              onClick={() => setExpandedImage(null)}
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>
      )}

      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
              What Our <span className="text-[#D4AF37]">Clients</span> Say
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from individuals, businesses, and creators who chose Radikal
            </p>
          </div>

          {/* Mobile-Optimized Filter System */}
          <div className="mb-8 md:mb-12">
            {/* Mobile Filter Dropdown */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-between w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-semibold text-gray-700 shadow-sm"
              >
                <span className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter: {activeFilter}</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="mt-2 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setVisibleCount(filter === 'WhatsApp' ? 6 : 6);
                        setShowFilters(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        activeFilter === filter
                          ? 'bg-[#D4AF37] text-black font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Filter Tabs */}
            <div className="hidden md:flex justify-center">
              <div className="bg-gray-100 rounded-2xl p-2 flex space-x-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setVisibleCount(filter === 'WhatsApp' ? 6 : 6);
                    }}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      activeFilter === filter
                        ? 'bg-[#D4AF37] text-black shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                  >
                    {filter === 'WhatsApp' && <MessageCircle className="w-4 h-4" />}
                    <span>{filter}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials Grid - WhatsApp as Images Only */}
          <div className={`max-w-7xl mx-auto ${
            activeFilter === 'WhatsApp' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8' 
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'
          }`}>
            {filteredTestimonials.map((testimonial, index) => {
              const rating = testimonial.rating || 5;
              const fullStars = Math.floor(rating);
              const hasHalfStar = rating % 1 !== 0;
              const isWhatsApp = testimonial.category?.toLowerCase().includes('whatsapp');
              
              return (
                <div 
                  key={`${testimonial.name}-${index}`}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden ${
                    isWhatsApp 
                      ? activeFilter === 'WhatsApp' 
                        ? 'min-h-[400px]' // Larger for WhatsApp filter
                        : 'min-h-[200px]' // Smaller for All filter
                      : ''
                  }`}
                >
                  {/* WhatsApp Screenshot Layout - IMAGE ONLY */}
                  {isWhatsApp ? (
                    <div className="h-full flex flex-col">
                      {/* WhatsApp Image - Full Size */}
                      {testimonial.imageUrl ? (
                        <div className="relative flex-1 cursor-pointer">
                          <img 
                            src={testimonial.imageUrl} 
                            alt="WhatsApp conversation screenshot"
                            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                              activeFilter === 'WhatsApp' ? 'min-h-[350px]' : 'min-h-[150px]'
                            }`}
                            loading="lazy"
                            onClick={() => setExpandedImage(testimonial.imageUrl)}
                          />
                          {/* Zoom Indicator - Only show on hover for WhatsApp filter */}
                          {activeFilter === 'WhatsApp' && (
                            <div className="absolute top-3 right-3 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                              <ZoomIn className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Fallback if no image */
                        <div className={`flex-1 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 ${
                          activeFilter === 'WhatsApp' ? 'min-h-[350px]' : 'min-h-[150px]'
                        }`}>
                          <div className="text-center p-6">
                            <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-green-700 font-semibold">WhatsApp Conversation</p>
                            <p className="text-green-600 text-sm mt-1">Screenshot not available</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Minimal Info - Only show for All filter */}
                      {activeFilter !== 'WhatsApp' && (
                        <div className="p-3 bg-white border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <MessageCircle className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-gray-600">WhatsApp</span>
                            </div>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < fullStars 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Standard Testimonial Layout */
                    <div className="p-4 md:p-6">
                      {/* Client Info */}
                      <div className="flex items-center mb-4">
                        {testimonial.imageUrl ? (
                          <img 
                            src={testimonial.imageUrl} 
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#D4AF37] group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-105 transition-transform duration-300">
                            <User className="w-6 h-6" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 group-hover:text-black transition-colors text-base truncate">
                            {testimonial.name}
                          </h3>
                          <p className="text-sm text-[#D4AF37] font-semibold truncate">
                            {testimonial.category}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < fullStars 
                                  ? 'text-yellow-400 fill-current' 
                                  : hasHalfStar && i === fullStars
                                  ? 'text-yellow-400 fill-current opacity-50'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">({rating})</span>
                      </div>

                      {/* Testimonial Text */}
                      <div className="relative">
                        <Quote className="w-5 h-5 text-gray-300 absolute -top-1 -left-1" />
                        <p className="text-gray-700 italic leading-relaxed group-hover:text-gray-900 transition-colors duration-300 text-sm pl-4 line-clamp-4">
                          {testimonial.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8 md:mt-12">
              <button 
                onClick={handleLoadMore}
                className="bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <span>Load More Testimonials</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900">
                  No Testimonials Found
                </h3>
                <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">
                  No testimonials available for the "{activeFilter}" category yet.
                </p>
                <button 
                  onClick={() => setActiveFilter('All')}
                  className="bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-6 rounded-lg transition-colors text-sm md:text-base"
                >
                  View All Testimonials
                </button>
              </div>
            </div>
          )}

          {/* Performance Indicator */}
          <div className="text-center mt-6 text-sm text-gray-500">
            Showing {filteredTestimonials.length} of {testimonials.length} testimonials
            {activeFilter !== 'All' && ` in ${activeFilter}`}
          </div>

          {/* WhatsApp Viewing Instructions */}
          {activeFilter === 'WhatsApp' && filteredTestimonials.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600 flex items-center justify-center space-x-2">
                <ZoomIn className="w-4 h-4" />
                <span>Click on any screenshot to view it larger</span>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}