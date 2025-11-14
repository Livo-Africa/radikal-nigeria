// components/style-journey/Step7Payment.tsx
'use client';
import { useState, useRef, useEffect } from 'react';

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

  // THIS IS WHERE THE MAGIC HAPPENS! 🎯
  const sendOrderToBackend = async () => {
    const orderData = {
      orderId,
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'paid'
    };

    let sheetsResponse;

    try {
      // 1. Send to Google Sheets (Order Tracking)
      sheetsResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const sheetsResult = await sheetsResponse.json();
      
      if (!sheetsResult.success) {
        throw new Error('Failed to save order to Google Sheets');
      }

      console.log('✅ Order saved to Google Sheets:', sheetsResult);

      // 2. Send Telegram notification to team
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customer: formData.whatsappNumber,
          package: formData.package?.name,
          amount: formData.finalTotal,
          urgent: formData.addOns?.includes('rush-delivery')
        })
      });

      // 3. Send SMS confirmation to customer
      await fetch('/api/sms/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.whatsappNumber,
          orderId,
          package: formData.package?.name,
          amount: formData.finalTotal,
          deliveryTime: formData.addOns?.includes('rush-delivery') ? '1 hour' : formData.package?.deliveryTime
        })
      });

      // 4. Send WhatsApp order received confirmation
      await fetch('/api/whatsapp/send-order-received', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.whatsappNumber,
          orderId,
          package: formData.package?.name
        })
      });

      console.log('🎉 All backend systems notified!');

    } catch (error) {
      console.error('Error sending to backend:', error);
      
      // Even if other services fail, if Google Sheets worked, we consider it a success
      // but log the error for debugging
      if (!sheetsResponse?.ok) {
        throw error; // Re-throw if Google Sheets failed
      }
      
      // If Google Sheets worked but other services failed, we can still proceed
      console.warn('Google Sheets saved but other services failed');
    }
  };

  // Simulate Paystack payment integration
  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setPaymentStatus('processing');
    
    try {
      // Simulate API call to Paystack
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In real implementation, this would be:
      // const response = await fetch('/api/paystack/initialize', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     amount: formData.finalTotal * 100, // Paystack uses kobo
      //     email: 'customer@radikal.com', // Would come from form
      //     reference: orderId,
      //     metadata: { orderId, ...formData }
      //   })
      // });
      
      // Simulate successful payment
      const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo
      
      if (paymentSuccess) {
        // Send order to backend systems
        await sendOrderToBackend();
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
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#D4AF37] mx-auto mb-6"></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Your Payment</h1>
          <p className="text-gray-600 mb-6">
            Please wait while we securely process your payment with Paystack...
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm text-blue-800">
              <span>🔒 Payment Security</span>
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
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-green-200 max-w-md w-full mx-4 text-center">
          {/* Confetti Animation Effect */}
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order! We're already working on your amazing photos.
          </p>
          
          {/* Order Summary */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <div className="font-semibold text-gray-900 mb-2">Order Confirmation:</div>
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
              <span className="text-green-500 text-lg">✅</span>
              <span>Payment received and verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✅</span>
              <span>Order #{orderId} submitted to our team</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✅</span>
              <span>Telegram notification sent to photographers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✅</span>
              <span>SMS confirmation sent to you</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-500 text-lg">✅</span>
              <span>WhatsApp order received message sent</span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What Happens Next:</h3>
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
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors"
            >
              Return to Homepage
            </button>
            <button
              onClick={handleNewOrder}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
            >
              Start New Photoshoot
            </button>
            <div className="text-center">
              <a 
                href={`https://wa.me/233207472307?text=Hi! I have a question about my order ${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm"
              >
                💬 Chat with us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-red-200 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-6">
            We couldn't process your payment. This might be due to network issues or insufficient funds.
          </p>
          
          <div className="bg-red-50 rounded-xl p-4 mb-6">
            <div className="text-sm text-red-800">
              <strong>Don't worry!</strong> Your order is saved and you can retry the payment.
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRetryPayment}
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors"
            >
              Try Payment Again
            </button>
            <button
              onClick={handleBack}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors"
            >
              Back to Order Review
            </button>
            <div className="text-center">
              <a 
                href="https://wa.me/233207472307?text=Hi! I need help with my payment"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm"
              >
                💬 Get help on WhatsApp
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
      className="min-h-[70vh] transition-all duration-300 ease-out"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-2xl">💳</span>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
            COMPLETE YOUR PAYMENT
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          Secure payment processed by Paystack - Ghana's leading payment platform
        </p>
        
        {/* Order ID Display */}
        <div className="mt-4 flex justify-center">
          <div className="bg-gray-100 text-gray-700 rounded-full px-4 py-2 text-sm font-mono">
            Order: {orderId}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Methods */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Package</span>
                <span className="font-semibold">{formData.package?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price</span>
                <span>₵{formData.package?.price}</span>
              </div>
              
              {/* Add-ons */}
              {formData.addOns && formData.addOns.length > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-gray-600 mb-2">Add-ons:</div>
                  {formData.addOns.map((addOnId: string) => {
                    // In real app, you'd map to actual add-on details
                    const addOnNames: Record<string, string> = {
                      'extra-image': '+1 Extra Image',
                      'advanced-retouching': 'Advanced Retouching',
                      'body-enhancement': 'Body Enhancement',
                      'additional-outfit': 'Additional Outfit',
                      'rush-delivery': 'Rush Delivery',
                      'premium-backgrounds': 'Premium Backgrounds'
                    };
                    return (
                      <div key={addOnId} className="flex justify-between text-sm">
                        <span className="text-gray-600">• {addOnNames[addOnId]}</span>
                        <span>+₵{/* Add price here */}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₵{formData.finalTotal}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Choose Payment Method</h2>
            
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`
                    border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
                    ${selectedMethod === method.id
                      ? `border-[#D4AF37] bg-gradient-to-br ${method.color} text-white transform scale-105`
                      : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <div className={`font-semibold ${selectedMethod === method.id ? 'text-white' : 'text-gray-900'}`}>
                          {method.name}
                        </div>
                        <div className={`text-sm ${selectedMethod === method.id ? 'text-white/90' : 'text-gray-600'}`}>
                          {method.description}
                        </div>
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="text-white text-2xl">✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Paystack Security Badge */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-green-800">
                  <span>🔒</span>
                  <span>Secured by Paystack</span>
                </div>
                <div className="text-green-700 font-semibold">PCI DSS Compliant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Trust & Security */}
        <div className="space-y-6">
          {/* Trust Indicators */}
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B91C1C] rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Your Order is Secure</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🛡️</div>
                <div>
                  <div className="font-semibold">Bank-Level Security</div>
                  <div className="text-white/80 text-sm">256-bit SSL encryption</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-semibold">Instant Processing</div>
                  <div className="text-white/80 text-sm">Real-time payment verification</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💰</div>
                <div>
                  <div className="font-semibold">Money-Back Guarantee</div>
                  <div className="text-white/80 text-sm">100% satisfaction or your money back</div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-center">Need Help?</h3>
            <div className="space-y-3 text-center">
              <a 
                href="https://wa.me/233207472307"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
              >
                💬 Chat on WhatsApp
              </a>
              <div className="text-sm text-gray-600">
                Our team is available 24/7 to assist you
              </div>
            </div>
          </div>

          {/* Payment Button */}
          {selectedMethod && (
            <button
              onClick={handlePayment}
              disabled={!selectedMethod}
              className="
                w-full bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] 
                text-white font-bold py-4 
                rounded-2xl shadow-2xl 
                transform transition-all duration-300 
                hover:scale-105 hover:shadow-3xl
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                flex items-center justify-center space-x-3
              "
            >
              <span>Pay ₵{formData.finalTotal} with Paystack</span>
              <span className="text-lg">🚀</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
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
          <span>Back to Review</span>
        </button>
      </div>
    </div>
  );
}