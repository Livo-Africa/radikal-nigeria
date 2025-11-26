// src/components/style-journey/Step4OutfitSelection.tsx - WITH LUCIDE ICONS
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';
import { Shirt, FileText, Sparkles, SkipForward, ArrowRight, ArrowLeft, Check, X, Plus } from 'lucide-react';

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

export default function Step4OutfitSelection({ formData, setFormData, currentStep, setCurrentStep }: Step4OutfitSelectionProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);
  const [outfitDescription, setOutfitDescription] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);
  const router = useRouter();

  // Get outfit slots based on package
  const outfitSlots = formData.package?.outfits || 2;

  // FIXED: Load outfits from localStorage and auto-select browse option
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
              console.log('👗 Loaded outfits from storage:', parsed.outfits.length);
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
      selectedOption === 'browse' && selectedOutfits.length >= outfitSlots ||
      selectedOption === 'describe' && outfitDescription.trim().length > 10 ||
      selectedOption === 'auto' || 
      selectedOption === 'skip';
    
    setShowNextButton(!!canProceed);
  }, [selectedOption, selectedOutfits, outfitDescription, outfitSlots]);

  // FIXED: Navigate to wardrobe (for adding more outfits)
  const handleBrowseWardrobe = () => {
    console.log('🚀 Navigating to wardrobe from step 4');
    
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
      console.log('🚀 Navigating to wardrobe from step 4 - Browse option');
      
      // Save current progress
      const progressData = {
        sessionId: typeof window !== 'undefined' ? localStorage.getItem('radikal_session_id') : null,
        formData,
        currentStep,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('radikal_booking_progress', JSON.stringify(progressData));
      
      router.push(`/wardrobe?returnToStep=4&slots=${outfitSlots}`);
    } else if (option === 'auto') {
      // Auto-select outfits based on shoot type
      const autoSelected = getAutoSelectedOutfits();
      setSelectedOutfits(autoSelected);
      setFormData((prev: any) => ({ ...prev, outfits: autoSelected, autoStyle: true }));
    } else if (option === 'skip') {
      setFormData((prev: any) => ({ ...prev, skipOutfits: true }));
    }
  };

  // Auto-select outfits based on shoot type
  const getAutoSelectedOutfits = (): Outfit[] => {
    const shootType = formData.shootType;
    let category = 'Professional';
    
    switch (shootType) {
      case 'social': category = 'Casual'; break;
      case 'graduation': category = 'Formal'; break;
      case 'birthday': category = 'Creative'; break;
      case 'group': category = 'Casual'; break;
      default: category = 'Professional';
    }
    
    // Sample wardrobe data for auto-selection
    const wardrobeOutfits: Outfit[] = [
      { id: '1', name: 'Navy Business Suit', category: 'Professional', image: '👔', tags: ['formal', 'business', 'professional'] },
      { id: '2', name: 'Grey Executive Suit', category: 'Professional', image: '👔', tags: ['formal', 'executive', 'professional'] },
      { id: '3', name: 'Black Formal Suit', category: 'Professional', image: '👔', tags: ['formal', 'elegant', 'professional'] },
      { id: '4', name: 'Casual Blazer', category: 'Casual', image: '🧥', tags: ['casual', 'smart-casual', 'modern'] },
      { id: '5', name: 'Designer Dress', category: 'Formal', image: '👗', tags: ['elegant', 'formal', 'dress'] },
      { id: '6', name: 'Trendy Streetwear', category: 'Casual', image: '👕', tags: ['casual', 'trendy', 'urban'] },
      { id: '7', name: 'Traditional Kente', category: 'Cultural', image: '🎗️', tags: ['cultural', 'traditional', 'colorful'] },
      { id: '8', name: 'Creative Artistic', category: 'Creative', image: '🎨', tags: ['creative', 'artistic', 'unique'] },
    ];
    
    return wardrobeOutfits
      .filter(outfit => outfit.category === category)
      .slice(0, outfitSlots);
  };

  // Remove single outfit
  const handleRemoveOutfit = (outfitId: string) => {
    const updated = selectedOutfits.filter(o => o.id !== outfitId);
    setSelectedOutfits(updated);
    
    // Update localStorage
    if (updated.length === 0) {
      localStorage.removeItem('radikal_selected_outfits');
    } else {
      localStorage.setItem('radikal_selected_outfits', JSON.stringify({
        outfits: updated,
        selectedAt: new Date().toISOString()
      }));
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedOutfits([]);
    localStorage.removeItem('radikal_selected_outfits');
  };

  const handleContinue = () => {
    if (!showNextButton) return;
    
    // Save selection to form data
    setFormData((prev: any) => ({ 
      ...prev, 
      outfits: selectedOutfits,
      outfitDescription: selectedOption === 'describe' ? outfitDescription : '',
      outfitOption: selectedOption
    }));
    
    // Clear temporary wardrobe storage
    localStorage.removeItem('radikal_selected_outfits');
    
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
    // Track abandonment if user has provided phone number
    if (hasPhoneNumber) {
      trackAbandonment('back_button_step_4');
    }
    
    // Clear temporary wardrobe storage when going back
    localStorage.removeItem('radikal_selected_outfits');
    
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
      className="min-h-[70vh] transition-all duration-300 ease-out"
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
          Tell us your style preference - or skip and we'll style you perfectly
        </p>
        
        {/* Outfit Slots Info */}
        <div className="mt-4 flex justify-center">
          <div className="bg-[#D4AF37]/10 text-[#D4AF37] rounded-full px-4 py-2 text-sm font-semibold flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{outfitSlots} outfit{outfitSlots > 1 ? 's' : ''} available with your {formData.package?.name} package</span>
          </div>
        </div>
      </div>

      {/* Selection Options Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Option 1: Browse Wardrobe */}
        <div 
          onClick={() => handleSelectOption('browse')}
          className={`
            group relative bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
            ${selectedOption === 'browse' 
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent scale-105 shadow-2xl' 
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-xl'
            }
          `}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shirt className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Virtual Wardrobe</h3>
            <p className="text-gray-600 mb-4">
              Choose from 200+ professional outfits in our digital wardrobe
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500 mb-2">
              <span>Real Images</span>
              <span>•</span>
              <span>Search & Filter</span>
              <span>•</span>
              <span>Context-Aware</span>
            </div>
            <div className="text-[#D4AF37] font-semibold flex items-center justify-center space-x-1">
              <span>Select {outfitSlots} outfit{outfitSlots > 1 ? 's' : ''}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
          
          {/* Glow effect for selected */}
          {selectedOption === 'browse' && (
            <div className="absolute inset-0 rounded-2xl bg-[#D4AF37] opacity-10 blur-xl -z-10 animate-pulse"></div>
          )}
        </div>

        {/* Option 2: Describe Style */}
        <div 
          onClick={() => handleSelectOption('describe')}
          className={`
            bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
            ${selectedOption === 'describe' 
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent scale-105 shadow-2xl' 
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-xl'
            }
          `}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FileText className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Describe Your Style</h3>
            <p className="text-gray-600 mb-4">
              Tell us what you're looking for and we'll create the perfect looks
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>Detailed</span>
              <span>•</span>
              <span>Specific</span>
              <span>•</span>
              <span>Custom</span>
            </div>
          </div>
        </div>

        {/* Option 3: Auto Style */}
        <div 
          onClick={() => handleSelectOption('auto')}
          className={`
            bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
            ${selectedOption === 'auto' 
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent scale-105 shadow-2xl' 
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-xl'
            }
          `}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Let Radikal Style You</h3>
            <p className="text-gray-600 mb-4">
              Our expert stylists will choose perfect outfits for your photoshoot
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>Expert Curated</span>
              <span>•</span>
              <span>Fast</span>
              <span>•</span>
              <span>Surprise Me</span>
            </div>
          </div>
        </div>

        {/* Option 4: Skip */}
        <div 
          onClick={() => handleSelectOption('skip')}
          className={`
            bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
            ${selectedOption === 'skip' 
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent scale-105 shadow-2xl' 
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-xl'
            }
          `}
        >
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <SkipForward className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Skip This Step</h3>
            <p className="text-gray-600 mb-4">
              We'll handle everything and create amazing looks for you
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>Trust Experts</span>
              <span>•</span>
              <span>Save Time</span>
              <span>•</span>
              <span>We'll Guide You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Option Content */}
      {selectedOption === 'describe' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg">
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

      {/* Wardrobe Selection Summary */}
      {selectedOption === 'browse' && selectedOutfits.length > 0 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg">
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
        <div className="max-w-2xl mx-auto bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 text-center">
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

      {selectedOption === 'auto' && (
        <div className="max-w-2xl mx-auto bg-green-50 rounded-2xl p-6 border-2 border-green-200 text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Perfect Outfits Selected!</h3>
          <p className="text-green-700 mb-4">
            Based on your {formData.shootTypeName} photoshoot, we've automatically selected {outfitSlots} outfits that will look amazing on you.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-green-600">
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Professionally Curated</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Style-Matched</span>
            </span>
            <span className="flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Perfect Fit Guaranteed</span>
            </span>
          </div>
        </div>
      )}

      {selectedOption === 'skip' && (
        <div className="max-w-2xl mx-auto bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
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
          <ArrowLeft className="w-5 h-5" />
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
            <span>Continue to Styling</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        )}
      </div>

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