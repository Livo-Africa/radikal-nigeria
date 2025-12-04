// src/components/style-journey/Step4OutfitSelection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';
import { Shirt, FileText, Upload, SkipForward, ArrowRight, ArrowLeft, Check, X, Plus, Camera, Trash2 } from 'lucide-react';
import StickyActionButtons from '../shared/StickyActionButtons';

interface Step4OutfitSelectionProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface Outfit {
  id: string;
  name: string;
  category: string;
  image: string;
  tags: string[];
}

interface UploadedOutfit {
  id: string;
  file: File;
  preview: string;
}

export default function Step4OutfitSelection({ formData, setFormData, currentStep, setCurrentStep }: Step4OutfitSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);
  const [uploadedOutfits, setUploadedOutfits] = useState<UploadedOutfit[]>([]);
  const [outfitDescription, setOutfitDescription] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);
  const router = useRouter();

  // Get outfit slots based on package
  const outfitSlots = formData.package?.outfits || 2;

  // Load outfits from localStorage and auto-select browse option
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('radikal_selected_outfits');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.outfits && Array.isArray(parsed.outfits)) {
            setSelectedOutfits(parsed.outfits);

            // Auto-select browse option if we have outfits
            if (parsed.outfits.length > 0) {
              setSelectedOption('browse');
            }
          }
        } catch (error) {
          console.error('Error loading saved outfits:', error);
        }
      }
    }
  }, []);

  // Check if we can proceed
  useEffect(() => {
    const canProceed =
      (selectedOption === 'browse' && selectedOutfits.length >= outfitSlots) ||
      (selectedOption === 'describe' && outfitDescription.trim().length > 10) ||
      (selectedOption === 'upload' && uploadedOutfits.length > 0) ||
      selectedOption === 'skip';

    setShowNextButton(!!canProceed);
  }, [selectedOption, selectedOutfits, outfitDescription, uploadedOutfits, outfitSlots]);

  // Navigate to wardrobe (for adding more outfits)
  const handleBrowseWardrobe = () => {
    // Save current progress
    const progressData = {
      sessionId: typeof window !== 'undefined' ? localStorage.getItem('radikal_session_id') : null,
      formData,
      currentStep,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('radikal_booking_progress', JSON.stringify(progressData));

    // Navigate to wardrobe with step 4 as return point
    router.push(`/wardrobe?returnToStep=4&slots=${outfitSlots}`);
  };

  // Handle option selection
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);

    if (option === 'browse') {
      // If browsing, check if we need to navigate or just show selected
      if (selectedOutfits.length === 0) {
        handleBrowseWardrobe();
      }
    } else if (option === 'skip') {
      setFormData((prev: any) => ({ ...prev, skipOutfits: true }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const newOutfit: UploadedOutfit = {
        id: Date.now().toString() + Math.random().toString(),
        file,
        preview: URL.createObjectURL(file)
      };
      setUploadedOutfits(prev => [...prev, newOutfit]);
    });

    // Reset input
    event.target.value = '';
  };

  const handleRemoveUploadedOutfit = (id: string) => {
    setUploadedOutfits(prev => {
      const filtered = prev.filter(o => o.id !== id);
      // Revoke URL to avoid memory leaks
      const removed = prev.find(o => o.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  // Remove single selected outfit
  const handleRemoveOutfit = (outfitId: string) => {
    const updated = selectedOutfits.filter(o => o.id !== outfitId);
    setSelectedOutfits(updated);

    // Update localStorage
    if (updated.length === 0) {
      localStorage.removeItem('radikal_selected_outfits');
    } else {
      localStorage.setItem('radikal_selected_outfits', JSON.stringify({ outfits: updated }));
    }
  };

  const handleClearAll = () => {
    setSelectedOutfits([]);
    localStorage.removeItem('radikal_selected_outfits');
  };

  const handleContinue = () => {
    // Save data to form
    setFormData((prev: any) => ({
      ...prev,
      outfits: selectedOption === 'browse' ? selectedOutfits : [],
      uploadedOutfits: selectedOption === 'upload' ? uploadedOutfits : [],
      outfitDescription: selectedOption === 'describe' ? outfitDescription : '',
      skipOutfits: selectedOption === 'skip'
    }));

    // Smooth transition
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(5);
    }, 200);
  };

  const handleBack = () => {
    if (hasPhoneNumber) {
      trackAbandonment('back_button_step_4');
    }

    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(3);
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out pb-32"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Shirt className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            CHOOSE YOUR OUTFITS
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Your package includes <strong>{outfitSlots} outfits</strong>. How would you like to select them?
        </p>
      </div>

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-4xl mx-auto">
        {/* Option 1: Browse Wardrobe */}
        <div
          onClick={() => handleSelectOption('browse')}
          className={`
            border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center
            ${selectedOption === 'browse'
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent shadow-lg scale-105'
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:shadow-md'
            }
          `}
        >
          <div className="flex justify-center mb-4">
            <Shirt className={`w-12 h-12 ${selectedOption === 'browse' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Wardrobe</h3>
          <p className="text-gray-600 mb-4">
            Explore our digital collection and pick your favorites
          </p>
          {selectedOption === 'browse' && (
            <div className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
              SELECTED
            </div>
          )}
        </div>

        {/* Option 2: Describe It */}
        <div
          onClick={() => handleSelectOption('describe')}
          className={`
            border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center
            ${selectedOption === 'describe'
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent shadow-lg scale-105'
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:shadow-md'
            }
          `}
        >
          <div className="flex justify-center mb-4">
            <FileText className={`w-12 h-12 ${selectedOption === 'describe' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Describe It</h3>
          <p className="text-gray-600 mb-4">
            Tell us what you have in mind and we'll find it
          </p>
          {selectedOption === 'describe' && (
            <div className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
              SELECTED
            </div>
          )}
        </div>

        {/* Option 3: Upload Your Own (Replaces Auto-Select) */}
        <div
          onClick={() => handleSelectOption('upload')}
          className={`
            border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center
            ${selectedOption === 'upload'
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent shadow-lg scale-105'
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:shadow-md'
            }
          `}
        >
          <div className="flex justify-center mb-4">
            <Upload className={`w-12 h-12 ${selectedOption === 'upload' ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Your Own</h3>
          <p className="text-gray-600 mb-4">
            Have your own outfits? Upload photos here
          </p>
          {selectedOption === 'upload' && (
            <div className="bg-[#D4AF37] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
              SELECTED
            </div>
          )}
        </div>

        {/* Option 4: Skip */}
        <div
          onClick={() => handleSelectOption('skip')}
          className={`
            border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 text-center
            ${selectedOption === 'skip'
              ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
            }
          `}
        >
          <div className="flex justify-center mb-4">
            <SkipForward className={`w-12 h-12 ${selectedOption === 'skip' ? 'text-blue-500' : 'text-gray-500'}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Skip This Step</h3>
          <p className="text-gray-600 mb-4">
            We'll handle everything and create amazing looks for you
          </p>
          {selectedOption === 'skip' && (
            <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
              EASIEST
            </div>
          )}
        </div>
      </div>

      {/* Selected Option Content */}
      {selectedOption === 'describe' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg animate-fadeIn">
          <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
            <FileText className="w-6 h-6 text-[#D4AF37]" />
            <span>Describe Your Preferred Style</span>
          </h3>
          <textarea
            value={outfitDescription}
            onChange={(e) => setOutfitDescription(e.target.value)}
            placeholder="Tell us about your style preferences... (e.g., 'I prefer professional business attire in navy and grey tones', 'I like casual and trendy streetwear with bold colors', 'Looking for elegant evening wear for a special occasion')"
            className="w-full h-32 border border-gray-300 rounded-xl p-4 text-sm resize-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
          />
          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4 text-green-500" />
              <span>Be as specific as possible for best results</span>
            </span>
            <span className={outfitDescription.length > 10 ? 'text-green-600 flex items-center space-x-1' : 'text-gray-400 flex items-center space-x-1'}>
              {outfitDescription.length > 10 ? <Check className="w-4 h-4" /> : <span>•</span>}
              <span>{outfitDescription.length > 10 ? 'Ready to continue' : 'Minimum 10 characters'}</span>
            </span>
          </div>
        </div>
      )}

      {selectedOption === 'browse' && selectedOutfits.length > 0 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Check className="w-6 h-6 text-green-500" />
              <span>Outfits Selected ({selectedOutfits.length}/{outfitSlots})</span>
            </h3>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center space-x-1"
            >
              <X className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {selectedOutfits.map((outfit) => (
              <div key={outfit.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{outfit.image}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{outfit.name}</div>
                    <div className="text-sm text-gray-500">{outfit.category}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOutfit(outfit.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>

          {selectedOutfits.length < outfitSlots && (
            <div className="text-center">
              <button
                onClick={handleBrowseWardrobe}
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add more outfits</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {selectedOption === 'browse' && selectedOutfits.length === 0 && (
        <div className="max-w-2xl mx-auto bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 text-center animate-fadeIn">
          <div className="flex justify-center mb-4">
            <Shirt className="w-12 h-12 text-yellow-600" />
          </div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Ready to Browse Outfits?</h3>
          <p className="text-yellow-700 mb-4">
            You haven't selected any outfits yet. Visit our virtual wardrobe to choose {outfitSlots} outfit{outfitSlots > 1 ? 's' : ''} for your photoshoot.
          </p>
          <button
            onClick={handleBrowseWardrobe}
            className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#b8941f] transition-colors flex items-center space-x-2 mx-auto"
          >
            <Shirt className="w-5 h-5" />
            <span>Open Virtual Wardrobe</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {selectedOption === 'upload' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg animate-fadeIn">
          <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center space-x-2">
            <Upload className="w-6 h-6 text-[#D4AF37]" />
            <span>Upload Your Outfits</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {uploadedOutfits.map((outfit) => (
              <div key={outfit.id} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                <img src={outfit.preview} alt="Uploaded outfit" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleRemoveUploadedOutfit(outfit.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 font-medium">Add Photo</span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
            multiple
          />

          <div className="text-center text-sm text-gray-500">
            <p>Upload photos of the outfits you plan to bring.</p>
            <p className="mt-1">
              {uploadedOutfits.length > 0
                ? `${uploadedOutfits.length} outfit${uploadedOutfits.length > 1 ? 's' : ''} uploaded`
                : 'Please upload at least one outfit to continue'
              }
            </p>
          </div>
        </div>
      )}

      {selectedOption === 'skip' && (
        <div className="max-w-2xl mx-auto bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 text-center animate-fadeIn">
          <div className="flex justify-center mb-4">
            <SkipForward className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-blue-800 mb-2">We've Got You Covered!</h3>
          <p className="text-blue-700 mb-4">
            Our expert stylists will choose the perfect outfits for your {formData.shootTypeName} photoshoot. Just focus on looking great!
          </p>
          <div className="flex justify-center space-x-4 text-sm text-blue-600">
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Expert Guidance</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Time Saved</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Surprise Element</span>
            </span>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <StickyActionButtons
        onBack={handleBack}
        onNext={handleContinue}
        nextLabel="Continue to Styling"
        showNext={showNextButton}
      />

      {/* Progress Helper */}
      {selectedOption === 'browse' && selectedOutfits.length > 0 && selectedOutfits.length < outfitSlots && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-center">
          <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Select {outfitSlots - selectedOutfits.length} more outfit{outfitSlots - selectedOutfits.length > 1 ? 's' : ''} to continue</span>
          </div>
        </div>
      )}
    </div>
  );
}