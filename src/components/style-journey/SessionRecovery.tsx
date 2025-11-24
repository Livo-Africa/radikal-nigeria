// src/components/style-journey/SessionRecovery.tsx - LESS AGGRESSIVE
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
        
        // FIXED: Only restore if within 2 hours AND user is at step 1
        // AND the progress was from a meaningful step (not just started)
        if (hoursDiff < 2 && currentStep === 1 && progress.currentStep > 2) {
          console.log('🔄 Session recovery available:', {
            step: progress.currentStep,
            shootType: progress.formData.shootTypeName,
            hoursAgo: hoursDiff
          });
          
          // Only show recovery if user was beyond step 2 (package selection)
          const shouldRecover = window.confirm(
            `Continue your ${progress.formData.shootTypeName || 'photoshoot'} from where you left off?`
          );
          
          if (shouldRecover) {
            setFormData(progress.formData);
            setCurrentStep(progress.currentStep);
            console.log('✅ Session recovered:', progress);
          } else {
            // Clear saved progress if user doesn't want to recover
            localStorage.removeItem('radikal_booking_progress');
            console.log('❌ Session recovery declined');
          }
        } else if (hoursDiff >= 2) {
          // Clear expired progress (older than 2 hours)
          localStorage.removeItem('radikal_booking_progress');
          localStorage.removeItem('radikal_session_id');
          console.log('🧹 Cleared expired session progress');
        }
      } catch (error) {
        console.error('Error recovering session:', error);
      }
    }
  }, [setFormData, setCurrentStep, currentStep]);

  return null; // This component doesn't render anything
}