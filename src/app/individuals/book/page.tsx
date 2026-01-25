// src/app/individuals/book/page.tsx
// Nigeria Booking Flow - Single-page mobile-optimized experience

'use client';
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
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
import { Package, generateOrderId, calculateGroupPrice, ADD_ONS, PACKAGES_BY_CATEGORY } from '@/utils/bookingDataNigeria';
import dynamic from 'next/dynamic';

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

// Dynamic import for Paystack to avoid SSR window issues
const PaystackHandler = dynamic(
    () => import('@/components/booking-nigeria/PaystackHandler'),
    { ssr: false }
);

const BookingContent = () => {
    const searchParams = useSearchParams();

    // Core booking state
    const [category, setCategory] = useState<string | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [groupSize, setGroupSize] = useState(3);

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

    // Phone validation (multi-country)
    const phoneValidation = usePhoneValidation('+234');

    // Payment
    const [orderId, setOrderId] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

    // Preloaded outfits
    const [preloadedOutfits, setPreloadedOutfits] = useState<Outfit[]>([]);
    const [outfitsLoading, setOutfitsLoading] = useState(false);

    // Paystack Configuration State
    // SECURITY: No fallback key - must be set in environment variables
    const [paystackConfig, setPaystackConfig] = useState({
        reference: '',
        email: '',
        amount: 0,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        metadata: {},
    });
    const [triggerPaystack, setTriggerPaystack] = useState(false);

    // Refs for auto-scrolling
    const packageRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const outfitRef = useRef<HTMLDivElement>(null);

    // Deep Linking Effect
    useEffect(() => {
        const catId = searchParams.get('category');
        const pkgId = searchParams.get('packageId');

        if (catId && pkgId && !selectedPackage) {
            // Find package
            const categoryPackages = PACKAGES_BY_CATEGORY[catId];
            if (categoryPackages) {
                const pkg = categoryPackages.find(p => p.id === pkgId);
                if (pkg) {
                    setCategory(catId);
                    setSelectedPackage(pkg);
                }
            }
        }
    }, [searchParams]); // Run once on mount/params change

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

    // Check if photos are valid (Moved up for useEffect)
    const arePhotosValid = isGroupBooking
        ? groupPhotos.every(p => p.face.state === 'complete' && p.body.state === 'complete')
        : facePhoto.state === 'complete' && bodyPhoto.state === 'complete';

    // Auto-scroll when photos are valid
    useEffect(() => {
        // Only scroll if photos are valid AND we have a package selected
        // We use a small timeout to ensure the DOM is ready and provide a better UX
        if (arePhotosValid && outfitRef.current) {
            setTimeout(() => {
                outfitRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }, [arePhotosValid]);

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
            setTimeout(() => {
                setFacePhoto({ file, url, state: 'complete' });
            }, 1000);
        }, 1500);
    }, []);

    // Handle body photo upload (single mode)
    const handleBodyUpload = useCallback((file: File) => {
        setBodyPhoto({ file: null, url: '', state: 'uploading' });
        const url = URL.createObjectURL(file);
        setTimeout(() => {
            setBodyPhoto({ file, url, state: 'processing' });
            setTimeout(() => {
                setBodyPhoto({ file, url, state: 'complete' });
            }, 1000);
        }, 1500);
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

    // Handle Add-on Toggle
    const toggleAddOn = (addOnId: string) => {
        setAddOns(prev =>
            prev.includes(addOnId)
                ? prev.filter(id => id !== addOnId)
                : [...prev, addOnId]
        );
    };

    // Submit Order logic
    const submitOrder = useCallback(async (paymentReference?: any) => {
        console.log('🚀 submitOrder called with reference:', paymentReference);

        if (!selectedPackage || !orderId) {
            console.error('❌ Missing package or orderId', { selectedPackage, orderId });
            return;
        }

        try {
            const orderData = {
                orderId,
                paymentReference,
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
                    background: { customDescription: styling.background ? styling.backgroundText : 'Not specified' }
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
                alert(`Order failed: ${result.error}. If you were charged, please contact support with Order ID: ${orderId}`);
            }

        } catch (error) {
            console.error('Payment error:', error);
            setPaymentStatus('failed');
            alert('Network error. Please check your connection. If payment was deducted, do NOT pay again. Contact support.');
        }
    }, [
        selectedPackage, category, groupSize, selectedOutfits,
        styling, phoneValidation.fullNumber, addOns,
        calculateTotal, facePhoto.file, bodyPhoto.file, groupPhotos, isGroupBooking, orderId
    ]);

    // Handle Paystack Callbacks
    const handlePaystackSuccess = useCallback((reference: any) => {
        submitOrder(reference);
    }, [submitOrder]);

    const handlePaystackClose = useCallback(() => {
        setPaymentStatus('failed');
        alert('Payment cancelled. Please try again.');
    }, []);

    // Handle Payment Button Click
    const handlePayment = useCallback(() => {
        if (!selectedPackage) return;

        setPaymentStatus('processing');
        const newOrderId = generateOrderId();
        setOrderId(newOrderId);

        // SECURITY: Validate Paystack key exists before proceeding
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            alert('Payment configuration error. Please contact support.');
            setPaymentStatus('failed');
            return;
        }

        setPaystackConfig({
            reference: newOrderId,
            email: `order-${newOrderId}@radikal.ng`,
            amount: calculateTotal() * 100,
            publicKey,
            metadata: {
                orderId: newOrderId,
                shootType: category,
                shootTypeName: category ? category.charAt(0).toUpperCase() + category.slice(1) : '',
                package: {
                    id: selectedPackage.id,
                    name: selectedPackage.name,
                    price: selectedPackage.price,
                },
                groupSize: category === 'group' ? groupSize : undefined,
                outfits: selectedOutfits.map(o => ({
                    id: o.id,
                    name: o.name,
                    image: o.imageUrl || o.previewUrl,
                    uploaded: o.isUploaded
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
                    background: { customDescription: styling.background ? styling.backgroundText : 'Not specified' }
                },
                whatsappNumber: phoneValidation.fullNumber,
                addOns: addOns,
                finalTotal: calculateTotal(),
                timestamp: new Date().toISOString()
            }
        });

        setTimeout(() => setTriggerPaystack(true), 100);

    }, [
        selectedPackage, calculateTotal, category, groupSize,
        selectedOutfits, styling, phoneValidation.fullNumber, addOns
    ]);

    // Reset Booking
    const handleNewBooking = () => {
        setCategory(null);
        setSelectedPackage(null);
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
        setPaymentStatus('idle');
        setOrderId(null);
        phoneValidation.setLocalNumber('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render Success Screen
    if (paymentStatus === 'success' && orderId && selectedPackage) {
        return (
            <SuccessScreen
                orderId={orderId}
                packageName={selectedPackage.name}
                amount={calculateTotal()}
                whatsappNumber={phoneValidation.fullNumber}
                onNewBooking={handleNewBooking}
            />
        );
    }



    // Determine if payment is enabled
    const isPaymentEnabled =
        !!category &&
        !!selectedPackage &&
        arePhotosValid &&
        phoneValidation.isValid;

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <LayoutGroup>
                <div className="max-w-md mx-auto px-4 py-8 space-y-12">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                            RADIKAL NIGERIA
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Premium AI Photoshoots in Lagos
                        </p>
                    </div>

                    {/* Step 1: Category Selection */}
                    <section>
                        <div className="flex items-center justify-between mb-2">
                            {category && <span className="text-xs font-bold text-gray-400">STEP 1</span>}
                            <HelperSystem section="category" />
                        </div>
                        <CategoryGrid
                            selectedId={category}
                            onSelect={handleCategorySelect}
                        />
                    </section>

                    {/* Step 2: Package Selection */}
                    <AnimatePresence>
                        {category && (
                            <motion.section
                                ref={packageRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-400">STEP 2</span>
                                    <HelperSystem section="package" />
                                </div>
                                <PackageCarousel
                                    category={category}
                                    selectedId={selectedPackage?.id || null}
                                    onSelect={handlePackageSelect}
                                    groupSize={groupSize}
                                    onGroupSizeChange={setGroupSize}
                                />
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Step 3: Photos & Outfits & Details */}
                    <AnimatePresence>
                        {selectedPackage && (
                            <motion.div
                                ref={photoRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                {/* Photo Upload */}
                                <section>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-400">STEP 3</span>
                                        <HelperSystem section="photos" />
                                    </div>
                                    <PhotoUpload
                                        faceState={facePhoto.state}
                                        faceImage={facePhoto.url}
                                        bodyState={bodyPhoto.state}
                                        bodyImage={bodyPhoto.url}
                                        onFaceUpload={handleFaceUpload}
                                        onBodyUpload={handleBodyUpload}
                                        isGroupMode={isGroupBooking}
                                        groupSize={groupSize}
                                        groupPhotos={groupPhotos}
                                        onGroupPhotoUpload={(index, type, file) => {
                                            setGroupPhotos(prev => {
                                                const updated = [...prev];
                                                const url = URL.createObjectURL(file);
                                                updated[index] = {
                                                    ...updated[index],
                                                    [type]: { file, url, state: 'complete' as PhotoState }
                                                };
                                                return updated;
                                            });
                                        }}
                                    />
                                </section>

                                {/* Outfit Selection */}
                                <section ref={outfitRef}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-400">STEP 4</span>
                                        <HelperSystem section="outfits" />
                                    </div>
                                    <OutfitSelection
                                        packageOutfits={selectedPackage.outfits}
                                        packageName={selectedPackage.name}
                                        category={category!}
                                        selectedOutfits={selectedOutfits}
                                        onOutfitsChange={setSelectedOutfits}
                                        styling={styling}
                                        onStylingChange={(updates) => setStyling(prev => ({ ...prev, ...updates }))}
                                        preloadedOutfits={preloadedOutfits}
                                        outfitsLoading={outfitsLoading}
                                    />
                                </section>

                                {/* Contact Details */}
                                <section>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-400">STEP 5</span>
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
                                </section>

                                {/* Spacer for bottom bar */}
                                <div className="h-24" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sticky Payment Bar */}
                    <StickyPaymentBar
                        package={selectedPackage}
                        groupSize={groupSize}
                        selectedAddOns={addOns}
                        onToggleAddOn={toggleAddOn}
                        total={calculateTotal()}
                        isEnabled={isPaymentEnabled}
                        onPay={handlePayment}
                        isLoading={paymentStatus === 'processing'}
                    />

                    {/* Paystack Integration */}
                    <PaystackHandler
                        key={paystackConfig.reference || 'init'}
                        email={paystackConfig.email}
                        amount={paystackConfig.amount}
                        publicKey={paystackConfig.publicKey}
                        reference={paystackConfig.reference}
                        metadata={paystackConfig.metadata}
                        currency="NGN"
                        onSuccess={handlePaystackSuccess}
                        onClose={handlePaystackClose}
                        trigger={triggerPaystack}
                        setTrigger={setTriggerPaystack}
                    />

                </div>
            </LayoutGroup>
        </div>
    );
};

export default function NigeriaBookingPage() {
    return (
        <>
            <Navigation />
            <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                <BookingContent />
            </Suspense>
        </>
    );
}
