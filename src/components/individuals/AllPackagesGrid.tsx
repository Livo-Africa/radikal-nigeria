// src/components/individuals/AllPackagesGrid.tsx
'use client';

import { useState } from 'react';
import { ArrowRight, Camera, Shirt, Clock, Check, ArrowLeft } from 'lucide-react';
import { PACKAGES_BY_CATEGORY as NG_PACKAGES_DATA, CATEGORIES as NG_CATEGORIES_DATA } from '@/utils/bookingDataNigeria';

interface Package {
    id: string;
    name: string;
    price: string;
    photos: number;
    outfits: number;
    deliveryTime: string;
    features: string[];
    popular: boolean;
    category: string;
    categoryId: string;
}

// Hardcoded Ghana Data
const GH_DATA: Record<string, { packages: Package[] }> = {
    'Solo': {
        packages: [
            {
                id: "solo-standard",
                name: "Solo Standard",
                price: "₵50",
                photos: 4,
                outfits: 1,
                deliveryTime: "1-3 hours",
                features: ["Multiple poses", "Basic editing"],
                popular: true,
                category: "Solo",
                categoryId: "solo"
            },
            {
                id: "solo-medium",
                name: "Solo Medium",
                price: "₵90",
                photos: 8,
                outfits: 2,
                deliveryTime: "1-3 hours",
                features: ["Varied poses", "Premium editing"],
                popular: false,
                category: "Solo",
                categoryId: "solo"
            },
            {
                id: "solo-supreme",
                name: "Solo Supreme",
                price: "₵130",
                photos: 15,
                outfits: 3,
                deliveryTime: "2-4 hours",
                features: ["Premium lighting", "Advanced retouching"],
                popular: false,
                category: "Solo",
                categoryId: "solo"
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
                deliveryTime: "1-3 hours",
                features: ["Birthday props & theme"],
                popular: true,
                category: "Birthday",
                categoryId: "birthday"
            },
            {
                id: "birthday-deluxe",
                name: "Birthday Deluxe",
                price: "₵70",
                photos: 6,
                outfits: 2,
                deliveryTime: "1-3 hours",
                features: ["Enhanced set design", "Prop usage"],
                popular: false,
                category: "Birthday",
                categoryId: "birthday"
            },
            {
                id: "birthday-royal",
                name: "Birthday Royal",
                price: "₵100",
                photos: 10,
                outfits: 3,
                deliveryTime: "2-4 hours",
                features: ["Luxury set design", "Balloon arrangement"],
                popular: false,
                category: "Birthday",
                categoryId: "birthday"
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
                deliveryTime: "1-3 hours",
                features: ["Up to 2 People", "Group coordination"],
                popular: false,
                category: "Group",
                categoryId: "group"
            },
            {
                id: "group-deluxe",
                name: "Group Deluxe",
                price: "₵130",
                photos: 6,
                outfits: 3,
                deliveryTime: "1-3 hours",
                features: ["Up to 2 People", "Creative direction"],
                popular: false,
                category: "Group",
                categoryId: "group"
            },
            {
                id: "group-supreme",
                name: "Group Supreme",
                price: "₵200",
                photos: 10,
                outfits: 5,
                deliveryTime: "2-4 hours",
                features: ["Up to 2 People", "Extra person: ₵30"],
                popular: false,
                category: "Group",
                categoryId: "group"
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
                deliveryTime: "1-3 hours",
                features: ["Social media ready", "Perfect for CV/LinkedIn"],
                popular: true,
                category: "Specialty",
                categoryId: "specialty"
            },
            {
                id: "jersey-shoot",
                name: "Jersey Shoot",
                price: "₵20",
                photos: 3,
                outfits: 1,
                deliveryTime: "1-3 hours",
                features: ["Custom jersey name styling", "Sports theme background"],
                popular: false,
                category: "Specialty",
                categoryId: "specialty"
            },
            {
                id: "occupation-shots",
                name: "Occupation Shots",
                price: "₵50",
                photos: 3,
                outfits: 1,
                deliveryTime: "1-3 hours",
                features: ["Professional props included", "Studio background"],
                popular: true,
                category: "Specialty",
                categoryId: "specialty"
            },
            {
                id: "graduation-shots",
                name: "Graduation Shots",
                price: "₵70",
                photos: 3,
                outfits: 1,
                deliveryTime: "1-3 hours",
                features: ["Gown styling assistance", "School theme set"],
                popular: true,
                category: "Specialty",
                categoryId: "specialty"
            }
        ]
    }
};

