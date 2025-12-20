// components/individuals/PackageCarousel.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Camera,
    Shirt,
    Sparkles,
    User,
    Users,
    Cake,
    Briefcase,
    GraduationCap,
    Trophy,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Zap,
    Star,
    Crown
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
    description?: string;
    highlight?: string;
}

export default function PackageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string>('Specialty & Themed');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);

    const categories = [
        {
            id: 'specialty',
            name: 'Specialty & Themed',
            icon: Sparkles,
            description: 'For events, school, or professional needs',
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'birthday',
            name: 'Birthday',
            icon: Cake,
            description: 'Custom birthday-themed backgrounds included',
            color: 'from-pink-500 to-rose-500'
        },
        {
            id: 'solo',
            name: 'Solo',
            icon: User,
            description: 'Perfect personal photos just for you',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'group',
            name: 'Group',
            icon: Users,
            description: 'Designed for 2+ people',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    const packages: Package[] = [
        // Specialty & Themed
        {
            id: "profile-headshots",
            name: "Profile Headshots",
            price: "₵30",
            photos: 3,
            outfits: 1,
            features: ["3 Images (Headshot, Medium, Full)", "1 Professional Outfit", "Social Media Ready", "CV/ID Perfect"],
            popular: true,
            category: "Specialty & Themed",
            description: "Perfect for LinkedIn & professional profiles",
            highlight: "Social Media Ready"
        },
        {
            id: "jersey-shoot",
            name: "Jersey Shoot",
            price: "₵20",
            photos: 3,
            outfits: 1,
            features: ["3 Images (2 Front, 1 Back)", "Custom Name on Jersey", "Studio Theme", "Sports Fan Favorite"],
            popular: false,
            category: "Specialty & Themed",
            description: "Show your team spirit",
            highlight: "Custom Jersey"
        },
        {
            id: "occupation-shots",
            name: "Occupation Shots",
            price: "₵50",
            photos: 3,
            outfits: 1,
            features: ["3 Professional Shots", "Studio Background", "Portfolio Finishing", "LinkedIn Perfect"],
            popular: true,
            category: "Specialty & Themed",
            description: "Elevate your professional image",
            highlight: "Portfolio Ready"
        },
        {
            id: "graduation-shots",
            name: "Graduation Shots",
            price: "₵70",
            photos: 3,
            outfits: 1,
            features: ["3 Images (Headshot, Medium, Full)", "Custom Gown Design", "Name/School Sash", "Memorable Keepsake"],
            popular: true,
            category: "Specialty & Themed",
            description: "Celebrate your achievement",
            highlight: "Graduation Memory"
        },
        // Birthday
        {
            id: "birthday-basic",
            name: "Birthday Basic",
            price: "₵40",
            photos: 4,
            outfits: 1,
            features: ["4 Images", "1 Outfit Style", "Simple Layout", "Birthday Background"],
            popular: true,
            category: "Birthday",
            description: "Simple & sweet celebration",
            highlight: "Birthday Theme"
        },
        {
            id: "birthday-deluxe",
            name: "Birthday Deluxe",
            price: "₵70",
            photos: 6,
            outfits: 2,
            features: ["6 Images", "2 Outfit Styles", "Enhanced Layout", "Birthday Background"],
            popular: false,
            category: "Birthday",
            description: "Enhanced celebration package",
            highlight: "Enhanced Layout"
        },
        {
            id: "birthday-royal",
            name: "Birthday Royal",
            price: "₵100",
            photos: 10,
            outfits: 3,
            features: ["10 Images", "3 Outfit Styles", "Luxury Layout", "Premium Background"],
            popular: false,
            category: "Birthday",
            description: "Luxury birthday experience",
            highlight: "Premium Package"
        },
        // Solo
        {
            id: "solo-standard",
            name: "Solo Standard",
            price: "₵50",
            photos: 4,
            outfits: 1,
            features: ["4 Images", "1 Outfit Style", "Multiple Poses", "Social Media Ready"],
            popular: true,
            category: "Solo",
            description: "Perfect for personal branding",
            highlight: "Most Popular"
        },
        {
            id: "solo-medium",
            name: "Solo Medium",
            price: "₵90",
            photos: 8,
            outfits: 2,
            features: ["8 Images", "2 Outfit Styles", "Multiple Poses Each", "Wide Variety"],
            popular: false,
            category: "Solo",
            description: "More variety, more options",
            highlight: "Great Value"
        },
        {
            id: "solo-supreme",
            name: "Solo Supreme",
            price: "₵130",
            photos: 15,
            outfits: 3,
            features: ["15 Images", "3 Outfit Styles", "Premium Lighting", "Portfolio Quality"],
            popular: false,
            category: "Solo",
            description: "Professional portfolio grade",
            highlight: "Premium Quality"
        },
        // Group
        {
            id: "group-standard",
            name: "Group Standard",
            price: "₵80",
            photos: 4,
            outfits: 2,
            features: ["For 2 People", "4 Images", "2 Outfit Themes", "Studio Layout"],
            popular: false,
            category: "Group",
            description: "Perfect for couples & friends",
            highlight: "For 2 People"
        },
        {
            id: "group-deluxe",
            name: "Group Deluxe",
            price: "₵130",
            photos: 6,
            outfits: 3,
            features: ["For 2 People", "6 Images", "3 Outfit Themes", "Creative Poses"],
            popular: false,
            category: "Group",
            description: "Creative group photography",
            highlight: "Creative Poses"
        },
        {
            id: "group-supreme",
            name: "Group Supreme",
            price: "₵200",
            photos: 10,
            outfits: 5,
            features: ["For 2 People", "10 Images", "5 Outfit Themes", "Premium Concept"],
            popular: false,
            category: "Group",
            description: "Premium group photography",
            highlight: "+1 Person: +₵30"
        }
    ];

    const currentCategory = categories.find(cat => cat.name === activeCategory);
    const currentPackages = packages.filter(pkg => pkg.category === activeCategory);

    // Enhanced touch handling with momentum
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsSwiping(true);
        setTouchStartX(e.touches[0].clientX);
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isSwiping) return;
        e.preventDefault();
    }, [isSwiping]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!isSwiping) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        const threshold = 50;
        const velocity = Math.abs(diff) / 150; // Simple velocity calculation

        if (Math.abs(diff) > threshold || velocity > 0.5) {
            setIsTransitioning(true);

            if (diff > 0 && currentIndex < currentPackages.length - 1) {
                // Swipe left
                setCurrentIndex(prev => prev + 1);
            } else if (diff < 0 && currentIndex > 0) {
                // Swipe right
                setCurrentIndex(prev => prev - 1);
            }

            // Reset transitioning state
            setTimeout(() => setIsTransitioning(false), 300);
        }

        setIsSwiping(false);
    }, [isSwiping, touchStartX, currentIndex, currentPackages.length]);

    // Auto-reset when category changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    const nextSlide = () => {
        if (currentIndex < currentPackages.length - 1) {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev + 1);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setIsTransitioning(true);
            setCurrentIndex(prev => prev - 1);
            setTimeout(() => setIsTransitioning(false), 300);
        }
    };

    const handlePackageSelect = (pkg: Package) => {
        const packageData = {
            package: pkg,
            selectedAt: new Date().toISOString()
        };
        localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

        window.location.href = '/individuals/style-journey?step=2';
    };

    const getCategoryIcon = (categoryName: string) => {
        switch (categoryName) {
            case 'Specialty & Themed': return Sparkles;
            case 'Birthday': return Cake;
            case 'Solo': return User;
            case 'Group': return Users;
            default: return Camera;
        }
    };

    return (
        <section id="packages" className="py-12 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
                {/* Elegant Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-white px-4 py-1 rounded-full mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-semibold">CURATED PACKAGES</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-playfair">
                        Choose Your Experience
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Professional virtual photoshoots tailored to your needs
                    </p>
                </div>

                {/* Premium Category Selector */}
                <div className="mb-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isActive = activeCategory === category.name;

                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.name)}
                                    className={`group relative p-4 rounded-xl transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-lg shadow-black/10'
                                        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className={`p-3 rounded-full mb-3 transition-all ${isActive
                                            ? 'bg-white/20'
                                            : 'bg-gray-100 group-hover:bg-gray-200'
                                            }`}>
                                            <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                                        </div>
                                        <span className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                                            {category.name.split(' ')[0]}
                                        </span>
                                        <span className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                                            {category.name.includes(' ') ? category.name.split(' ')[1] : ''}
                                        </span>
                                    </div>

                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Category Description */}
                    {currentCategory && (
                        <div className="text-center">
                            <p className="text-gray-600 italic">
                                {currentCategory.description}
                            </p>
                        </div>
                    )}
                </div>

                {/* Premium Carousel Container */}
                <div className="relative max-w-6xl mx-auto">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] transition-all duration-500"
                                style={{ width: `${((currentIndex + 1) / currentPackages.length) * 100}%` }}
                            />
                        </div>
                        <span className="ml-4 text-sm font-medium text-gray-600">
                            {currentIndex + 1} of {currentPackages.length}
                        </span>
                    </div>

                    {/* Carousel Content */}
                    <div className="relative">
                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 md:-translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center hover:shadow-2xl hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>

                        <button
                            onClick={nextSlide}
                            disabled={currentIndex === currentPackages.length - 1}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 md:translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center hover:shadow-2xl hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Carousel */}
                        <div
                            ref={carouselRef}
                            className={`overflow-hidden ${isTransitioning ? 'opacity-90' : 'opacity-100'} transition-opacity duration-300`}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {currentPackages.map((pkg) => (
                                    <div key={pkg.id} className="w-full flex-shrink-0 px-2 md:px-4">
                                        {/* Premium Package Card */}
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group">
                                            {/* Card Header with Gradient */}
                                            <div className={`relative h-3 ${pkg.popular
                                                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37]'
                                                : 'bg-gradient-to-r from-gray-900 to-gray-700'
                                                }`} />

                                            <div className="p-6 md:p-8">
                                                {/* Badges */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {pkg.popular && (
                                                        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37]/10 to-[#F4D03F]/10 text-[#D4AF37] px-3 py-1.5 rounded-full text-xs font-semibold">
                                                            <Star className="w-3 h-3" />
                                                            MOST POPULAR
                                                        </div>
                                                    )}

                                                    <div className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                                                        {(() => {
                                                            const Icon = getCategoryIcon(pkg.category);
                                                            return <Icon className="w-3 h-3" />;
                                                        })()}
                                                        {pkg.category}
                                                    </div>

                                                    {pkg.highlight && (
                                                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                                                            <Zap className="w-3 h-3" />
                                                            {pkg.highlight}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Package Name & Price */}
                                                <div className="flex items-start justify-between mb-6">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                                                        <p className="text-gray-600 italic">{pkg.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-3xl font-bold text-gray-900">{pkg.price}</div>
                                                        <div className="text-sm text-gray-500">Starting at</div>
                                                    </div>
                                                </div>

                                                {/* Key Features */}
                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                                                                <Camera className="w-5 h-5 text-[#D4AF37]" />
                                                            </div>
                                                            <div>
                                                                <div className="text-2xl font-bold text-gray-900">{pkg.photos}</div>
                                                                <div className="text-sm text-gray-600">Professional Images</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {pkg.outfits && (
                                                        <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                                                                    <Shirt className="w-5 h-5 text-[#D4AF37]" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-2xl font-bold text-gray-900">{pkg.outfits}</div>
                                                                    <div className="text-sm text-gray-600">Outfit Styles</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Features List */}
                                                <div className="mb-8">
                                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">What's Included</h4>
                                                    <div className="space-y-3">
                                                        {pkg.features.map((feature, idx) => (
                                                            <div key={idx} className="flex items-start gap-3 group/feature">
                                                                <div className="p-1">
                                                                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37] mt-0.5" />
                                                                </div>
                                                                <span className="text-gray-700 group-hover/feature:text-gray-900 transition-colors">
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* CTA Button */}
                                                <button
                                                    onClick={() => handlePackageSelect(pkg)}
                                                    className="w-full group/button relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white font-semibold py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                                        <span className="text-lg">Select Package</span>
                                                        <ChevronRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] opacity-0 group-hover/button:opacity-100 transition-opacity duration-500" />
                                                </button>

                                                {/* Quick Info */}
                                                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                                        <span>1-3 hour delivery</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                        <span>WhatsApp delivery</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dot Navigation */}
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {currentPackages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setIsTransitioning(true);
                                        setCurrentIndex(index);
                                        setTimeout(() => setIsTransitioning(false), 300);
                                    }}
                                    className={`relative transition-all duration-300 ${index === currentIndex
                                        ? 'w-8'
                                        : 'w-2 hover:w-3'
                                        } h-2 rounded-full`}
                                >
                                    <div className={`absolute inset-0 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]'
                                        : 'bg-gray-300 hover:bg-gray-400'
                                        }`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* View All Packages Link */}
                <div className="text-center mt-12 pt-8 border-t border-gray-200">
                    <a
                        href="/individuals/packages"
                        className="group inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold transition-colors"
                    >
                        <span>View detailed package comparison</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
}