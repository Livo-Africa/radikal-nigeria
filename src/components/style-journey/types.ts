// components/style-journey/types.ts
export interface ShootType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface FormData {
  shootType: string | null;
  shootTypeName: string | null;
  package: any | null;
  photos: File[];
  outfits: any[];
  style: any;
  whatsappNumber: string;
  specialRequests: string;
  addOns: string[];
  total: number;
}

// ADDED: Common interface for all step components
export interface StepComponentProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}