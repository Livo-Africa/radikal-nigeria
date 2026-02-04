'use client';

import { useState, useMemo, useEffect } from 'react';
import { Eye, Sparkles, ChevronDown, X } from 'lucide-react';

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

    // Get available sub-filters for the current main filter
    const currentSubFilters = SUB_FILTERS[activeFilter] || null;

    // Filtering Logic (Case-Insensitive)
    const filteredTransformations = useMemo(() => {
        let filtered = transformations;

        // Step 1: Filter by main category
        if (activeFilter !== 'All') {
            filtered = filtered.filter(t => {
                const category = (t.category || '').toLowerCase();
                const filterLower = activeFilter.toLowerCase();

                // Match category keywords
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
                        return category.includes(filterLower);
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

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    const handleMainFilterChange = (filter: MainFilterType) => {
        setActiveFilter(filter);
        setActiveSubFilter('All'); // Reset sub-filter when main filter changes
        setVisibleCount(10);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubFilterChange = (subFilter: string) => {
        setActiveSubFilter(subFilter);
        setVisibleCount(10);
    };

    // Close lightbox on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="bg-black min-h-screen">
            {/* Mobile Header - "The RAdikal Difference" */}
            <div className="md:hidden pt-8 pb-4 text-center px-4">
                <h1 className="text-3xl font-bold font-playfair text-white">
                    The RAdikal <span className="text-[#D4AF37]">Difference</span>
                </h1>
            </div>

            {/* Modern Filter Section */}
            <div className="sticky top-16 md:top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    {/* Main Filters - Segmented Control Style */}
                    <div className="flex justify-center mb-3">
                        <div className="inline-flex bg-white/5 rounded-2xl p-1.5 backdrop-blur-sm border border-white/10">
                            {MAIN_FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => handleMainFilterChange(filter)}
                                    className={`
                                        relative px-4 md:px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap
                                        ${activeFilter === filter
                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black shadow-lg shadow-[#D4AF37]/25'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub-Filters Row (Conditional) */}
                    {currentSubFilters && (
                        <div className="flex justify-center animate-fadeIn">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500 mr-2 hidden md:inline">Package:</span>
                                {currentSubFilters.map((subFilter) => (
                                    <button
                                        key={subFilter}
                                        onClick={() => handleSubFilterChange(subFilter)}
                                        className={`
                                            px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200
                                            ${activeSubFilter === subFilter
                                                ? 'bg-white text-black'
                                                : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white border border-white/10'
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

            <div className="container mx-auto px-4 py-8">
                {/* Results Count */}
                <div className="mb-6 text-gray-500 text-sm text-center md:text-left">
                    Showing {visibleItems.length} of {filteredTransformations.length} results
                </div>

                {/* Gallery Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {visibleItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer group hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300 border border-gray-800 hover:border-[#D4AF37]/50"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative w-full">
                                <img
                                    src={item.imageUrl}
                                    alt={item.category || 'Transformation'}
                                    className="w-full h-auto object-cover display-block"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-full text-white">
                                        <Eye className="w-6 h-6" />
                                    </div>
                                </div>
                            </div>
                            {(item.category || item.package) && (
                                <div className="p-4 border-t border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                                            {item.category}
                                        </p>
                                        {item.package && (
                                            <span className="text-gray-500 text-xs bg-gray-800 px-2 py-0.5 rounded">
                                                {item.package}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredTransformations.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
                            <Sparkles className="w-8 h-8 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                        <p className="text-gray-400">Try selecting a different category or package.</p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="mt-12 text-center pb-20">
                        <button
                            onClick={handleLoadMore}
                            className="inline-flex items-center space-x-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] px-8 py-3 rounded-xl font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
                        >
                            <span>View More</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 md:top-8 md:right-8 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(null);
                        }}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.imageUrl}
                            alt={selectedImage.category || 'Full size'}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        {(selectedImage.category || selectedImage.package) && (
                            <div className="mt-4 text-center flex items-center gap-3">
                                <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider">
                                    {selectedImage.category}
                                </span>
                                {selectedImage.package && (
                                    <>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-white text-sm">
                                            {selectedImage.package}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
