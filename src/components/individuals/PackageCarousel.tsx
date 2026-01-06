// components/individuals/PackageCarousel.tsx
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

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits?: number;
    features: string[];
    popular: boolean;
    category: string;
    description: string;
}

interface PackageCarouselProps {
    country?: 'GH' | 'NG';
}

// Hardcoded Ghana Data (Preserved)
const GH_DATA = {
    'Solo': {
        packages: [
            {
                id: "solo-standard",
                name: "Solo Standard",
                price: "₵50",
                photos: 4,
                outfits: 1,
                features: ["4 Images", "1 Outfit", "Multiple poses"],
                popular: true,
                category: "Solo",
                description: "Personal photos"
            },
            {
                id: "solo-medium",
                name: "Solo Medium",
                price: "₵90",
                photos: 8,
                outfits: 2,
                features: ["8 Images", "2 Outfits", "Varied poses"],
                popular: false,
                category: "Solo",
                description: "More variety"
            },
            {
                id: "solo-supreme",
                name: "Solo Supreme",
                price: "₵130",
                photos: 15,
                outfits: 3,
                features: ["15 Images", "3 Outfits", "Premium lighting"],
                popular: false,
                category: "Solo",
                description: "Premium portfolio"
            }
        ]
    },
    'Birthday': {
        packages: [
            {
                id: "birthday-basic",
                name: "Birthday Basic",
                price: "₵40",
                photos: 4,
                outfits: 1,
                features: ["4 Images", "Birthday theme", "1 Outfit"],
                popular: true,
                category: "Birthday",
                description: "Simple birthday photos"
            },
            {
                id: "birthday-deluxe",
                name: "Birthday Deluxe",
                price: "₵70",
                photos: 6,
                outfits: 2,
                features: ["6 Images", "2 Outfits", "Enhanced layout"],
                popular: false,
                category: "Birthday",
                description: "Enhanced birthday photos"
            },
            {
                id: "birthday-royal",
                name: "Birthday Royal",
                price: "₵100",
                photos: 10,
                outfits: 3,
                features: ["10 Images", "3 Outfits", "Luxury layout"],
                popular: false,
                category: "Birthday",
                description: "Premium birthday photos"
            }
        ]
    },

    'Group': {
        packages: [
            {
                id: "group-standard",
                name: "Group Standard",
                price: "₵80",
                photos: 4,
                outfits: 2,
                features: ["2 People", "4 Images", "2 Outfits"],
                popular: false,
                category: "Group",
                description: "Couples or friends"
            },
            {
                id: "group-deluxe",
                name: "Group Deluxe",
                price: "₵130",
                photos: 6,
                outfits: 3,
                features: ["2 People", "6 Images", "3 Outfits"],
                popular: false,
                category: "Group",
                description: "Creative group photos"
            },
            {
                id: "group-supreme",
                name: "Group Supreme",
                price: "₵200",
                photos: 10,
                outfits: 5,
                features: ["2 People", "10 Images", "+1: ₵30"],
                popular: false,
                category: "Group",
                description: "Premium group photos"
            }
        ]
    },
    'Specialty & Themed': {
        packages: [
            {
                id: "profile-headshots",
                name: "Profile Headshots",
                price: "₵30",
                photos: 3,
                outfits: 1,
                features: ["3 Images", "1 Outfit", "Social media ready", "Perfect for CV"],
                popular: true,
                category: "Specialty",
                description: "Professional profile photos"
            },
            {
                id: "jersey-shoot",
                name: "Jersey Shoot",
                price: "₵20",
                photos: 3,
                outfits: 1,
                features: ["Custom jersey name", "3 Images", "Sports theme"],
                popular: false,
                category: "Specialty",
                description: "Team spirit photos"
            },
            {
                id: "occupation-shots",
                name: "Occupation Shots",
                price: "₵50",
                photos: 3,
                outfits: 1,
                features: ["Professional theme", "Studio background", "Portfolio ready"],
                popular: true,
                category: "Specialty",
                description: "Career-focused photos"
            },
            {
                id: "graduation-shots",
                name: "Graduation Shots",
                price: "₵70",
                photos: 3,
                outfits: 1,
                features: ["Custom gown", "Name sash", "School theme"],
                popular: true,
                category: "Specialty",
                description: "Graduation celebration"
            }
        ]
    }
};

