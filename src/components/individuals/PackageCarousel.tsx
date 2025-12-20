// components/individuals/PackageCarousel.tsx - ENHANCED VERSION
'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronRight, ChevronLeft } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits?: number;
    features: string[];
    popular: boolean;
    category: string;
    subcategory?: string;
    type: 'main' | 'addon' | 'standalone';
}

export default function PackageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [activeFilter, setActiveFilter] = useState('Most Popular');
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(1); // Number of visible cards
    const carouselRef = useRef<HTMLDivElement>(null);

    // Full Package List Based on Your Document
    const allPackages: Package[] = [
        // Profile Headshots (Professional)
        {
            id: "profile-headshots",
            name: "Profile Headshots",
            price: "₵30",
            photos: 3,
            outfits: 1,
            features: ["3 Images", "1 Headshot", "1 Medium Shot", "1 Full Shot", "1 Outfit"],
            popular: true,
            category: "Professional",
            subcategory: "Headshots",
            type: 'main'
        },
        {
            id: "occupation-shots",
            name: "Occupation Shots",
            price: "₵50",
            photos: 3,
            outfits: 1,
            features: ["3 Images", "1 Headshot", "1 Medium Shot", "1 Full Shot", "Professional outfit theme", "Studio-style background", "Portfolio finishing"],
            popular: true,
            category: "Professional",
            subcategory: "Occupation",
            type: 'main'
        },
        // Graduation & Jersey
        {
            id: "graduation-shots",
            name: "Graduation Shots",
            price: "₵70",
            photos: 3,
            outfits: 1,
            features: ["3 Images", "1 Headshot", "1 Medium Shot", "1 Full Shot", "Custom gown design", "Custom sash with name & school"],
            popular: true,
            category: "Special Occasions",
            subcategory: "Graduation",
            type: 'main'
        },
        {
            id: "jersey-shoot",
            name: "Jersey Shoot",
            price: "₵20",
            photos: 3,
            outfits: 1,
            features: ["3 Images", "2 Front Views", "1 Back View", "Customized name on jersey", "Studio jersey theme"],
            popular: false,
            category: "Special Occasions",
            subcategory: "Sports",
            type: 'main'
        },
        // Solo Packages
        {
            id: "solo-standard",
            name: "Solo Standard",
            price: "₵50",
            photos: 4,
            outfits: 1,
            features: ["4 Images", "1 Outfit style", "Multiple poses"],
            popular: true,
            category: "Solo",
            subcategory: "Basic",
            type: 'main'
        },
        {
            id: "solo-medium",
            name: "Solo Medium",
            price: "₵90",
            photos: 8,
            outfits: 2,
            features: ["8 Images", "2 Outfit styles", "Multiple poses per outfit"],
            popular: false,
            category: "Solo",
            subcategory: "Medium",
            type: 'main'
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
            subcategory: "Premium",
            type: 'main'
        },
        // Birthday Packages
        {
            id: "birthday-basic",
            name: "Birthday Basic",
            price: "₵40",
            photos: 4,
            outfits: 1,
            features: ["4 Images", "1 Outfit style", "Simple birthday layout", "Birthday-themed background"],
            popular: true,
            category: "Birthday",
            subcategory: "Basic",
            type: 'main'
        },
        {
            id: "birthday-deluxe",
            name: "Birthday Deluxe",
            price: "₵70",
            photos: 6,
            outfits: 2,
            features: ["6 Images", "2 Outfit styles", "Enhanced birthday layout", "Birthday-themed background"],
            popular: false,
            category: "Birthday",
            subcategory: "Deluxe",
            type: 'main'
        },
        {
            id: "birthday-royal",
            name: "Birthday Royal",
            price: "₵100",
            photos: 10,
            outfits: 3,
            features: ["10 Images", "3 Outfit styles", "Luxury birthday layout", "Birthday-themed background"],
            popular: false,
            category: "Birthday",
            subcategory: "Royal",
            type: 'main'
        },
        // Group Packages (for 2 people)
        {
            id: "group-standard",
            name: "Group Standard",
            price: "₵80",
            photos: 4,
            outfits: 2,
            features: ["For 2 people", "4 Images", "2 Outfit themes", "Studio group layout", "Add +1 person: +₵30"],
            popular: false,
            category: "Group",
            subcategory: "Standard",
            type: 'main'
        },
        {
            id: "group-deluxe",
            name: "Group Deluxe",
            price: "₵130",
            photos: 6,
            outfits: 3,
            features: ["For 2 people", "6 Images", "3 Outfit themes", "Creative group poses", "Add +1 person: +₵30"],
            popular: false,
            category: "Group",
            subcategory: "Deluxe",
            type: 'main'
        },
        {
            id: "group-supreme",
            name: "Group Supreme",
            price: "₵200",
            photos: 10,
            outfits: 5,
            features: ["For 2 people", "10 Images", "5 Outfit themes", "Premium group concept", "Add +1 person: +₵30"],
            popular: false,
            category: "Group",
            subcategory: "Supreme",
            type: 'main'
        },
        // Standalone Digital Services
        {
            id: "makeup",
            name: "Makeup Service",
            price: "₵45",
            photos: 1,
            features: ["Professional makeup application", "Eyes, lips, skin glow", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Beauty",
            type: 'standalone'
        },
        {
            id: "hairstyle-change",
            name: "Hairstyle Change",
            price: "₵15",
            photos: 1,
            features: ["Transform hairstyle digitally", "Braids, curls, straight", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Beauty",
            type: 'standalone'
        },
        {
            id: "outfit-change",
            name: "Outfit Change",
            price: "₵20",
            photos: 1,
            features: ["Replace clothing", "New outfit style", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Style",
            type: 'standalone'
        },
        {
            id: "background-replacement",
            name: "Background Replacement",
            price: "₵10",
            photos: 1,
            features: ["Swap background", "Studio, office, outdoor", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Editing",
            type: 'standalone'
        },
        {
            id: "body-restructuring-standalone",
            name: "Body Restructuring",
            price: "₵60",
            photos: 1,
            features: ["Shape adjustment", "Slimming or enhancement", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Enhancement",
            type: 'standalone'
        },
        {
            id: "advanced-retouch-standalone",
            name: "Advanced Retouch",
            price: "₵15",
            photos: 1,
            features: ["Professional retouching", "No package required"],
            popular: false,
            category: "Digital Services",
            subcategory: "Editing",
            type: 'standalone'
        },
    ];

    // Add-on Services
    const addOnServices = [
        {
            id: "extra-image",
            name: "Extra Image",
            price: "₵5",
            features: ["Add extra image to your package"],
            type: 'addon' as const
        },
        {
            id: "extra-outfit",
            name: "Extra Outfit",
            price: "₵10",
            features: ["Add extra outfit change"],
            type: 'addon' as const
        },
        {
            id: "background-pose-change",
            name: "Background/Pose Change",
            price: "₵5",
            features: ["Change background or pose"],
            type: 'addon' as const
        },
        {
            id: "advanced-retouch",
            name: "Advanced Retouch",
            price: "₵15",
            features: ["Professional advanced retouching"],
            type: 'addon' as const
        },
        {
            id: "body-restructuring",
            name: "Body Restructuring",
            price: "₵30",
            features: ["Pregnancy, weight, height adjustment"],
            type: 'addon' as const
        },
    ];

    const filters = [
        'Most Popular',
        'Professional',
        'Solo',
        'Birthday',
        'Group',
        'Special Occasions',
        'Digital Services',
        'All Packages'
    ];

    // Calculate visible count based on screen width
    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const getFilteredPackages = () => {
        switch (activeFilter) {
            case 'Most Popular':
                return allPackages.filter(pkg => pkg.popular);
            case 'Professional':
                return allPackages.filter(pkg => pkg.category === 'Professional');
            case 'Solo':
                return allPackages.filter(pkg => pkg.category === 'Solo');
            case 'Birthday':
                return allPackages.filter(pkg => pkg.category === 'Birthday');
            case 'Group':
                return allPackages.filter(pkg => pkg.category === 'Group');
            case 'Special Occasions':
                return allPackages.filter(pkg => pkg.category === 'Special Occasions');
            case 'Digital Services':
                return allPackages.filter(pkg => pkg.type === 'standalone');
            case 'All Packages':
                return allPackages;
            default:
                return allPackages;
        }
    };

    const filteredPackages = getFilteredPackages();
    const totalSlides = Math.ceil(filteredPackages.length / visibleCount);

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    const handlePackageSelect = (pkg: Package) => {
        // Save package to localStorage for preselection
        const packageData = {
            package: pkg,
            selectedAt: new Date().toISOString()
        };
        localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

        // Navigate to style journey
        window.location.href = '/individuals/style-journey?step=2';
    };

    const renderPackageCard = (pkg: Package) => (
        <div key={pkg.id} className="flex-shrink-0 w-full px-2">
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow h-full">
                {/* Popular Badge */}
                {pkg.popular && (
                    <div className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full mb-4">
                        MOST POPULAR
                    </div>
                )}

                {/* Category Badge */}
                <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded mr-2 mb-2">
                    {pkg.category}
                </div>

                {/* Package Header */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h3>
                    <div className="text-2xl font-bold text-gray-900">{pkg.price}</div>
                    {pkg.subcategory && (
                        <p className="text-sm text-gray-500 mt-1">{pkg.subcategory}</p>
                    )}
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                            <span className="text-[#D4AF37] text-xs">📸</span>
                        </div>
                        <span className="text-sm">{pkg.photos} image{pkg.photos !== 1 ? 's' : ''}</span>
                    </div>

                    {pkg.outfits && (
                        <div className="flex items-center text-gray-700">
                            <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mr-3">
                                <span className="text-[#D4AF37] text-xs">👕</span>
                            </div>
                            <span className="text-sm">{pkg.outfits} outfit{pkg.outfits !== 1 ? 's' : ''}</span>
                        </div>
                    )}
                </div>

                {/* Features List */}
                <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">INCLUDES:</h4>
                    <ul className="space-y-1">
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                <span className="text-[#D4AF37] mr-2 mt-0.5">•</span>
                                {feature}
                            </li>
                        ))}
                        {pkg.features.length > 3 && (
                            <li className="text-xs text-gray-500">
                                + {pkg.features.length - 3} more features
                            </li>
                        )}
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
    );

    const renderAddOnCard = (addon: typeof addOnServices[0]) => (
        <div key={addon.id} className="flex-shrink-0 w-full px-2">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-[#D4AF37] transition-colors h-full">
                <div className="mb-4">
                    <div className="inline-block bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium px-2 py-1 rounded-full mb-2">
                        ADD-ON
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{addon.name}</h3>
                    <div className="text-xl font-bold text-gray-900">{addon.price}</div>
                    <p className="text-xs text-gray-500 mt-1">Add to any package</p>
                </div>

                <div className="mb-6">
                    <ul className="space-y-1">
                        {addon.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                <span className="text-[#D4AF37] mr-2 mt-0.5">•</span>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                <button
                    onClick={() => {
                        // Store add-on selection
                        localStorage.setItem('radikal_selected_addon', JSON.stringify({
                            addon,
                            selectedAt: new Date().toISOString()
                        }));
                        window.location.href = '/individuals/style-journey?step=2';
                    }}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors active:scale-[0.98]"
                >
                    Add to Package
                </button>
            </div>
        </div>
    );

    return (
        <section id="packages" className="py-8 bg-white">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-playfair">
                        Our Packages & Services
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                        Choose from professional photoshoot packages or standalone digital services
                    </p>
                </div>

                {/* Filter Toggle Button */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        <span className="text-xs bg-[#D4AF37] text-white px-2 py-1 rounded-full ml-2">
                            {activeFilter}
                        </span>
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mb-8 animate-slideDown">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Filter Packages</h4>
                            <div className="flex flex-wrap gap-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setActiveFilter(filter);
                                            setCurrentIndex(0);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeFilter === filter
                                                ? 'bg-[#D4AF37] text-black shadow-sm'
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 text-sm text-gray-500">
                                Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>
                )}

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    {totalSlides > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl z-10"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2 bg-white border border-gray-200 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl z-10"
                                disabled={currentIndex === totalSlides - 1}
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Package Carousel */}
                    <div className="overflow-hidden">
                        <div
                            ref={carouselRef}
                            className="flex transition-transform duration-300 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                <div key={slideIndex} className="flex w-full flex-shrink-0">
                                    {filteredPackages
                                        .slice(slideIndex * visibleCount, (slideIndex + 1) * visibleCount)
                                        .map(renderPackageCard)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    {totalSlides > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`rounded-full transition-all ${index === currentIndex
                                            ? 'w-3 h-3 bg-[#D4AF37]'
                                            : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Add-on Services Section */}
                    <div className="mt-12">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                            Add-on Services
                            <span className="block text-sm font-normal text-gray-600 mt-1">
                                Enhance your package with these extras
                            </span>
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {addOnServices.map(renderAddOnCard)}
                        </div>
                    </div>

                    {/* Important Policies */}
                    <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 text-center">
                            Important Policies
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    Full payment required before work begins
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    No refunds once processing starts
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    No images of children under 15
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    No nudity or explicit content
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    All images deleted from our archives after delivery
                                </div>
                                <div className="flex items-start text-sm text-gray-600">
                                    <span className="text-red-500 mr-2">•</span>
                                    Clear, high-quality selfies required
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View All Packages Link */}
                    <div className="text-center mt-8">
                        <a
                            href="/individuals/packages"
                            className="inline-flex items-center text-[#D4AF37] font-semibold hover:text-[#b8941f] transition-colors text-sm"
                        >
                            View detailed package comparison →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}