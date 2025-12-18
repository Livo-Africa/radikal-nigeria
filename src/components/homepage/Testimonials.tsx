// COMPLETE src/components/homepage/Testimonials.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Star, MessageCircle, User, Filter, ZoomIn, X, ChevronDown, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export default function Testimonials({ testimonials = [] }: { testimonials?: any[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(3);
  const [isMounted, setIsMounted] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // MOBILE CAROUSEL STATES
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const minSwipeDistance = 50;

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // MOBILE SWIPE HANDLERS
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setMobileCurrentIndex(prev =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }

    if (isRightSwipe) {
      setMobileCurrentIndex(prev =>
        prev === 0 ? testimonials.length - 1 : prev - 1
      );
    }

    setTouchStartX(0);
    setTouchEndX(0);
  };

  // DESKTOP FILTERING LOGIC
  const filters = ['All', 'Individuals', 'Business', 'Creators', 'WhatsApp'];

  const getFilteredTestimonials = () => {
    if (activeFilter === 'All') {
      return testimonials;
    }

    if (activeFilter === 'WhatsApp') {
      return testimonials.filter(t =>
        t.category?.toLowerCase().includes('whatsapp')
      );
    }

    const categoryTestimonials = testimonials.filter(t => {
      const category = t.category?.toLowerCase() || '';
      switch (activeFilter.toLowerCase()) {
        case 'individuals': return category.includes('individual') || category.includes('personal');
        case 'business': return category.includes('business') || category.includes('corporate');
        case 'creators': return category.includes('creator') || category.includes('influencer');
        default: return true;
      }
    });

    return categoryTestimonials;
  };

  const filteredTestimonials = getFilteredTestimonials();
  const displayedTestimonials = filteredTestimonials.slice(0, visibleCount);
  const hasMore = filteredTestimonials.length > visibleCount;

  // DESKTOP CAROUSEL NAVIGATION
  const nextSlide = () => {
    if (displayedTestimonials.length <= 3) return;
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(displayedTestimonials.length / 3));
  };

  const prevSlide = () => {
    if (displayedTestimonials.length <= 3) return;
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(displayedTestimonials.length / 3)) % Math.ceil(displayedTestimonials.length / 3));
  };

  useEffect(() => {
    if (carouselRef.current && window.innerWidth >= 1024) {
      const scrollAmount = currentSlide * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  }, [currentSlide, displayedTestimonials.length]);

  useEffect(() => {
    setVisibleCount(3);
    setCurrentSlide(0);
    setMobileCurrentIndex(0);
  }, [activeFilter]);

  // Loading state
  if (!isMounted) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Stories</h2>
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-8 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Stories</h2>
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            <img
              src={expandedImage}
              alt="Testimonial screenshot"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
              onClick={() => setExpandedImage(null)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <section className="py-8 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 font-playfair">
              Real <span className="text-[#D4AF37]">Results</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our clients are saying through their experiences
            </p>
          </div>

          {/* ========== MOBILE VERSION ========== */}
          <div className="md:hidden">
            <div className="relative">
              {/* Carousel Container */}
              <div
                className="flex overflow-visible"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Previous Card (Peeking) */}
                {testimonials.length > 1 && (
                  <div className="absolute -left-4 top-0 w-[calc(100%-2rem)] opacity-30 scale-95 z-0">
                    <TestimonialCard
                      testimonial={testimonials[
                        mobileCurrentIndex === 0 ? testimonials.length - 1 : mobileCurrentIndex - 1
                      ]}
                      onExpand={() => setExpandedImage(testimonials[
                        mobileCurrentIndex === 0 ? testimonials.length - 1 : mobileCurrentIndex - 1
                      ]?.imageUrl)}
                    />
                  </div>
                )}

                {/* Current Card (Full Width) */}
                <div className="w-full z-10 relative">
                  <TestimonialCard
                    testimonial={testimonials[mobileCurrentIndex]}
                    onExpand={() => setExpandedImage(testimonials[mobileCurrentIndex]?.imageUrl)}
                  />
                </div>

                {/* Next Card (Peeking) */}
                {testimonials.length > 1 && (
                  <div className="absolute -right-4 top-0 w-[calc(100%-2rem)] opacity-30 scale-95 z-0">
                    <TestimonialCard
                      testimonial={testimonials[
                        mobileCurrentIndex === testimonials.length - 1 ? 0 : mobileCurrentIndex + 1
                      ]}
                      onExpand={() => setExpandedImage(testimonials[
                        mobileCurrentIndex === testimonials.length - 1 ? 0 : mobileCurrentIndex + 1
                      ]?.imageUrl)}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Dots */}
              {testimonials.length > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setMobileCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === mobileCurrentIndex
                          ? 'bg-[#D4AF37] w-6'
                          : 'bg-gray-300'
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Swipe Instructions */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  Swipe left or right to see more testimonials
                </p>
              </div>
            </div>
          </div>

          {/* ========== DESKTOP VERSION ========== */}
          <div className="hidden md:block">
            {/* Desktop Filter Tabs */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-2xl p-2 flex space-x-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter);
                      setVisibleCount(3);
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${activeFilter === filter
                        ? 'bg-[#D4AF37] text-black shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Carousel */}
            <div className="relative max-w-6xl mx-auto">
              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex overflow-x-hidden scroll-smooth snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex space-x-6 min-w-full">
                  {displayedTestimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[calc(33.333%-16px)] snap-start"
                    >
                      <TestimonialCard
                        testimonial={testimonial}
                        onExpand={() => setExpandedImage(testimonial.imageUrl)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation */}
              {displayedTestimonials.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setVisibleCount(prev => prev + 3)}
                  className="bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                >
                  <span>Load More ({filteredTestimonials.length - visibleCount} remaining)</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {displayedTestimonials.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    No Testimonials Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    No testimonials available for "{activeFilter}" category.
                  </p>
                  <button
                    onClick={() => setActiveFilter('All')}
                    className="bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    View All Testimonials
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* View More Button (For Mobile & Desktop) */}
          <div className="text-center mt-8 md:mt-12">
            <a
              href="/testimonials"
              className="inline-flex items-center space-x-2 bg-[#D4AF37] hover:bg-[#b8941f] text-black font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <span>View All Testimonials</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, onExpand }: { testimonial: any; onExpand: () => void }) {
  const rating = testimonial.rating || 5;
  const isWhatsApp = testimonial.category?.toLowerCase().includes('whatsapp');

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Image Container */}
      <div className="flex-1 relative overflow-hidden bg-gray-100 min-h-[300px]">
        {testimonial.imageUrl ? (
          <>
            <img
              src={testimonial.imageUrl}
              alt={isWhatsApp ? "WhatsApp conversation" : `Testimonial from ${testimonial.name}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            {/* Zoom Overlay */}
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 cursor-pointer flex items-center justify-center"
              onClick={onExpand}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3">
                <ZoomIn className="w-5 h-5 text-gray-900" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#D4AF37]/10 to-[#B91C1C]/10 p-6">
            {isWhatsApp ? (
              <MessageCircle className="w-12 h-12 text-green-500 mb-3" />
            ) : (
              <User className="w-12 h-12 text-[#D4AF37] mb-3" />
            )}
            <div className="text-center">
              <div className="font-semibold text-gray-900 mb-2">
                {testimonial.name}
              </div>
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                "{testimonial.text}"
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {isWhatsApp ? (
              <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : (
              <User className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-gray-900 truncate">
              {testimonial.name}
            </span>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {testimonial.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}