export default function PackageCarousel({ country = 'GH' }: PackageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    // Initialize activeCategory based on available categories for the country
    const [activeCategory, setActiveCategory] = useState<string>('');
    const carouselRef = useRef<HTMLDivElement>(null);

    // Dynamic Data Loading
    let categoryData: typeof GH_DATA;

    if (country === 'NG') {
        const transformedData: any = {};
        // Use NG_CATEGORIES_DATA to order and label the tabs correctly
        NG_CATEGORIES_DATA.forEach(cat => {
            const catKey = cat.id; // e.g., 'professional'
            const packages = NG_PACKAGES_DATA[catKey] || [];

            if (packages.length > 0) {
                transformedData[cat.label] = {
                    packages: packages.map(pkg => ({
                        id: pkg.id,
                        name: pkg.name,
                        price: `₦${pkg.price.toLocaleString()}`,
                        photos: pkg.images,
                        outfits: pkg.outfits,
                        features: [`${pkg.images} Images`, `${pkg.outfits} Outfit${pkg.outfits > 1 ? 's' : ''}`, pkg.description], // Construct simplified features
                        popular: pkg.popular || false,
                        category: cat.label,
                        description: pkg.description
                    }))
                };
            }
        });
        categoryData = transformedData;
    } else {
        categoryData = GH_DATA;
    }

    const categories = Object.keys(categoryData);

    // Ensure activeCategory is valid when country changes
    useEffect(() => {
        if (!categories.includes(activeCategory)) {
            setActiveCategory(categories[0] || '');
        }
    }, [country, categories, activeCategory]);

    const currentPackages = categoryData[activeCategory as keyof typeof categoryData]?.packages || [];

    // Handle touch events for swipe
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

    // Scroll carousel to current index
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

    // Reset index when category changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    const handlePackageSelect = (pkg: Package) => {
        localStorage.setItem('radikal_preselected_package', JSON.stringify({
            package: pkg,
            selectedAt: new Date().toISOString()
        }));

        if (country === 'NG') {
            window.location.href = '/individuals/book';
        } else {
            window.location.href = '/individuals/style-journey?step=2';
        }
    };

    const CategoryIcon = ({ category }: { category: string }) => {
        // Simple heuristic for icons based on text
        if (category.includes('Specialty') || category.includes('Jersey')) return <Trophy className="w-4 h-4" />;
        if (category.includes('Birthday')) return <Cake className="w-4 h-4" />;
        if (category.includes('Solo') || category.includes('Professional') || category.includes('Graduation')) return <User className="w-4 h-4" />;
        if (category.includes('Group')) return <Users className="w-4 h-4" />;
        return <Star className="w-4 h-4" />;
    };

    if (categories.length === 0) return null;

    return (
        <section id="packages" className="py-8 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                        Choose Your Package
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Swipe to see options
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide -mx-4 px-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`dot-indicator flex items-center gap-2 flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
                                ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20 border border-[#D4AF37]'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#D4AF37]/50'
                                }`}
                        >
                            <CategoryIcon category={category} />
                            {category}
                        </button>
                    ))}
                </div>

                {/* Carousel Container */}
                <div className="relative pb-8">
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
                                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center pt-6" // pt-6 to allow space for hanging tag/ribbon
                                >
                                    {/* Package Card - Luxury White design */}
                                    <div className="relative bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-xl hover:shadow-2xl transition-all duration-300">

                                        {/* Subtle Gold Pattern Background Overlay */}
                                        <div className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
                                            style={{
                                                backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
                                                backgroundSize: '10px 10px'
                                            }}
                                        />

                                        {/* Popular Ribbon - Diagonal Top Left */}
                                        {pkg.popular && (
                                            <div className="absolute -top-3 -left-3 z-20">
                                                <div className="bg-[#B91C1C] text-white text-[10px] font-bold px-3 py-1 shadow-md transform -rotate-12 rounded-sm border border-white/20">
                                                    POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Hanging Price Tag - Top Right */}
                                        <div className="absolute -top-5 -right-2 z-20 shadow-lg transform rotate-3 hover:rotate-6 transition-transform origin-top-right">
                                            <div className="bg-[#D4AF37] text-white p-1 rounded-sm relative">
                                                <div className="border border-white/30 rounded-sm px-2 py-1 bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">
                                                    <div className="text-xl font-bold">{pkg.price}</div>
                                                </div>
                                                {/* Simulated string/hook maybe? Keeping it simple for now */}
                                            </div>
                                        </div>

                                        {/* Package Header */}
                                        <div className="mb-6 mt-2 relative z-10">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                            <p className="text-sm text-gray-500 font-medium tracking-wide uppercase text-xs">{pkg.category}</p>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                            <div className="bg-[#D4AF37]/5 rounded-lg p-3 flex items-center gap-2 border border-[#D4AF37]/10">
                                                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                                    <Camera className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{pkg.photos}</div>
                                                    <div className="text-xs text-gray-500">Images</div>
                                                </div>
                                            </div>

                                            {pkg.outfits && (
                                                <div className="bg-[#D4AF37]/5 rounded-lg p-3 flex items-center gap-2 border border-[#D4AF37]/10">
                                                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                                        <Shirt className="w-4 h-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900">{pkg.outfits}</div>
                                                        <div className="text-xs text-gray-500">Outfits</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Features List */}
                                        <div className="mb-8 relative z-10">
                                            <div className="space-y-3">
                                                {pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50/50 p-2 rounded-lg">
                                                        <Check className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                                                        <span className="text-sm font-medium">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className="relative z-10 w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-[#D4AF37]/30"
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
                                className={`dot-indicator rounded-full transition-all ${index === currentIndex
                                    ? 'w-8 h-2 bg-[#D4AF37]'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to package ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Swipe Hint */}
                    <div className="text-center mt-4">
                        <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-medium bg-[#D4AF37]/5 px-3 py-1 rounded-full animate-pulse">
                            Swipe to see more <ChevronRight className="w-3 h-3" />
                        </div>
                    </div>

                    {/* View All Link */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-100">
                        <a
                            href="/individuals/packages"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
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
