// src/components/mobile/MobileStepHeader.tsx - NEW FILE
'use client';
import { ArrowLeft, Home, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileStepHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  showBack?: boolean;
  onBack?: () => void;
}

export default function MobileStepHeader({ 
  title, 
  currentStep, 
  totalSteps, 
  showBack = true,
  onBack 
}: MobileStepHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4">
        {/* Back Button */}
        {showBack && (
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        {/* Center Title and Progress */}
        <div className="flex-1 text-center px-4">
          <h1 className="font-semibold text-gray-900 text-sm truncate">{title}</h1>
          <div className="text-xs text-gray-500 mt-1">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
          </button>
          <button 
            onClick={() => window.open(`https://wa.me/${process.env.WHATSAPP_NUMBER}`, '_blank')}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] h-1 transition-all duration-500"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}