// src/components/style-journey/Step1ShootType.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { User, Users, Briefcase, Camera, Heart, Star, ArrowRight, Check } from 'lucide-react';


interface Step1ShootTypeProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function Step1ShootType({ formData, setFormData, currentStep, setCurrentStep }: Step1ShootTypeProps) {
  const [selectedType, setSelectedType] = useState<string | null>(formData.shootType);
  const containerRef = useRef<HTMLDivElement>(null);

  const shootTypes = [
    {
      id: 'profile',
      name: 'Profile',
      description: 'LinkedIn & professional',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Instagram & content',
      icon: Camera,
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Brand & corporate',
      icon: Briefcase,
      color: 'from-gray-700 to-gray-900',
      popular: false
    },
    {
      id: 'couples',
      name: 'Couples',
      description: 'Love & engagement',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      popular: false
    },
    {
      id: 'group',
      name: 'Group',
      description: 'Friends & family',
      icon: Users,
      color: 'from-green-500 to-teal-600',
      popular: false
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Artistic & editorial',
      icon: Star,
      color: 'from-orange-500 to-yellow-600',
      popular: false
    },
  ];

  const handleSelectShootType = (type: typeof shootTypes[0]) => {
    setSelectedType(type.id);
    setFormData((prev: any) => ({
      ...prev,
      shootType: type.id,
      shootTypeName: type.name
    }));

    // Smooth transition effect
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    // Auto-advance after short delay
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out pb-20"
    >
      {/* Desktop Header */}
      <div className="hidden lg:block text-center mb-10 pt-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent mb-4">
          WHAT ARE WE SHOOTING?
        </h1>
        <p className="text-gray-600 text-lg">
          Select the type of photoshoot you're looking for
        </p>
      </div>

      {/* Grid of Options (Horizontal Scroll on Mobile, Grid on Desktop) */}
      <div className="flex flex-row overflow-x-auto pb-6 -mx-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6 md:max-w-5xl md:mx-auto md:overflow-visible md:pb-0 hide-scrollbar snap-x snap-mandatory">
        {shootTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => handleSelectShootType(type)}
              className={`
                min-w-[160px] w-[160px] md:w-auto flex-shrink-0 mr-4 md:mr-0 snap-center
                relative group overflow-hidden rounded-2xl p-4 md:p-6 text-left transition-all duration-300
                border-2 flex flex-col items-center justify-center h-48 md:h-48
                ${isSelected
                  ? 'border-[#D4AF37] bg-gradient-to-br from-gray-50 to-white shadow-xl scale-105'
                  : 'border-gray-100 bg-white hover:border-[#D4AF37]/50 hover:shadow-lg hover:scale-102'
                }
              `}
            >
              {/* Icon Circle */}
              <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300
                bg-gradient-to-br ${type.color} text-white shadow-md group-hover:shadow-lg group-hover:scale-110
              `}>
                <Icon className="w-6 h-6 md:w-7 md:h-7" />
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1">
                  {type.name}
                </h3>
                <p className="text-xs text-gray-500 hidden md:block">
                  {type.description}
                </p>
              </div>

              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-[#D4AF37] text-white rounded-full p-1 shadow-sm animate-scaleIn">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Popular Tag */}
              {type.popular && !isSelected && (
                <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  HOT
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      <div className="text-center mt-6 text-sm text-gray-400">
        Tap any option to continue
      </div>
    </div>
  );
}