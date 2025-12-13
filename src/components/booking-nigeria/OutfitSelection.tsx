// src/components/booking-nigeria/OutfitSelection.tsx
// Outfit selection + styling - package-aware with wardrobe search

'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Search, Sparkles, X, Check, Shirt } from 'lucide-react';
import OptimizedImage from '@/components/shared/OptimizedImage';

type OutfitMethod = 'upload' | 'wardrobe' | 'skip' | null;

interface Outfit {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    tags: string[];
    available: boolean;
    gender?: string;
}

interface StylingOptions {
    makeup: boolean;
    hairstyle: string;
    background: string;
}

interface OutfitSelectionProps {
    packageOutfits: number;
    packageName: string;
    category: string; // To determine mandatory backgrounds
    method: OutfitMethod;
    onMethodSelect: (method: OutfitMethod) => void;
    selectedOutfits: Outfit[];
    onOutfitToggle: (outfit: Outfit) => void;
    uploadedFiles: File[];
    onUploadOutfits: (files: File[]) => void;
    styling: StylingOptions;
    onStylingChange: (styling: Partial<StylingOptions>) => void;
    preloadedOutfits: Outfit[]; // Preloaded from parent
    outfitsLoading: boolean;
}

// Packages that require mandatory background selection
const MANDATORY_BACKGROUND_PACKAGES = ['birthday', 'professional', 'graduation'];

