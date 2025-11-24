// src/hooks/useAbandonmentTracking.ts - LESS AGGRESSIVE
import { useEffect, useRef } from 'react';

export const useAbandonmentTracking = (formData: any, currentStep: number) => {
  const sessionIdRef = useRef<string>('');
  const hasPhoneNumber = formData?.whatsappNumber && formData.whatsappNumber !== '';
  const triggeredRef = useRef<string[]>([]); // Track already triggered reasons
  const lastActionRef = useRef<number>(Date.now());

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
    // Update last action timestamp on any user interaction
    lastActionRef.current = Date.now();
  }, [currentStep, formData]);

  useEffect(() => {
    // Save progress to localStorage - but only after meaningful steps
    if (typeof window !== 'undefined' && currentStep >= 3) { // Only after step 3 (photos)
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
    // FIXED: Prevent duplicate tracking for same reason
    if (triggeredRef.current.includes(reason)) {
      console.log('🔄 Already tracked this abandonment reason:', reason);
      return;
    }

    // FIXED: Only track if user provided phone number AND was beyond step 3
    if (!hasPhoneNumber || currentStep < 3) {
      console.log('❌ NOT TRACKING: No phone or before step 3', {
        hasPhoneNumber,
        currentStep,
        reason
      });
      return;
    }

    // FIXED: Check if user was inactive for more than 2 minutes before tracking
    const timeSinceLastAction = Date.now() - lastActionRef.current;
    if (timeSinceLastAction < 120000) { // 2 minutes
      console.log('⏰ User was active recently, not tracking abandonment');
      return;
    }

    console.log('🔍 TRACKING ABANDONMENT:', {
      reason,
      step: currentStep,
      phone: formData.whatsappNumber,
      sessionId: sessionIdRef.current,
      inactiveTime: timeSinceLastAction
    });

    triggeredRef.current.push(reason);

    try {
      const abandonmentData = {
        sessionId: sessionIdRef.current,
        currentStep,
        formData,
        timestamp: new Date().toISOString(),
        reason,
        inactiveDuration: timeSinceLastAction
      };

      // Use sendBeacon for more reliable tracking during page unload
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(abandonmentData)], { type: 'application/json' });
        const success = navigator.sendBeacon('/api/abandonment/track', blob);
        console.log('📡 SendBeacon result:', success);
      } else {
        // Fallback to fetch
        await fetch('/api/abandonment/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(abandonmentData),
        });
      }

      console.log('✅ Abandonment tracked:', { reason, step: currentStep });
    } catch (error) {
      console.error('❌ Failed to track abandonment:', error);
    }
  };

  // FIXED: Less aggressive detection methods

  // 1. Page Unload Detection - Only track if user was beyond step 3
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasPhoneNumber && currentStep >= 3) {
        trackAbandonment('browser_closed');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasPhoneNumber, currentStep]);

  // 2. Visibility Change - Only track after 2 minutes of inactivity
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && hasPhoneNumber && currentStep >= 3) {
        const timeSinceLastAction = Date.now() - lastActionRef.current;
        if (timeSinceLastAction > 120000) { // 2 minutes
          trackAbandonment('tab_switch_inactivity');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [hasPhoneNumber, currentStep]);

  return {
    trackAbandonment,
    hasPhoneNumber
  };
};