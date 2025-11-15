'use client';
import { useEffect } from 'react';

interface SessionRecoveryProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function SessionRecovery({ formData, setFormData, currentStep, setCurrentStep }: SessionRecoveryProps) {
  useEffect(() => {
    // Check for saved progress on component mount
    const savedProgress = localStorage.getItem('radikal_booking_progress');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const lastUpdated = new Date(progress.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);
        
        // Only restore if within 24 hours and not already in a session
        if (hoursDiff < 24 && currentStep === 1) {
          // Check if we should show recovery prompt
          if (progress.currentStep > 1 && progress.currentStep < 7) {
            const shouldRecover = window.confirm(
              `Welcome back! We found your incomplete ${progress.formData.shootTypeName || 'photoshoot'} booking from earlier. Would you like to continue where you left off?`
            );
            
            if (shouldRecover) {
              setFormData(progress.formData);
              setCurrentStep(progress.currentStep);
              console.log('🔄 Session recovered:', progress);
            } else {
              // Clear saved progress if user doesn't want to recover
              localStorage.removeItem('radikal_booking_progress');
            }
          }
        } else if (hoursDiff >= 24) {
          // Clear expired progress
          localStorage.removeItem('radikal_booking_progress');
          localStorage.removeItem('radikal_session_id');
        }
      } catch (error) {
        console.error('Error recovering session:', error);
      }
    }
  }, [setFormData, setCurrentStep, currentStep]);

  return null; // This component doesn't render anything
}