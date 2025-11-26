// components/shared/MobileOptimized.tsx - UTILITIES
'use client';
import { ReactNode } from 'react';

// Mobile-optimized text component
interface MobileTextProps {
  children: ReactNode;
  mobile?: string;
  desktop?: string;
  className?: string;
}

export function MobileText({ children, mobile, desktop, className = "" }: MobileTextProps) {
  return (
    <span className={`
      ${mobile ? `block lg:hidden ${mobile}` : ''}
      ${desktop ? `hidden lg:block ${desktop}` : ''}
      ${className}
    `}>
      {children}
    </span>
  );
}

// Icon-only mobile button
interface MobileIconButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export function MobileIconButton({ icon, label, onClick, className = "" }: MobileIconButtonProps) {
  return (
    <>
      {/* Mobile - Icon Only */}
      <button
        onClick={onClick}
        className={`lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
        aria-label={label}
      >
        {icon}
      </button>
      
      {/* Desktop - Full Button */}
      <button
        onClick={onClick}
        className={`hidden lg:flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
      >
        {icon}
        <span>{label}</span>
      </button>
    </>
  );
}