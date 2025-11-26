// src/components/style-journey/Step5StyleCustomization.tsx - WITH LUCIDE ICONS
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';
import { Scissors, Palette, Image as ImageIcon, ArrowRight, ArrowLeft, SkipForward, Check, Sparkles, Settings } from 'lucide-react';

interface Step5StyleCustomizationProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface StyleOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface StyleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  options: StyleOption[];
  selectedOption: string | null;
  customDescription: string;
}

export default function Step5StyleCustomization({ formData, setFormData, currentStep, setCurrentStep }: Step5StyleCustomizationProps) {
  const [styleCategories, setStyleCategories] = useState<StyleCategory[]>([
    {
      id: 'hairstyle',
      name: 'Hairstyle',
      icon: '💇',
      description: 'Choose your preferred hairstyle',
      options: [
        { id: 'professional', name: 'Professional', icon: '👔', description: 'Clean, business-appropriate styling', color: 'from-blue-500 to-blue-600' },
        { id: 'modern-casual', name: 'Modern Casual', icon: '💁', description: 'Contemporary, relaxed styling', color: 'from-purple-500 to-pink-500' },
        { id: 'creative', name: 'Creative', icon: '🎨', description: 'Artistic and expressive styling', color: 'from-green-500 to-emerald-600' },
        { id: 'natural', name: 'Natural', icon: '🌿', description: 'Minimal, natural-looking styling', color: 'from-green-400 to-green-500' },
      ],
      selectedOption: null,
      customDescription: ''
    },
    {
      id: 'makeup',
      name: 'Makeup',
      icon: '💄',
      description: 'Choose your makeup style',
      options: [
        { id: 'natural-look', name: 'Natural Look', icon: '🌸', description: 'Subtle, minimal makeup', color: 'from-pink-400 to-pink-500' },
        { id: 'professional-makeup', name: 'Professional Makeup', icon: '💼', description: 'Polished, camera-ready makeup', color: 'from-red-500 to-orange-500' },
        { id: 'glam-makeup', name: 'Glam Makeup', icon: '✨', description: 'Dramatic, evening makeup', color: 'from-purple-500 to-pink-500' },
        { id: 'no-makeup', name: 'No Makeup', icon: '🚫', description: 'Natural skin, no makeup enhancement', color: 'from-gray-400 to-gray-500' },
      ],
      selectedOption: null,
      customDescription: ''
    },
    {
      id: 'background',
      name: 'Background',
      icon: '🏞️',
      description: 'Choose your background setting',
      options: [
        { id: 'studio', name: 'Studio Setting', icon: '📸', description: 'Clean, professional studio background', color: 'from-gray-500 to-gray-700' },
        { id: 'office', name: 'Office Background', icon: '🏢', description: 'Professional office environment', color: 'from-blue-500 to-blue-600' },
        { id: 'outdoor', name: 'Outdoor Scene', icon: '🌳', description: 'Natural outdoor setting', color: 'from-green-500 to-green-600' },
        { id: 'luxury', name: 'Luxury Interior', icon: '🏰', description: 'Elegant, high-end interior', color: 'from-yellow-500 to-orange-500' },
      ],
      selectedOption: null,
      customDescription: ''
    }
  ]);

  const [showNextButton, setShowNextButton] = useState(false);
  const [activeDescription, setActiveDescription] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);

  // Check if user has made any selections or can skip
  useEffect(() => {
    const hasSelections = styleCategories.some(category => 
      category.selectedOption || category.customDescription.trim().length > 0
    );
    
    // User can proceed if they've made selections OR skip entirely
    setShowNextButton(true); // Always allow proceeding since it's optional
  }, [styleCategories]);

  // Handle option selection
  const handleSelectOption = (categoryId: string, optionId: string) => {
    setStyleCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, selectedOption: optionId } 
          : category
      )
    );
  };

  // Handle custom description change
  const handleCustomDescriptionChange = (categoryId: string, description: string) => {
    setStyleCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, customDescription: description } 
          : category
      )
    );
  };

  // Clear selection for a category
  const handleClearSelection = (categoryId: string) => {
    setStyleCategories(prev => 
      prev.map(category => 
        category.id === categoryId 
          ? { ...category, selectedOption: null, customDescription: '' } 
          : category
      )
    );
  };

  // Get selected options summary
  const getSelectedSummary = () => {
    return styleCategories
      .filter(category => category.selectedOption || category.customDescription)
      .map(category => {
        const selectedOption = category.options.find(opt => opt.id === category.selectedOption);
        return {
          category: category.name,
          selection: selectedOption ? selectedOption.name : 'Custom description',
          description: category.customDescription || selectedOption?.description
        };
      });
  };

  const handleContinue = () => {
    // Save style selections to form data
    const styleSelections = styleCategories.reduce((acc, category) => {
      acc[category.id] = {
        selectedOption: category.selectedOption,
        customDescription: category.customDescription,
        selectedName: category.selectedOption 
          ? category.options.find(opt => opt.id === category.selectedOption)?.name 
          : null
      };
      return acc;
    }, {} as any);

    setFormData((prev: any) => ({ 
      ...prev, 
      style: styleSelections
    }));
    
    // Smooth transition
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }
    
    setTimeout(() => {
      setCurrentStep(6);
    }, 200);
  };

 const handleBack = () => {
  // Track abandonment if user has provided phone number
  if (hasPhoneNumber) {
    trackAbandonment('navigated_back_from_step_5');
  }
  
  if (containerRef.current) {
    containerRef.current.style.opacity = '0.9';
    containerRef.current.style.transform = 'scale(0.98)';
  }
  
  setTimeout(() => {
    setCurrentStep(4);
  }, 200);
};

 const handleSkipAll = () => {
  // Track abandonment if user skips styling after providing phone
  if (hasPhoneNumber) {
    trackAbandonment('skipped_styling_step');
  }
  
  setFormData((prev: any) => ({ 
    ...prev, 
    style: { skipped: true }
  }));
  
  if (containerRef.current) {
    containerRef.current.style.opacity = '0.9';
    containerRef.current.style.transform = 'scale(0.98)';
  }
  
  setTimeout(() => {
    setCurrentStep(6);
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
          <Settings className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            CUSTOMIZE YOUR LOOK
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Add the finishing touches - or skip and we'll create magic for you
        </p>
        
        {/* Optional Notice */}
        <div className="mt-4 flex justify-center">
          <div className="bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-semibold border border-blue-200 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Optional Step - Your photos will look amazing either way!</span>
          </div>
        </div>
      </div>

      {/* Style Categories */}
      <div className="max-w-6xl mx-auto space-y-8">
        {styleCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            {/* Category Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">
                  {category.id === 'hairstyle' && <Scissors className="w-8 h-8 text-blue-500" />}
                  {category.id === 'makeup' && <Palette className="w-8 h-8 text-pink-500" />}
                  {category.id === 'background' && <ImageIcon className="w-8 h-8 text-green-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              
              {(category.selectedOption || category.customDescription) && (
                <button
                  onClick={() => handleClearSelection(category.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center space-x-1"
                >
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {category.options.map((option) => {
                const isSelected = category.selectedOption === option.id;
                
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelectOption(category.id, option.id)}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform
                      ${isSelected
                        ? `border-[#D4AF37] bg-gradient-to-br ${option.color} text-white scale-105 shadow-lg`
                        : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{option.icon}</div>
                      <h4 className={`font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {option.name}
                      </h4>
                      <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                      
                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="mt-3">
                          <div className="bg-white/20 rounded-full px-3 py-1 text-xs font-semibold inline-flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Selected</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Description */}
            <div className="border-t border-gray-200 pt-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-3"
                onClick={() => setActiveDescription(activeDescription === category.id ? null : category.id)}
              >
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <span>📝</span>
                  <span>Or describe exactly what you want...</span>
                </h4>
                <span className="text-gray-500 transform transition-transform">
                  {activeDescription === category.id ? '▲' : '▼'}
                </span>
              </div>
              
              {activeDescription === category.id && (
                <div className="animate-fadeIn">
                  <textarea
                    value={category.customDescription}
                    onChange={(e) => handleCustomDescriptionChange(category.id, e.target.value)}
                    placeholder={`Describe your ideal ${category.name.toLowerCase()}... (e.g., "${category.id === 'hairstyle' ? 'Sleek back with subtle volume on top' : category.id === 'makeup' ? 'Smokey eyes with nude lips and contoured cheeks' : 'Modern minimalist office with wooden desk and plants'}")`}
                    className="w-full h-24 border border-gray-300 rounded-xl p-4 text-sm resize-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Be specific for best results</span>
                    </span>
                    <span className={category.customDescription.length > 0 ? 'text-green-600 flex items-center space-x-1' : 'text-gray-400 flex items-center space-x-1'}>
                      {category.customDescription.length > 0 ? <Check className="w-4 h-4" /> : <span>•</span>}
                      <span>{category.customDescription.length > 0 ? 'Custom description saved' : 'Optional'}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Style Summary */}
      {getSelectedSummary().length > 0 && (
        <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#B91C1C]/10 rounded-2xl p-6 border border-[#D4AF37]/20">
          <h3 className="text-lg font-bold text-center mb-4 flex items-center justify-center space-x-2">
            <Check className="w-5 h-5 text-green-500" />
            <span>Your Style Selections</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getSelectedSummary().map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-gray-900 mb-1">{item.category}</div>
                <div className="text-[#D4AF37] font-medium text-sm mb-1">{item.selection}</div>
                <div className="text-gray-600 text-xs">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Style Inspiration */}
      <div className="max-w-4xl mx-auto mt-8 bg-purple-50 rounded-2xl p-6 border border-purple-200">
        <h3 className="font-bold text-purple-900 mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>Style Inspiration & Tips</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">For Professional Shoots:</h4>
            <ul className="space-y-1 text-purple-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Clean, groomed hairstyles</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Natural or professional makeup</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Studio or office backgrounds</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Neutral colors work best</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-purple-800 mb-2">For Creative Shoots:</h4>
            <ul className="space-y-1 text-purple-700">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Expressive, artistic hairstyles</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Bold or glam makeup choices</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Outdoor or luxury backgrounds</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Don't be afraid to experiment!</span>
              </li>
            </ul>
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
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Skip All Button */}
        <button
          onClick={handleSkipAll}
          className="
            bg-gray-500 text-white font-bold py-4 px-6 
            rounded-2xl shadow-xl 
            transform transition-all duration-300 
            hover:scale-105 hover:shadow-2xl
            active:scale-95
            flex items-center space-x-2
          "
        >
          <SkipForward className="w-5 h-5" />
          <span>Skip All Styling</span>
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
            <span>Review Order</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        )}
      </div>

      {/* Quick Selection Helper */}
      <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-20 hidden lg:block">
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-3 text-sm">Quick Picks</h4>
          <div className="space-y-2">
            <button
              onClick={() => {
                setStyleCategories(prev => prev.map(cat => ({
                  ...cat,
                  selectedOption: cat.options[0].id, // First option (professional)
                  customDescription: ''
                })));
              }}
              className="w-full bg-blue-500 text-white text-xs px-3 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Check className="w-3 h-3" />
              <span>Professional Look</span>
            </button>
            <button
              onClick={() => {
                setStyleCategories(prev => prev.map(cat => ({
                  ...cat,
                  selectedOption: cat.options[1].id, // Second option (casual/creative)
                  customDescription: ''
                })));
              }}
              className="w-full bg-purple-500 text-white text-xs px-3 py-2 rounded-lg font-semibold hover:bg-purple-600 transition-colors flex items-center space-x-2"
            >
              <Check className="w-3 h-3" />
              <span>Creative Look</span>
            </button>
            <button
              onClick={() => {
                setStyleCategories(prev => prev.map(cat => ({
                  ...cat,
                  selectedOption: cat.options[2].id, // Third option
                  customDescription: ''
                })));
              }}
              className="w-full bg-green-500 text-white text-xs px-3 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <Check className="w-3 h-3" />
              <span>Natural Look</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}