// src/components/style-journey/Step6Review.tsx - WITH LUCIDE ICONS
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';
import { CheckCircle, MessageCircle, FileText, CreditCard, Package, Shirt, Settings, ArrowRight, ArrowLeft, Plus, X, Zap, Shield, Users, Clock } from 'lucide-react';

interface Step6ReviewProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  popular: boolean;
}

export default function Step6Review({ formData, setFormData, currentStep, setCurrentStep }: Step6ReviewProps) {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isValidNumber, setIsValidNumber] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackAbandonment, hasPhoneNumber } = useAbandonmentTracking(formData, currentStep);
  

  // Add-ons data
  const addOns: AddOn[] = [
    { id: 'extra-image', name: '+1 Extra Image', description: 'Get one additional edited photo', price: 10, popular: true },
    { id: 'advanced-retouching', name: 'Advanced Retouching', description: 'Professional skin smoothing and enhancement', price: 15, popular: false },
    { id: 'body-enhancement', name: 'Body Enhancement', description: 'Subtle body shaping and proportion adjustment', price: 50, popular: false },
    { id: 'additional-outfit', name: 'Additional Outfit', description: 'Add one more outfit to your package', price: 40, popular: true },
    { id: 'rush-delivery', name: 'Rush Delivery', description: 'Get your photos in 1 hour (instead of 1-3)', price: 30, popular: true },
    { id: 'premium-backgrounds', name: 'Premium Backgrounds', description: 'Access to exclusive background options', price: 25, popular: false },
  ];

  // Calculate totals
  const baseTotal = formData.package?.price || 0;
  const addOnsTotal = selectedAddOns.reduce((total, addOnId) => {
    const addOn = addOns.find(a => a.id === addOnId);
    return total + (addOn?.price || 0);
  }, 0);
  const finalTotal = baseTotal + addOnsTotal;

  // Validate WhatsApp number (Ghana format: +233XXXXXXXXX)
  useEffect(() => {
    const ghanaRegex = /^\+233[0-9]{9}$/;
    const isValid = ghanaRegex.test(whatsappNumber);
    setIsValidNumber(isValid);
    setShowNextButton(isValid);
  }, [whatsappNumber]);

  // Handle add-on selection
  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleContinue = () => {
    if (!isValidNumber) return;
    
    // Save all data to form
    setFormData((prev: any) => ({ 
      ...prev, 
      whatsappNumber,
      specialRequests,
      addOns: selectedAddOns,
      finalTotal
    }));
    
    // Smooth transition
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }
    
    setTimeout(() => {
      setCurrentStep(7);
    }, 200);
  };

