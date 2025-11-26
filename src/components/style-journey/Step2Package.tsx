// src/components/style-journey/Step2Package.tsx - WITH LUCIDE ICONS
'use client';
import { useState, useRef, useEffect } from 'react';
import { Package } from './types';
import { Package as PackageIcon, Camera, Shirt, Clock, Check, ArrowRight, ArrowLeft } from 'lucide-react';

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
  // Add other shoot types...
  graduation: [
    {
      id: 'graduation-basic',
      name: 'Graduation Basic',
      price: 50,
      originalPrice: 70,
      photos: 3,
      outfits: 1,
      deliveryTime: '1-3 hours',
      features: ['Graduation-themed', 'Gown enhancement', 'Basic editing', 'Digital delivery'],
      popular: false,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'graduation-premium',
      name: 'Graduation Premium',
      price: 90,
      originalPrice: 140,
      photos: 8,
      outfits: 2,
      deliveryTime: '1-2 hours',
      features: ['8 celebration shots', '2 outfits', 'Custom backgrounds', 'Priority editing'],
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
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get packages for current shoot type
  const currentPackages = packagesByType[formData.shootType] || packagesByType.profile;

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
      
      // Show next button after selection
      setShowNextButton(true);
      setIsSelecting(false);
    }, 300);
  };

  // Auto-advance after 2 seconds if user doesn't manually proceed
  useEffect(() => {
    if (!selectedPackage) return;
    
    const timer = setTimeout(() => {
      handleContinue();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [selectedPackage]);

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

  // Swipe gesture support
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && selectedPackage) {
      handleContinue();
    } else if (isRightSwipe) {
      handleBack();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <PackageIcon className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            CHOOSE YOUR PHOTOSHOOT PACKAGE
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Perfect packages for your <span className="text-[#D4AF37] font-semibold">{formData.shootTypeName}</span>
        </p>
        
        {/* Swipe Hints */}
        <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
          <div className="flex items-center animate-pulse">
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center mr-2">
              <ArrowLeft className="w-3 h-3 text-white" />
            </div>
            <span>Swipe left to go back</span>
          </div>
          
          {selectedPackage && (
            <div className="flex items-center animate-pulse">
              <span className="mr-2">Swipe right to continue</span>
              <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {currentPackages.map((pkg) => (
          <div
            key={pkg.id}
            onClick={() => handleSelectPackage(pkg)}
            className={`
              relative group cursor-pointer transition-all duration-500 ease-out transform
              ${selectedPackage?.id === pkg.id 
                ? 'scale-105 ring-4 ring-[#D4AF37] ring-opacity-50 shadow-2xl' 
                : 'hover:scale-102 hover:shadow-xl'
              }
              ${isSelecting ? 'pointer-events-none' : ''}
            `}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ⭐ MOST POPULAR
                </div>
              </div>
            )}
            
            {/* Package Card */}
            <div className={`
              bg-white rounded-2xl p-6 border-2 min-h-[400px] flex flex-col
              transition-all duration-300 ease-out relative overflow-hidden
              ${selectedPackage?.id === pkg.id 
                ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent' 
                : 'border-gray-200 hover:border-[#D4AF37]/50'
              }
            `}>
              
              {/* Price Header with Gradient */}
              <div className={`
                bg-gradient-to-br ${pkg.color} rounded-xl p-4 text-white text-center mb-6
                transform transition-transform duration-300
                ${selectedPackage?.id === pkg.id ? 'scale-105' : 'group-hover:scale-102'}
              `}>
                <div className="text-3xl font-bold">₵{pkg.price}</div>
                {pkg.originalPrice && (
                  <div className="text-sm opacity-90 line-through">₵{pkg.originalPrice}</div>
                )}
                <div className="text-sm font-semibold mt-1">{pkg.name}</div>
              </div>
              
              {/* Package Details */}
              <div className="flex-1 space-y-4">
                {/* Photo & Outfit Summary */}
                <div className="text-center">
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Camera className="w-4 h-4" />
                      <span className="font-bold">{pkg.photos} photos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shirt className="w-4 h-4" />
                      <span className="font-bold">{pkg.outfits} outfit{pkg.outfits > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Delivery: {pkg.deliveryTime}</span>
                  </div>
                </div>
                
                {/* Features List */}
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 text-sm transition-all duration-300 transform group-hover:translate-x-1"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Selection Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className={`
                  w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center space-x-2
                  ${selectedPackage?.id === pkg.id
                    ? 'bg-[#D4AF37] text-black shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                  }
                `}>
                  {selectedPackage?.id === pkg.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Selected</span>
                    </>
                  ) : (
                    <span>Select Package</span>
                  )}
                </button>
              </div>
              
              {/* Savings Badge */}
              {pkg.originalPrice && (
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Save ₵{pkg.originalPrice - pkg.price}
                </div>
              )}
            </div>
            
            {/* Glow Effect for Selected Package */}
            {selectedPackage?.id === pkg.id && (
              <div className="absolute inset-0 rounded-2xl bg-[#D4AF37] opacity-20 blur-xl -z-10 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Package Comparison Helper */}
      <div className="max-w-2xl mx-auto mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
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
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="
            bg-gray-600 text-white font-bold py-4 px-6 
            rounded-2xl shadow-xl 
            transform transition-all duration-300 
            hover:scale-105 hover:shadow-2xl
            active:scale-95
            flex items-center space-x-2
          "
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        {/* Next Button - Appears after selection */}
        {showNextButton && (
          <button
            onClick={handleContinue}
            className="
              bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] 
              text-white font-bold py-4 px-8 
              rounded-2xl shadow-2xl 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-3xl
              active:scale-95
              flex items-center space-x-3
            "
          >
            <span>Continue to Photos</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        )}
      </div>

      {/* Auto-progress indicator */}
      {showNextButton && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30 text-center">
          <div className="w-24 h-1 bg-gray-300 rounded-full mx-auto overflow-hidden">
            <div 
              className="h-full bg-[#D4AF37] rounded-full transition-all duration-2000 ease-linear"
              style={{ 
                width: '100%',
                animation: 'shrink 2s linear forwards'
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Auto-continuing in 2s...</p>
        </div>
      )}

      {/* CSS for auto-progress animation */}
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}