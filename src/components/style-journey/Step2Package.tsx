// src/components/style-journey/Step2Package.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Package } from './types';
import { Package as PackageIcon, Camera, Shirt, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import StickyActionButtons from '../shared/StickyActionButtons';

// Package data based on shoot type
const packagesByType: Record<string, Package[]> = {
  profile: [
    {
      id: 'basic-profile',
      name: 'Basic Profile',
      price: 30,
      originalPrice: 50,
      photos: 2,
      outfits: 1,
      deliveryTime: '1-3 hours',
      features: ['Clean professional shots', 'Basic editing', '1 outfit', 'Digital delivery'],
      popular: false,
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'professional-headshots',
      name: 'Professional Headshots',
      price: 50,
      originalPrice: 80,
      photos: 3,
      outfits: 2,
      deliveryTime: '1-3 hours',
      features: ['3 professional poses', '2 outfits', 'Enhanced styling', 'Digital delivery'],
      popular: true,
      color: 'from-[#D4AF37] to-[#B91C1C]'
    },
    {
      id: 'premium-portfolio',
      name: 'Premium Portfolio',
      price: 70,
      originalPrice: 120,
      photos: 5,
      outfits: 3,
      deliveryTime: '1-2 hours',
      features: ['5 versatile shots', '3 outfits', 'Premium backgrounds', 'Priority editing'],
      popular: false,
      color: 'from-purple-500 to-pink-500'
    }
  ],
  social: [
    {
      id: 'social-essential',
      name: 'Social Essential',
      price: 40,
      originalPrice: 60,
      photos: 5,
      outfits: 2,
      deliveryTime: '1-3 hours',
      features: ['5 social-ready photos', '2 trendy outfits', 'Platform optimization', 'Digital delivery'],
      popular: true,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'social-pro',
      name: 'Social Pro',
      price: 80,
      originalPrice: 120,
      photos: 10,
      outfits: 3,
      deliveryTime: '1-2 hours',
      features: ['10 curated photos', '3 outfits', 'Multiple styles', 'Priority delivery'],
      popular: false,
      color: 'from-[#D4AF37] to-[#B91C1C]'
    }
  ],
  // Default fallback
  default: [
    {
      id: 'standard',
      name: 'Standard Package',
      price: 50,
      originalPrice: 80,
      photos: 5,
      outfits: 2,
      deliveryTime: '1-3 hours',
      features: ['Professional photos', '2 outfits', 'Standard editing', 'Digital delivery'],
      popular: true,
      color: 'from-[#D4AF37] to-[#B91C1C]'
    }
  ]
};

interface Step2PackageProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function Step2Package({ formData, setFormData, currentStep, setCurrentStep }: Step2PackageProps) {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(formData.package || null);
  const [isSelecting, setIsSelecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get packages for current shoot type
  const currentPackages = packagesByType[formData.shootType] || packagesByType.default;

  // Handle package selection with smooth animation
  const handleSelectPackage = (pkg: Package) => {
    if (isSelecting) return;

    setIsSelecting(true);
    setSelectedPackage(pkg);

    // Visual feedback first
    setTimeout(() => {
      setFormData((prev: any) => ({
        ...prev,
        package: pkg,
        total: pkg.price
      }));

      setIsSelecting(false);

      // Auto advance
      handleContinue();
    }, 500);
  };

  const handleContinue = () => {
    if (!selectedPackage) return;

    // Add a smooth transition effect
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(3);
    }, 200);
  };

  const handleBack = () => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(1);
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out pb-32"
    >
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <PackageIcon className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            CHOOSE YOUR PACKAGE
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Select the perfect package for your {formData.shootTypeName || 'photoshoot'} needs
        </p>
      </div>

      {/* Packages Grid / Horizontal Scroll */}
      <div className="flex flex-row overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:max-w-6xl md:mx-auto md:px-4 md:overflow-visible md:pb-0 hide-scrollbar snap-x snap-mandatory">
        {currentPackages.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;

          return (
            <div
              key={pkg.id}
              onClick={() => handleSelectPackage(pkg)}
              className={`
                min-w-[280px] w-[280px] md:w-auto flex-shrink-0 mr-4 md:mr-0 snap-center
                relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
                border-2 flex flex-col
                ${isSelected
                  ? 'border-[#D4AF37] shadow-xl scale-105 z-10'
                  : 'border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-lg hover:scale-102'
                }
                bg-white
              `}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-bl-xl z-20">
                  MOST POPULAR
                </div>
              )}

              {/* Header Section */}
              <div className={`p-6 bg-gradient-to-br ${pkg.color} text-white relative overflow-hidden`}>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold">₵{pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-sm line-through opacity-70">₵{pkg.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black opacity-10 rounded-full -ml-10 -mb-10"></div>
              </div>

              {/* Features Section */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Camera className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm font-semibold">{pkg.photos} Photos</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Shirt className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm font-semibold">{pkg.outfits} Outfits</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm font-semibold">{pkg.deliveryTime}</span>
                  </div>
                </div>

                {/* Selection Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button className={`
                    w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2
                    ${isSelected
                      ? 'bg-[#D4AF37] text-black shadow-lg'
                      : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                    }
                  `}>
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <span>Select Package</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Comparison Helper */}
      <div className="max-w-2xl mx-auto mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200 mx-4 lg:mx-auto">
        <h3 className="font-bold text-gray-900 mb-3 text-center">💰 Package Comparison</h3>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-bold text-gray-700">Basic</div>
            <div className="text-gray-500">Great for quick updates</div>
          </div>
          <div>
            <div className="font-bold text-[#D4AF37]">Professional</div>
            <div className="text-gray-500">Perfect for most needs</div>
          </div>
          <div>
            <div className="font-bold text-purple-600">Premium</div>
            <div className="text-gray-500">Ultimate quality & speed</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <StickyActionButtons
        onBack={handleBack}
        onNext={handleContinue}
        nextLabel="Continue to Photos"
        showNext={!!selectedPackage}
      />
    </div>
  );
}