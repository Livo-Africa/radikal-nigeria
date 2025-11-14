// src/app/individuals/style-journey/page.tsx (update steps array)
'use client';
import { useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';
import WhatsAppFloat from '@/components/shared/WhatsAppFloat';
import Step1ShootType from '@/components/style-journey/Step1ShootType';
import Step2Package from '@/components/style-journey/Step2Package';
import Step3PhotoUpload from '@/components/style-journey/Step3PhotoUpload'; // ADD THIS IMPORT
import StepNavigation from '@/components/style-journey/StepNavigation';

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
    total: 0
  });

  const steps = [
    { number: 1, title: 'Shoot Type', component: Step1ShootType },
    { number: 2, title: 'Package', component: Step2Package },
    { number: 3, title: 'Photos', component: Step3PhotoUpload }, // ADD THIS STEP
    // We'll add other steps later
  ];

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <>
      <Navigation />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-32">
        {/* Progress Bar */}
        <div className="container mx-auto px-4 py-6">
          <StepNavigation 
            currentStep={currentStep} 
            totalSteps={7}
            formData={formData}
          />
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