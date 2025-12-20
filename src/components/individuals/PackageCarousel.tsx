// components/individuals/PackageCarousel.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits?: number;
    features: string[];
    popular: boolean;
    category: string;
    description?: string;
}

export default function PackageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string>('🎓 Specialty & Themed Packages');
    const carouselRef = useRef<HTMLDivElement>(null);

    const categoryData = {
        '🎓 Specialty & Themed Packages': {
            description: 'Best for specific events, school, or professional needs.',
            packages: [
                {
                    id: "profile-headshots",
                    name: "Profile Headshots",
                    price: "₵30",
                    photos: 3,
                    outfits: 1,
                    features: ["3 Images (1 Headshot, 1 Medium, 1 Full)", "1 Outfit", "Social media profile ready", "Perfect for IDs & CVs"],
                    popular: true,
                    category: "Specialty & Themed",
                    description: "Best for: Social media profiles or ID cards."
                },
                {
                    id: "jersey-shoot",
                    name: "Jersey Shoot",
                    price: "₵20",
                    photos: 3,
                    outfits: 1,
                    features: ["3 Images (2 Front, 1 Back)", "Customized name on jersey", "Studio jersey theme", "Perfect for sports fans"],
                    popular: false,
                    category: "Specialty & Themed",
                    description: "Best for: Sports fans or team support."
                },
                {
                    id: "occupation-shots",
                    name: "Occupation Shots",
                    price: "₵50",
                    photos: 3,
                    outfits: 1,
                    features: ["3 Images (Headshot, Medium, Full)", "1 Professional outfit theme", "Studio background", "Portfolio finishing"],
                    popular: true,
                    category: "Specialty & Themed",
                    description: "Best for: CVs, LinkedIn, or business profiles."
                },
                {
                    id: "graduation-shots",
                    name: "Graduation Shots",
                    price: "₵70",
                    photos: 3,
                    outfits: 1,
                    features: ["3 Images (Headshot, Medium, Full)", "Custom gown design", "Custom sash with name/school", "Perfect graduation memory"],
                    popular: true,
                    category: "Specialty & Themed",
                    description: "Best for: Celebrating finishing school."
                }
            ]
        },
        '🎂 Birthday Celebration Packages': {
            description: 'Includes a mandatory custom birthday-themed background.',
            packages: [
                {
                    id: "birthday-basic",
                    name: "Birthday Basic",
                    price: "₵40",
                    photos: 4,
                    outfits: 1,
                    features: ["4 Images", "1 Outfit style", "Simple birthday layout", "Custom birthday background"],
                    popular: true,
                    category: "Birthday",
                    description: "Best for: Simple birthday celebrations"
                },
                {
                    id: "birthday-deluxe",
                    name: "Birthday Deluxe",
                    price: "₵70",
                    photos: 6,
                    outfits: 2,
                    features: ["6 Images", "2 Outfit styles", "Enhanced birthday layout", "Custom birthday background"],
                    popular: false,
                    category: "Birthday",
                    description: "Best for: Enhanced birthday celebrations"
                },
                {
                    id: "birthday-royal",
                    name: "Birthday Royal",
                    price: "₵100",
                    photos: 10,
                    outfits: 3,
                    features: ["10 Images", "3 Outfit styles", "Luxury birthday layout", "Custom birthday background"],
                    popular: false,
                    category: "Birthday",
                    description: "Best for: Luxury birthday celebrations"
                }
            ]
        },
        '👤 General Solo Packages': {
            description: 'Flexible packages for when you just want great photos of yourself.',
            packages: [
                {
                    id: "solo-standard",
                    name: "Solo Standard",
                    price: "₵50",
                    photos: 4,
                    outfits: 1,
                    features: ["4 Images", "1 Outfit style", "Multiple poses", "Perfect for social media"],
                    popular: true,
                    category: "Solo",
                    description: "Best for: Personal photos and social media"
                },
                {
                    id: "solo-medium",
                    name: "Solo Medium",
                    price: "₵90",
                    photos: 8,
                    outfits: 2,
                    features: ["8 Images", "2 Outfit styles", "Multiple poses per outfit", "Wide variety of shots"],
                    popular: false,
                    category: "Solo",
                    description: "Best for: More variety in your photos"
                },
                {
                    id: "solo-supreme",
                    name: "Solo Supreme",
                    price: "₵130",
                    photos: 15,
                    outfits: 3,
                    features: ["15 Images", "3 Outfit styles", "Wide pose variety", "Premium lighting look"],
                    popular: false,
                    category: "Solo",
                    description: "Best for: Premium professional portfolio"
                }
            ]
        },
        '👥 Group & Duo Packages': {
            description: 'Designed for 2 people (Couples, Best Friends, Siblings).',
            packages: [
                {
                    id: "group-standard",
                    name: "Group Standard",
                    price: "₵80",
                    photos: 4,
                    outfits: 2,
                    features: ["4 Images", "2 Outfit themes", "Studio group layout", "For 2 people"],
                    popular: false,
                    category: "Group",
                    description: "Best for: Couples or best friends"
                },
                {
                    id: "group-deluxe",
                    name: "Group Deluxe",
                    price: "₵130",
                    photos: 6,
                    outfits: 3,
                    features: ["6 Images", "3 Outfit themes", "Creative group poses", "For 2 people"],
                    popular: false,
                    category: "Group",
                    description: "Best for: Creative group sessions"
                },
                {
                    id: "group-supreme",
                    name: "Group Supreme",
                    price: "₵200",
                    photos: 10,
                    outfits: 5,
                    features: ["10 Images", "5 Outfit themes", "Premium group concept", "For 2 people", "+1 person: +₵30"],
                    popular: false,
                    category: "Group",
                    description: "Best for: Premium group photos"
                }
            ]
        }
    };

    const categories = Object.keys(categoryData);
    const currentPackages = categoryData[activeCategory as keyof typeof categoryData]?.packages || [];

    // Handle touch events for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsSwiping(true);
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchX = e.touches[0].clientX;
        const diff = touchStartX - touchX;

        // Prevent vertical scroll during horizontal swipe
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(diff) > threshold) {
            if (diff > 0 && currentIndex < currentPackages.length - 1) {
                // Swipe left - next
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right - previous
                setCurrentIndex(prev => prev - 1);
            }
        }

        setIsSwiping(false);
    };

    // Scroll carousel to current index
    useEffect(() => {
        if (carouselRef.current) {
            const cardWidth = carouselRef.current.clientWidth * 0.85; // 85vw
            const scrollPosition = currentIndex * (cardWidth + 16); // card width + gap

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
        const packageData = {
            package: pkg,
            selectedAt: new Date().toISOString()
        };
        localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

        // Navigate to style journey
        window.location.href = '/individuals/style-journey?step=2';
    };

    return (
        <section id="packages" className="py-8 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                        Choose Your Package
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
                        Select from our curated packages designed for different needs
                    </p>
                </div>

                {/* Category Filter - Simple */}
                <div className="flex overflow-x-auto pb-3 mb-6 gap-2 scrollbar-hide">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === category
                                    ? 'bg-[#D4AF37] text-black shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category.split(' ')[0]} {/* Show only emoji and first word */}
                            <span className="hidden sm:inline"> {category.split(' ').slice(1).join(' ')}</span>
                        </button>
                    ))}
                </div>

                {/* Category Description */}
                <div className="text-center mb-6">
                    <p className="text-gray-600 text-sm italic">
                        {categoryData[activeCategory as keyof typeof categoryData]?.description}
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Swipe Instructions */}
                    <div className="flex justify-between items-center mb-4 px-2">
                        <div className="text-xs text-gray-500 flex items-center">
                            <span className="mr-1">←</span> Swipe
                        </div>
                        <div className="text-xs text-gray-500">
                            {currentIndex + 1} / {currentPackages.length}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                            Swipe <span className="ml-1">→</span>
                        </div>
                    </div>

                    {/* Carousel */}
                    <div
                        ref={carouselRef}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            touchAction: 'pan-y'
                        }}
                    >
                        <div className="flex gap-4 px-4">
                            {currentPackages.map((pkg, index) => (
                                <div
                                    key={pkg.id}
                                    className="flex-shrink-0 w-[85vw] max-w-sm snap-center"
                                >
                                    {/* Package Card */}
                                    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow h-full">
                                        {/* Popular Badge */}
                                        {pkg.popular && (
                                            <div className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                                                MOST POPULAR
                                            </div>
                                        )}

                                        {/* Package Header */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                            <div className="text-2xl font-bold text-gray-900">{pkg.price}</div>
                                            {pkg.description && (
                                                <p className="text-sm text-gray-500 mt-1 italic">{pkg.description}</p>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                                    <span className="text-[#D4AF37] text-sm">📸</span>
                                                </div>
                                                <span className="text-sm">{pkg.photos} image{pkg.photos !== 1 ? 's' : ''}</span>
                                            </div>

                                            {pkg.outfits && (
                                                <div className="flex items-center text-gray-700">
                                                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                                        <span className="text-[#D4AF37] text-sm">👕</span>
                                                    </div>
                                                    <span className="text-sm">{pkg.outfits} outfit{pkg.outfits !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Features List */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">INCLUDES:</h4>
                                            <ul className="space-y-1">
                                                {pkg.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-start text-sm text-gray-600">
                                                        <span className="text-[#D4AF37] mr-2 mt-0.5">✓</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Select Button */}
                                        <button
                                            onClick={() => handlePackageSelect(pkg)}
                                            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors active:scale-[0.98] mt-auto"
                                        >
                                            Select Package
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    <div className="flex justify-center items-center gap-1.5 mt-6">
                        {currentPackages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full transition-all ${index === currentIndex
                                    ? 'w-2 h-2 bg-[#D4AF37]'
                                    : 'w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                aria-label={`Go to package ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* View All Packages Link */}
                    <div className="text-center mt-8">
                        <a
                            href="/individuals/packages"
                            className="inline-block text-[#D4AF37] font-semibold hover:text-[#b8941f] transition-colors text-sm"
                        >
                            View detailed package comparison →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}