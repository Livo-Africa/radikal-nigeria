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
import { useRetryFetch } from '@/hooks/useRetryFetch';
import { Package, generateOrderId, calculateGroupPrice, ADD_ONS, PACKAGES_BY_CATEGORY, findBestPackageForOutfits } from '@/utils/bookingDataNigeria';
import { compressImage } from '@/utils/imageCompression';
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
type PaymentStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'failed';

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

// localStorage key for pending order persistence
const PENDING_ORDER_KEY = 'radikal_pending_order';
const PENDING_ORDER_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface PendingOrderState {
    orderId: string;
    createdAt: string;
    orderDataSent: boolean;
    uploadedFiles: string[]; // file keys that were successfully uploaded
    expiresAt: string;
}

function savePendingOrder(state: PendingOrderState) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(state));
    }
}

function loadPendingOrder(): PendingOrderState | null {
    if (typeof window === 'undefined') return null;
    try {
        const saved = localStorage.getItem(PENDING_ORDER_KEY);
        if (!saved) return null;
        const state: PendingOrderState = JSON.parse(saved);
        if (new Date(state.expiresAt) < new Date()) {
            localStorage.removeItem(PENDING_ORDER_KEY);
            return null;
        }
        return state;
    } catch {
        return null;
    }
}

function clearPendingOrder() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(PENDING_ORDER_KEY);
    }
}

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

    // Retry fetch hook
    const { fetchWithRetry } = useRetryFetch();

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

    // Deep Linking Effect (supports both direct links and wardrobe flow)
    useEffect(() => {
        const catId = searchParams.get('category');
        const pkgId = searchParams.get('packageId');
        const fromWardrobe = searchParams.get('fromWardrobe');
        const outfitCountParam = searchParams.get('outfitCount');

        if (catId && pkgId && !selectedPackage) {
            // Direct deep link: category + packageId
            const categoryPackages = PACKAGES_BY_CATEGORY[catId];
            if (categoryPackages) {
                const pkg = categoryPackages.find(p => p.id === pkgId);
                if (pkg) {
                    setCategory(catId);
                    setSelectedPackage(pkg);
                }
            }
        } else if (fromWardrobe === 'true' && outfitCountParam && !selectedPackage) {
            // Wardrobe flow: auto-select best package for outfit count
            const outfitCount = parseInt(outfitCountParam);
            if (outfitCount > 0) {
                const match = findBestPackageForOutfits(outfitCount);
                if (match) {
                    setCategory(match.category);
                    setSelectedPackage(match.package);
                }
            }

            // Load saved outfits from localStorage
            try {
                const saved = localStorage.getItem('radikal_selected_outfits');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.outfits && Array.isArray(parsed.outfits)) {
                        setSelectedOutfits(parsed.outfits);
                    }
                }
            } catch (e) {
                console.error('Failed to load wardrobe selections:', e);
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

    // Handle face photo upload (single mode) — with background compression
    const handleFaceUpload = useCallback(async (file: File) => {
        const url = URL.createObjectURL(file);
        setFacePhoto({ file: null, url, state: 'uploading' });

        // Compress in background (silent, user sees preview immediately)
        const compressed = await compressImage(file);
        setFacePhoto({ file: compressed, url, state: 'complete' });
    }, []);

    // Handle body photo upload (single mode) — with background compression
    const handleBodyUpload = useCallback(async (file: File) => {
        const url = URL.createObjectURL(file);
        setBodyPhoto({ file: null, url, state: 'uploading' });

        const compressed = await compressImage(file);
        setBodyPhoto({ file: compressed, url, state: 'complete' });
    }, []);

    // Handle group photo upload — with background compression
    const handleGroupPhotoUpload = useCallback(async (personIndex: number, type: 'face' | 'body', file: File) => {
        const url = URL.createObjectURL(file);
        setGroupPhotos(prev => {
            const updated = [...prev];
            updated[personIndex] = {
                ...updated[personIndex],
                [type]: { file: null, url, state: 'uploading' as PhotoState }
            };
            return updated;
        });

        const compressed = await compressImage(file);
        setGroupPhotos(prev => {
            const updated = [...prev];
            updated[personIndex] = {
                ...updated[personIndex],
                [type]: { file: compressed, url, state: 'complete' as PhotoState }
            };
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

    // Submit Order Confirmation (called after Paystack payment success)
    const confirmOrder = useCallback(async (paymentReference: any) => {
        console.log('🚀 confirmOrder called with reference:', paymentReference);

        if (!orderId) {
            console.error('❌ Missing orderId for confirmation');
            return;
        }

        try {
            const refString = typeof paymentReference === 'object'
                ? paymentReference.reference || paymentReference.trxref
                : paymentReference;

            const response = await fetchWithRetry('/api/orders/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId,
                    paymentReference: refString
                })
            }, { maxRetries: 3, silent: true });

            const result = await response.json();

            if (result.success) {
                setPaymentStatus('success');
            } else {
                // Payment was successful (Paystack confirmed), but our confirmation API had issues.
                // The webhook will handle this as backup. Show success to user.
                console.warn('Confirm API returned error, but payment was successful. Webhook will handle:', result.error);
                setPaymentStatus('success');
            }

        } catch (error) {
            // Network error on confirm call. Payment was already successful.
            // Webhook will confirm the order. Show success to user.
            console.warn('Confirm call failed (network), but payment was successful. Webhook will handle:', error);
            setPaymentStatus('success');
        }
    }, [orderId, fetchWithRetry]);

    // Handle Paystack Callbacks
    const handlePaystackSuccess = useCallback((reference: any) => {
        clearPendingOrder();
        confirmOrder(reference);
    }, [confirmOrder]);

    const handlePaystackClose = useCallback(() => {
        // Payment cancelled — keep orderId so files aren't re-uploaded on retry
        setPaymentStatus('idle');
        alert('Payment cancelled. Tap Pay when you\'re ready to try again.');
    }, []);

    // Handle Payment Button Click — Split Upload Flow
    const handlePayment = useCallback(async () => {
        if (!selectedPackage) return;

        // SECURITY: Validate Paystack key exists before proceeding
        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!publicKey) {
            alert('Payment configuration error. Please contact support.');
            setPaymentStatus('failed');
            return;
        }

        // Check if we have a pending order from a previous attempt (localStorage)
        let pending = loadPendingOrder();
        let currentOrderId = pending?.orderId || orderId;
        let orderDataSent = pending?.orderDataSent || false;
        let uploadedFiles = new Set(pending?.uploadedFiles || []);

        // Generate new orderId only if we don't have one
        if (!currentOrderId) {
            currentOrderId = generateOrderId();
        }

        setOrderId(currentOrderId);
        setPaymentStatus('uploading');

        // Build order data
        const orderData = {
            orderId: currentOrderId,
            status: 'pending',
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

        // --- Step 1: Send order data (JSON only, no files) ---
        if (!orderDataSent) {
            try {
                const response = await fetchWithRetry('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                }, { maxRetries: 3, baseDelay: 1000 });

                const result = await response.json();
                if (!result.success) {
                    setPaymentStatus('failed');
                    alert(`Something went wrong: ${result.error}. Please try again.`);
                    return;
                }

                orderDataSent = true;
                savePendingOrder({
                    orderId: currentOrderId,
                    createdAt: new Date().toISOString(),
                    orderDataSent: true,
                    uploadedFiles: [],
                    expiresAt: new Date(Date.now() + PENDING_ORDER_TTL).toISOString()
                });
            } catch (error) {
                console.error('Order creation failed:', error);
                setPaymentStatus('failed');
                alert('Upload failed. Please check your connection and try again.');
                return;
            }
        }

        // --- Step 2: Upload files individually ---
        // Collect all files to upload
        const filesToUpload: { key: string; file: File }[] = [];

        if (isGroupBooking) {
            groupPhotos.forEach((person, index) => {
                if (person.face.file) filesToUpload.push({ key: `photo_face_${index}`, file: person.face.file });
                if (person.body.file) filesToUpload.push({ key: `photo_body_${index}`, file: person.body.file });
            });
        } else {
            if (facePhoto.file) filesToUpload.push({ key: 'photo_face', file: facePhoto.file });
            if (bodyPhoto.file) filesToUpload.push({ key: 'photo_body', file: bodyPhoto.file });
        }

        selectedOutfits.forEach((outfit, index) => {
            if (outfit.isUploaded && outfit.file) {
                filesToUpload.push({ key: `outfit_upload_${index}`, file: outfit.file });
            }
        });

        // Upload only files that haven't been uploaded yet
        const pendingFiles = filesToUpload.filter(f => !uploadedFiles.has(f.key));

        for (const { key, file } of pendingFiles) {
            try {
                const formData = new FormData();
                formData.append('orderId', currentOrderId);
                formData.append('fileKey', key);
                formData.append('file', file);

                const response = await fetchWithRetry('/api/orders/upload-file', {
                    method: 'POST',
                    body: formData
                }, { maxRetries: 3, baseDelay: 1500 });

                const result = await response.json();
                if (result.success) {
                    uploadedFiles.add(key);
                    // Save progress after each successful file
                    savePendingOrder({
                        orderId: currentOrderId,
                        createdAt: pending?.createdAt || new Date().toISOString(),
                        orderDataSent: true,
                        uploadedFiles: Array.from(uploadedFiles),
                        expiresAt: new Date(Date.now() + PENDING_ORDER_TTL).toISOString()
                    });
                }
            } catch (error) {
                console.error(`Failed to upload ${key}:`, error);
                // Continue with other files — don't block the whole flow
            }
        }

        console.log(`✅ Upload complete. ${uploadedFiles.size}/${filesToUpload.length} files sent.`);

        // --- Step 3: Open Paystack payment modal ---
        setPaymentStatus('processing');

        setPaystackConfig({
            reference: currentOrderId,
            email: `order-${currentOrderId}@radikal.ng`,
            amount: Math.ceil(calculateTotal() * 1.02 * 100),
            publicKey,
            metadata: {
                orderId: currentOrderId,
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
        selectedOutfits, styling, phoneValidation.fullNumber, addOns,
        facePhoto.file, bodyPhoto.file, groupPhotos, isGroupBooking, fetchWithRetry, orderId
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
        clearPendingOrder();
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
                        isLoading={paymentStatus === 'uploading' || paymentStatus === 'processing'}
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
                        phone={phoneValidation.fullNumber}
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
