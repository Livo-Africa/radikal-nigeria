// src/components/homepage/Transformations.tsx - FIXED WITH MOBILE TOGGLE HIDDEN
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Eye, EyeOff, ArrowRight, Play, Pause, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Transformation } from '@/types';

interface TransformationsProps {
  transformations?: Transformation[];
}

export default function Transformations({ transformations = [] }: TransformationsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAfter, setShowAfter] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Constants
  const SWIPE_THRESHOLD = 50;

  // Mount detection
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, []);

  // Validate transformations
  const validatedTransformations = useMemo(() => {
    return transformations.filter(t => {
      if (t.visible === false) return false;
      if (!t.beforeUrl || !t.afterUrl) return false;
      return true;
    });
  }, [transformations]);

  // Filter by service
  const filteredTransformations = useMemo(() => {
    if (activeFilter === 'All') return validatedTransformations;

    return validatedTransformations.filter(t => {
      const service = t.service?.toLowerCase() || '';

      if (activeFilter === 'Personal') {
        return service.includes('personal') || service.includes('individual');
      } else if (activeFilter === 'Product') {
        return service.includes('product') || service.includes('ecommerce');
      } else if (activeFilter === 'Brand') {
        return service.includes('brand') || service.includes('business') || service.includes('corporate');
      } else if (activeFilter === 'Video') {
        return service.includes('video') || service.includes('motion') || service.includes('animation');
      }
      return true;
    });
  }, [validatedTransformations, activeFilter]);

  // Preload current images
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    const current = filteredTransformations[currentIndex];
    if (!current) return;

    const beforeKey = `${currentIndex}-before`;
    if (!imageCacheRef.current.has(beforeKey)) {
      const beforeImg = new Image();
      beforeImg.src = current.beforeUrl;
      imageCacheRef.current.set(beforeKey, beforeImg);
    }

    const afterKey = `${currentIndex}-after`;
    if (!imageCacheRef.current.has(afterKey)) {
      const afterImg = new Image();
      afterImg.src = current.afterUrl;
      imageCacheRef.current.set(afterKey, afterImg);
    }
  }, [currentIndex, filteredTransformations, isMounted]);

  // AUTO-PLAY LOGIC: Shows before→after→next like your individuals page
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0 || !isPlaying) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    // Clear any existing timer
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);

    autoPlayTimerRef.current = setTimeout(() => {
      setShowAfter(prev => {
        if (prev) {
          // If currently showing "after", move to next transformation and show "before"
          setCurrentIndex(current => (current + 1) % filteredTransformations.length);
          return false;
        }
        // If currently showing "before", show "after"
        return true;
      });
    }, showAfter ? 2500 : 2500); // 2.5 seconds for both before and after

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [showAfter, isPlaying, filteredTransformations.length, isMounted]);

  // Reset on filter change
  useEffect(() => {
    if (!isMounted || filteredTransformations.length === 0) return;

    setCurrentIndex(0);
    setShowAfter(false);
    setIsPlaying(true);
  }, [activeFilter, isMounted, filteredTransformations.length]);

  // Touch handlers - FIXED: Only navigate, don't reset showAfter to false
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;

    if (Math.abs(distance) > SWIPE_THRESHOLD) {
      // Pause auto-play on interaction
      setIsPlaying(false);

      if (distance > 0) {
        // Swipe left - follow the cycle: before → after → next before
        if (showAfter) {
          // Currently showing "after", move to next image and show "before"
          setCurrentIndex(prev => (prev + 1) % filteredTransformations.length);
          setShowAfter(false);
        } else {
          // Currently showing "before", show "after" of same image
          setShowAfter(true);
        }
      } else {
        // Swipe right - reverse cycle: after → before → previous after
        if (showAfter) {
          // Currently showing "after", show "before" of same image
          setShowAfter(false);
        } else {
          // Currently showing "before", go to previous image and show "after"
          setCurrentIndex(prev => (prev - 1 + filteredTransformations.length) % filteredTransformations.length);
          setShowAfter(true);
        }
      }

      // Resume auto-play after 5 seconds
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 5000);
    }

    setTouchStart(null);
  };

  // Manual toggle view
  const handleToggleView = () => {
    setIsPlaying(false);
    setShowAfter(!showAfter);

    // Resume auto-play after 5 seconds
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  // Navigation - FIXED: Only change index, preserve showAfter state
  const handleNavigation = (index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
    // DO NOT reset showAfter - keep whatever view (before/after) is currently showing

    // Resume auto-play after 5 seconds
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    inactivityTimerRef.current = setTimeout(() => {
      setIsPlaying(true);
    }, 5000);
  };

  // Simple play/pause toggle
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
  };

  // Filter tabs
  const filters = [
    { id: 'All', name: 'All Work', icon: Sparkles },
    { id: 'Personal', name: 'Personal', icon: Eye },
    { id: 'Product', name: 'Product', icon: Sparkles },
    { id: 'Brand', name: 'Brand', icon: Sparkles },
    { id: 'Video', name: 'Video', icon: Play }
  ];

  // Show loading state
  if (!isMounted) {
    return (
      <section className="py-12 md:py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
              The Radikal <span className="text-[#D4AF37]">Transformation</span>
            </h2>
            <p className="text-lg md:text-xl text-[#D4AF37] max-w-2xl mx-auto">
              From ordinary to extraordinary across all services
            </p>
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37] mx-auto"></div>
            <p className="text-[#D4AF37] mt-4">Loading transformations...</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTransform = filteredTransformations[currentIndex];

  return (
    <section className="py-12 md:py-20 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 font-playfair">
            The Radikal <span className="text-[#D4AF37]">Transformation</span>
          </h2>
          <p className="text-lg md:text-xl text-[#D4AF37] max-w-2xl mx-auto">
            From ordinary to extraordinary across all services
          </p>
        </div>

        {/* Filter Tabs - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex justify-center mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex space-x-2 md:space-x-4 px-4 md:px-0 min-w-max">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap flex-shrink-0 ${activeFilter === filter.id
                  ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="text-sm md:text-base">{filter.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredTransformations.length === 0 && (
          <div className="text-center py-8 md:py-12 max-w-2xl mx-auto">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-gray-800">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#D4AF37]">
                No Transformations Found
              </h3>
              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-base">
                No transformations available for "{activeFilter}" category.
              </p>
              <button
                onClick={() => setActiveFilter('All')}
                className="bg-[#D4AF37] hover:bg-[#b8941f] text-black px-6 py-3 rounded-lg font-semibold transition-colors text-sm md:text-base"
              >
                Show All Transformations
              </button>
            </div>
          </div>
        )}

        {/* Transformation Display */}
        {filteredTransformations.length > 0 && currentTransform && (
          <div className="max-w-4xl mx-auto">
            {/* Image Container */}
            <div
              className="relative aspect-[3/4] md:aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-gray-700 shadow-2xl mb-6 md:mb-8 cursor-pointer bg-gray-900"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={handleToggleView}
            >
              {/* Before Image */}
              <div className={`absolute inset-0 ${showAfter ? 'hidden' : 'block'}`}>
                <img
                  src={currentTransform.beforeUrl}
                  alt="Before transformation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '1';
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000/333/fff?text=Before+Image+Not+Found';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
                />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-black/80 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-sm md:text-base">
                  BEFORE
                </div>
              </div>

              {/* After Image */}
              <div className={`absolute inset-0 ${showAfter ? 'block' : 'hidden'}`}>
                <img
                  src={currentTransform.afterUrl}
                  alt="After transformation"
                  className="w-full h-full object-cover"
                  loading="eager"
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '1';
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x1000/666/fff?text=After+Image+Not+Found';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
                />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 bg-[#D4AF37] text-black px-3 md:px-4 py-1 md:py-2 rounded-lg font-semibold text-sm md:text-base">
                  AFTER
                </div>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                className="absolute top-3 md:top-4 right-3 md:right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
                aria-label={isPlaying ? 'Pause auto-play' : 'Play auto-play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Play className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>

              {/* Swipe Hint - Mobile Only */}
              <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/60 text-white px-2 py-1 rounded text-xs md:hidden backdrop-blur-sm z-20">
                ← Swipe →
              </div>
            </div>

            {/* Controls - Manual Toggle Button HIDDEN ON MOBILE */}
            <div className="hidden md:flex md:flex-row justify-between items-center gap-4 md:gap-8 mb-6 md:mb-8">
              {/* Manual Toggle Button - Only visible on desktop */}
              <button
                onClick={handleToggleView}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-colors border border-gray-600 w-full md:w-auto justify-center"
              >
                {showAfter ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    <span>Show Before</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    <span>Show After</span>
                  </>
                )}
              </button>
            </div>

            {/* Transformation Info */}
            <div className="text-center bg-gray-900/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-800 hover:border-gray-600 transition-all duration-500 mb-6 md:mb-8">
              <h4 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white">
                {currentTransform.title}
              </h4>
            </div>

            {/* View More Button */}
            <div className="text-center">
              <Link
                href="/transformations"
                className="inline-flex items-center space-x-2 bg-transparent hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors border border-[#D4AF37] text-sm md:text-base group"
              >
                <span>View More Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}