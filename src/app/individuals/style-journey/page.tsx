// src/app/individuals/style-journey/page.tsx - COMPLETE FIXED VERSION
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

function StyleJourneyContent() {
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

  const searchParams = useSearchParams();
  
  // FIXED: Check for step parameter in URL (from wardrobe)
  useEffect(() => {
    const stepFromUrl = searchParams.get('step');
    if (stepFromUrl) {
      const stepNumber = parseInt(stepFromUrl);
      if (stepNumber >= 1 && stepNumber <= 7) {
        console.log('🎯 Setting step from URL:', stepNumber);
        setCurrentStep(stepNumber);
        
        // Load outfits from localStorage if coming from wardrobe
        if (stepNumber === 4) {
          const savedOutfits = localStorage.getItem('radikal_selected_outfits');
          if (savedOutfits) {
            try {
              const parsed = JSON.parse(savedOutfits);
              if (parsed.outfits && Array.isArray(parsed.outfits)) {
                console.log('👗 Loading outfits from localStorage:', parsed.outfits.length);
                setFormData(prev => ({
                  ...prev,
                  outfits: parsed.outfits
                }));
              }
            } catch (error) {
              console.error('Error loading saved outfits:', error);
            }
          }
        }
      }
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

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-32">
        <SessionRecovery 
          formData={formData}
          setFormData={setFormData}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        
        {/* Progress Bar */}
        <div className="container mx-auto px-4 py-6">
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
        <div className="container mx-auto px-4">
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading style journey...</p>
        </div>
      </div>
    }>
      <StyleJourneyContent />
    </Suspense>
  );
}