export default function OutfitSelection({
    packageOutfits,
    packageName,
    category,
    method,
    onMethodSelect,
    selectedOutfits,
    onOutfitToggle,
    uploadedFiles,
    onUploadOutfits,
    styling,
    onStylingChange,
    preloadedOutfits,
    outfitsLoading
}: OutfitSelectionProps) {
    const [showWardrobe, setShowWardrobe] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeGender, setActiveGender] = useState<'All' | 'M' | 'F'>('All');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);

    const categories = ['All', 'Professional', 'Casual', 'Formal', 'Cultural', 'Creative'];

    // Check if background is mandatory for this package
    const requiresBackground = MANDATORY_BACKGROUND_PACKAGES.includes(category);

    // Generate previews for uploaded files
    useEffect(() => {
        const previews = uploadedFiles.map(file => URL.createObjectURL(file));
        setUploadPreviews(previews);

        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [uploadedFiles]);

    // Filter outfits with search
    const filteredOutfits = preloadedOutfits.filter(outfit => {
        let matches = true;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches = matches && (
                outfit.name.toLowerCase().includes(query) ||
                outfit.tags.some(tag => tag.toLowerCase().includes(query)) ||
                outfit.category.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (activeCategory !== 'All') {
            matches = matches && outfit.category === activeCategory;
        }

        // Gender filter
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

    // Handle upload click - immediately open file picker
    const handleUploadClick = useCallback(() => {
        onMethodSelect('upload');
        // Immediately open file picker
        setTimeout(() => {
            fileInputRef.current?.click();
        }, 100);
    }, [onMethodSelect]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Enforce package limit
        const remainingSlots = packageOutfits - uploadedFiles.length;
        const filesToAdd = Array.from(files).slice(0, remainingSlots);

        if (filesToAdd.length < files.length) {
            alert(`Your package allows ${packageOutfits} outfit(s). Only ${remainingSlots} more can be added.`);
        }

        const newFiles = [...uploadedFiles, ...filesToAdd];
        onUploadOutfits(newFiles);
        e.target.value = '';
    };

    const removeUploadedFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        onUploadOutfits(newFiles);
    };

    const handleOutfitToggle = (outfit: Outfit) => {
        const isSelected = selectedOutfits.some(o => o.id === outfit.id);

        // If selecting and at limit, don't allow
        if (!isSelected && selectedOutfits.length >= packageOutfits) {
            alert(`Your package allows ${packageOutfits} outfit(s) only.`);
            return;
        }

        onOutfitToggle(outfit);
    };

    const isOutfitSelected = (outfitId: string) => selectedOutfits.some(o => o.id === outfitId);

    return (
        <div className="w-full px-4">
            {/* Hidden file input */}
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
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Outfits & Styling
                </h2>
                <p className="text-gray-500 text-sm">
                    Your package includes {packageOutfits} outfit{packageOutfits > 1 ? 's' : ''}
                </p>
            </div>

            {/* Outfit Selection Methods */}
            <div className="space-y-3 mb-6">
                {/* Upload Option - Opens file picker immediately */}
                <button
                    onClick={handleUploadClick}
                    className={`
            w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'upload'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Upload my outfit photos</span>
                        <p className="text-sm text-gray-500">
                            {uploadedFiles.length > 0
                                ? `${uploadedFiles.length}/${packageOutfits} uploaded`
                                : 'Photos of outfits you own'
                            }
                        </p>
                    </div>
                    {method === 'upload' && uploadedFiles.length > 0 && (
                        <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {uploadedFiles.length}
                        </span>
                    )}
                </button>

                {/* Browse Wardrobe Option */}
                <button
                    onClick={() => { onMethodSelect('wardrobe'); setShowWardrobe(true); }}
                    className={`
            w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'wardrobe'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Browse our wardrobe</span>
                        <p className="text-sm text-gray-500">
                            {selectedOutfits.length > 0
                                ? `${selectedOutfits.length}/${packageOutfits} selected`
                                : 'Choose from our collection'
                            }
                        </p>
                    </div>
                    {selectedOutfits.length > 0 && (
                        <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {selectedOutfits.length}
                        </span>
                    )}
                </button>

                {/* Skip Option */}
                <button
                    onClick={() => onMethodSelect('skip')}
                    className={`
            w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'skip'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Let us choose</span>
                        <p className="text-sm text-gray-500">Our stylists will pick perfect outfits</p>
                    </div>
                    {method === 'skip' && (
                        <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                        </div>
                    )}
                </button>
            </div>

            {/* Upload Preview Grid */}
            {method === 'upload' && uploadedFiles.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Uploaded Outfits</span>
                        <span className="text-xs text-gray-500">{uploadedFiles.length}/{packageOutfits}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {uploadPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                                <img src={preview} alt={`Outfit ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeUploadedFile(index)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        {/* Add More Button (if under limit) */}
                        {uploadedFiles.length < packageOutfits && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                            >
                                <span className="text-2xl">+</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Selected Wardrobe Outfits */}
            {method === 'wardrobe' && selectedOutfits.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Selected from Wardrobe</span>
                        <button
                            onClick={() => setShowWardrobe(true)}
                            className="text-xs text-[#D4AF37] font-medium"
                        >
                            Edit selection
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {selectedOutfits.map((outfit) => (
                            <div key={outfit.id} className="relative aspect-square rounded-xl overflow-hidden ring-2 ring-[#D4AF37]">
                                <OptimizedImage src={outfit.imageUrl} alt={outfit.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                    <p className="text-white text-[10px] truncate">{outfit.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== STYLING SECTION ===== */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 mb-4 border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">💄</span>
                    <div>
                        <h3 className="font-bold text-gray-900">Do you want makeup?</h3>
                        <p className="text-xs text-gray-500">Let us know your styling preferences</p>
                    </div>
                </div>

                {/* Makeup Toggle */}
                <label className="flex items-center justify-between p-3 bg-white rounded-xl mb-3 cursor-pointer">
                    <span className="font-medium text-gray-900">Yes, I'd like makeup!</span>
                    <div
                        onClick={() => onStylingChange({ makeup: !styling.makeup })}
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

                {/* Hairstyle Input */}
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        ✂️ Hairstyle preference
                    </label>
                    <input
                        type="text"
                        value={styling.hairstyle}
                        onChange={(e) => onStylingChange({ hairstyle: e.target.value })}
                        placeholder="e.g., Low cut, braids, afro, natural..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm"
                    />
                </div>

                {/* Background Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        🎨 Background/Theme
                        {requiresBackground && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Required</span>
                        )}
                    </label>
                    <input
                        type="text"
                        value={styling.background}
                        onChange={(e) => onStylingChange({ background: e.target.value })}
                        placeholder="e.g., Office setting, birthday theme, outdoor..."
                        className={`
              w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all text-sm
              ${requiresBackground && !styling.background ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-[#D4AF37]'}
            `}
                    />
                    {requiresBackground && !styling.background && (
                        <p className="text-xs text-red-500 mt-1">
                            {packageName} package requires a background/theme
                        </p>
                    )}
                </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
                💡 Our team will contact you for further clarity on styling
            </p>

            {/* Wardrobe Modal with Search */}
            {showWardrobe && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowWardrobe(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Browse Wardrobe</h3>
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${selectedOutfits.length >= packageOutfits ? 'text-green-600' : 'text-gray-500'}`}>
                                        {selectedOutfits.length}/{packageOutfits}
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
                                        const isSelected = isOutfitSelected(outfit.id);
                                        const isDisabled = !isSelected && selectedOutfits.length >= packageOutfits;

                                        return (
                                            <button
                                                key={outfit.id}
                                                onClick={() => handleOutfitToggle(outfit)}
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

                                                {/* Selection Overlay */}
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-[#D4AF37]/30 flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                                                            <Check className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Info Badge */}
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
