// SIMPLIFIED: src/components/style-journey/Step3PhotoUpload.tsx
'use client';
import { useState, useRef, useEffect } from 'react';

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

export default function Step3PhotoUpload({ formData, setFormData, currentStep, setCurrentStep }: Step3PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(formData.whatsappNumber || '');
  const [isValidNumber, setIsValidNumber] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Required photos based on package
  const requiredPhotos = [
    { type: 'face' as const, label: 'Clear Face Selfie', description: 'Front-facing, good lighting, neutral expression' },
    { type: 'body' as const, label: 'Full Body Photo', description: 'Stand straight, fitted clothes, simple background' }
  ];

  // Validate Ghana WhatsApp number
  useEffect(() => {
    const ghanaRegex = /^\+233[0-9]{9}$/;
    const isValid = ghanaRegex.test(whatsappNumber);
    setIsValidNumber(isValid);
    
    // Save to form data when valid
    if (isValid) {
      setFormData((prev: any) => ({ 
        ...prev, 
        whatsappNumber 
      }));
    }
  }, [whatsappNumber, setFormData]);

  // Format phone number as user types
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on input
    let formatted = '';
    if (digits.startsWith('233')) {
      formatted = '+' + digits;
    } else if (digits.startsWith('0')) {
      formatted = '+233' + digits.slice(1);
    } else {
      formatted = '+' + digits;
    }
    
    // Limit to 12 digits after +233
    if (formatted.length > 13) {
      formatted = formatted.slice(0, 13);
    }
    
    setWhatsappNumber(formatted);
  };

  // Check if all required photos are uploaded
  useEffect(() => {
    const facePhoto = uploadedPhotos.find(photo => photo.type === 'face' && photo.status === 'success');
    const bodyPhoto = uploadedPhotos.find(photo => photo.type === 'body' && photo.status === 'success');
    
    const allValid = facePhoto && bodyPhoto;
    setShowNextButton(!!allValid);
  }, [uploadedPhotos]);

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

  // Process and upload file (simplified - no validation)
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

    setUploadedPhotos(prev => [...prev, newPhoto]);
    setIsUploading(true);

    // Simulate upload process (no validation)
    setTimeout(() => {
      setUploadedPhotos(prev => 
        prev.map(photo => 
          photo.id === photoId 
            ? { ...photo, status: 'success' } 
            : photo
        )
      );
      setIsUploading(false);
    }, 1000); // Shorter delay since no validation
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
      cameraInputRef.current.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          processAndUploadFile(files[0], type);
        }
      };
      cameraInputRef.current.click();
    }
  };

  // Open file picker
  const handleOpenFilePicker = (type: 'face' | 'body') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files && files.length > 0) {
          processAndUploadFile(files[0], type);
        }
      };
      fileInputRef.current.click();
    }
  };

  const handleContinue = () => {
    if (!showNextButton) return;
    
    // Save photos to form data
    setFormData((prev: any) => ({ 
      ...prev, 
      photos: uploadedPhotos 
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
      className="min-h-[70vh] transition-all duration-300 ease-out"
    >
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
      />
      <input
        type="file"
        ref={cameraInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
      />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-2xl">📸</span>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            UPLOAD YOUR STARTING PHOTOS
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          We need these photos to create your perfect look
        </p>
        
        {/* Progress */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm">
            📸 {uploadedPhotos.filter(p => p.status === 'success').length} of {requiredPhotos.length} photos uploaded
          </div>
        </div>
      </div>

      {/* WhatsApp Delivery Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💬</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Get Instant Delivery & Expert Feedback
              </h3>
              <p className="text-gray-600 mb-4">
                Enter your WhatsApp number to receive your photos instantly and get personalized styling tips from our experts
              </p>
              
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+233 00 000 0000"
                    className={`w-full border rounded-xl p-4 pr-12 text-lg font-mono transition-all duration-300 ${
                      isValidNumber 
                        ? 'border-green-500 bg-green-50 focus:ring-2 focus:ring-green-500/20' 
                        : whatsappNumber 
                        ? 'border-red-500 bg-red-50 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isValidNumber ? (
                      <span className="text-green-500 text-2xl">✓</span>
                    ) : whatsappNumber ? (
                      <span className="text-red-500 text-2xl">✗</span>
                    ) : (
                      <span className="text-gray-400 text-2xl">📱</span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  {isValidNumber ? (
                    <span className="text-green-600">✓ Perfect! We'll deliver your photos here</span>
                  ) : whatsappNumber ? (
                    <span className="text-red-600">Please use a valid Ghana number (+233XXXXXXXXX)</span>
                  ) : (
                    <span>Optional - but recommended for instant delivery</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="max-w-4xl mx-auto space-y-8">
        {requiredPhotos.map((reqPhoto, index) => {
          const uploadedPhoto = getUploadedPhoto(reqPhoto.type);
          const isUploaded = !!uploadedPhoto;

          return (
            <div key={reqPhoto.type} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isUploaded ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isUploaded ? '✓' : index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {reqPhoto.label}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {reqPhoto.description}
                    </p>
                  </div>
                </div>
                
                {isUploaded && (
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      ✓ Uploaded
                    </div>
                  </div>
                )}
              </div>

              {/* Content Area */}
              {!isUploaded ? (
                /* Upload Interface */
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#D4AF37] transition-colors">
                  <div className="text-4xl mb-4">📁</div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    Upload your {reqPhoto.type === 'face' ? 'face selfie' : 'full body photo'}
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {reqPhoto.type === 'face' 
                      ? 'Clear front-facing photo with good lighting'
                      : 'Full body shot with simple background'
                    }
                  </p>
                  
                  {/* Upload Methods */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => handleOpenCamera(reqPhoto.type)}
                      className="flex items-center justify-center space-x-2 bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
                    >
                      <span>📱</span>
                      <span>Take Photo</span>
                    </button>
                    
                    <button
                      onClick={() => handleOpenFilePicker(reqPhoto.type)}
                      className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <span>🖼️</span>
                      <span>Choose from Gallery</span>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Supported: JPG, PNG, WebP • Max 10MB
                  </p>
                </div>
              ) : (
                /* Uploaded Preview */
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-green-300">
                        <img 
                          src={uploadedPhoto.preview} 
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Success Message */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h4 className="font-bold text-green-800 mb-2">✅ Photo Uploaded Successfully!</h4>
                        <p className="text-green-700 text-sm">
                          Your {reqPhoto.type === 'face' ? 'face selfie' : 'full body photo'} has been received and is ready for processing.
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRemovePhoto(uploadedPhoto.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-sm"
                        >
                          Remove Photo
                        </button>
                        <button
                          onClick={() => handleOpenFilePicker(reqPhoto.type)}
                          className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm"
                        >
                          Replace Photo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Photo Tips */}
      <div className="max-w-4xl mx-auto mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3 flex items-center">
          💡 Photo Tips for Best Results
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>Front-facing, good natural lighting</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>Neutral expression, face clearly visible</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>Simple, uncluttered background</span>
          </div>
          <div className="flex items-start space-x-2">
            <span>✅</span>
            <span>No sunglasses, hats, or heavy filters</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center space-x-2"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        
        {/* Next Button */}
        {showNextButton && (
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 flex items-center space-x-3"
          >
            <span>Continue to Outfits</span>
            <span className="text-lg animate-bounce">→</span>
          </button>
        )}
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
    </div>
  );
}