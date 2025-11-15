import { useEffect, useRef } from 'react';

export const useAbandonmentTracking = (formData: any, currentStep: number) => {
  const sessionIdRef = useRef<string>('');
  const hasPhoneNumber = formData?.whatsappNumber && formData.whatsappNumber !== '';

  useEffect(() => {
    // Initialize session ID
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('radikal_session_id');
      if (!sessionId) {
        sessionId = 'radikal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('radikal_session_id', sessionId);
      }
      sessionIdRef.current = sessionId;
    }
  }, []);

  useEffect(() => {
    // Save progress to localStorage
    if (typeof window !== 'undefined' && currentStep >= 1) {
      const progressData = {
        sessionId: sessionIdRef.current,
        formData,
        currentStep,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('radikal_booking_progress', JSON.stringify(progressData));
    }
  }, [formData, currentStep]);

  const trackAbandonment = async (reason: string = 'user_navigation') => {
    // Only track if user provided phone number (after Step 3)
    if (!hasPhoneNumber || currentStep < 3) return;

    try {
      const abandonmentData = {
        sessionId: sessionIdRef.current,
        currentStep,
        formData,
        timestamp: new Date().toISOString(),
        reason
      };

      // Use sendBeacon for more reliable tracking during page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(abandonmentData)], { type: 'application/json' });
        navigator.sendBeacon('/api/abandonment/track', blob);
      } else {
        // Fallback to fetch
        await fetch('/api/abandonment/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(abandonmentData),
        });
      }

      console.log('📊 Abandonment tracked:', { reason, step: currentStep });
    } catch (error) {
      console.error('Failed to track abandonment:', error);
    }
  };

  // Track page unload (user closes tab/browser)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasPhoneNumber && currentStep >= 3 && currentStep < 7) {
        trackAbandonment('page_unload');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasPhoneNumber, currentStep]);

  return {
    trackAbandonment,
    sessionId: sessionIdRef.current,
    hasPhoneNumber
  };
};