// In src/app/individuals/style-journey/page.tsx - ADD MobileStepHeader
'use client';
import { useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Step1ShootType from '@/components/style-journey/Step1ShootType';
import Step2Package from '@/components/style-journey/Step2Package';
import Step3PhotoUpload from '@/components/style-journey/Step3PhotoUpload';
import Step4OutfitSelection from '@/components/style-journey/Step4OutfitSelection';
import Step5StyleCustomization from '@/components/style-journey/Step5StyleCustomization';
import Step6Review from '@/components/style-journey/Step6Review';
import Step7Payment from '@/components/style-journey/Step7Payment';
import SessionRecovery from '@/components/style-journey/SessionRecovery';
import MobileStepHeader from '@/components/mobile/MobileStepHeader';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';

export default function StyleJourney() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shootType: null,
    shootTypeName: null,
    package: null,
    photos: [],
    outfits: [],
    style: {},
    whatsappNumber: '',
    specialRequests: '',
    addOns: [],
    total: 0,
    finalTotal: 0
  });

  // Initialize abandonment tracking globally
  useAbandonmentTracking(formData, currentStep);

  const steps = [
    { number: 1, title: 'Shoot Type', component: Step1ShootType },
    { number: 2, title: 'Package', component: Step2Package },
    { number: 3, title: 'Photos', component: Step3PhotoUpload },
    { number: 4, title: 'Outfits', component: Step4OutfitSelection },
    { number: 5, title: 'Style', component: Step5StyleCustomization },
    { number: 6, title: 'Review', component: Step6Review },
    { number: 7, title: 'Payment', component: Step7Payment },
  ];

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  // Step titles for mobile header
  const stepTitles = [
    'Choose Shoot Type',
    'Select Package',
    'Upload Photos',
    'Choose Outfits',
    'Customize Style',
    'Review Order',
    'Complete Payment'
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 lg:pt-0 pb-32">
        <SessionRecovery
          formData={formData}
          setFormData={setFormData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />

        {/* Mobile Header - Shows on all steps */}
        <MobileStepHeader
          title={stepTitles[currentStep - 1]}
          currentStep={currentStep}
          totalSteps={steps.length}
          showBack={currentStep > 1}
          onBack={currentStep > 1 ? () => setCurrentStep(currentStep - 1) : undefined}
        />

        {/* Progress Bar - Desktop Only */}
        <div className="hidden lg:block container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm font-bold text-[#D4AF37]">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="container mx-auto px-0 lg:px-4">
          {CurrentStepComponent && (
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}