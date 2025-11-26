// components/style-journey/Step3PhotoUpload.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle, X, AlertCircle, ArrowRight } from 'lucide-react';
import PhoneInput from '@/components/shared/PhoneInput';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const requiredPhotos = [
    { type: 'face' as const, label: 'Face Photo', description: 'Clear front selfie' },
    { type: 'body' as const, label: 'Body Photo', description: 'Full body shot' }
  ];

  // Validate phone number (basic validation)
  useEffect(() => {
    const isValid = whatsappNumber.length >= 10; // Basic length check
    if (isValid) {
      setFormData((prev: any) => ({ 
        ...prev, 
        whatsappNumber 
      }));
    }
  }, [whatsappNumber, setFormData]);

  // Check if all required photos are uploaded
  useEffect(() => {
    const facePhoto = uploadedPhotos.find(photo => photo.type === 'face' && photo.status === 'success');
    const bodyPhoto = uploadedPhotos.find(photo => photo.type === 'body' && photo.status === 'success');
    const allValid = facePhoto && bodyPhoto && whatsappNumber.length >= 10;
    setShowNextButton(!!allValid);
  }, [uploadedPhotos, whatsappNumber]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'body') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      processAndUploadFile(file, type);
    });

    event.target.value = '';
  };

  const processAndUploadFile = (file: File, type: 'face' | 'body') => {
    const photoId = Date.now().toString();
    const previewUrl = URL.createObjectURL(file);

    const newPhoto: UploadedPhoto = {
      id: photoId,
      file,
      preview: previewUrl,
      type,
      status: 'uploading'
    };

    setUploadedPhotos(prev => [...prev, newPhoto]);
    setIsUploading(true);

    // Simulate upload
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

  const handleRemovePhoto = (photoId: string) => {
    setUploadedPhotos(prev => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

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
    
    setFormData((prev: any) => ({ 
      ...prev, 
      photos: uploadedPhotos 
    }));
    
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  const getUploadedPhoto = (type: 'face' | 'body') => {
    return uploadedPhotos.find(photo => photo.type === type && photo.status === 'success');
  };

  return (
    <div className="min-h-[70vh] pt-4 lg:pt-0">
      {/* Hidden file inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Camera className="w-6 h-6 text-[#D4AF37]" />
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
            Upload Photos
          </h1>
        </div>
        
        {/* Progress */}
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full px-4 py-2 text-sm">
            {uploadedPhotos.filter(p => p.status === 'success').length} of {requiredPhotos.length} photos
          </div>
        </div>
      </div>

      {/* WhatsApp Delivery - Simplified */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                Delivery & Support
              </h3>
              
              <PhoneInput
                value={whatsappNumber}
                onChange={setWhatsappNumber}
                placeholder="Enter your number"
                className="mb-3"
              />
              
              <p className="text-blue-700 text-xs lg:text-sm">
                We'll deliver your photos here and provide expert support
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Sections */}
      <div className="max-w-4xl mx-auto space-y-4 px-2">
        {requiredPhotos.map((reqPhoto, index) => {
          const uploadedPhoto = getUploadedPhoto(reqPhoto.type);
          const isUploaded = !!uploadedPhoto;

          return (
            <div key={reqPhoto.type} className="bg-white rounded-xl p-4 border border-gray-200">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isUploaded ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {isUploaded ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm lg:text-base">
                      {reqPhoto.label}
                    </h3>
                    <p className="text-gray-600 text-xs hidden lg:block">
                      {reqPhoto.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              {!isUploaded ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#D4AF37] transition-colors">
                  <div className="text-2xl mb-2">📸</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">
                    Upload {reqPhoto.type === 'face' ? 'face selfie' : 'body photo'}
                  </h4>
                  
                  {/* Upload Methods */}
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => handleOpenCamera(reqPhoto.type)}
                      className="flex items-center justify-center space-x-2 bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors text-sm"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>
                    
                    <button
                      onClick={() => handleOpenFilePicker(reqPhoto.type)}
                      className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Choose File</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-green-300">
                        <img 
                          src={uploadedPhoto.preview} 
                          alt="Uploaded preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Success Message */}
                    <div className="flex-1">
                      <div className="mb-2">
                        <h4 className="font-bold text-green-800 mb-1 text-sm">Photo Uploaded</h4>
                        <p className="text-green-700 text-xs">
                          Your {reqPhoto.type} photo is ready
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRemovePhoto(uploadedPhoto.id)}
                          className="text-red-600 hover:text-red-800 font-semibold text-xs flex items-center space-x-1"
                        >
                          <X className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                        <button
                          onClick={() => handleOpenFilePicker(reqPhoto.type)}
                          className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-xs flex items-center space-x-1"
                        >
                          <Upload className="w-3 h-3" />
                          <span>Replace</span>
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

      {/* Photo Tips - Simplified */}
      <div className="max-w-4xl mx-auto mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-2 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          Tips for Best Results
        </h3>
        <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Good natural lighting</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Face clearly visible</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>Simple background</span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2 text-sm"
        >
          <span>←</span>
          <span>Back</span>
        </button>
        
        {showNextButton && (
          <button
            onClick={handleContinue}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2 text-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}