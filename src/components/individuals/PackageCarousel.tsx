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

export default function PackageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string>('Specialty & Themed');
    const carouselRef = useRef<HTMLDivElement>(null);

    const categoryData = {
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
        }
    };

    const categories = Object.keys(categoryData);
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

        window.location.href = '/individuals/style-journey?step=2';
    };

    const CategoryIcon = ({ category }: { category: string }) => {
        switch (category) {
            case 'Specialty & Themed': return <Trophy className="w-4 h-4" />;
            case 'Birthday': return <Cake className="w-4 h-4" />;
            case 'Solo': return <User className="w-4 h-4" />;
            case 'Group': return <Users className="w-4 h-4" />;
            default: return <Star className="w-4 h-4" />;
        }
    };

    return (
        <section id="packages" className="py-8 bg-white">
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
                            className={`flex items-center gap-2 flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
                                    ? 'bg-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <CategoryIcon category={category} />
                            {category}
                        </button>
                    ))}
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
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
                                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center"
                                >
                                    {/* Package Card */}
                                    <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                                        {/* Popular Badge */}
                                        {pkg.popular && (
                                            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                                                <Star className="w-3 h-3" />
                                                MOST POPULAR
                                            </div>
                                        )}

                                        {/* Package Header */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                                                <div className="text-2xl font-bold text-gray-900 bg-[#D4AF37]/10 px-3 py-1 rounded-lg">
                                                    {pkg.price}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500">{pkg.description}</p>
                                        </div>

                                        {/* Features Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            <div className="bg-[#D4AF37]/5 rounded-lg p-3 flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                                    <Camera className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{pkg.photos}</div>
                                                    <div className="text-xs text-gray-500">Images</div>
                                                </div>
                                            </div>

                                            {pkg.outfits && (
                                                <div className="bg-[#D4AF37]/5 rounded-lg p-3 flex items-center gap-2">
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
                                        <div className="mb-8">
                                            <div className="space-y-2">
                                                {pkg.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center text-sm text-gray-700">
                                                        <Check className="w-4 h-4 text-[#D4AF37] mr-2 flex-shrink-0" />
                                                        <span className="text-sm">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                        >
                                            Select Package
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {currentPackages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full transition-all ${index === currentIndex
                                    ? 'w-8 h-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to package ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Position Indicator */}
                    <div className="text-center mt-4">
                        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                            <div className="text-sm font-medium text-gray-600">
                                {currentIndex + 1} <span className="text-gray-400">/ {currentPackages.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* View All Link */}
                    <div className="text-center mt-8 pt-6 border-t border-gray-100">
                        <a
                            href="/individuals/packages"
                            className="inline-flex items-center gap-2 text-[#D4AF37] font-semibold hover:text-[#b8941f] transition-colors text-sm"
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