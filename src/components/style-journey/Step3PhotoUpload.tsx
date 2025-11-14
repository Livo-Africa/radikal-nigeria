// components/style-journey/Step3PhotoUpload.tsx
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
  validation: {
    hasFace: boolean;
    isClear: boolean;
    goodLighting: boolean;
    fullBodyVisible?: boolean;
  };
}

export default function Step3PhotoUpload({ formData, setFormData, currentStep, setCurrentStep }: Step3PhotoUploadProps) {
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Required photos based on package
  const requiredPhotos = [
    { type: 'face' as const, label: 'Clear Face Selfie', description: 'Front-facing, good lighting, neutral expression' },
    { type: 'body' as const, label: 'Full Body Photo', description: 'Stand straight, fitted clothes, simple background' }
  ];

  // Check if all required photos are uploaded and validated
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
      processAndValidateFile(file, type);
    });

    // Reset input
    event.target.value = '';
  };

  // Process and validate uploaded file
  const processAndValidateFile = (file: File, type: 'face' | 'body') => {
    const photoId = Date.now().toString();
    const previewUrl = URL.createObjectURL(file);

    // Create initial photo object
    const newPhoto: UploadedPhoto = {
      id: photoId,
      file,
      preview: previewUrl,
      type,
      status: 'uploading',
      validation: {
        hasFace: false,
        isClear: false,
        goodLighting: false,
        fullBodyVisible: type === 'body' ? false : undefined
      }
    };

    setUploadedPhotos(prev => [...prev, newPhoto]);
    setIsUploading(true);

    // Simulate upload and validation process
    setTimeout(() => {
      validatePhoto(newPhoto, file).then(validation => {
        setUploadedPhotos(prev => 
          prev.map(photo => 
            photo.id === photoId 
              ? { ...photo, status: 'success', validation } 
              : photo
          )
        );
        setIsUploading(false);
      });
    }, 1500);
  };

  // Simple photo validation (simulated - in real app, this would use AI/ML)
  const validatePhoto = async (photo: UploadedPhoto, file: File): Promise<UploadedPhoto['validation']> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Simulate validation checks
        const validation: UploadedPhoto['validation'] = {
          hasFace: Math.random() > 0.3, // 70% chance of "face detected"
          isClear: file.size > 50000, // Basic file size check
          goodLighting: Math.random() > 0.4, // 60% chance of good lighting
          fullBodyVisible: photo.type === 'body' ? Math.random() > 0.3 : undefined
        };
        resolve(validation);
      };
      img.src = photo.preview;
    });
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
          processAndValidateFile(files[0], type);
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
          processAndValidateFile(files[0], type);
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

  // Get validation score for progress
  const getValidationScore = (validation: UploadedPhoto['validation']) => {
    const checks = Object.values(validation).filter(v => typeof v === 'boolean');
    const passed = checks.filter(v => v).length;
    return (passed / checks.length) * 100;
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

      {/* Upload Sections */}
      <div className="max-w-4xl mx-auto space-y-8">
        {requiredPhotos.map((reqPhoto, index) => {
          const uploadedPhoto = getUploadedPhoto(reqPhoto.type);
          const isUploaded = !!uploadedPhoto;
          const validationScore = uploadedPhoto ? getValidationScore(uploadedPhoto.validation) : 0;

          return (
            <div key={reqPhoto.type} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${isUploaded ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
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
                    <div className="text-xs text-gray-500">
                      {validationScore.toFixed(0)}% quality
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
                    
                    {/* Validation Results */}
                    <div className="flex-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {Object.entries(uploadedPhoto.validation).map(([key, value]) => {
                          if (typeof value !== 'boolean') return null;
                          
                          const labels: Record<string, string> = {
                            hasFace: 'Face detected',
                            isClear: 'Clear image',
                            goodLighting: 'Good lighting',
                            fullBodyVisible: 'Full body visible'
                          };
                          
                          return (
                            <div key={key} className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                value ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {value ? '✓' : '✗'}
                              </div>
                              <span className={`text-sm ${
                                value ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {labels[key] || key}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Quality Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">Photo Quality</span>
                          <span className="font-semibold">{validationScore.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              validationScore > 70 ? 'bg-green-500' : 
                              validationScore > 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${validationScore}%` }}
                          ></div>
                        </div>
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
          className="
            bg-gray-600 text-white font-bold py-4 px-6 
            rounded-2xl shadow-xl 
            transform transition-all duration-300 
            hover:scale-105 hover:shadow-2xl
            active:scale-95
            flex items-center space-x-2
          "
        >
          <span>←</span>
          <span>Back</span>
        </button>
        
        {/* Next Button */}
        {showNextButton && (
          <button
            onClick={handleContinue}
            className="
              bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] 
              text-white font-bold py-4 px-8 
              rounded-2xl shadow-2xl 
              transform transition-all duration-300 
              hover:scale-105 hover:shadow-3xl
              active:scale-95
              flex items-center space-x-3
            "
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
            <h3 className="font-bold text-lg mb-2">Processing Your Photo</h3>
            <p className="text-gray-600">Validating image quality and requirements...</p>
          </div>
        </div>
      )}
    </div>
  );
}