// components/style-journey/Step1ShootType.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { ShootType } from './types';

const shootTypes: ShootType[] = [
  {
    id: 'profile',
    name: 'Profile Headshots',
    description: 'For LinkedIn, CVs, professional profiles',
    icon: '👔',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'social', 
    name: 'Social Media Ready',
    description: 'Perfect for Instagram, TikTok, Facebook',
    icon: '📱',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'graduation',
    name: 'Graduation Celebration', 
    description: 'Celebrate your achievement with style',
    icon: '🎓',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'birthday',
    name: 'Birthday & Celebration',
    description: 'Make your special day unforgettable',
    icon: '🎉',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'group',
    name: 'Group & Family',
    description: 'With friends, family, or loved ones',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'portfolio',
    name: 'Professional Portfolio',
    description: 'Showcase your skills and expertise',
    icon: '💼',
    color: 'from-gray-700 to-gray-900'
  }
];

// UPDATED: Added currentStep to the interface
interface Step1ShootTypeProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number; // ADDED THIS LINE
  setCurrentStep: (step: number) => void;
}

// UPDATED: Added currentStep parameter
export default function Step1ShootType({ 
  formData, 
  setFormData, 
  currentStep, // ADDED THIS PARAMETER
  setCurrentStep 
}: Step1ShootTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle selection with smooth animation
  const handleSelectShootType = (type: ShootType) => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    setSelectedType(type.id);
    
    // Visual feedback first
    setTimeout(() => {
      setFormData((prev: any) => ({ 
        ...prev, 
        shootType: type.id,
        shootTypeName: type.name 
      }));
      
      // Show next button after selection
      setShowNextButton(true);
      setIsSelecting(false);
    }, 300);
  };

  // Auto-advance after 2 seconds if user doesn't manually proceed
  useEffect(() => {
    if (!selectedType) return;
    
    const timer = setTimeout(() => {
      handleContinue();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [selectedType]);

  const handleContinue = () => {
    if (!selectedType) return;
    
    // Add a smooth transition effect
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }
    
    setTimeout(() => {
      setCurrentStep(2);
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
    const isLeftSwipe = distance > 50; // Minimum swipe distance
    
    if (isLeftSwipe && selectedType) {
      handleContinue();
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
          <span className="text-2xl">🎯</span>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            WHAT KIND OF PHOTOSHOOT DO YOU NEED?
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Choose the perfect photoshoot for your occasion</p>
        
        {/* Swipe Hint */}
        {selectedType && (
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500 animate-pulse">
            <span className="mr-2">← Swipe right to continue</span>
            <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">→</span>
            </div>
          </div>
        )}
      </div>

      {/* Shoot Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
        {shootTypes.map((type) => (
          <div
            key={type.id}
            onClick={() => handleSelectShootType(type)}
            className={`
              relative group cursor-pointer transition-all duration-500 ease-out transform
              ${selectedType === type.id 
                ? 'scale-105 ring-4 ring-[#D4AF37] ring-opacity-50 shadow-2xl' 
                : 'hover:scale-102 hover:shadow-xl'
              }
              ${isSelecting ? 'pointer-events-none' : ''}
            `}
          >
            {/* Card */}
            <div className={`
              bg-white rounded-2xl p-6 border-2 min-h-[180px] flex flex-col justify-between
              transition-all duration-300 ease-out
              ${selectedType === type.id 
                ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent' 
                : 'border-gray-200 hover:border-[#D4AF37]/50'
              }
            `}>
              
              {/* Icon with Gradient Background */}
              <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mb-4
                bg-gradient-to-br ${type.color} text-white
                transform transition-transform duration-300
                ${selectedType === type.id ? 'scale-110 rotate-12' : 'group-hover:scale-105'}
              `}>
                {type.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                  {type.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {type.description}
                </p>
              </div>
              
              {/* Selection Indicator */}
              <div className="mt-4 flex justify-between items-center">
                <button className={`
                  px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300
                  ${selectedType === type.id
                    ? 'bg-[#D4AF37] text-black shadow-lg'
                    : 'bg-gray-100 text-gray-700 group-hover:bg-gray-200'
                  }
                `}>
                  {selectedType === type.id ? 'Selected ✓' : 'Choose This'}
                </button>
                
                {/* Pulse animation when selected */}
                {selectedType === type.id && (
                  <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping"></div>
                )}
              </div>
            </div>
            
            {/* Glow Effect */}
            {selectedType === type.id && (
              <div className="absolute inset-0 rounded-2xl bg-[#D4AF37] opacity-20 blur-xl -z-10 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>

      {/* Next Button - Appears after selection */}
      {showNextButton && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-fadeIn">
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
            <span>Continue to Packages</span>
            <span className="text-lg animate-bounce">→</span>
          </button>
          
          {/* Auto-progress indicator */}
          <div className="mt-2 text-center">
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
        </div>
      )}

      {/* Help Text */}
      {!selectedType && (
        <div className="text-center mt-8 animate-pulse">
          <p className="text-gray-500">
            Not sure? <span className="text-[#D4AF37] font-semibold">Tap any option</span> and we'll help you choose
          </p>
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