// src/components/booking-nigeria/OutfitSelection.tsx
// Outfit selection with 3 methods: upload, browse wardrobe modal, auto-select

'use client';
import { useState, useRef, useEffect } from 'react';
import OptimizedImage from '@/components/shared/OptimizedImage';

type OutfitMethod = 'upload' | 'wardrobe' | 'auto' | null;

interface Outfit {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    tags: string[];
    available: boolean;
    gender?: string;
}

interface OutfitSelectionProps {
    packageOutfits: number;
    method: OutfitMethod;
    onMethodSelect: (method: OutfitMethod) => void;
    selectedOutfits: string[];
    onOutfitToggle: (outfitId: string) => void;
    uploadedFiles: File[];
    onUploadOutfits: (files: File[]) => void;
    autoStyle: boolean;
}

export default function OutfitSelection({
    packageOutfits,
    method,
    onMethodSelect,
    selectedOutfits,
    onOutfitToggle,
    uploadedFiles,
    onUploadOutfits,
    autoStyle
}: OutfitSelectionProps) {
    const [showWardrobe, setShowWardrobe] = useState(false);
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeGender, setActiveGender] = useState<'All' | 'M' | 'F'>('All');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);

    const categories = ['All', 'Professional', 'Casual', 'Formal', 'Cultural', 'Creative'];

    // Fetch outfits from API when wardrobe opens
    useEffect(() => {
        if (showWardrobe && outfits.length === 0) {
            fetchOutfits();
        }
    }, [showWardrobe]);

    // Generate previews for uploaded files
    useEffect(() => {
        const previews = uploadedFiles.map(file => URL.createObjectURL(file));
        setUploadPreviews(previews);

        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [uploadedFiles]);

    const fetchOutfits = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/outfits');
            const data = await response.json();
            if (data.outfits) {
                setOutfits(data.outfits);
            }
        } catch (error) {
            console.error('Failed to load outfits:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter outfits
    const filteredOutfits = outfits.filter(outfit => {
        let matches = true;

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

    const handleMethodClick = (newMethod: OutfitMethod) => {
        if (newMethod === 'wardrobe') {
            setShowWardrobe(true);
        }
        onMethodSelect(newMethod);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = [...uploadedFiles, ...Array.from(files)];
        onUploadOutfits(newFiles);
        e.target.value = '';
    };

    const removeUploadedFile = (index: number) => {
        const newFiles = uploadedFiles.filter((_, i) => i !== index);
        onUploadOutfits(newFiles);
    };

    const isOutfitSelected = (outfitId: string) => selectedOutfits.includes(outfitId);

    return (
        <div className="w-full px-4">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
            />

            {/* Section Header */}
            <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Choose Outfits
                </h2>
                <p className="text-gray-500 text-sm">
                    Your package includes {packageOutfits} outfit{packageOutfits > 1 ? 's' : ''}
                </p>
            </div>

            {/* Three Method Options */}
            <div className="grid grid-cols-1 gap-3 mb-6">
                {/* Upload Option */}
                <button
                    onClick={() => handleMethodClick('upload')}
                    className={`
            p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'upload'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <span className="text-3xl">📤</span>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Upload my outfit photos</span>
                        <p className="text-sm text-gray-500">Use photos of outfits you already own</p>
                    </div>
                    {method === 'upload' && (
                        <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>

                {/* Browse Wardrobe Option */}
                <button
                    onClick={() => handleMethodClick('wardrobe')}
                    className={`
            p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'wardrobe'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <span className="text-3xl">👔</span>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Browse wardrobe</span>
                        <p className="text-sm text-gray-500">Choose from our curated digital collection</p>
                    </div>
                    {method === 'wardrobe' && selectedOutfits.length > 0 && (
                        <span className="bg-[#D4AF37] text-white text-xs font-bold px-2 py-1 rounded-full">
                            {selectedOutfits.length} selected
                        </span>
                    )}
                </button>

                {/* Auto-Select Option */}
                <button
                    onClick={() => handleMethodClick('auto')}
                    className={`
            p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all
            ${method === 'auto'
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }
          `}
                >
                    <span className="text-3xl">✨</span>
                    <div className="flex-1">
                        <span className="font-bold text-gray-900">Let us choose</span>
                        <p className="text-sm text-gray-500">Our stylists will select perfect outfits</p>
                    </div>
                    {method === 'auto' && (
                        <div className="w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>
            </div>

            {/* Upload Preview Section */}
            {method === 'upload' && (
                <div className="bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {uploadPreviews.map((preview, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                                <img src={preview} alt={`Outfit ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeUploadedFile(index)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* Add More Button */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                        >
                            <span className="text-2xl">+</span>
                            <span className="text-xs">Add</span>
                        </button>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                        {uploadedFiles.length > 0
                            ? `${uploadedFiles.length} outfit${uploadedFiles.length > 1 ? 's' : ''} uploaded`
                            : 'Tap + to upload outfit photos'
                        }
                    </p>
                </div>
            )}

            {/* Wardrobe Modal */}
            {showWardrobe && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowWardrobe(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Browse Wardrobe</h3>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-gray-500">
                                        {selectedOutfits.length}/{packageOutfits} selected
                                    </span>
                                    <button
                                        onClick={() => setShowWardrobe(false)}
                                        className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg font-bold text-sm"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={() => setActiveGender('All')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'All' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                >
                                    ALL
                                </button>
                                <button
                                    onClick={() => setActiveGender('M')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'M' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                >
                                    MEN
                                </button>
                                <button
                                    onClick={() => setActiveGender('F')}
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${activeGender === 'F' ? 'bg-black text-white' : 'bg-gray-100'}`}
                                >
                                    WOMEN
                                </button>
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
                        <div className="overflow-y-auto max-h-[60vh] p-4">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-gray-500 mt-2">Loading outfits...</p>
                                </div>
                            ) : filteredOutfits.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No outfits found</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3">
                                    {filteredOutfits.map(outfit => {
                                        const isSelected = isOutfitSelected(outfit.id);
                                        const isDisabled = !isSelected && selectedOutfits.length >= packageOutfits;

                                        return (
                                            <button
                                                key={outfit.id}
                                                onClick={() => !isDisabled && onOutfitToggle(outfit.id)}
                                                disabled={isDisabled}
                                                className={`
                          relative rounded-xl overflow-hidden aspect-[3/4] group
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
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
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
