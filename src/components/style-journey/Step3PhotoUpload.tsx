// src/components/style-journey/Step3PhotoUpload.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';

import { Camera, Upload, Check, X, AlertCircle, ArrowLeft, MessageCircle, ChevronDown } from 'lucide-react';
import StickyActionButtons from '../shared/StickyActionButtons';

interface Step3PhotoUploadProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  type: 'face' | 'body';
  status: 'uploading' | 'success' | 'error';
}

const countryCodes = [
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
];

export default function Step3PhotoUpload({ formData, setFormData, currentStep, setCurrentStep }: Step3PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>(formData.photos || []);
  const [isUploading, setIsUploading] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  // Split phone number into code and local part for UI
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCodes[0].code);
  const [localPhoneNumber, setLocalPhoneNumber] = useState('');

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);

  // Initialize phone number from formData if exists
  useEffect(() => {
    if (formData.whatsappNumber) {
      // Try to find matching country code
      const match = countryCodes.find(c => formData.whatsappNumber.startsWith(c.code));
      if (match) {
        setSelectedCountryCode(match.code);
        setLocalPhoneNumber(formData.whatsappNumber.replace(match.code, ''));
      } else {
        setLocalPhoneNumber(formData.whatsappNumber);
      }
    }
  }, []); // Run once on mount

  // Required photos based on package
  const requiredPhotos = [
    { type: 'face' as const, label: 'Clear Face Selfie', description: 'Front-facing, good lighting, neutral expression', icon: '👤' },
    { type: 'body' as const, label: 'Full Body Photo', description: 'Stand straight, fitted clothes, simple background', icon: '🧍' }
  ];

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const number = e.target.value.replace(/[^0-9]/g, '');
    setLocalPhoneNumber(number);
    updateFormData(selectedCountryCode, number);
  };

  const handleCountrySelect = (code: string) => {
    setSelectedCountryCode(code);
    setIsCountryDropdownOpen(false);
    updateFormData(code, localPhoneNumber);
  };

  const updateFormData = (code: string, number: string) => {
    const fullNumber = code + number;

    // Save to form data when valid (basic validation: code + at least 7 digits)
    if (number.length >= 7) {
      setFormData((prev: any) => ({
        ...prev,
        whatsappNumber: fullNumber
      }));
    }
  };

  // Check if all required photos are uploaded
  useEffect(() => {
    const facePhoto = uploadedPhotos.find(photo => photo.type === 'face' && photo.status === 'success');
    const bodyPhoto = uploadedPhotos.find(photo => photo.type === 'body' && photo.status === 'success');

    const allValid = !!(facePhoto && bodyPhoto && localPhoneNumber.length >= 7);
    setShowNextButton(allValid);
  }, [uploadedPhotos, localPhoneNumber]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'body') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      processAndUploadFile(file, type);
    });

    // Reset input
    event.target.value = '';
  };

  // Process and upload file
  const processAndUploadFile = (file: File, type: 'face' | 'body') => {
    const photoId = Date.now().toString();
    const previewUrl = URL.createObjectURL(file);

    // Create initial photo object
    const newPhoto: UploadedPhoto = {
      id: photoId,
      file,
      preview: previewUrl,
      type,
      status: 'uploading'
    };

    setUploadedPhotos(prev => {
      // Remove existing photo of same type if any
      const filtered = prev.filter(p => p.type !== type);
      return [...filtered, newPhoto];
    });

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      setUploadedPhotos(prev =>
        prev.map(photo =>
          photo.id === photoId
            ? { ...photo, status: 'success' }
            : photo
        )
      );
      setIsUploading(false);
    }, 1000);
  };

  // Remove photo
  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  // Open camera
  const handleOpenCamera = (type: 'face' | 'body') => {
    if (cameraInputRef.current) {
      cameraInputRef.current.setAttribute('capture', 'environment');
      cameraInputRef.current.accept = 'image/*';

      const handleCameraChange = (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          processAndUploadFile(files[0], type);
        }
        cameraInputRef.current?.removeEventListener('change', handleCameraChange);
      };

      cameraInputRef.current.addEventListener('change', handleCameraChange);
      cameraInputRef.current.click();
    }
  };

  // Open file picker
  const handleOpenFilePicker = (type: 'face' | 'body') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';

      const handleFileChange = (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          processAndUploadFile(files[0], type);
        }
        fileInputRef.current?.removeEventListener('change', handleFileChange);
      };

      fileInputRef.current.addEventListener('change', handleFileChange);
      fileInputRef.current.click();
    }
  };

  const handleContinue = () => {
    if (!showNextButton) return;

    // Ensure final save of photos
    setFormData((prev: any) => ({
      ...prev,
      photos: uploadedPhotos,
      whatsappNumber: selectedCountryCode + localPhoneNumber
    }));

    // Smooth transition
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(4);
    }, 200);
  };

  const handleBack = () => {
    if (hasPhoneNumber) {
      trackAbandonment('back_button_step_3');
    }

    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(2);
    }, 200);
  };

  // Get uploaded photo for a specific type
  const getUploadedPhoto = (type: 'face' | 'body') => {
    return uploadedPhotos.find(photo => photo.type === type && photo.status === 'success');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:min-h-[70vh] transition-all duration-300 ease-out pb-32"
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
      />

      {/* Desktop Header */}
      <div className="hidden lg:block text-center mb-8 pt-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Camera className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            UPLOAD YOUR STARTING PHOTOS
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          We need a current photo to help us style you perfectly
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Phone Number Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
            <span>Your WhatsApp Number</span>
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            We'll send your edited photos here. Make sure it's correct!
          </p>

          <div className="flex space-x-2">
            {/* Country Code Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="h-full px-4 py-4 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center space-x-2 min-w-[100px] justify-between hover:border-[#D4AF37] transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{countryCodes.find(c => c.code === selectedCountryCode)?.flag}</span>
                  <span className="font-semibold text-gray-700">{selectedCountryCode}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-64 overflow-y-auto">
                  {countryCodes.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => handleCountrySelect(country.code)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 text-left transition-colors border-b border-gray-50 last:border-0"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <span className="font-medium text-gray-900">{country.country}</span>
                      <span className="text-sm text-gray-500 ml-auto">{country.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Local Number Input */}
            <input
              type="tel"
              value={localPhoneNumber}
              onChange={handlePhoneChange}
              placeholder="20 123 4567"
              className="flex-1 text-lg p-4 border-2 border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all"
            />
          </div>
        </div>

        {/* Photo Upload Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {requiredPhotos.map((req) => {
            const uploaded = getUploadedPhoto(req.type);

            return (
              <div key={req.type} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{req.icon}</span>
                    <h3 className="font-bold text-gray-900">{req.label}</h3>
                  </div>
                  {uploaded && (
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>UPLOADED</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-500 text-sm mb-4">{req.description}</p>

                {uploaded ? (
                  <div className="relative rounded-xl overflow-hidden aspect-[3/4] group">
                    <img src={uploaded.preview} alt={req.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemovePhoto(uploaded.id)}
                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleOpenCamera(req.type)}
                      className="w-full bg-[#D4AF37] text-white font-bold py-3 rounded-xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={() => handleOpenFilePicker(req.type)}
                      className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload from Gallery</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Photo Tips */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>Photo Tips for Best Results</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Front-facing, good natural lighting</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Neutral expression, face clearly visible</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Simple, uncluttered background</span>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>No sunglasses, hats, or heavy filters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto mb-4"></div>
            <h3 className="font-bold text-lg mb-2">Uploading Your Photo</h3>
            <p className="text-gray-600">Please wait while we process your photo...</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <StickyActionButtons
        onBack={handleBack}
        onNext={handleContinue}
        nextLabel="Continue to Outfits"
        showNext={showNextButton}
      />
    </div>
  );
}