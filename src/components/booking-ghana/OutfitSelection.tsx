// src/components/booking-nigeria/OutfitSelection.tsx
// Outfit selection + styling with Lucide icons

'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
    Upload, Search, Sparkles, X, Check, Shirt,
    Palette, Scissors, Heart,
    LucideIcon
} from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';

interface Outfit {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    tags: string[];
    available: boolean;
    gender?: string;
    isUploaded?: boolean;
    file?: File;
    previewUrl?: string;
}

interface StylingOptions {
    makeup: boolean;
    makeupType: 'light' | 'heavy' | 'glam' | null;
    hairstyle: boolean;
    hairstyleText: string;
    background: boolean;
    backgroundText: string;
}

interface OutfitSelectionProps {
    packageOutfits: number;
    packageName: string;
    category: string;
    selectedOutfits: Outfit[];
    onOutfitsChange: (outfits: Outfit[]) => void;
    styling: StylingOptions;
    onStylingChange: (styling: Partial<StylingOptions>) => void;
    preloadedOutfits: Outfit[];
    outfitsLoading: boolean;
    mandatoryBackground?: { enabled: boolean; text: string } | null;
}

const MANDATORY_BACKGROUNDS: Record<string, string> = {
    'birthday': 'Studio with balloons',
    'graduation': 'Academic backdrop',
    'professional': 'Professional office/studio'
};

