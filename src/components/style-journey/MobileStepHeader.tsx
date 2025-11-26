// components/style-journey/MobileStepHeader.tsx
'use client';
import { Camera, Package, Image, Shirt, Palette, FileText, CreditCard } from 'lucide-react';

interface MobileStepHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const stepIcons = [
  { icon: Camera, label: 'Type' },
  { icon: Package, label: 'Package' },
  { icon: Image, label: 'Photos' },
  { icon: Shirt, label: 'Outfits' },
  { icon: Palette, label: 'Style' },
  { icon: FileText, label: 'Review' },
  { icon: CreditCard, label: 'Payment' },
];

export default function MobileStepHeader({ currentStep, totalSteps }: MobileStepHeaderProps) {
  return (
    <div className="lg:hidden fixed top-20 left-0 right-0 bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Icons */}
        <div className="flex justify-between items-center">
          {stepIcons.map(({ icon: Icon, label }, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? 'bg-[#D4AF37] text-white' : ''}
                  ${isCurrent ? 'bg-[#D4AF37] text-white ring-2 ring-[#D4AF37] ring-opacity-50' : ''}
                  ${stepNumber > currentStep ? 'bg-gray-100 text-gray-400' : ''}
                `}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`
                  text-xs mt-1 font-medium
                  ${isCurrent ? 'text-[#D4AF37]' : 'text-gray-500'}
                `}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}