'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  AlertCircle,
  RotateCcw,
  MessageCircle
} from 'lucide-react';

interface Step7PaymentProps {
  formData: any;
  setFormData: (data: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'validating';

interface PaymentError {
  type: 'sheets' | 'telegram' | 'sms' | 'whatsapp' | 'payment';
  message: string;
  retryable: boolean;
}

export default function Step7Payment({ formData, setFormData, currentStep, setCurrentStep }: Step7PaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');
  const [errors, setErrors] = useState<PaymentError[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [processingStep, setProcessingStep] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  const paymentMethods = [
    { 
      id: 'mobile-money', 
      name: 'Mobile Money', 
      icon: Smartphone, 
      description: 'Pay with MTN, Vodafone, or AirtelTigo', 
      color: 'from-green-500 to-green-600' 
    },
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      icon: CreditCard, 
      description: 'Visa, Mastercard, or American Express', 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      id: 'bank-transfer', 
      name: 'Bank Transfer', 
      icon: Building, 
      description: 'Direct transfer to our bank account', 
      color: 'from-purple-500 to-purple-600' 
    },
  ];

  // Validate order data before processing
  const validateOrderData = (): { isValid: boolean; errors: string[] } => {
    const validationErrors: string[] = [];

    if (!formData.whatsappNumber || !/^\+233[0-9]{9}$/.test(formData.whatsappNumber)) {
      validationErrors.push('Valid WhatsApp number is required');
    }

    if (!formData.package?.name || !formData.package?.price) {
      validationErrors.push('Valid package selection is required');
    }

    if (!formData.finalTotal || formData.finalTotal <= 0) {
      validationErrors.push('Valid total amount is required');
    }

    if (!formData.photos || formData.photos.length === 0) {
      validationErrors.push('At least one photo is required');
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors
    };
  };

  // Generate order ID on component mount
  useEffect(() => {
    const newOrderId = `RAD-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setOrderId(newOrderId);
  }, []);

  // Enhanced backend service with retry logic
  const sendToBackendService = async (url: string, data: any, serviceName: string, maxRetries = 2): Promise<boolean> => {
    let attempts = 0;
    
    while (attempts <= maxRetries) {
      try {
        setProcessingStep(`Sending to ${serviceName}...${attempts > 0 ? ` (Retry ${attempts})` : ''}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error(`${serviceName} responded with ${response.status}`);
        }

        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || `${serviceName} failed`);
        }

        console.log(`✅ ${serviceName} successful`);
        return true;

      } catch (error) {
        attempts++;
        console.error(`❌ ${serviceName} attempt ${attempts} failed:`, error);
        
        if (attempts > maxRetries) {
          setErrors(prev => [...prev, {
            type: serviceName.toLowerCase() as any,
            message: `Failed to connect to ${serviceName}`,
            retryable: true
          }]);
          return false;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
      }
    }
    
