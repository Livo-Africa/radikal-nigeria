'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Star, MessageCircle, User, ZoomIn, X, ChevronDown, Filter } from 'lucide-react';
import { Testimonial } from '@/types';

// Extended filter types
type FilterType = 'All' | 'Individuals' | 'Business' | 'Creators' | 'WhatsApp';

interface TestimonialsGalleryProps {
    testimonials: Testimonial[];
}

export default function TestimonialsGallery({ testimonials = [] }: TestimonialsGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<FilterType>('All');
    const [visibleCount, setVisibleCount] = useState(12);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filters: { id: FilterType; label: string }[] = [
        { id: 'All', label: 'All Stories' },
        { id: 'Individuals', label: 'Individuals' },
        { id: 'Business', label: 'Business' },
        { id: 'Creators', label: 'Creators' },
        { id: 'WhatsApp', label: 'WhatsApp Reviews' },
    ];

    // Filtering Logic
    const filteredTestimonials = useMemo(() => {
        if (activeFilter === 'All') return testimonials;

        if (activeFilter === 'WhatsApp') {
            return testimonials.filter(t => t.category?.toLowerCase().includes('whatsapp'));
        }

        return testimonials.filter(t => {
            const category = (t.category || '').toLowerCase();
            switch (activeFilter) {
                case 'Individuals':
                    return category.includes('individual') || category.includes('personal');
                case 'Business':
                    return category.includes('business') || category.includes('corporate');
                case 'Creators':
                    return category.includes('creator') || category.includes('influencer');
                default:
                    return true;
            }
        });
    }, [testimonials, activeFilter]);

    const visibleTestimonials = filteredTestimonials.slice(0, visibleCount);
    const hasMore = visibleCount < filteredTestimonials.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    const handleFilterChange = (filter: FilterType) => {
        setActiveFilter(filter);
        setVisibleCount(12);
        window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll to top of grid
    };

    return (
        <>
            {/* Image Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-full w-full">
                        <img
                            src={expandedImage}
                            alt="Testimonial Proof"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                            onClick={() => setExpandedImage(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-8">
                {/* Filters - Sticky on Mobile */}
                <div className="sticky top-20 md:top-0 z-20 bg-white/95 backdrop-blur md:bg-transparent md:backdrop-blur-none py-4 mb-8 border-b md:border-none border-gray-100 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3 md:justify-center">
                        {filters.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => handleFilterChange(filter.id)}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap border flex-shrink-0 ${activeFilter === filter.id
                                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900 shadow-sm'
                                    }`}
                            >
                                <span>{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6 text-gray-400 text-sm text-center md:text-left">
                    Showing {visibleTestimonials.length} of {filteredTestimonials.length} stories
                </div>

                {/* MASONRY GRID LAYOUT */}
                {/* We use CSS columns for true Masonry effect */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {visibleTestimonials.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="break-inside-avoid mb-6">
                            <TestimonialCard
                                item={item}
                                onExpand={() => item.imageUrl && setExpandedImage(item.imageUrl)}
                            />
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {hasMore && (
                    <div className="mt-12 text-center pb-12">
                        <button
                            onClick={handleLoadMore}
                            className="inline-flex items-center space-x-2 bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-300 group shadow-md"
                        >
                            <span>Load More Stories</span>
                            <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {filteredTestimonials.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No stories found</h3>
                        <p className="text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </div>
        </>
    );
}

function TestimonialCard({ item, onExpand }: { item: Testimonial; onExpand: () => void }) {
    const isWhatsApp = item.category?.toLowerCase().includes('whatsapp');
    const rating = item.rating || 5;

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-auto">
            {/* Header / User Info */}
            <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isWhatsApp ? 'bg-green-100 text-green-600' : 'bg-[#D4AF37]/10 text-[#D4AF37]'
                        }`}>
                        {isWhatsApp ? <MessageCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                </div>
                <div className="flex">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{item.text}"</p>

                {/* Optional Image Attachment */}
                {item.imageUrl && (
                    <div
                        className="relative h-48 w-full rounded-xl overflow-hidden cursor-pointer group mt-2"
                        onClick={onExpand}
                    >
                        <Image
                            src={item.imageUrl}
                            alt="Evidence"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all text-xs font-medium flex items-center gap-1">
                                <ZoomIn className="w-4 h-4" /> View
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
