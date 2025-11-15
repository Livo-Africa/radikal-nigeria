// Session management for abandonment tracking
export const generateSessionId = (): string => {
  return 'radikal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  
  let sessionId = localStorage.getItem('radikal_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('radikal_session_id', sessionId);
  }
  return sessionId;
};

export const saveProgressToStorage = (formData: any, currentStep: number) => {
  if (typeof window === 'undefined') return;
  
  const progressData = {
    sessionId: getSessionId(),
    formData,
    currentStep,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem('radikal_booking_progress', JSON.stringify(progressData));
};

export const getProgressFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  const progress = localStorage.getItem('radikal_booking_progress');
  return progress ? JSON.parse(progress) : null;
};

export const clearProgressStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('radikal_booking_progress');
};