export default function OutfitSelection({
    packageOutfits,
    packageName,
    category,
    selectedOutfits,
    onOutfitsChange,
    styling,
    onStylingChange,
    preloadedOutfits,
    outfitsLoading,
    mandatoryBackground
}: OutfitSelectionProps) {
    const [showWardrobe, setShowWardrobe] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeGender, setActiveGender] = useState<'All' | 'M' | 'F'>('All');
    const [skipped, setSkipped] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const categories = ['All', 'Official', 'Traditional', 'Semi Official', 'All Occasions', 'Blouse'];

    const hasMandatoryBackground = MANDATORY_BACKGROUNDS[category];
    const totalOutfits = selectedOutfits.length;
    const canAddMore = totalOutfits < packageOutfits;
    const uploadedOutfits = selectedOutfits.filter(o => o.isUploaded);

    const filteredOutfits = preloadedOutfits.filter(outfit => {
        let matches = true;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
                outfit.name.toLowerCase().includes(query) ||
                outfit.tags.some(tag => tag.toLowerCase().includes(query)) ||
                outfit.category.toLowerCase().includes(query)
            );
        }

        if (activeCategory !== 'All') {
            matches = matches && outfit.category === activeCategory;
        }

        if (activeGender !== 'All') {
            const g = (outfit.gender || '').toUpperCase();
            const isUnisex = g === 'UNISEX' || g === 'U';
            if (activeGender === 'M') {
                matches = matches && (g === 'MALE' || g === 'M' || isUnisex);
            } else if (activeGender === 'F') {
                matches = matches && (g === 'FEMALE' || g === 'F' || isUnisex);
            }
        }

        return matches;
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = packageOutfits - totalOutfits;
        if (remainingSlots <= 0) {
            alert(`Your package allows ${packageOutfits} outfit(s) only. Remove one to add more.`);
            e.target.value = '';
            return;
        }

        const filesToAdd = Array.from(files).slice(0, remainingSlots);

        const newUploadedOutfits: Outfit[] = filesToAdd.map((file, index) => ({
            id: `upload-${Date.now()}-${index}`,
            name: `My Outfit ${uploadedOutfits.length + index + 1}`,
            category: 'Uploaded',
            imageUrl: URL.createObjectURL(file),
            tags: ['uploaded'],
            available: true,
            isUploaded: true,
            file: file,
            previewUrl: URL.createObjectURL(file)
        }));

        onOutfitsChange([...selectedOutfits, ...newUploadedOutfits]);
        setSkipped(false);
        e.target.value = '';
    };

    const handleWardrobeToggle = (outfit: Outfit) => {
        const exists = selectedOutfits.some(o => o.id === outfit.id);

        if (exists) {
            onOutfitsChange(selectedOutfits.filter(o => o.id !== outfit.id));
        } else {
            if (!canAddMore) {
                alert(`Your package allows ${packageOutfits} outfit(s) only. Remove one to add more.`);
                return;
            }
            onOutfitsChange([...selectedOutfits, { ...outfit, isUploaded: false }]);
            setSkipped(false);
        }
    };

    const removeOutfit = (outfitId: string) => {
        const outfit = selectedOutfits.find(o => o.id === outfitId);
        if (outfit?.previewUrl) {
            URL.revokeObjectURL(outfit.previewUrl);
        }
        onOutfitsChange(selectedOutfits.filter(o => o.id !== outfitId));
    };

    const handleSkip = () => {
        setSkipped(true);
        onOutfitsChange([]);
    };

    const isOutfitInWardrobe = (outfitId: string) => selectedOutfits.some(o => o.id === outfitId && !o.isUploaded);

    return (
        <div className="w-full px-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={packageOutfits > 1}
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Section Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Outfits & Styling
                </h2>
                <p className="text-base text-gray-600">
                    Your package includes {packageOutfits} outfit{packageOutfits > 1 ? 's' : ''}
                </p>
            </div>

            {/* === OUTFIT SELECTION === */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Shirt className="w-5 h-5 text-gray-700" />
                        <span className="font-bold text-gray-900">Select Outfits</span>
                    </div>
                    <span className={`text-sm font-medium ${totalOutfits >= packageOutfits ? 'text-green-600' : 'text-gray-500'}`}>
                        {totalOutfits}/{packageOutfits}
                    </span>
                </div>

                {/* Action Buttons Row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <button
                        onClick={() => canAddMore && fileInputRef.current?.click()}
                        disabled={!canAddMore && totalOutfits > 0}
                        className={`
              p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
              ${canAddMore
                                ? 'border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10'
                                : 'border-gray-200 bg-gray-50'
                            }
            `}
                    >
                        <Upload className={`w-6 h-6 ${canAddMore ? 'text-[#D4AF37]' : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${canAddMore ? 'text-gray-900' : 'text-gray-400'}`}>Upload</span>
                    </button>

                    <button
                        onClick={() => setShowWardrobe(true)}
                        className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 flex flex-col items-center gap-2 transition-all"
                    >
                        <Shirt className="w-6 h-6 text-purple-600" />
                        <span className="text-xs font-medium text-gray-900">Wardrobe</span>
                    </button>

                    <button
                        onClick={handleSkip}
                        className={`
              p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
              ${skipped
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                            }
            `}
                    >
                        <Sparkles className={`w-6 h-6 ${skipped ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-xs font-medium text-gray-900">Skip</span>
                    </button>
                </div>

                {/* Selected Outfits Display */}
                {(totalOutfits > 0 || skipped) && (
                    <div className="bg-gray-50 rounded-2xl p-4">
                        {skipped ? (
                            <div className="text-center py-4">
                                <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">Let us style you!</p>
                                <p className="text-xs text-gray-500">Our stylists will pick perfect outfits</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-medium text-gray-700">Selected Outfits</span>
                                    <span className="text-xs text-gray-500">{totalOutfits}/{packageOutfits}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedOutfits.map((outfit) => (
                                        <div key={outfit.id} className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-[#D4AF37]">
                                            <img
                                                src={outfit.previewUrl || outfit.imageUrl}
                                                alt={outfit.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                onClick={() => removeOutfit(outfit.id)}
                                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                                <p className="text-white text-[10px] truncate flex items-center gap-1">
                                                    {outfit.isUploaded ? (
                                                        <><Upload className="w-3 h-3" /> Uploaded</>
                                                    ) : (
                                                        <><Shirt className="w-3 h-3" /> Wardrobe</>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {canAddMore && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                                        >
                                            <span className="text-2xl">+</span>
                                            <span className="text-xs">Add</span>
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* ===== STYLING SECTION ===== */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Styling Preferences</h3>
                        <p className="text-xs text-gray-500">Optional but helps us create your perfect look</p>
                    </div>
                </div>

                {/* === MAKEUP === */}
                <div className="mb-5">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500" />
                            <span className="font-medium text-gray-900">Do you want makeup?</span>
                        </div>
                        <div
                            onClick={() => onStylingChange({ makeup: !styling.makeup, makeupType: null })}
                            className={`
                w-14 h-8 rounded-full p-1 transition-colors cursor-pointer
                ${styling.makeup ? 'bg-[#D4AF37]' : 'bg-gray-300'}
              `}
                        >
                            <div className={`
                w-6 h-6 bg-white rounded-full shadow transition-transform
                ${styling.makeup ? 'translate-x-6' : 'translate-x-0'}
              `} />
                        </div>
                    </label>

                    {styling.makeup && (
                        <div className="mt-3 bg-white rounded-xl p-4 space-y-2">
                            {[
                                { value: 'light', label: 'Light Makeup', desc: 'Natural, subtle look' },
                                { value: 'heavy', label: 'Heavy Makeup', desc: 'Bold, dramatic look' },
                                { value: 'glam', label: 'Glam Makeup', desc: 'Full glam, photo-ready' }
                            ].map((option) => (
                                <label
                                    key={option.value}
                                    className={`
                    flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                    ${styling.makeupType === option.value
                                            ? 'bg-[#D4AF37]/10 border-2 border-[#D4AF37]'
                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                        }
                  `}
                                >
                                    <input
                                        type="radio"
                                        name="makeupType"
                                        value={option.value}
                                        checked={styling.makeupType === option.value}
                                        onChange={(e) => onStylingChange({ makeupType: e.target.value as any })}
                                        className="sr-only"
                                    />
                                    <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${styling.makeupType === option.value ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-gray-300'}
                  `}>
                                        {styling.makeupType === option.value && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{option.label}</p>
                                        <p className="text-xs text-gray-500">{option.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* === HAIRSTYLE === */}
                <div className="mb-5">
                    <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer">
                        <div className="flex items-center gap-2">
                            <Scissors className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-900">Hairstyle preference?</span>
                        </div>
                        <div
                            onClick={() => onStylingChange({ hairstyle: !styling.hairstyle, hairstyleText: '' })}
                            className={`
                w-14 h-8 rounded-full p-1 transition-colors cursor-pointer
                ${styling.hairstyle ? 'bg-[#D4AF37]' : 'bg-gray-300'}
              `}
                        >
                            <div className={`
                w-6 h-6 bg-white rounded-full shadow transition-transform
                ${styling.hairstyle ? 'translate-x-6' : 'translate-x-0'}
              `} />
                        </div>
                    </label>

                    {styling.hairstyle && (
                        <div className="mt-3">
                            <input
                                type="text"
                                value={styling.hairstyleText}
                                onChange={(e) => onStylingChange({ hairstyleText: e.target.value })}
                                placeholder="e.g., Low cut, braids, afro, natural curls..."
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm"
                            />
                        </div>
                    )}
                </div>

                {/* === BACKGROUND === */}
                <div>
                    {hasMandatoryBackground ? (
                        <div className="p-3 bg-gray-100 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Palette className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Background</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                    Default for {packageName}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium pl-7">{hasMandatoryBackground}</p>
                        </div>
                    ) : (
                        <>
                            <label className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Palette className="w-5 h-5 text-orange-500" />
                                    <span className="font-medium text-gray-900">Background preference?</span>
                                </div>
                                <div
                                    onClick={() => onStylingChange({ background: !styling.background, backgroundText: '' })}
                                    className={`
                    w-14 h-8 rounded-full p-1 transition-colors cursor-pointer
                    ${styling.background ? 'bg-[#D4AF37]' : 'bg-gray-300'}
                  `}
                                >
                                    <div className={`
                    w-6 h-6 bg-white rounded-full shadow transition-transform
                    ${styling.background ? 'translate-x-6' : 'translate-x-0'}
                  `} />
                                </div>
                            </label>

                            {styling.background && (
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        value={styling.backgroundText}
                                        onChange={(e) => onStylingChange({ backgroundText: e.target.value })}
                                        placeholder="e.g., Office setting, outdoor, studio, beach..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                Our team will contact you for further clarity on styling
            </p>

            {/* Wardrobe Modal */}
            {showWardrobe && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowWardrobe(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* STICKY Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Shirt className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-lg font-bold">Browse Wardrobe</h3>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${totalOutfits >= packageOutfits ? 'text-green-600' : 'text-gray-500'}`}>
                                        {totalOutfits}/{packageOutfits}
                                    </span>
                                    <button
                                        onClick={() => setShowWardrobe(false)}
                                        className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-bold text-sm"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search outfits..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#D4AF37] outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                )}
                            </div>

                            {/* Gender Filters */}
                            <div className="flex gap-2 mb-3">
                                {['All', 'M', 'F'].map((g) => (
                                    <button
                                        key={g}
                                        onClick={() => setActiveGender(g as any)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${activeGender === g ? 'bg-black text-white' : 'bg-gray-100'
                                            }`}
                                    >
                                        {g === 'All' ? 'ALL' : g === 'M' ? 'MEN' : 'WOMEN'}
                                    </button>
                                ))}
                            </div>

                            {/* Category Pills */}
                            <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-gray-600'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Outfit Grid */}
                        <div className="overflow-y-auto flex-1 p-4">
                            {outfitsLoading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-gray-500 mt-2">Loading outfits...</p>
                                </div>
                            ) : filteredOutfits.length === 0 ? (
                                <div className="text-center py-12">
                                    <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <p className="text-gray-500">No outfits found</p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="text-[#D4AF37] text-sm font-medium mt-2"
                                        >
                                            Clear search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pb-20">
                                    {filteredOutfits.map(outfit => {
                                        const isSelected = isOutfitInWardrobe(outfit.id);
                                        const isDisabled = !isSelected && !canAddMore;

                                        return (
                                            <button
                                                key={outfit.id}
                                                onClick={() => handleWardrobeToggle(outfit)}
                                                disabled={isDisabled}
                                                className={`
                          relative rounded-xl overflow-hidden aspect-[3/4] group text-left
                          ${isSelected ? 'ring-2 ring-[#D4AF37]' : ''}
                          ${isDisabled ? 'opacity-50' : ''}
                        `}
                                            >
                                                <OptimizedImage
                                                    src={outfit.imageUrl}
                                                    alt={outfit.name}
                                                    className="w-full h-full object-cover"
                                                />

                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-[#D4AF37]/30 flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                                            <Check className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                                    <p className="text-white text-xs font-bold truncate">{outfit.name}</p>
                                                    <p className="text-white/70 text-[10px]">{outfit.category}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