const handleBack = () => {
  // Track abandonment if user has provided phone number
  if (hasPhoneNumber) {
    trackAbandonment('navigated_back_from_step_6');
  }
  
  if (containerRef.current) {
    containerRef.current.style.opacity = '0.9';
    containerRef.current.style.transform = 'scale(0.98)';
  }
  
  setTimeout(() => {
    setCurrentStep(5);
  }, 200);
};

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

  // Get selected add-ons details
  const getSelectedAddOnsDetails = () => {
    return selectedAddOns.map(id => addOns.find(a => a.id === id)).filter(Boolean);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-[70vh] transition-all duration-300 ease-out"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            REVIEW YOUR ORDER
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Almost there! Review your photoshoot details and tell us where to send your photos
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-6 h-6 text-[#D4AF37]" />
              <span>Order Summary</span>
            </h2>
            
            <div className="space-y-4">
              {/* Shoot Type */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">Shoot Type</div>
                  <div className="text-sm text-gray-600">{formData.shootTypeName}</div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold flex items-center space-x-1"
                >
                  <span>Edit</span>
                </button>
              </div>

              {/* Package */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>Package</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formData.package?.name} • {formData.package?.photos} photos • {formData.package?.outfits} outfits
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Delivery: {formData.package?.deliveryTime}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₵{formData.package?.price}</div>
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Outfits */}
              {formData.outfits && formData.outfits.length > 0 && (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Shirt className="w-4 h-4" />
                      <span>Selected Outfits</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.outfits.slice(0, 2).map((outfit: any) => outfit.name).join(', ')}
                      {formData.outfits.length > 2 && ` and ${formData.outfits.length - 2} more`}
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(4)}
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* Style Customizations */}
              {formData.style && !formData.style.skipped && (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Style Preferences</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {Object.entries(formData.style).map(([key, value]: [string, any]) => (
                        value.selectedOption && (
                          <div key={key}>
                            {key}: {value.selectedName}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => setCurrentStep(5)}
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Base Total */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-gray-900">Base Total</div>
                <div className="font-bold text-gray-900">₵{baseTotal}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Add-ons & Final Total */}
        <div className="space-y-6">
          {/* Add-ons Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Plus className="w-6 h-6 text-[#D4AF37]" />
              <span>Enhance Your Photoshoot (Optional)</span>
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Add these premium features to make your photos even more amazing
            </p>
            
            <div className="space-y-3">
              {addOns.map((addOn) => {
                const isSelected = selectedAddOns.includes(addOn.id);
                
                return (
                  <div
                    key={addOn.id}
                    onClick={() => handleAddOnToggle(addOn.id)}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
                      ${isSelected
                        ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent'
                        : 'border-gray-200 hover:border-[#D4AF37]/50'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300'}
                        `}>
                          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{addOn.name}</span>
                            {addOn.popular && (
                              <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded-full font-bold">
                                POPULAR
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">{addOn.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">+₵{addOn.price}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Total Card */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B91C1C] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Final Total</h2>
            
            <div className="space-y-3">
              {/* Base Package */}
              <div className="flex justify-between">
                <span>{formData.package?.name} Package</span>
                <span>₵{baseTotal}</span>
              </div>

              {/* Add-ons */}
              {getSelectedAddOnsDetails().length > 0 && (
                <>
                  <div className="border-t border-white/20 pt-2">
                    <div className="text-sm font-semibold mb-2">Add-ons:</div>
                    {getSelectedAddOnsDetails().map((addOn) => (
                      <div key={addOn?.id} className="flex justify-between text-sm opacity-90">
                        <span>• {addOn?.name}</span>
                        <span>+₵{addOn?.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Add-ons Total</span>
                    <span>+₵{addOnsTotal}</span>
                  </div>
                </>
              )}

              {/* Final Total */}
              <div className="border-t border-white/30 pt-3 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₵{finalTotal}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white/20 rounded-xl p-3 mt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Zap className="w-4 h-4" />
                  <span>
                    <strong>Delivery:</strong> {selectedAddOns.includes('rush-delivery') ? '1 HOUR' : formData.package?.deliveryTime} via WhatsApp
                  </span>
                </div>
                {selectedAddOns.includes('rush-delivery') && (
                  <div className="text-xs opacity-90 mt-1 flex items-center space-x-1">
                    <Zap className="w-3 h-3" />
                    <span>Rush delivery selected - your photos will be prioritized!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 text-center">Why Choose Radikal?</h3>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Zap className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="font-semibold text-gray-900">Fast Delivery</div>
                <div className="text-gray-600">1-3 hours</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center">
                  <CheckCircle className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="font-semibold text-gray-900">4.9/5 Rating</div>
                <div className="text-gray-600">500+ clients</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center">
                  <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="font-semibold text-gray-900">24/7 Support</div>
                <div className="text-gray-600">WhatsApp chat</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-center">
                  <Users className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div className="font-semibold text-gray-900">Ghana Based</div>
                <div className="text-gray-600">Local experts</div>
              </div>
            </div>
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
            <span>Proceed to Payment</span>
            <ArrowRight className="w-5 h-5 animate-bounce" />
          </button>
        )}
      </div>

      
    </div>
  );
}