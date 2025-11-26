// components/individuals/PackageShowcase.tsx - UPDATED
'use client';
import { useState } from 'react';
import { ArrowRight, Star, Clock, Image, Shirt } from 'lucide-react';

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

export default function PackageShowcase() {
  const [showAll, setShowAll] = useState(false);
  
  const allPackages: Package[] = [
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

  const displayedPackages = showAll ? allPackages : allPackages.slice(0, 6);
  const hiddenCount = allPackages.length - 6;

  const handlePackageSelect = (pkg: Package) => {
    // Save package to localStorage for preselection
    const packageData = {
      package: pkg,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));
    
    // Navigate to style journey with package preselected
    window.location.href = '/individuals/style-journey?step=2';
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Popular Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our most popular photoshoot packages
          </p>
        </div>
        
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-lg"
            >
              {/* Package Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                  <p className="text-sm text-gray-500">{pkg.category}</p>
                </div>
                {pkg.popular && (
                  <span className="bg-[#D4AF37] text-black text-xs font-bold px-2 py-1 rounded-full">
                    POPULAR
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-gray-900">{pkg.price}</div>
                {pkg.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Image className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>{pkg.photos} professional photos</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shirt className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>{pkg.outfits} outfit{pkg.outfits > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-[#D4AF37]" />
                  <span>Delivery in {pkg.deliveryTime}</span>
                </div>
              </div>

              {/* Select Button */}
              <button
                onClick={() => handlePackageSelect(pkg)}
                className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
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
              <span>{showAll ? 'Show Less' : `View All Packages (${hiddenCount} more)`}</span>
              <ArrowRight className={`w-4 h-4 transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}