// components/style-journey/Step4OutfitSelection.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';

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
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);

  // Get outfit slots based on package
  const outfitSlots = formData.package?.outfits || 2;

  // Sample wardrobe data
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

  // FIXED: Use Array.from instead of spread operator with Set
  const categories = ['All', ...Array.from(new Set(wardrobeOutfits.map(o => o.category)))];

  // ... rest of the component remains EXACTLY the same ...
  // Check if we can proceed
  useEffect(() => {
    const canProceed = 
      selectedOption === 'browse' && selectedOutfits.length >= outfitSlots ||
      selectedOption === 'describe' && outfitDescription.trim().length > 10 ||
      selectedOption === 'auto' || 
      selectedOption === 'skip';
    
    setShowNextButton(!!canProceed);
  }, [selectedOption, selectedOutfits, outfitDescription, outfitSlots]);

  // Handle option selection
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    
    if (option === 'browse') {
      setShowWardrobeModal(true);
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
    
    return wardrobeOutfits
      .filter(outfit => outfit.category === category)
      .slice(0, outfitSlots);
  };

  // Wardrobe selection handlers
  const handleSelectOutfit = (outfit: Outfit) => {
    if (selectedOutfits.find(o => o.id === outfit.id)) {
      // Remove if already selected
      setSelectedOutfits(prev => prev.filter(o => o.id !== outfit.id));
    } else if (selectedOutfits.length < outfitSlots) {
      // Add if within slot limit
      setSelectedOutfits(prev => [...prev, outfit]);
    }
  };

  const handleRemoveOutfit = (outfitId: string) => {
    setSelectedOutfits(prev => prev.filter(o => o.id !== outfitId));
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
    trackAbandonment('navigated_back_from_step_4');
  }
  
  if (containerRef.current) {
    containerRef.current.style.opacity = '0.9';
    containerRef.current.style.transform = 'scale(0.98)';
  }
  
  setTimeout(() => {
    setCurrentStep(3);
  }, 200);
};

  // Filter outfits by category
  const [activeFilter, setActiveFilter] = useState('All');
  const filteredOutfits = activeFilter === 'All' 
    ? wardrobeOutfits 
    : wardrobeOutfits.filter(outfit => outfit.category === activeFilter);

  return (
    <div 
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-2xl">👗</span>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            CHOOSE YOUR OUTFITS
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Tell us your style preference - or skip and we'll style you perfectly
        </p>
        
        {/* Outfit Slots Info */}
        <div className="mt-4 flex justify-center">
          <div className="bg-[#D4AF37]/10 text-[#D4AF37] rounded-full px-4 py-2 text-sm font-semibold">
            🎯 {outfitSlots} outfit{outfitSlots > 1 ? 's' : ''} available with your {formData.package?.name} package
          </div>
        </div>
      </div>

      {/* Selection Options Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Option 1: Browse Wardrobe */}
        <div 
          onClick={() => handleSelectOption('browse')}
          className={`
            bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 transform
            ${selectedOption === 'browse' 
              ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent scale-105 shadow-2xl' 
              : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-xl'
            }
          `}
        >
          <div className="text-center">
            <div className="text-5xl mb-4">👔</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Our Wardrobe</h3>
            <p className="text-gray-600 mb-4">
              Choose from 200+ professional outfits curated by our stylists
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>👔 Professional</span>
              <span>👗 Formal</span>
              <span>👕 Casual</span>
            </div>
          </div>
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
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Describe Your Style</h3>
            <p className="text-gray-600 mb-4">
              Tell us what you're looking for and we'll create the perfect looks
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>💬 Detailed</span>
              <span>🎯 Specific</span>
              <span>✨ Custom</span>
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
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Let Radikal Style You</h3>
            <p className="text-gray-600 mb-4">
              Our expert stylists will choose perfect outfits for your photoshoot
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>🤖 AI-Powered</span>
              <span>⭐ Expert Curated</span>
              <span>🚀 Fast</span>
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
            <div className="text-5xl mb-4">⏭️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Skip This Step</h3>
            <p className="text-gray-600 mb-4">
              We'll handle everything and create amazing looks for you
            </p>
            <div className="flex justify-center space-x-2 text-sm text-gray-500">
              <span>🎯 Trust Experts</span>
              <span>⚡ Save Time</span>
              <span>✨ Surprise Me</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Option Content */}
      {selectedOption === 'describe' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg">
          <h3 className="text-xl font-bold text-center mb-4">📝 Describe Your Preferred Style</h3>
          <textarea
            value={outfitDescription}
            onChange={(e) => setOutfitDescription(e.target.value)}
            placeholder="Tell us about your style preferences... (e.g., 'I prefer professional business attire in navy and grey tones', 'I like casual and trendy streetwear with bold colors', 'Looking for elegant evening wear for a special occasion')"
            className="w-full h-32 border border-gray-300 rounded-xl p-4 text-sm resize-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
          />
          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span>💡 Be as specific as possible for best results</span>
            <span className={outfitDescription.length > 10 ? 'text-green-600' : 'text-gray-400'}>
              {outfitDescription.length > 10 ? '✓ Ready to continue' : 'Minimum 10 characters'}
            </span>
          </div>
        </div>
      )}

      {selectedOption === 'browse' && selectedOutfits.length > 0 && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-lg">
          <h3 className="text-xl font-bold text-center mb-4">
            ✅ Your Selected Outfits ({selectedOutfits.length}/{outfitSlots})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="text-red-500 hover:text-red-700 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {selectedOutfits.length < outfitSlots && (
            <div className="text-center mt-4">
              <button
                onClick={() => setShowWardrobeModal(true)}
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold"
              >
                + Add more outfits
              </button>
            </div>
          )}
        </div>
      )}

      {selectedOption === 'auto' && (
        <div className="max-w-2xl mx-auto bg-green-50 rounded-2xl p-6 border-2 border-green-200 text-center">
          <div className="text-4xl mb-4">✨</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Perfect Outfits Selected!</h3>
          <p className="text-green-700">
            Based on your {formData.shootTypeName} photoshoot, we've automatically selected {outfitSlots} outfits that will look amazing on you.
          </p>
        </div>
      )}

      {selectedOption === 'skip' && (
        <div className="max-w-2xl mx-auto bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-blue-800 mb-2">We've Got You Covered!</h3>
          <p className="text-blue-700">
            Our expert stylists will choose the perfect outfits for your {formData.shootTypeName} photoshoot. Just focus on looking great!
          </p>
        </div>
      )}

      {/* Virtual Wardrobe Modal */}
      {showWardrobeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Virtual Wardrobe</h2>
                <button
                  onClick={() => setShowWardrobeModal(false)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="mt-2 opacity-90">
                Select {outfitSlots} outfit{outfitSlots > 1 ? 's' : ''} for your photoshoot
              </p>
              
              {/* Selected Outfits */}
              {selectedOutfits.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-semibold mb-2">Selected ({selectedOutfits.length}/{outfitSlots}):</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedOutfits.map(outfit => (
                      <div key={outfit.id} className="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center space-x-2">
                        <span>{outfit.image}</span>
                        <span>{outfit.name}</span>
                        <button 
                          onClick={() => handleRemoveOutfit(outfit.id)}
                          className="text-white hover:text-gray-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      activeFilter === category
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Outfits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOutfits.map(outfit => {
                  const isSelected = selectedOutfits.find(o => o.id === outfit.id);
                  
                  return (
                    <div
                      key={outfit.id}
                      onClick={() => handleSelectOutfit(outfit)}
                      className={`
                        border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
                        ${isSelected
                          ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent transform scale-105'
                          : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102'
                        }
                        ${selectedOutfits.length >= outfitSlots && !isSelected ? 'opacity-50 pointer-events-none' : ''}
                      `}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{outfit.image}</div>
                        <h3 className="font-bold text-gray-900 mb-1">{outfit.name}</h3>
                        <div className="text-sm text-gray-500 mb-3">{outfit.category}</div>
                        <div className="flex flex-wrap gap-1 justify-center mb-3">
                          {outfit.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          className={`
                            w-full py-2 rounded-lg text-sm font-semibold transition-all
                            ${isSelected
                              ? 'bg-[#D4AF37] text-black'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {isSelected ? 'Selected ✓' : 'Select Outfit'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedOutfits.length} of {outfitSlots} outfits selected
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowWardrobeModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowWardrobeModal(false)}
                    className="px-6 py-2 bg-[#D4AF37] text-black rounded-lg font-semibold hover:bg-[#b8941f] transition-colors"
                  >
                    Done Selecting
                  </button>
                </div>
              </div>
            </div>
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
            <span>Continue to Styling</span>
            <span className="text-lg animate-bounce">→</span>
          </button>
        )}
      </div>
    </div>
  );
}