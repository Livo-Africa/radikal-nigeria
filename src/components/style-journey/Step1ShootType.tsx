// components/style-journey/Step1ShootType.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, Users, GraduationCap, Cake, User, Briefcase, ArrowRight } from 'lucide-react';

const shootTypes = [
  {
    id: 'profile',
    name: 'Profile',
    description: 'LinkedIn & professional',
    icon: User,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'social',
    name: 'Social',
    description: 'Instagram & social media',
    icon: Camera,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'graduation',
    name: 'Graduation',
    description: 'Celebrate achievement',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Special celebrations',
    icon: Cake,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'group',
    name: 'Group',
    description: 'Friends & family',
    icon: Users,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Professional work',
    icon: Briefcase,
    color: 'from-gray-700 to-gray-900'
  }
];

interface Step1ShootTypeProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function Step1ShootType({ formData, setFormData, currentStep, setCurrentStep }: Step1ShootTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const handleSelectShootType = (type: typeof shootTypes[0]) => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    setSelectedType(type.id);
    
    setTimeout(() => {
      setFormData((prev: any) => ({ 
        ...prev, 
        shootType: type.id,
        shootTypeName: type.name 
      }));
      
      setShowNextButton(true);
      setIsSelecting(false);
    }, 300);
  };

  const handleContinue = () => {
    if (!selectedType) return;
    setCurrentStep(2);
  };

  return (
    <div className="min-h-[70vh] pt-4 lg:pt-0">
      {/* Header - Minimal on Mobile */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Camera className="w-6 h-6 text-[#D4AF37]" />
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            Choose Your Shoot
          </h1>
        </div>
        <p className="text-gray-600 hidden lg:block">
          Select the type of photoshoot you need
        </p>
      </div>

      {/* Shoot Type Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 max-w-6xl mx-auto px-2">
        {shootTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;
          
          return (
            <div
              key={type.id}
              onClick={() => handleSelectShootType(type)}
              className={`
                relative group cursor-pointer transition-all duration-300 transform
                ${isSelected ? 'scale-105' : 'hover:scale-102'}
                ${isSelecting ? 'pointer-events-none' : ''}
              `}
            >
              {/* Card */}
              <div className={`
                bg-white rounded-xl lg:rounded-2xl p-4 border-2 min-h-[120px] lg:min-h-[180px] flex flex-col justify-between
                transition-all duration-300
                ${isSelected 
                  ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent' 
                  : 'border-gray-200 hover:border-[#D4AF37]/50'
                }
              `}>
                
                {/* Icon with Gradient */}
                <div className={`
                  w-12 h-12 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center text-white
                  bg-gradient-to-br ${type.color} mx-auto mb-3 lg:mb-4
                  transform transition-transform duration-300
                  ${isSelected ? 'scale-110 rotate-6' : 'group-hover:scale-105'}
                `}>
                  <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-sm lg:text-lg mb-1">
                    {type.name}
                  </h3>
                  <p className="text-gray-600 text-xs lg:text-sm hidden lg:block">
                    {type.description}
                  </p>
                </div>
                
                {/* Selection Indicator */}
                <div className="mt-2 flex justify-center">
                  <div className={`
                    px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300
                    ${isSelected
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-gray-100 text-gray-700'
                    }
                  `}>
                    {isSelected ? 'Selected' : 'Choose'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      {showNextButton && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
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
            <span className="text-sm lg:text-base">Continue</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      )}

      {/* Help Text */}
      {!selectedType && (
        <div className="text-center mt-8 animate-pulse">
          <p className="text-gray-500 text-sm">
            Tap any option to continue
          </p>
        </div>
      )}
    </div>
  );
}