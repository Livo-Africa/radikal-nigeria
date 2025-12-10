// In src/app/individuals/style-journey/page.tsx - ADD MobileStepHeader
'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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

function StyleJourneyContent() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shootType: 'profile', // Default to avoid null issues
    shootTypeName: 'Profile Shoot',
    package: null as any,
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

  // Handle Entry Points (URL Params)
  useEffect(() => {
    const fromWardrobe = searchParams.get('fromWardrobe');
    const outfitCount = parseInt(searchParams.get('outfitCount') || '0');
    const stepParam = searchParams.get('step');

    // Case 1: Coming from Wardrobe
    if (fromWardrobe === 'true') {
      // Load selected outfits from localStorage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('radikal_selected_outfits');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.outfits && Array.isArray(parsed.outfits)) {

              // Auto-select package based on outfit count (Simple logic)
              // 1 outfit -> Basic, 2 outfits -> Standard, 3+ -> Premium
              // Ideally we check shootType too using an effect map, but defaulting to Profile/Standard is safe
              let autoPackageId = 'basic-profile';
              if (outfitCount === 2) autoPackageId = 'professional-headshots';
              if (outfitCount >= 3) autoPackageId = 'premium-portfolio';

              // We need to fetch package details or just mock them for now since they are in Step2Package file
              // For robustness, we might want to move package data to a shared constant file.
              // For now, let's just set the outfits and skip to Step 3 (Photos)

              setFormData(prev => ({
                ...prev,
                outfits: parsed.outfits,
                // We leave package as null so Step 2 forces them to confirm or we auto-select if we had the data
                // Better UX: Let them pick package in Step 2 but show "Recommended for X outfits"
              }));

              // If specific step requested, go there, else go to Step 2 (to pick package matching outfits) or Step 3
              if (stepParam) {
                setCurrentStep(parseInt(stepParam));
              } else {
                setCurrentStep(2); // Go to Package selection to confirm package
              }
            }
          } catch (e) {
            console.error('Error parsing saved outfits', e);
          }
        }
      }
    } else if (stepParam) {
      setCurrentStep(parseInt(stepParam));
    }
  }, [searchParams]);

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

export default function StyleJourney() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-[#D4AF37] font-semibold">Loading Style Journey...</div>
      </div>
    }>
      <StyleJourneyContent />
    </Suspense>
  );
}