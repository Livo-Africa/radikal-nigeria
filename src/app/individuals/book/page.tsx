// src/app/individuals/book/page.tsx
// Nigeria Booking Flow - Single-page mobile-optimized experience

'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Navigation from '@/components/shared/Navigation';
import {
    CategoryGrid,
    PackageCarousel,
    PhotoUpload,
    ContactStyling,
    OutfitSelection,
    StickyPaymentBar,
    HelperSystem,
    SuccessScreen
} from '@/components/booking-nigeria';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { Package, generateOrderId, calculateGroupPrice, ADD_ONS } from '@/utils/bookingDataNigeria';

// Types
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

type PhotoState = 'empty' | 'uploading' | 'processing' | 'complete';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

interface PhotoData {
    file: File | null;
    url: string;
    state: PhotoState;
}

// Mandatory backgrounds for certain packages
const MANDATORY_BACKGROUNDS: Record<string, string> = {
    'birthday': 'Studio with balloons',
    'graduation': 'Academic backdrop',
    'professional': 'Professional office/studio'
};

export default function NigeriaBookingPage() {
    // Phone validation (multi-country)
    const phoneValidation = usePhoneValidation('+234');

    // Core booking state
    const [category, setCategory] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [groupSize, setGroupSize] = useState(2);

    // Single person photo state
    const [facePhoto, setFacePhoto] = useState<PhotoData>({ file: null, url: '', state: 'empty' });
    const [bodyPhoto, setBodyPhoto] = useState<PhotoData>({ file: null, url: '', state: 'empty' });

    // Group photos state
    const [groupPhotos, setGroupPhotos] = useState<{ face: PhotoData; body: PhotoData }[]>([]);

    // Unified outfit state
    const [selectedOutfits, setSelectedOutfits] = useState<Outfit[]>([]);

    // Styling state
    const [styling, setStyling] = useState<StylingOptions>({
        makeup: false,
        makeupType: null,
        hairstyle: false,
        hairstyleText: '',
        background: false,
        backgroundText: ''
    });

    // Add-ons
    const [addOns, setAddOns] = useState<string[]>([]);

    // Payment
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

    // Preloaded outfits
    const [preloadedOutfits, setPreloadedOutfits] = useState<Outfit[]>([]);
    const [outfitsLoading, setOutfitsLoading] = useState(false);

    // Refs for auto-scrolling
    const packageRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const outfitRef = useRef<HTMLDivElement>(null);

    // Check if this is a group booking
    const isGroupBooking = category === 'group';

    // Initialize group photos when group size changes
    useEffect(() => {
        if (isGroupBooking) {
            setGroupPhotos(
                Array.from({ length: groupSize }, () => ({
                    face: { file: null, url: '', state: 'empty' as PhotoState },
                    body: { file: null, url: '', state: 'empty' as PhotoState }
                }))
            );
        }
    }, [groupSize, isGroupBooking]);

    // Preload outfits when page loads
    useEffect(() => {
        fetchOutfits();
    }, []);

    const fetchOutfits = async () => {
        try {
            setOutfitsLoading(true);
            const response = await fetch('/api/outfits');
            const data = await response.json();
            if (data.outfits) {
                setPreloadedOutfits(data.outfits);
            }
        } catch (error) {
            console.error('Failed to load outfits:', error);
        } finally {
            setOutfitsLoading(false);
        }
    };

    // Calculate total
    const calculateTotal = useCallback(() => {
        if (!selectedPackage) return 0;

        let total = category === 'group' && selectedPackage.basePrice
            ? calculateGroupPrice(selectedPackage, groupSize)
            : selectedPackage.price;

        addOns.forEach(addOnId => {
            const addOn = ADD_ONS.find(a => a.id === addOnId);
            if (addOn) total += addOn.price;
        });

        return total;
    }, [selectedPackage, category, groupSize, addOns]);

    // Auto-scroll when category is selected
    useEffect(() => {
        if (category && packageRef.current) {
            setTimeout(() => {
                packageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [category]);

    // Auto-scroll when package is selected
    useEffect(() => {
        if (selectedPackage && photoRef.current) {
            setTimeout(() => {
                photoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [selectedPackage]);

    // Handle category selection
    const handleCategorySelect = useCallback((categoryId: string) => {
        setCategory(categoryId);
        setSelectedPackage(null);
    }, []);

    // Handle package selection
    const handlePackageSelect = useCallback((pkg: Package) => {
        setSelectedPackage(pkg);
        setSelectedOutfits([]);
    }, []);

    // Handle face photo upload (single mode)
    const handleFaceUpload = useCallback((file: File) => {
        setFacePhoto({ file: null, url: '', state: 'uploading' });

        const url = URL.createObjectURL(file);

        setTimeout(() => {
            setFacePhoto({ file, url, state: 'processing' });
        }, 800);

        setTimeout(() => {
            setFacePhoto({ file, url, state: 'complete' });
        }, 2300);
    }, []);

    // Handle body photo upload (single mode)
    const handleBodyUpload = useCallback((file: File) => {
        setBodyPhoto({ file: null, url: '', state: 'uploading' });

        const url = URL.createObjectURL(file);

        setTimeout(() => {
            setBodyPhoto({ file, url, state: 'complete' });
        }, 1000);
    }, []);

    // Handle group photo upload
    const handleGroupPhotoUpload = useCallback((personIndex: number, type: 'face' | 'body', file: File) => {
        setGroupPhotos(prev => {
            const updated = [...prev];
            const url = URL.createObjectURL(file);

            // Set uploading first
            updated[personIndex] = {
                ...updated[personIndex],
                [type]: { file: null, url: '', state: 'uploading' as PhotoState }
            };

            // Then complete after delay
            setTimeout(() => {
                setGroupPhotos(prev2 => {
                    const updated2 = [...prev2];
                    updated2[personIndex] = {
                        ...updated2[personIndex],
                        [type]: { file, url, state: 'complete' as PhotoState }
                    };
                    return updated2;
                });
            }, type === 'face' ? 2000 : 1000);

            return updated;
        });
    }, []);

    // Handle add-on toggle
    const handleAddOnToggle = useCallback((addOnId: string) => {
        setAddOns(prev =>
            prev.includes(addOnId)
                ? prev.filter(id => id !== addOnId)
                : [...prev, addOnId]
        );
    }, []);

    // Handle payment
    const handlePayment = useCallback(async () => {
        if (!selectedPackage) return;

        setPaymentStatus('processing');

        const newOrderId = generateOrderId();
        setOrderId(newOrderId);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const backgroundText = MANDATORY_BACKGROUNDS[category || ''] || styling.backgroundText;

            const orderData = {
                orderId: newOrderId,
                shootType: category,
                shootTypeName: category ? category.charAt(0).toUpperCase() + category.slice(1) : '',
                package: {
                    id: selectedPackage.id,
                    name: selectedPackage.name,
                    price: selectedPackage.price,
                    images: selectedPackage.images,
                    outfits: selectedPackage.outfits
                },
                groupSize: category === 'group' ? groupSize : undefined,
                outfits: selectedOutfits.map(o => ({
                    id: o.id,
                    name: o.name,
                    image: o.imageUrl || o.previewUrl,
                    category: o.category,
                    uploaded: o.isUploaded || false
                })),
                style: {
                    makeup: {
                        selectedName: styling.makeup
                            ? (styling.makeupType === 'light' ? 'Light Makeup' :
                                styling.makeupType === 'heavy' ? 'Heavy Makeup' :
                                    styling.makeupType === 'glam' ? 'Glam Makeup' : 'Yes')
                            : 'No'
                    },
                    hairstyle: { customDescription: styling.hairstyle ? styling.hairstyleText : 'Not specified' },
                    background: { customDescription: backgroundText || 'Not specified' }
                },
                whatsappNumber: phoneValidation.fullNumber,
                specialRequests: '',
                addOns: addOns,
                finalTotal: calculateTotal(),
                timestamp: new Date().toISOString()
            };

            const formData = new FormData();
            formData.append('orderData', JSON.stringify(orderData));

            // Append photos based on mode
            if (isGroupBooking) {
                groupPhotos.forEach((person, index) => {
                    if (person.face.file) {
                        formData.append(`photo_face_${index}`, person.face.file);
                    }
                    if (person.body.file) {
                        formData.append(`photo_body_${index}`, person.body.file);
                    }
                });
            } else {
                if (facePhoto.file) {
                    formData.append('photo_face', facePhoto.file);
                }
                if (bodyPhoto.file) {
                    formData.append('photo_body', bodyPhoto.file);
                }
            }

            // Append uploaded outfit files
            selectedOutfits.forEach((outfit, index) => {
                if (outfit.isUploaded && outfit.file) {
                    formData.append(`outfit_upload_${index}`, outfit.file);
                }
            });

            const response = await fetch('/api/orders', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setPaymentStatus('success');
            } else {
                console.error('Order submission failed:', result.error);
                setPaymentStatus('failed');
            }

        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
        }
    }, [
        selectedPackage, category, groupSize, selectedOutfits,
        styling, phoneValidation.fullNumber, addOns,
        calculateTotal, facePhoto.file, bodyPhoto.file, groupPhotos, isGroupBooking
    ]);

    // Handle new booking
    const handleNewBooking = useCallback(() => {
        setCategory(null);
        setSelectedPackage(null);
        setGroupSize(2);
        setFacePhoto({ file: null, url: '', state: 'empty' });
        setBodyPhoto({ file: null, url: '', state: 'empty' });
        setGroupPhotos([]);
        setSelectedOutfits([]);
        setStyling({
            makeup: false,
            makeupType: null,
            hairstyle: false,
            hairstyleText: '',
            background: false,
            backgroundText: ''
        });
        setAddOns([]);
        setOrderId(null);
        setPaymentStatus('idle');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Show success screen
    if (paymentStatus === 'success' && orderId) {
        return (
            <SuccessScreen
                orderId={orderId}
                packageName={selectedPackage?.name || 'Photoshoot Package'}
                amount={calculateTotal()}
                whatsappNumber={phoneValidation.fullNumber}
                onNewBooking={handleNewBooking}
            />
        );
    }

    // Check photo completion
    const singlePhotosComplete = facePhoto.state === 'complete' && bodyPhoto.state === 'complete';
    const groupPhotosComplete = groupPhotos.length > 0 &&
        groupPhotos.every(p => p.face.state === 'complete' && p.body.state === 'complete');
    const photosComplete = isGroupBooking ? groupPhotosComplete : singlePhotosComplete;

    const phoneValid = phoneValidation.isValid;

    // Outfits valid if selected some OR skipped (styling interaction implies skip)
    const outfitsValid = selectedOutfits.length > 0 ||
        (styling.makeup || styling.hairstyle || styling.background);

    // Payment bar only shows when outfits section is done (not just phone)
    const canPay = selectedPackage && photosComplete && phoneValid && outfitsValid;

    return (
        <>
            <Navigation />

            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-48">
                {/* Progress Indicator */}
                <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3 px-4">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">Book Your Photoshoot</span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">🇳🇬 Nigeria</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((step) => {
                                let isComplete = false;
                                let isActive = false;

                                if (step === 1) {
                                    isComplete = !!selectedPackage;
                                    isActive = !selectedPackage;
                                } else if (step === 2) {
                                    isComplete = photosComplete && phoneValid;
                                    isActive = !!selectedPackage && !(photosComplete && phoneValid);
                                } else if (step === 3) {
                                    isComplete = outfitsValid;
                                    isActive = photosComplete && phoneValid && !outfitsValid;
                                } else if (step === 4) {
                                    isComplete = paymentStatus === 'success';
                                    isActive = canPay;
                                }

                                return (
                                    <div
                                        key={step}
                                        className={`
                      h-1.5 flex-1 rounded-full transition-all
                      ${isComplete ? 'bg-[#D4AF37]' : isActive ? 'bg-[#D4AF37]/50' : 'bg-gray-200'}
                    `}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Section 1: Category Selection */}
                <section className="py-8 px-4">
                    <div className="max-w-lg mx-auto relative">
                        <div className="absolute top-0 right-0">
                            <HelperSystem section="category" />
                        </div>
                        <CategoryGrid
                            selectedId={category}
                            onSelect={handleCategorySelect}
                        />
                    </div>
                </section>

                {/* Section 2: Package Selection */}
                {category && (
                    <section ref={packageRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto relative">
                            <div className="absolute top-0 right-4">
                                <HelperSystem section="package" />
                            </div>
                            <PackageCarousel
                                category={category}
                                selectedId={selectedPackage?.id || null}
                                onSelect={handlePackageSelect}
                                groupSize={groupSize}
                                onGroupSizeChange={setGroupSize}
                            />
                        </div>
                    </section>
                )}

                {/* Section 3: Photos & Contact */}
                {selectedPackage && (
                    <section ref={photoRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto space-y-8">
                            {/* Photo Upload */}
                            <div className="relative">
                                <div className="absolute top-0 right-4">
                                    <HelperSystem section="photos" />
                                </div>
                                <PhotoUpload
                                    // Single mode props
                                    faceState={facePhoto.state}
                                    bodyState={bodyPhoto.state}
                                    faceImage={facePhoto.url}
                                    bodyImage={bodyPhoto.url}
                                    onFaceUpload={handleFaceUpload}
                                    onBodyUpload={handleBodyUpload}
                                    // Group mode props
                                    isGroupMode={isGroupBooking}
                                    groupSize={groupSize}
                                    groupPhotos={groupPhotos}
                                    onGroupPhotoUpload={handleGroupPhotoUpload}
                                />
                            </div>

                            {/* Contact */}
                            <div className="relative">
                                <div className="absolute top-0 right-4">
                                    <HelperSystem section="phone" />
                                </div>
                                <ContactStyling
                                    countryCode={phoneValidation.countryCode}
                                    phoneNumber={phoneValidation.localNumber}
                                    onPhoneChange={(code, number) => {
                                        phoneValidation.setCountryCode(code);
                                        phoneValidation.setLocalNumber(number);
                                    }}
                                    isPhoneValid={phoneValidation.isValid}
                                    phoneError={phoneValidation.error}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Section 4: Outfits & Styling */}
                {photosComplete && phoneValid && (
                    <section ref={outfitRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto relative">
                            <div className="absolute top-0 right-4">
                                <HelperSystem section="outfits" />
                            </div>
                            <OutfitSelection
                                packageOutfits={selectedPackage?.outfits || 1}
                                packageName={selectedPackage?.name || ''}
                                category={category || ''}
                                selectedOutfits={selectedOutfits}
                                onOutfitsChange={setSelectedOutfits}
                                styling={styling}
                                onStylingChange={(updates) => setStyling(prev => ({ ...prev, ...updates }))}
                                preloadedOutfits={preloadedOutfits}
                                outfitsLoading={outfitsLoading}
                            />
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky Payment Bar - Only shows when outfits section is done */}
            <StickyPaymentBar
                package={selectedPackage}
                groupSize={groupSize}
                selectedAddOns={addOns}
                onToggleAddOn={handleAddOnToggle}
                total={calculateTotal()}
                isEnabled={canPay || false}
                onPay={handlePayment}
                isLoading={paymentStatus === 'processing'}
            />
        </>
    );
}
