'use client';
import { useState } from 'react';
import { ArrowRight, Star, Clock, Image, Shirt, Check } from 'lucide-react';
import { PACKAGES_BY_CATEGORY as NG_PACKAGES_DATA } from '@/utils/bookingDataNigeria';

interface Package {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  photos: number;
  outfits: number;
  deliveryTime: string;
  features: string[];
  popular: boolean;
  category: string;
}

interface PackageShowcaseProps {
  country?: 'GH' | 'NG';
}

// Hardcoded Ghana Packages (Preserved)
const GH_PACKAGES: Package[] = [
  {
    id: "profile-headshots",
    name: "Profile Headshots",
    price: "₵30",
    photos: 2,
    outfits: 1,
    deliveryTime: "1-3 hours",
    features: ["Professional quality", "LinkedIn ready", "2 edited photos"],
    popular: false,
    category: "Professional"
  },
  {
    id: "solo-standard",
    name: "Solo Standard",
    price: "₵50",
    photos: 4,
    outfits: 1,
    deliveryTime: "1-3 hours",
    features: ["4 professional photos", "1 outfit", "Basic editing"],
    popular: true,
    category: "Solo"
  },
  {
    id: "birthday-basic",
    name: "Birthday Basic",
    price: "₵40",
    photos: 4,
    outfits: 1,
    deliveryTime: "1-3 hours",
    features: ["Birthday theme", "4 photos", "1 outfit"],
    popular: false,
    category: "Special Occasions"
  },
  {
    id: "graduation-shots",
    name: "Graduation Shots",
    price: "₵70",
    photos: 3,
    outfits: 1,
    deliveryTime: "1-3 hours",
    features: ["Graduation theme", "Gown enhancement", "3 photos"],
    popular: true,
    category: "Special Occasions"
  },
  {
    id: "solo-medium",
    name: "Solo Medium",
    price: "₵90",
    photos: 8,
    outfits: 2,
    deliveryTime: "1-3 hours",
    features: ["8 photos", "2 outfits", "Premium editing"],
    popular: false,
    category: "Solo"
  },
  {
    id: "group-standard",
    name: "Group Standard",
    price: "₵80",
    photos: 4,
    outfits: 2,
    deliveryTime: "1-3 hours",
    features: ["Group shots", "2 outfits", "4 photos"],
    popular: false,
    category: "Group"
  },
  // Additional packages that will be hidden initially
  {
    id: "premium-portfolio",
    name: "Premium Portfolio",
    price: "₵120",
    photos: 10,
    outfits: 3,
    deliveryTime: "2-4 hours",
    features: ["10 professional shots", "3 outfits", "Advanced editing"],
    popular: false,
    category: "Professional"
  },
  {
    id: "family-package",
    name: "Family Package",
    price: "₵150",
    photos: 8,
    outfits: 3,
    deliveryTime: "2-4 hours",
    features: ["Family shots", "3 outfits", "8 photos"],
    popular: false,
    category: "Group"
  }
];

export default function PackageShowcase({ country = 'GH' }: PackageShowcaseProps) {
  const [showAll, setShowAll] = useState(false);

  // Dynamic Data Loading
  let allPackages: Package[];

  if (country === 'NG') {
    const ngPackages: Package[] = [];
    Object.keys(NG_PACKAGES_DATA).forEach(key => {
      const packages = NG_PACKAGES_DATA[key];
      packages.forEach(pkg => {
        ngPackages.push({
          id: pkg.id,
          name: pkg.name,
          price: `₦${pkg.price.toLocaleString()} `,
          // Use dummy values where specific fields are missing in util but required here
          originalPrice: undefined,
          photos: pkg.images,
          outfits: pkg.outfits,
          deliveryTime: "1-3 hours", // Hardcoded default
          features: [pkg.description, `${pkg.images} Photos`, `${pkg.outfits} Outfits`],
          popular: pkg.popular || false,
          category: key.charAt(0).toUpperCase() + key.slice(1) // Capitalize category key
        });
      });
    });
    allPackages = ngPackages;
  } else {
    allPackages = GH_PACKAGES;
  }

  const displayedPackages = showAll ? allPackages : allPackages.slice(0, 6);
  const hiddenCount = Math.max(0, allPackages.length - 6);

  const handlePackageSelect = (pkg: Package) => {
    // Save package to localStorage for preselection
    const packageData = {
      package: pkg,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

    // Navigate to style journey with package preselected
    if (country === 'NG') {
      window.location.href = '/individuals/book';
    } else {
      window.location.href = '/individuals/style-journey?step=2';
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our most popular photoshoot packages in {country === 'GH' ? 'Ghana' : 'Nigeria'}
          </p>
        </div>

        {/* Packages Grid - Added top padding for hanging tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 pt-8 px-2">
          {displayedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block"
            >
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
                </div>
              </div>

              {/* Package Header */}
              <div className="mb-4 relative z-10 pt-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-wider font-medium text-xs mt-1">{pkg.category}</p>
                </div>
              </div>

              {/* Specs Row */}
              <div className="flex items-center gap-4 mb-6 relative z-10 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-[#D4AF37]/10">
                    <Image className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{pkg.photos}</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1.5">
                  <div className="p-1.5 rounded-full bg-[#D4AF37]/10">
                    <Shirt className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">{pkg.outfits}</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-500">{pkg.deliveryTime.split(' ')[0]}h</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8 relative z-10">
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-700">
                    <Check className="w-4 h-4 text-[#D4AF37] mr-3 flex-shrink-0" />
                    <span>{feature}</span>
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

        {/* Show More/Less Button */}
        {allPackages.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>{showAll ? 'Show Less' : `View All Packages(${hiddenCount} more)`}</span>
              <ArrowRight className={`w - 4 h - 4 transform ${showAll ? 'rotate-180' : ''} `} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
