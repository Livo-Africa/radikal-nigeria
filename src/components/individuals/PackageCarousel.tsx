// components/individuals/PackageCarousel.tsx - PREMIUM DARK MODE REDESIGN
'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Camera,
    Shirt,
    ChevronLeft,
    ChevronRight,
    Star,
    Trophy,
    Cake,
    User,
    Users,
    Check
} from 'lucide-react';
import { PACKAGES_BY_CATEGORY as NG_PACKAGES_DATA, CATEGORIES as NG_CATEGORIES_DATA } from '@/utils/bookingDataNigeria';
import { PACKAGES_BY_CATEGORY as GH_PACKAGES_DATA, CATEGORIES as GH_CATEGORIES_DATA } from '@/utils/bookingDataGhana';

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits?: number;
    features: string[];
    popular: boolean;
    category: string;
    categoryId: string;
    description: string;
}

interface PackageCarouselProps {
    country?: 'GH' | 'NG';
}



export default function PackageCarousel({ country = 'GH' }: PackageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const carouselRef = useRef<HTMLDivElement>(null);

    // Dynamic Data Loading
    let categoryData: any = {};

    if (country === 'NG') {
        NG_CATEGORIES_DATA.forEach(cat => {
            const catKey = cat.id;
            const packages = NG_PACKAGES_DATA[catKey] || [];

            if (packages.length > 0) {
                categoryData[cat.label] = {
                    packages: packages.map(pkg => ({
                        id: pkg.id,
                        name: pkg.name,
                        price: `₦${pkg.price.toLocaleString()}`,
                        photos: pkg.images,
                        outfits: pkg.outfits,
                        features: [pkg.description],
                        popular: pkg.popular || false,
                        category: cat.label,
                        categoryId: cat.id,
                        description: pkg.description
                    }))
                };
            }
        });
    } else {
        GH_CATEGORIES_DATA.forEach(cat => {
            const catKey = cat.id;
            const packages = GH_PACKAGES_DATA[catKey] || [];

            if (packages.length > 0) {
                categoryData[cat.label] = {
                    packages: packages.map(pkg => ({
                        id: pkg.id,
                        name: pkg.name,
                        price: `₵${pkg.price.toLocaleString()}`,
                        photos: pkg.images,
                        outfits: pkg.outfits || 0,
                        features: [pkg.description],
                        popular: pkg.popular || false,
                        category: cat.label,
                        categoryId: cat.id,
                        description: pkg.description
                    }))
                };
            }
        });
    }

    const categories = Object.keys(categoryData);

    useEffect(() => {
        if (!categories.includes(activeCategory)) {
            setActiveCategory(categories[0] || '');
        }
    }, [country, categories, activeCategory]);

    const currentPackages = categoryData[activeCategory as keyof typeof categoryData]?.packages || [];

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < currentPackages.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                setCurrentIndex(prev => prev - 1);
            }
        }
    };

    useEffect(() => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.clientWidth * 0.85;
            const scrollPosition = currentIndex * (cardWidth + 16);

            carouselRef.current.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }, [currentIndex, currentPackages]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    const handlePackageSelect = (pkg: Package) => {
        localStorage.setItem('radikal_preselected_package', JSON.stringify({
            package: pkg,
            selectedAt: new Date().toISOString()
        }));

        if (country === 'NG') {
            window.location.href = `/individuals/book?category=${pkg.categoryId}&packageId=${pkg.id}`;
        } else {
            window.location.href = `/individuals/style-journey?category=${pkg.categoryId}&packageId=${pkg.id}`;
        }
    };

    const CategoryIcon = ({ category }: { category: string }) => {
        if (category.includes('Specialty') || category.includes('Jersey')) return <Trophy className="w-4 h-4" />;
        if (category.includes('Birthday')) return <Cake className="w-4 h-4" />;
        if (category.includes('Solo') || category.includes('Professional') || category.includes('Graduation')) return <User className="w-4 h-4" />;
        if (category.includes('Group')) return <Users className="w-4 h-4" />;
        return <Star className="w-4 h-4" />;
    };

    if (categories.length === 0) return null;

    return (
        <section id="packages" className="py-8 bg-[#0A0A0F] overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2 font-playfair">
                        Choose Your Package
                    </h2>
                    <p className="text-white/40 text-sm">
                        Swipe to see options
                    </p>
                </div>

                {/* Category Filter - Glass Segmented Controls */}
                <div className="mb-6 overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex space-x-2 pb-2 min-w-max">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === category
                                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                                    : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20 hover:text-white/60'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative pb-8">
                    {/* Left Arrow Button */}
                    {currentIndex > 0 && (
                        <button
                            onClick={() => setCurrentIndex(prev => prev - 1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-xl hover:bg-white/20 shadow-lg rounded-full p-2 border border-white/10 hover:border-amber-500/30 transition-all duration-200"
                            aria-label="Previous package"
                        >
                            <ChevronLeft className="w-5 h-5 text-white" />
                        </button>
                    )}

                    {/* Right Arrow Button */}
                    {currentIndex < currentPackages.length - 1 && (
                        <button
                            onClick={() => setCurrentIndex(prev => prev + 1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/10 backdrop-blur-xl hover:bg-white/20 shadow-lg rounded-full p-2 border border-white/10 hover:border-amber-500/30 transition-all duration-200"
                            aria-label="Next package"
                        >
                            <ChevronRight className="w-5 h-5 text-white" />
                        </button>
                    )}

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-4"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        <div className="flex gap-4 px-4">
                            {currentPackages.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center pt-6"
                                >
                                    {/* Package Card - Dark Glass Design */}
                                    <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 shadow-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] transition-all duration-500 group">

                                        {/* Subtle Gradient Overlay on Hover */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        {/* Popular Badge */}
                                        {pkg.popular && (
                                            <div className="absolute -top-3 -left-1 z-20">
                                                <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 shadow-[0_0_15px_rgba(244,114,182,0.4)] transform -rotate-3 rounded-lg">
                                                    ✨ POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Price Tag */}
                                        <div className="absolute -top-4 -right-1 z-20">
                                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-black p-0.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                                <div className="px-3 py-1.5 rounded-[10px]">
                                                    <div className="text-xl font-black">{pkg.price}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Package Header */}
                                        <div className="mb-6 mt-2 relative z-10">
                                            <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                                            <p className="text-xs text-white/40 font-medium tracking-wider uppercase">{pkg.category}</p>
                                        </div>

                                        {/* Features List */}
                                        <div className="mb-8 relative z-10">
                                            <div className="space-y-2.5">
                                                {/* Photos */}
                                                <div className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                                                    <Camera className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                                                    <span className="font-medium text-white/80">{pkg.photos} Professional Photos</span>
                                                </div>

                                                {/* Outfits */}
                                                {pkg.outfits !== undefined && (
                                                    <div className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                                                        <Shirt className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                                                        <span className="font-medium text-white/80">{pkg.outfits} Outfit{pkg.outfits > 1 ? 's' : ''}</span>
                                                    </div>
                                                )}

                                                {/* Additional Features */}
                                                {pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                                                        <Check className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                                                        <span className="text-sm font-medium text-white/70">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Select Button - Gradient CTA */}
                                        <button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className="relative z-10 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-[0.98]"
                                        >
                                            Select Package
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {currentPackages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`dot-indicator rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'w-8 h-2 bg-gradient-to-r from-amber-400 to-orange-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Go to package ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Swipe Hint */}
                    <div className="text-center mt-4">
                        <div className="inline-flex items-center gap-2 text-amber-400/70 text-xs font-medium bg-amber-500/5 border border-amber-500/10 px-3 py-1 rounded-full animate-pulse">
                            Swipe to see more <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>

                    {/* View All Link */}
                    <div className="text-center mt-6 pt-6 border-t border-white/5">
                        <a
                            href="/individuals/packages"
                            className="inline-flex items-center gap-2 text-white/30 hover:text-amber-400 transition-colors text-sm font-medium"
                        >
                            View all packages
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
