'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Eye, Sparkles, ChevronDown, X, Loader2 } from 'lucide-react';

type MainFilterType = 'All' | 'Birthday' | 'Solo' | 'Headshots' | 'Products' | 'Creative' | 'Video';

interface CollageTransformation {
    id: string;
    imageUrl: string;
    category: string;
    package?: string;
}

interface CollageGalleryProps {
    transformations: CollageTransformation[];
}

// Sub-filter definitions
const SUB_FILTERS: Record<string, string[]> = {
    Birthday: ['All', 'Basic', 'Deluxe', 'Royal'],
    Solo: ['All', 'Standard', 'Medium', 'Supreme'],
};

const MAIN_FILTERS: MainFilterType[] = ['All', 'Birthday', 'Solo', 'Headshots', 'Products', 'Creative', 'Video'];

export default function CollageGallery({ transformations = [] }: CollageGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<MainFilterType>('All');
    const [activeSubFilter, setActiveSubFilter] = useState<string>('All');
    const [visibleCount, setVisibleCount] = useState(10);
    const [selectedImage, setSelectedImage] = useState<CollageTransformation | null>(null);
    const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Get available sub-filters for the current main filter
    const currentSubFilters = SUB_FILTERS[activeFilter] || null;

    // Filtering Logic (Case-Insensitive)
    const filteredTransformations = useMemo(() => {
        let filtered = transformations;

        // Step 1: Filter by main category
        if (activeFilter !== 'All') {
            filtered = filtered.filter(t => {
                const category = (t.category || '').toLowerCase();

                switch (activeFilter) {
                    case 'Birthday':
                        return category.includes('birthday');
                    case 'Solo':
                        return category.includes('solo') || category.includes('personal') || category.includes('individual');
                    case 'Headshots':
                        return category.includes('headshot') || category.includes('corporate') || category.includes('professional') || category.includes('brand') || category.includes('business');
                    case 'Products':
                        return category.includes('product') || category.includes('commercial');
                    case 'Creative':
                        return category.includes('creative') || category.includes('art') || category.includes('editorial');
                    case 'Video':
                        return category.includes('video') || category.includes('reel') || category.includes('motion');
                    default:
                        return true;
                }
            });
        }

        // Step 2: Filter by sub-filter (package) if applicable
        if (currentSubFilters && activeSubFilter !== 'All') {
            filtered = filtered.filter(t => {
                const pkg = (t.package || '').toLowerCase();
                return pkg === activeSubFilter.toLowerCase();
            });
        }

        return filtered;
    }, [transformations, activeFilter, activeSubFilter, currentSubFilters]);

    const visibleItems = filteredTransformations.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTransformations.length;

    const handleLoadMore = useCallback(() => {
        setIsLoadingMore(true);
        // Simulate smooth loading
        setTimeout(() => {
            setVisibleCount(prev => prev + 10);
            setIsLoadingMore(false);
        }, 300);
    }, []);

    const handleMainFilterChange = useCallback((filter: MainFilterType) => {
        setActiveFilter(filter);
        setActiveSubFilter('All');
        setVisibleCount(10);
    }, []);

    const handleSubFilterChange = useCallback((subFilter: string) => {
        setActiveSubFilter(subFilter);
        setVisibleCount(10);
    }, []);

    const handleImageLoad = useCallback((id: string) => {
        setImageLoadStates(prev => ({ ...prev, [id]: true }));
    }, []);

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!selectedImage) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedImage(null);
            } else if (e.key === 'ArrowRight') {
                const currentIndex = filteredTransformations.findIndex(t => t.id === selectedImage.id);
                if (currentIndex < filteredTransformations.length - 1) {
                    setSelectedImage(filteredTransformations[currentIndex + 1]);
                }
            } else if (e.key === 'ArrowLeft') {
                const currentIndex = filteredTransformations.findIndex(t => t.id === selectedImage.id);
                if (currentIndex > 0) {
                    setSelectedImage(filteredTransformations[currentIndex - 1]);
                }
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage, filteredTransformations]);

    return (
        <div className="bg-black min-h-screen overflow-x-hidden">
            {/* Mobile Header */}
            <div className="md:hidden pt-6 pb-3 text-center px-4">
                <h1 className="text-2xl font-bold font-playfair text-white">
                    The RAdikal <span className="text-[#D4AF37]">Difference</span>
                </h1>
            </div>

            {/* Filter Section - Sticky */}
            <div className="sticky top-16 md:top-0 z-30 bg-gradient-to-b from-black via-black/98 to-black/95 backdrop-blur-xl border-b border-white/5 overflow-hidden">
                <div className="container mx-auto px-4 py-3 md:py-4 overflow-hidden">
                    {/* Main Filters - Horizontal Scroll on Mobile */}
                    <div
                        className="overflow-x-auto pb-2 md:pb-0 md:overflow-visible"
                        style={{
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <div className="flex md:justify-center gap-2 md:gap-1 w-max md:w-auto mx-auto">
                            <div className="flex md:inline-flex md:bg-white/5 md:rounded-2xl md:p-1 md:backdrop-blur-sm md:border md:border-white/10 gap-2 md:gap-0">
                                {MAIN_FILTERS.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => handleMainFilterChange(filter)}
                                        className={`
                                            relative px-4 md:px-5 py-2.5 md:py-2 rounded-xl md:rounded-lg text-sm font-semibold 
                                            transition-all duration-300 whitespace-nowrap flex-shrink-0
                                            ${activeFilter === filter
                                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black shadow-lg shadow-[#D4AF37]/30 scale-[1.02]'
                                                : 'bg-white/5 md:bg-transparent text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 md:border-0'
                                            }
                                        `}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sub-Filters Row */}
                    {currentSubFilters && (
                        <div
                            className="mt-3 overflow-x-auto pb-1 md:pb-0 md:overflow-visible"
                            style={{
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            <div className="flex md:justify-center items-center gap-2 w-max md:w-auto mx-auto">
                                <span className="text-gray-500 text-xs uppercase tracking-wider mr-1 hidden md:inline">Package</span>
                                <div className="h-4 w-px bg-gray-700 hidden md:block" />
                                {currentSubFilters.map((subFilter) => (
                                    <button
                                        key={subFilter}
                                        onClick={() => handleSubFilterChange(subFilter)}
                                        className={`
                                            px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide 
                                            transition-all duration-200 whitespace-nowrap flex-shrink-0
                                            ${activeSubFilter === subFilter
                                                ? 'bg-white text-black shadow-md'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/15 hover:text-white border border-white/10'
                                            }
                                        `}
                                    >
                                        {subFilter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Gallery Content */}
            <div className="container mx-auto px-3 md:px-4 py-6 md:py-10">
                {/* Results Summary */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-500 text-sm">
                        <span className="text-white font-semibold">{filteredTransformations.length}</span> results
                        {activeFilter !== 'All' && (
                            <span className="ml-1">in <span className="text-[#D4AF37]">{activeFilter}</span></span>
                        )}
                    </p>
                    {activeFilter !== 'All' && (
                        <button
                            onClick={() => handleMainFilterChange('All')}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                        >
                            Clear filter
                        </button>
                    )}
                </div>

                {/* Gallery Grid - Responsive Masonry-like */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {visibleItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="group relative bg-gray-900/50 rounded-2xl overflow-hidden cursor-pointer 
                                       transform transition-all duration-500 hover:scale-[1.02] hover:z-10
                                       border border-gray-800/50 hover:border-[#D4AF37]/40
                                       shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/10"
                            onClick={() => setSelectedImage(item)}
                            style={{
                                animationDelay: `${(index % 10) * 50}ms`,
                                opacity: 0,
                                animation: 'fadeSlideUp 0.5s ease-out forwards'
                            }}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                                {/* Skeleton Loader */}
                                {!imageLoadStates[item.id] && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-gray-700 animate-spin" />
                                    </div>
                                )}
                                <img
                                    src={item.imageUrl}
                                    alt={item.category || 'Transformation'}
                                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110
                                               ${imageLoadStates[item.id] ? 'opacity-100' : 'opacity-0'}`}
                                    loading="lazy"
                                    onLoad={() => handleImageLoad(item.id)}
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                                              opacity-0 group-hover:opacity-100 transition-all duration-300
                                              flex flex-col justify-end p-4">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                        {item.package && (
                                            <span className="ml-2 text-white/70 text-xs">
                                                • {item.package}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* View Icon */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                              opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                    <div className="bg-white/10 backdrop-blur-xl p-4 rounded-full border border-white/20">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTransformations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 mb-6 shadow-xl">
                            <Sparkles className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No results found</h3>
                        <p className="text-gray-400 mb-6 max-w-md mx-auto">
                            We couldn't find any transformations matching your criteria. Try a different category.
                        </p>
                        <button
                            onClick={() => handleMainFilterChange('All')}
                            className="px-6 py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#F4D03F] transition-colors"
                        >
                            View All Work
                        </button>
                    </div>
                )}

                {/* Load More */}
                {hasMore && (
                    <div className="mt-12 mb-8 text-center">
                        <button
                            onClick={handleLoadMore}
                            disabled={isLoadingMore}
                            className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 
                                     border border-white/10 hover:border-[#D4AF37]/50 
                                     text-white px-8 py-4 rounded-2xl font-semibold 
                                     transition-all duration-300 group disabled:opacity-50"
                        >
                            {isLoadingMore ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <span>Load More</span>
                                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                                </>
                            )}
                        </button>
                        <p className="text-gray-600 text-sm mt-3">
                            Showing {visibleItems.length} of {filteredTransformations.length}
                        </p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-xl"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-3 rounded-full
                                 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10
                                 transition-all duration-200 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Navigation Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 text-gray-500 text-sm">
                        <span>← → Navigate</span>
                        <span>•</span>
                        <span>ESC Close</span>
                    </div>

                    {/* Image Container */}
                    <div
                        className="relative max-w-6xl w-full mx-4 flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.category || 'Full size'}
                            className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        />

                        {/* Image Info */}
                        <div className="mt-6 flex items-center gap-4">
                            <span className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                {selectedImage.category}
                            </span>
                            {selectedImage.package && (
                                <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm">
                                    {selectedImage.package}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes fadeSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
