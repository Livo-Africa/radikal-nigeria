// src/components/booking-nigeria/CategoryGrid.tsx
// Category selection grid - 5 categories in 2-column layout

'use client';
import { CATEGORIES, Category } from '@/utils/bookingDataNigeria';

interface CategoryGridProps {
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export default function CategoryGrid({ selectedId, onSelect }: CategoryGridProps) {
    const handleSelect = (category: Category) => {
        onSelect(category.id);
    };

    return (
        <div className="w-full">
            {/* Section Header - BIGGER AND MORE READABLE */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select Purpose
                </h2>
                <p className="text-base text-gray-600">
                    What type of photoshoot do you need?
                </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                {CATEGORIES.map((category, index) => {
                    const isSelected = selectedId === category.id;
                    const isLastItem = index === CATEGORIES.length - 1;

                    return (
                        <button
                            key={category.id}
                            onClick={() => handleSelect(category)}
                            className={`
                relative aspect-[4/5] rounded-2xl p-4 flex flex-col items-center justify-center
                transition-all duration-300 transform active:scale-95
                border-2
                ${isLastItem ? 'col-span-2 max-w-[calc(50%-6px)] mx-auto' : ''}
                ${isSelected
                                    ? 'bg-black text-white border-[#D4AF37] shadow-xl scale-[1.02]'
                                    : 'bg-white text-gray-900 border-gray-200 hover:border-[#D4AF37]/50 hover:shadow-lg'
                                }
              `}
                        >
                            {/* Icon */}
                            <span className="text-5xl mb-3">{category.icon}</span>

                            {/* Label */}
                            <span className={`font-bold text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                {category.label}
                            </span>

                            {/* Price Range */}
                            <span className={`text-sm ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`}>
                                {category.priceRange}
                            </span>

                            {/* Selection indicator */}
                            {isSelected && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
