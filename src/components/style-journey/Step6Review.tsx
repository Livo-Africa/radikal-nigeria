// src/components/style-journey/Step6Review.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useAbandonmentTracking } from '@/hooks/useAbandonmentTracking';
import MobileStepHeader from '@/components/mobile/MobileStepHeader';
import { Check, Edit, MessageCircle, FileText, Package, Shirt, Palette, CreditCard, Shield, Clock, Star, MapPin, ArrowLeft } from 'lucide-react';
import StickyActionButtons from '../shared/StickyActionButtons';

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
  const [specialRequests, setSpecialRequests] = useState(formData.specialRequests || '');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(formData.addOns || []);
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

  // Handle add-on selection
  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleContinue = () => {
    // Save all data to form
    setFormData((prev: any) => ({
      ...prev,
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
      trackAbandonment('back_button_step_6');
    }

    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(5);
    }, 200);
  };

  // Get selected add-ons details
  const getSelectedAddOnsDetails = () => {
    return selectedAddOns.map(id => addOns.find(a => a.id === id)).filter(Boolean);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:min-h-[70vh] transition-all duration-300 ease-out pb-32"
    >
      {/* Desktop Header */}
      <div className="hidden lg:block text-center mb-8 pt-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Check className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            REVIEW YOUR ORDER
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Almost there! Review your photoshoot details
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-0">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
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
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Package */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">Package</div>
                  <div className="text-sm text-gray-600">
                    {formData.package?.name} • {formData.package?.photos} photos • {formData.package?.outfits} outfits
                  </div>
                  <div className="text-sm text-[#D4AF37] font-semibold">
                    Delivery: {formData.package?.deliveryTime}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">₵{formData.package?.price}</div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold flex items-center space-x-1 justify-end"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* Outfits */}
              {formData.outfits && formData.outfits.length > 0 && (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">Selected Outfits</div>
                    <div className="text-sm text-gray-600">
                      {formData.outfits.slice(0, 2).map((outfit: any) => outfit.name).join(', ')}
                      {formData.outfits.length > 2 && ` and ${formData.outfits.length - 2} more`}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>
              )}

              {/* Style Customizations */}
              {formData.style && !formData.style.skipped && (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">Style Preferences</div>
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
                    className="text-[#D4AF37] hover:text-[#b8941f] text-sm font-semibold flex items-center space-x-1"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
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

          {/* Delivery Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <span>Delivery Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number for Delivery
                </label>
                <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 text-lg">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-mono">{formData.whatsappNumber}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Your photos will be delivered to this number via WhatsApp
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  To change your number, go back to the photos step
                </p>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any specific poses, colors, or style preferences? (e.g., 'I prefer natural lighting', 'Please include some smiling shots', 'Focus on my right side')"
                  className="w-full h-32 border border-gray-300 rounded-xl p-4 text-sm resize-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  maxLength={500}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>Help us understand your vision better</span>
                  </span>
                  <span>{specialRequests.length}/500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Add-ons & Final Total */}
        <div className="space-y-6">
          {/* Add-ons Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Package className="w-5 h-5" />
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
                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${isSelected
                      ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/10 to-transparent'
                      : 'border-gray-200 hover:border-[#D4AF37]/50'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300'
                          }`}>
                          {isSelected && <Check className="w-3 h-3 text-white" />}
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
            <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Final Total</span>
            </h2>

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
                  <Clock className="w-4 h-4" />
                  <span>
                    <strong>Delivery:</strong> {selectedAddOns.includes('rush-delivery') ? '1 HOUR' : formData.package?.deliveryTime} via WhatsApp
                  </span>
                </div>
                {selectedAddOns.includes('rush-delivery') && (
                  <div className="text-xs opacity-90 mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Rush delivery selected - your photos will be prioritized!</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3 text-center flex items-center justify-center space-x-2">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span>Why Choose Radikal?</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
              <div className="space-y-1">
                <Clock className="w-6 h-6 text-[#D4AF37] mx-auto" />
                <div className="font-semibold text-gray-900">Fast Delivery</div>
                <div className="text-gray-600">1-3 hours</div>
              </div>
              <div className="space-y-1">
                <Star className="w-6 h-6 text-[#D4AF37] mx-auto" />
                <div className="font-semibold text-gray-900">4.9/5 Rating</div>
                <div className="text-gray-600">500+ clients</div>
              </div>
              <div className="space-y-1">
                <MessageCircle className="w-6 h-6 text-[#D4AF37] mx-auto" />
                <div className="font-semibold text-gray-900">24/7 Support</div>
                <div className="text-gray-600">WhatsApp chat</div>
              </div>
              <div className="space-y-1">
                <MapPin className="w-6 h-6 text-[#D4AF37] mx-auto" />
                <div className="font-semibold text-gray-900">Ghana Based</div>
                <div className="text-gray-600">Local experts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <StickyActionButtons
        onBack={handleBack}
        onNext={handleContinue}
        nextLabel="Proceed to Payment"
      />
    </div>
  );
}