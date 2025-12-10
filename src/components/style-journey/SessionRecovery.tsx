// src/components/style-journey/SessionRecovery.tsx - COMPLETE UPDATED FILE
'use client';
import { useEffect, useRef } from 'react';

interface SessionRecoveryProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

export default function SessionRecovery({ formData, setFormData, currentStep, setCurrentStep }: SessionRecoveryProps) {
  const hasAttemptedRecovery = useRef(false);

  useEffect(() => {
    // Only attempt recovery ONCE on mount (when we start at step 1)
    if (currentStep !== 1 || hasAttemptedRecovery.current) return;

    hasAttemptedRecovery.current = true;

    const savedProgress = localStorage.getItem('radikal_booking_progress');

    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const lastUpdated = new Date(progress.lastUpdated);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

        // Only restore if within 24 hours and progress exists
        if (hoursDiff < 24 && progress.currentStep > 1) {
          // SILENT AUTO-RESTORE
          setFormData(progress.formData);
          setCurrentStep(progress.currentStep);
          console.log('🔄 Session auto-recovered to step:', progress.currentStep);
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

  return null;
}