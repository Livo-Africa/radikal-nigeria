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
import { useBookingState } from '@/hooks/useBookingState';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { Package, generateOrderId, calculateGroupPrice } from '@/utils/bookingDataNigeria';

export default function NigeriaBookingPage() {
    const { state, actions, validation } = useBookingState();
    const phoneValidation = usePhoneValidation('+234');

    // Refs for auto-scrolling
    const packageRef = useRef<HTMLDivElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const outfitRef = useRef<HTMLDivElement>(null);

    // Local states for photo management
    const [faceImage, setFaceImage] = useState<string>('');
    const [bodyImage, setBodyImage] = useState<string>('');

    // Sync phone validation with booking state
    useEffect(() => {
        actions.setContact(phoneValidation.countryCode, phoneValidation.localNumber);
    }, [phoneValidation.countryCode, phoneValidation.localNumber]);

    // Auto-scroll to next section when category is selected
    useEffect(() => {
        if (state.category && packageRef.current) {
            setTimeout(() => {
                packageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [state.category]);

    // Auto-scroll when package is selected
    useEffect(() => {
        if (state.package && photoRef.current) {
            setTimeout(() => {
                photoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [state.package]);

    // Handle category selection
    const handleCategorySelect = useCallback((categoryId: string) => {
        actions.setCategory(categoryId);
    }, [actions]);

    // Handle package selection
    const handlePackageSelect = useCallback((pkg: Package) => {
        actions.setPackage(pkg);
    }, [actions]);

    // Handle face photo upload
    const handleFaceUpload = useCallback(async (file: File) => {
        // Set uploading state
        actions.setFacePhoto(file, '', 'uploading');

        // Create preview URL
        const url = URL.createObjectURL(file);
        setFaceImage(url);

        // Simulate AI processing animation
        setTimeout(() => {
            actions.setFacePhoto(file, url, 'processing');
        }, 800);

        // Complete after AI scan animation
        setTimeout(() => {
            actions.setFacePhoto(file, url, 'complete');
        }, 2300);
    }, [actions]);

    // Handle body photo upload
    const handleBodyUpload = useCallback(async (file: File) => {
        actions.setBodyPhoto(null, '', 'uploading');

        const url = URL.createObjectURL(file);
        setBodyImage(url);

        setTimeout(() => {
            actions.setBodyPhoto(file, url, 'complete');
        }, 1000);
    }, [actions]);

    // Handle payment
    const handlePayment = useCallback(async () => {
        if (!validation.canProceedToPayment) return;

        actions.setPaymentStatus('processing');

        // Generate order ID
        const orderId = generateOrderId();
        actions.setOrderId(orderId);

        try {
            // TODO: Integrate real Paystack SDK here
            // For now, simulate payment
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Submit order to backend
            const formData = new FormData();
            formData.append('orderData', JSON.stringify({
                orderId,
                category: state.category,
                package: state.package,
                groupSize: state.groupSize,
                whatsappNumber: phoneValidation.fullNumber,
                styling: state.styling,
                outfits: state.outfits,
                addOns: state.addOns,
                total: state.total,
                timestamp: new Date().toISOString()
            }));

            // Append photos
            if (state.photos.face.file) {
                formData.append('photo_face', state.photos.face.file);
            }
            if (state.photos.body.file) {
                formData.append('photo_body', state.photos.body.file);
            }

            // Append outfit uploads
            state.outfits.uploadedFiles.forEach((file, index) => {
                formData.append(`outfit_${index}`, file);
            });

            const response = await fetch('/api/orders', {
                method: 'POST',
                body: formData
            });

            // Simulate payment success
            actions.setPaymentStatus('success');

        } catch (error) {
            console.error('Payment error:', error);
            actions.setPaymentStatus('failed');
        }
    }, [state, actions, validation, phoneValidation.fullNumber]);

    // Handle new booking from success screen
    const handleNewBooking = useCallback(() => {
        actions.resetBooking();
        setFaceImage('');
        setBodyImage('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [actions]);

    // Show success screen if payment succeeded
    if (state.paymentStatus === 'success' && state.orderId) {
        return (
            <SuccessScreen
                orderId={state.orderId}
                packageName={state.package?.name || 'Photoshoot Package'}
                amount={state.total}
                whatsappNumber={phoneValidation.fullNumber}
                onNewBooking={handleNewBooking}
            />
        );
    }

    // Calculate if payment bar should show
    const showPaymentBar = validation.canProceedToPayment;

    return (
        <>
            <Navigation />

            <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 pb-40">
                {/* Progress Indicator */}
                <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-3 px-4">
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Book Your Photoshoot</span>
                            <span className="text-xs text-gray-400">Nigeria</span>
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((step) => {
                                let isComplete = false;
                                let isActive = false;

                                if (step === 1) {
                                    isComplete = !!state.category;
                                    isActive = !state.category;
                                } else if (step === 2) {
                                    isComplete = !!state.package;
                                    isActive = !!state.category && !state.package;
                                } else if (step === 3) {
                                    isComplete = state.photos.face.state === 'complete' && state.photos.body.state === 'complete' && phoneValidation.isValid;
                                    isActive = !!state.package && !isComplete;
                                } else if (step === 4) {
                                    isComplete = !!state.outfits.method;
                                    isActive = isComplete || (state.photos.face.state === 'complete' && phoneValidation.isValid);
                                }

                                return (
                                    <div
                                        key={step}
                                        className={`
                      h-1 flex-1 rounded-full transition-all
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
                            selectedId={state.category}
                            onSelect={handleCategorySelect}
                        />
                    </div>
                </section>

                {/* Section 2: Package Selection */}
                {state.category && (
                    <section ref={packageRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto relative">
                            <div className="absolute top-0 right-4">
                                <HelperSystem section="package" />
                            </div>
                            <PackageCarousel
                                category={state.category}
                                selectedId={state.package?.id || null}
                                onSelect={handlePackageSelect}
                                groupSize={state.groupSize}
                                onGroupSizeChange={actions.setGroupSize}
                            />
                        </div>
                    </section>
                )}

                {/* Section 3: Photos & Contact */}
                {state.package && (
                    <section ref={photoRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto space-y-8">
                            {/* Photo Upload */}
                            <div className="relative">
                                <div className="absolute top-0 right-4">
                                    <HelperSystem section="photos" />
                                </div>
                                <PhotoUpload
                                    faceState={state.photos.face.state}
                                    bodyState={state.photos.body.state}
                                    faceImage={faceImage}
                                    bodyImage={bodyImage}
                                    onFaceUpload={handleFaceUpload}
                                    onBodyUpload={handleBodyUpload}
                                />
                            </div>

                            {/* Contact & Styling */}
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
                                    styling={state.styling}
                                    onStylingChange={actions.setStyling}
                                    isPhoneValid={phoneValidation.isValid}
                                    phoneError={phoneValidation.error}
                                />
                            </div>
                        </div>
                    </section>
                )}

                {/* Section 4: Outfit Selection */}
                {state.photos.face.state === 'complete' && state.photos.body.state === 'complete' && phoneValidation.isValid && (
                    <section ref={outfitRef} className="py-8 border-t border-gray-100">
                        <div className="max-w-lg mx-auto relative">
                            <div className="absolute top-0 right-4">
                                <HelperSystem section="outfits" />
                            </div>
                            <OutfitSelection
                                packageOutfits={state.package?.outfits || 1}
                                method={state.outfits.method}
                                onMethodSelect={actions.setOutfitMethod}
                                selectedOutfits={state.outfits.selectedIds}
                                onOutfitToggle={actions.toggleOutfit}
                                uploadedFiles={state.outfits.uploadedFiles}
                                onUploadOutfits={actions.setUploadedOutfits}
                                autoStyle={state.outfits.autoStyle}
                            />
                        </div>
                    </section>
                )}
            </main>

            {/* Sticky Payment Bar */}
            <StickyPaymentBar
                package={state.package}
                groupSize={state.groupSize}
                selectedAddOns={state.addOns}
                onToggleAddOn={actions.toggleAddOn}
                total={state.total}
                isEnabled={showPaymentBar}
                onPay={handlePayment}
                isLoading={state.paymentStatus === 'processing'}
            />
        </>
    );
}