export default function AllPackagesGrid() {
    const [country, setCountry] = useState<'GH' | 'NG'>('GH');
    const [activeCategory, setActiveCategory] = useState<string>('All');

    // Get all packages based on country
    const getAllPackages = (): Package[] => {
        if (country === 'NG') {
            const ngPackages: Package[] = [];
            NG_CATEGORIES_DATA.forEach(cat => {
                const packages = NG_PACKAGES_DATA[cat.id] || [];
                packages.forEach(pkg => {
                    ngPackages.push({
                        id: pkg.id,
                        name: pkg.name,
                        price: `₦${pkg.price.toLocaleString()}`,
                        photos: pkg.images,
                        outfits: pkg.outfits,
                        deliveryTime: "1-3 hours",
                        features: [pkg.description],
                        popular: pkg.popular || false,
                        category: cat.label,
                        categoryId: cat.id
                    });
                });
            });
            return ngPackages;
        } else {
            const ghPackages: Package[] = [];
            Object.keys(GH_DATA).forEach(categoryKey => {
                GH_DATA[categoryKey].packages.forEach(pkg => {
                    ghPackages.push(pkg);
                });
            });
            return ghPackages;
        }
    };

    const allPackages = getAllPackages();
    const categories = ['All', ...Array.from(new Set(allPackages.map(p => p.category)))];

    const filteredPackages = activeCategory === 'All'
        ? allPackages
        : allPackages.filter(p => p.category === activeCategory);

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

    return (
        <section className="py-8 md:py-16 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <div className="mb-6">
                    <a
                        href="/individuals"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Individuals</span>
                    </a>
                </div>

                {/* Header */}
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-playfair">
                        All Packages
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse all our virtual photoshoot packages. Choose your country to see pricing in your local currency.
                    </p>
                </div>

                {/* Country Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-full inline-flex relative shadow-md border border-gray-200">
                        {/* Sliding Background */}
                        <div
                            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#D4AF37] rounded-full shadow-sm transition-all duration-300 ease-spring ${country === 'GH' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'
                                }`}
                        />

                        {/* Ghana Button */}
                        <button
                            onClick={() => {
                                setCountry('GH');
                                setActiveCategory('All');
                            }}
                            className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${country === 'GH' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="text-lg">🇬🇭</span>
                            Ghana
                        </button>

                        {/* Nigeria Button */}
                        <button
                            onClick={() => {
                                setCountry('NG');
                                setActiveCategory('All');
                            }}
                            className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 ${country === 'NG' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span className="text-lg">🇳🇬</span>
                            Nigeria
                        </button>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Package Count */}
                <p className="text-center text-gray-500 text-sm mb-8">
                    Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
                </p>

                {/* Packages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredPackages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="relative bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Subtle Gold Pattern Background Overlay */}
                            <div className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
                                    backgroundSize: '10px 10px'
                                }}
                            />

                            {/* Popular Ribbon */}
                            {pkg.popular && (
                                <div className="absolute -top-3 -left-3 z-20">
                                    <div className="bg-[#B91C1C] text-white text-[10px] font-bold px-3 py-1 shadow-md transform -rotate-12 rounded-sm border border-white/20">
                                        POPULAR
                                    </div>
                                </div>
                            )}

                            {/* Hanging Price Tag */}
                            <div className="absolute -top-5 -right-2 z-20 shadow-lg transform rotate-3 hover:rotate-6 transition-transform origin-top-right">
                                <div className="bg-[#D4AF37] text-white p-1 rounded-sm relative">
                                    <div className="border border-white/30 rounded-sm px-2 py-1 bg-gradient-to-br from-[#D4AF37] to-[#B8860B]">
                                        <div className="text-xl font-bold">{pkg.price}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Package Header */}
                            <div className="mb-4 relative z-10 pt-2">
                                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mt-1">{pkg.category}</p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3 mb-6 relative z-10">
                                {/* Photos */}
                                <div className="flex items-center text-sm text-gray-700 bg-gray-50/50 p-2 rounded-lg">
                                    <Camera className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                    <span className="font-medium text-gray-900">{pkg.photos} Professional photos</span>
                                </div>

                                {/* Outfits */}
                                <div className="flex items-center text-sm text-gray-700 bg-gray-50/50 p-2 rounded-lg">
                                    <Shirt className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                    <span className="font-medium text-gray-900">{pkg.outfits} Outfit{pkg.outfits > 1 ? 's' : ''}</span>
                                </div>

                                {/* Delivery Time */}
                                <div className="flex items-center text-sm text-gray-700 bg-gray-50/50 p-2 rounded-lg">
                                    <Clock className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                    <span className="font-medium text-gray-900">Delivery in {pkg.deliveryTime}</span>
                                </div>

                                {/* Other Features */}
                                {pkg.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center text-sm text-gray-700 bg-gray-50/50 p-2 rounded-lg">
                                        <Check className="w-5 h-5 text-[#D4AF37] mr-3 flex-shrink-0" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Select Button */}
                            <button
                                onClick={() => handlePackageSelect(pkg)}
                                className="relative z-10 w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 border-2 border-transparent hover:border-[#D4AF37]/30"
                            >
                                <span>Select Package</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPackages.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No packages found for this filter.</p>
                        <button
                            onClick={() => setActiveCategory('All')}
                            className="mt-4 text-[#D4AF37] font-semibold hover:underline"
                        >
                            Show all packages
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
