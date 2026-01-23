// src/components/shared/WhatsAppFloat.tsx - REVAMPED
'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '233207472307';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Radikal!%20I'm%20interested%20in%20your%20services`;

  // Show tooltip on mount for 3 seconds
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-16 bottom-0 bg-black text-white px-4 py-3 rounded-xl shadow-2xl max-w-xs mb-4 animate-fadeIn">
          <div className="flex justify-between items-start mb-2">
            <span className="font-semibold text-[#D4AF37]">Need help?</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm">Chat with us on WhatsApp for instant support!</p>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-3 h-3 bg-black"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative inline-block ${isHovered ? 'animate-glow' : 'animate-bounce-glow'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Pulsing Ring Effect */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20"></div>

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#B91C1C] rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
          1
        </div>

        {/* Main Button */}
        <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-2xl transform transition-all duration-300 hover:scale-110 hover:rotate-12">
          <MessageCircle className="w-6 h-6" />
        </div>
      </a>
    </div>
  );
}