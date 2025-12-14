// src/components/booking-nigeria/SuccessScreen.tsx
// Order confirmation with WhatsApp tracking link

'use client';
import { useState, useEffect } from 'react';
import { formatNaira, generateWhatsAppLink } from '@/utils/bookingDataNigeria';

interface SuccessScreenProps {
    orderId: string;
    packageName: string;
    amount: number;
    whatsappNumber: string;
    onNewBooking: () => void;
}

// Ghana business WhatsApp number
const BUSINESS_WHATSAPP = '233207472307';

export default function SuccessScreen({
    orderId,
    packageName,
    amount,
    whatsappNumber,
    onNewBooking
}: SuccessScreenProps) {
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const whatsappLink = generateWhatsAppLink(orderId, packageName, amount, BUSINESS_WHATSAPP);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-20px',
                                animationDelay: `${Math.random() * 1}s`,
                                backgroundColor: ['#D4AF37', '#22C55E', '#3B82F6', '#EC4899', '#F97316'][Math.floor(Math.random() * 5)],
                                width: `${6 + Math.random() * 6}px`,
                                height: `${6 + Math.random() * 6}px`,
                                borderRadius: Math.random() > 0.5 ? '50%' : '0'
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Success Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center relative z-10">
                {/* Success Icon */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                    <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Booking Confirmed!
                </h1>
                <p className="text-gray-600 mb-6">
                    Thank you! We're already working on your amazing photos.
                </p>

                {/* Order Details Box */}
                <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-900">Order Details</span>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-mono font-bold text-gray-900">{orderId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Package</span>
                            <span className="font-medium text-gray-900">{packageName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Amount Paid</span>
                            <span className="font-bold text-green-600">{formatNaira(amount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Delivery To</span>
                            <span className="font-medium text-gray-900">{whatsappNumber}</span>
                        </div>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-blue-50 rounded-2xl p-4 mb-6 text-left">
                    <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2">
                        <span>⏱️</span>
                        <span>What happens next?</span>
                    </h3>
                    <ul className="text-xs text-blue-800 space-y-1">
                        <li>1. Our team starts processing immediately</li>
                        <li>2. We'll contact you if we need clarification</li>
                        <li>3. Receive your photos via WhatsApp</li>
                        <li>4. Support available 24/7 via WhatsApp</li>
                    </ul>
                </div>

                {/* WhatsApp Button */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-green-500/30 transition-all active:scale-[0.98] mb-4"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>Track Order on WhatsApp</span>
                </a>

                <p className="text-xs text-gray-500 mb-6">
                    Click to receive instant updates on your order status
                </p>

                {/* New Booking Button */}
                <button
                    onClick={onNewBooking}
                    className="text-[#D4AF37] font-bold text-sm hover:underline"
                >
                    Start a new booking →
                </button>
            </div>

            <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
        @keyframes checkmark {
          0% {
            stroke-dasharray: 0 100;
          }
          100% {
            stroke-dasharray: 100 0;
          }
        }
        .animate-checkmark path {
          stroke-dasharray: 100;
          animation: checkmark 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
