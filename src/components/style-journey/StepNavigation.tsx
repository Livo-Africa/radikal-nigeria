// components/style-journey/StepNavigation.tsx
'use client';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  formData: any;
}

export default function StepNavigation({ currentStep, totalSteps, formData }: StepNavigationProps) {
  const steps = [
    'Shoot Type', 'Package', 'Photos', 'Outfits', 'Style', 'Review', 'Payment'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-[#D4AF37]">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Connector Line */}
              {index > 0 && (
                <div 
                  className={`absolute top-4 left-0 right-0 h-0.5 -z-10 ${
                    isCompleted ? 'bg-[#D4AF37]' : 'bg-gray-300'
                  }`}
                  style={{ 
                    left: `${(index - 1) * (100 / (steps.length - 1))}%`,
                    width: `${100 / (steps.length - 1)}%`
                  }}
                ></div>
              )}
              
              {/* Step Circle */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold 
                transition-all duration-300 transform
                ${isCompleted 
                  ? 'bg-[#D4AF37] text-white scale-110' 
                  : isCurrent 
                  ? 'bg-[#D4AF37] text-white ring-4 ring-[#D4AF37] ring-opacity-30 scale-110'
                  : 'bg-gray-300 text-gray-600'
                }
                ${isUpcoming ? 'opacity-50' : ''}
              `}>
                {isCompleted ? '✓' : stepNumber}
              </div>
              
              {/* Step Label */}
              <span className={`
                text-xs mt-2 text-center hidden sm:block
                ${isCurrent ? 'text-[#D4AF37] font-bold' : 'text-gray-500'}
                ${isUpcoming ? 'opacity-50' : ''}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current Selection Display */}
      {formData.shootTypeName && (
        <div className="mt-6 text-center animate-fadeIn">
          <div className="inline-flex items-center space-x-2 bg-[#D4AF37]/10 px-4 py-2 rounded-full">
            <span className="text-sm text-gray-700">Selected:</span>
            <span className="text-sm font-bold text-[#D4AF37]">{formData.shootTypeName}</span>
          </div>
        </div>
      )}
    </div>
  );
}