    return false;
  };

  // MAIN PAYMENT PROCESSING WITH COMPREHENSIVE ERROR HANDLING
  const processOrder = async (): Promise<boolean> => {
    setPaymentStatus('validating');
    
    // Step 1: Validate order data
    const validation = validateOrderData();
    if (!validation.isValid) {
      setErrors(validation.errors.map(msg => ({
        type: 'payment',
        message: msg,
        retryable: false
      })));
      setPaymentStatus('failed');
      return false;
    }

    setPaymentStatus('processing');
    setErrors([]);

    const orderData = {
      orderId,
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'paid',
      paymentMethod: selectedMethod
    };

    try {
      // Step 2: Send to Google Sheets (CRITICAL - must succeed)
      setProcessingStep('Saving order to database...');
      const sheetsSuccess = await sendToBackendService('/api/orders', orderData, 'Google Sheets', 3);
      
      if (!sheetsSuccess) {
        throw new Error('Failed to save order to database');
      }

      // Step 3: Send notifications (can fail without blocking success)
      const notificationPromises = [
        sendToBackendService('/api/telegram/notify', {
          orderId,
          customer: formData.whatsappNumber,
          package: formData.package?.name,
          amount: formData.finalTotal,
          urgent: formData.addOns?.includes('rush-delivery'),
        }, 'Telegram', 1),
        
        sendToBackendService('/api/sms/send-confirmation', {
          to: formData.whatsappNumber,
          orderId,
          package: formData.package?.name,
          amount: formData.finalTotal,
          deliveryTime: formData.addOns?.includes('rush-delivery') ? '1 hour' : formData.package?.deliveryTime
        }, 'SMS', 1),
        
        sendToBackendService('/api/whatsapp/send-order-received', {
          to: formData.whatsappNumber,
          orderId,
          package: formData.package?.name
        }, 'WhatsApp', 1)
      ];

      // Wait for all notifications but don't fail the order if they fail
      const notificationResults = await Promise.allSettled(notificationPromises);
      notificationResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`⚠️ Notification service ${index} failed but order was saved`);
        }
      });

      // Step 4: Clear session data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('radikal_booking_progress');
        localStorage.removeItem('radikal_selected_outfits');
        localStorage.removeItem('radikal_session_id');
      }

      setPaymentStatus('success');
      return true;

    } catch (error) {
      console.error('❌ Order processing failed:', error);
      setPaymentStatus('failed');
      setErrors(prev => [...prev, {
        type: 'payment',
        message: 'Failed to process your order. Please try again.',
        retryable: true
      }]);
      return false;
    }
  };

  // Simulate Paystack payment integration
  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setRetryCount(0);
    setErrors([]);

    try {
      // Simulate API call to Paystack
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 95% success rate for demo
          Math.random() > 0.05 ? resolve(true) : reject(new Error('Payment gateway timeout'));
        }, 2000);
      });
      
      // Process order after successful payment
      await processOrder();

    } catch (error) {
      console.error('💳 Payment error:', error);
      setPaymentStatus('failed');
      setErrors([{
        type: 'payment',
        message: 'Payment processing failed. Please check your payment details and try again.',
        retryable: true
      }]);
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
    setErrors([]);
    setRetryCount(prev => prev + 1);
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
  if (paymentStatus === 'processing' || paymentStatus === 'validating') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-[#D4AF37] mx-auto mb-6 flex items-center justify-center">
            <Loader2 className="h-10 w-10 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {paymentStatus === 'validating' ? 'Validating Your Order' : 'Processing Your Payment'}
          </h1>
          <p className="text-gray-600 mb-6">
            {paymentStatus === 'validating' 
              ? 'Checking your order details...' 
              : 'Please wait while we securely process your payment with Paystack...'
            }
          </p>
          
          {processingStep && (
            <div className="bg-blue-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-800">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">{processingStep}</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Secure connection established</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Processing ₵{formData.finalTotal}...</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <span>Encrypting transaction...</span>
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
          <div className="text-6xl mb-4 animate-bounce text-green-500">
            <CheckCircle className="h-16 w-16 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order! We're already working on your amazing photos.
          </p>
          
          {/* Order Summary */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
            <div className="font-semibold text-gray-900 mb-2">Order Confirmation:</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Order ID: <strong className="font-mono">{orderId}</strong></div>
              <div>Package: {formData.package?.name}</div>
              <div>Amount Paid: <strong>₵{formData.finalTotal}</strong></div>
              <div>Delivery: {formData.addOns?.includes('rush-delivery') ? '1 HOUR ⚡' : formData.package?.deliveryTime}</div>
              <div>To: {formData.whatsappNumber}</div>
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
              className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
            >
              <span>Return to Homepage</span>
            </button>
            <button
              onClick={handleNewOrder}
              className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-2xl hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Start New Photoshoot</span>
            </button>
            <div className="text-center">
              <a 
                href={`https://wa.me/233207472307?text=Hi! I have a question about my order ${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm flex items-center justify-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat with us on WhatsApp</span>
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
          <div className="text-6xl mb-4 text-red-500">
            <XCircle className="h-16 w-16 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {errors.some(e => !e.retryable) ? 'Order Validation Failed' : 'Payment Failed'}
          </h1>
          
          {/* Error Details */}
          {errors.length > 0 && (
            <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Issues detected:</span>
              </div>
              <div className="space-y-2 text-sm text-red-700">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span>•</span>
                    <span>{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            {errors.some(e => e.retryable) && (
              <button
                onClick={handleRetryPayment}
                className="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-2xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>
                  {retryCount > 0 ? `Try Again (${retryCount})` : 'Try Payment Again'}
                </span>
              </button>
            )}
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
                className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm flex items-center justify-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
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
      className="min-h-[70vh] transition-all duration-300 ease-out"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <CreditCard className="h-8 w-8 text-[#D4AF37]" />
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
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-[#D4AF37]" />
              Order Summary
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
              
              {/* Add-ons */}
              {formData.addOns && formData.addOns.length > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-gray-600 mb-2">Add-ons:</div>
                  {formData.addOns.map((addOnId: string) => {
                    const addOnNames: Record<string, string> = {
                      'extra-image': '+1 Extra Image',
                      'advanced-retouching': 'Advanced Retouching',
                      'body-enhancement': 'Body Enhancement',
                      'additional-outfit': 'Additional Outfit',
                      'rush-delivery': 'Rush Delivery',
                      'premium-backgrounds': 'Premium Backgrounds'
                    };
                    const addOnPrices: Record<string, number> = {
                      'extra-image': 10,
                      'advanced-retouching': 15,
                      'body-enhancement': 50,
                      'additional-outfit': 40,
                      'rush-delivery': 30,
                      'premium-backgrounds': 25
                    };
                    return (
                      <div key={addOnId} className="flex justify-between text-sm">
                        <span className="text-gray-600">• {addOnNames[addOnId]}</span>
                        <span>+₵{addOnPrices[addOnId]}</span>
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
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-300
                      ${isSelected
                        ? `border-[#D4AF37] bg-gradient-to-br ${method.color} text-white transform scale-105`
                        : 'border-gray-200 hover:border-[#D4AF37]/50 hover:scale-102'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`h-6 w-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        <div>
                          <div className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {method.name}
                          </div>
                          <div className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                            {method.description}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paystack Security Badge */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-green-800">
                  <Shield className="h-4 w-4" />
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
                <Shield className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Bank-Level Security</div>
                  <div className="text-white/80 text-sm">256-bit SSL encryption</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Loader2 className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Instant Processing</div>
                  <div className="text-white/80 text-sm">Real-time payment verification</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6" />
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
                className="block bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Chat on WhatsApp</span>
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
              <CreditCard className="h-5 w-5" />
              <span>Pay ₵{formData.finalTotal} with Paystack</span>
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