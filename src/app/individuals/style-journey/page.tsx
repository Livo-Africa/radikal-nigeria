'use client';
import dynamic from 'next/dynamic';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import {
  CATEGORIES,
  PACKAGES_BY_CATEGORY,
  ADD_ONS,
  Category,
  Package,
  calculateGroupPrice,
  generateOrderId
} from '@/utils/bookingDataGhana';
import { PaymentStatus, PhotoData, PhotoState, Outfit, StylingOptions } from '@/hooks/useBookingState';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';

// Components
import Navigation from '@/components/shared/Navigation';
import CategoryGrid from '@/components/booking-ghana/CategoryGrid';
import PackageCarousel from '@/components/booking-ghana/PackageCarousel';
import PhotoUpload from '@/components/booking-ghana/PhotoUpload';
import ContactStyling from '@/components/booking-ghana/ContactStyling';
import OutfitSelection from '@/components/booking-ghana/OutfitSelection';
import StickyPaymentBar from '@/components/booking-ghana/StickyPaymentBar';
import HelperSystem from '@/components/booking-ghana/HelperSystem';
import SuccessScreen from '@/components/booking-ghana/SuccessScreen';

// Dynamic import for Paystack to avoid SSR window issues
const PaystackHandler = dynamic(
  () => import('@/components/booking-nigeria/PaystackHandler'),
  { ssr: false }
);

const BookingContent = () => {
  const searchParams = useSearchParams();

  // Phone validation (Ghana default)
  const phoneValidation = usePhoneValidation('+233');

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

  // Paystack Configuration State
  // SECURITY: No fallback key - must be set in environment variables
  const [paystackConfig, setPaystackConfig] = useState({
    reference: '',
    email: '',
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
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
          // Auto-scroll to photos handled by existing useEffect
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
      const response = await fetch('/api/outfits'); // Keeping same API for now
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
      setTimeout(() => {
        setFacePhoto({ file, url, state: 'complete' });
      }, 1000); // Simulate processing
    }, 1500); // Simulate upload
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

  // Handle Add-on Toggle
  const toggleAddOn = (addOnId: string) => {
    setAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  // Submit Order logic (from Nigeria flow)
  const submitOrder = useCallback(async (paymentReference?: any) => {
    console.log('🚀 submitOrder called with reference:', paymentReference);

    if (!selectedPackage || !orderId) {
      console.error('❌ Missing package or orderId', { selectedPackage, orderId });
      return;
    }

    try {
      const orderData = {
        orderId,
        paymentReference, // Expecting { reference: "..." } or string
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
      email: `order-${newOrderId}@radikal.ng`, // Dummy email matches Nigeria flow
      amount: calculateTotal() * 100, // Paystack uses smallest currency unit (kobo/pesewas)
      publicKey,
    });

    setTimeout(() => setTriggerPaystack(true), 100);

  }, [selectedPackage, calculateTotal]);

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
    phoneValidation.reset();
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

  // Check if photos are valid
  const arePhotosValid = isGroupBooking
    ? groupPhotos.every(p => p.face.state === 'complete' && p.body.state === 'complete')
    : facePhoto.state === 'complete' && bodyPhoto.state === 'complete';

  // Determine if payment is enabled
  // Basic validation: Category -> Package -> Photos (compulsory) -> Phone -> Outfits (optional)
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
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#D4AF37] to-[#B91C1C] bg-clip-text text-transparent">
              RADIKAL GHANA
            </h1>
            <p className="text-gray-500 text-sm">
              Premium AI Photoshoots in Accra
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
                      // Implement group photo logic if needed
                      // Simplified for migration first pass
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
                      if (code !== phoneValidation.countryCode) {
                        phoneValidation.setCountryCode(code);
                      }
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
            currency="GHS"
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

export default function GhanaBookingPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
        <BookingContent />
      </Suspense>
    </>
  );
}
