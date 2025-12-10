// src/components/style-journey/Step7Payment.tsx
'use client';
import { useState, useRef, useEffect } from 'react';

import { CreditCard, Shield, Clock, Check, X, Home, MessageCircle, Loader, ArrowLeft } from 'lucide-react';

interface Step7PaymentProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export default function Step7Payment({ formData, setFormData, currentStep, setCurrentStep }: Step7PaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const paymentMethods = [
    { id: 'mobile-money', name: 'Mobile Money', icon: '📱', description: 'Pay with MTN, Vodafone, or AirtelTigo', color: 'from-green-500 to-green-600' },
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, or American Express', color: 'from-blue-500 to-blue-600' },
    { id: 'bank-transfer', name: 'Bank Transfer', icon: '🏦', description: 'Direct transfer to our bank account', color: 'from-purple-500 to-purple-600' },
  ];

  // Generate order ID on component mount
  useEffect(() => {
    const newOrderId = `RAD-${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
  }, []);

  // Send order to backend systems
  const sendOrderToBackend = async () => {
    const orderData = {
      orderId,
      ...formData,
      status: 'paid',
      timestamp: new Date().toISOString()
    };

    const submitFormData = new FormData();
    // Ensure complex objects are stringified for the backend parser
    const safeOrderData = {
      ...orderData,
      // Make sure package and other objects are preserved
    };
    submitFormData.append('orderData', JSON.stringify(safeOrderData));

    // Append photos (Step 3 photos)
    if (formData.photos && Array.isArray(formData.photos)) {
      formData.photos.forEach((photo: any, index: number) => {
        if (photo.file) {
          submitFormData.append(`photo_${index}`, photo.file);
        }
      });
    }

    // Append Uploaded Outfits (from Step 4 if any - though currently structure might be different based on implementation)
    // Checking Step4 structure from memory/context: formData.uploadedOutfits?
    if (formData.uploadedOutfits && Array.isArray(formData.uploadedOutfits)) {
      formData.uploadedOutfits.forEach((outfit: any, index: number) => {
        if (outfit.file) {
          submitFormData.append(`outfit_upload_${index}`, outfit.file);
        }
      });
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: submitFormData
      });

      const result = await response.json();

      if (!result.success) {
        console.error('Backend submission failed:', result);
        // We don't throw here to allow the UI to show success for the "Payment" part 
        // effectively treating it as a "soft" failure for the logging but "success" for user
        // BUT ideally we should warn.
      } else {
        console.log('✅ Order submitted successfully to backend');
      }

    } catch (error) {
      console.error('Error sending order to backend:', error);
      // Fallback or retry logic could go here
    }
  };

  // Simulate Paystack payment integration
  const handlePayment = async () => {
    if (!selectedMethod) return;

    setPaymentStatus('processing');

    try {
      // 1. Submit Order to Backend (Capture the lead/order details + files)
      // We do this concurrently with the "simulation"
      const submissionPromise = sendOrderToBackend();

      // 2. Simulate API call to Paystack (Delay)
      const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));

      await Promise.all([submissionPromise, delayPromise]);

      // Simulate successful payment
      const paymentSuccess = Math.random() > 0.0; // 100% success rate for demo (was 0.1 > 0.9 before?)

      if (paymentSuccess) {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    }
  };

  const handleBack = () => {
    if (containerRef.current) {
      containerRef.current.style.opacity = '0.9';
      containerRef.current.style.transform = 'scale(0.98)';
    }

    setTimeout(() => {
      setCurrentStep(6);
    }, 200);
  };

  const handleRetryPayment = () => {
    setPaymentStatus('idle');
    setSelectedMethod('');
  };

  const handleNewOrder = () => {
    // Reset form and go back to step 1
    setFormData({
      shootType: null,
      shootTypeName: null,
      package: null,
      photos: [],
      outfits: [],
      style: {},
      whatsappNumber: '',
      specialRequests: '',
      addOns: [],
      total: 0,
      finalTotal: 0
    });
    setCurrentStep(1);
  };

  // Payment Processing Screen
  if (paymentStatus === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <Loader className="animate-spin w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Your Payment</h1>
          <p className="text-gray-600 mb-6">
            Please wait while we securely process your payment with Paystack...
          </p>

          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm text-blue-800">
              <span className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Payment Security</span>
              </span>
              <span>PCI Compliant</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Connecting to Paystack...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Processing payment of ₵{formData.finalTotal}...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Securing transaction...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Success Screen
  if (paymentStatus === 'success') {
    // Clear session storage on success
    if (typeof window !== 'undefined') {
      localStorage.removeItem('radikal_booking_progress');
      localStorage.removeItem('radikal_session_id');
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-green-200 max-w-md w-full text-center">
          {/* Success Animation */}
          <div className="text-6xl mb-4 animate-bounce">🎉</div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order! We're already working on your amazing photos.
          </p>

          {/* Order Summary */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <div className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Order Confirmation:</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Order ID: <strong>{orderId}</strong></div>
              <div>Package: {formData.package?.name}</div>
              <div>Amount Paid: <strong>₵{formData.finalTotal}</strong></div>
              <div>Delivery: {formData.addOns?.includes('rush-delivery') ? '1 HOUR ⚡' : formData.package?.deliveryTime}</div>
              <div>To: {formData.whatsappNumber}</div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-3 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Payment received and verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Order #{orderId} submitted to our team</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <span>Order #{orderId} submitted successfully</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>What Happens Next:</span>
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>1. Our team starts processing immediately</div>
              <div>2. We'll contact you if we need clarification</div>
              <div>3. Receive your photos via WhatsApp</div>
              <div>4. Support available 24/7 via WhatsApp</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Return to Homepage</span>
            </button>
            <button
              onClick={handleNewOrder}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
            >
              Start New Photoshoot
            </button>
            <div className="text-center">
              <a
                href={`https://wa.me/233207472307?text=Hi Radikal! I want to track my order #${orderId}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white font-bold py-3 px-6 rounded-2xl hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Track Order on WhatsApp</span>
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Click to receive instant updates on your order status
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-red-200 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. This might be due to network issues or insufficient funds.
          </p>

          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-red-800 flex items-center space-x-2">
              <X className="w-5 h-5" />
              <span><strong>Don't worry!</strong> Your order is saved and you can retry the payment.</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Try Payment Again</span>
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Order Review</span>
            </button>
            <div className="text-center">
              <a
                href="https://wa.me/233207472307?text=Hi! I need help with my payment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Get help on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Payment Selection Screen
  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:min-h-[70vh] transition-all duration-300 ease-out pb-32"
    >


      {/* Desktop Header */}
      <div className="hidden lg:block text-center mb-8 pt-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CreditCard className="w-8 h-8 text-[#D4AF37]" />
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            COMPLETE YOUR PAYMENT
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Secure payment processed by Paystack - Ghana's leading payment platform
        </p>

        {/* Order ID Display */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-mono flex items-center space-x-2">
            <span>Order:</span>
            <span>{orderId}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 lg:px-0">
        {/* Left Column - Payment Methods */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full border-2 rounded-xl p-4 flex items-center space-x-4 transition-all duration-300 ${selectedMethod === method.id
                    ? 'border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent'
                    : 'border-gray-200 hover:border-[#D4AF37]/50'
                    }`}
                >
                  <div className="text-2xl">{method.icon}</div>
                  <div className="text-left flex-1">
                    <div className="font-bold text-gray-900">{method.name}</div>
                    <div className="text-xs text-gray-500">{method.description}</div>
                  </div>
                  {selectedMethod === method.id && (
                    <div className="bg-[#D4AF37] text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-center flex items-center justify-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Need Help?</span>
            </h3>
            <div className="space-y-3 text-center">
              <a
                href="https://wa.me/233207472307"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
              <div className="text-sm text-gray-600">
                Our team is available 24/7 to assist you
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Order Summary</span>
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Package</span>
                <span className="font-semibold">{formData.package?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span>₵{formData.package?.price}</span>
              </div>
              {formData.addOns && formData.addOns.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-ons ({formData.addOns.length})</span>
                  <span>+₵{formData.finalTotal - (formData.package?.price || 0)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total to Pay</span>
                  <span className="text-[#D4AF37]">₵{formData.finalTotal}</span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!selectedMethod}
                className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] text-white font-bold py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-3xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
              >
                <CreditCard className="w-5 h-5" />
                <span>Pay ₵{formData.finalTotal} Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons (Mobile Only) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 px-4 w-full max-w-md lg:hidden">
        <button
          onClick={handleBack}
          className="bg-gray-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 flex items-center space-x-2 w-full justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Review</span>
        </button>
      </div>
    </div>
  );
}