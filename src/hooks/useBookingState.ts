// src/hooks/useBookingState.ts
// Central state management for Nigeria booking flow with localStorage persistence

import { useState, useEffect, useCallback } from 'react';
import { Package, AddOn, ADD_ONS, calculateGroupPrice } from '@/utils/bookingDataNigeria';

// Photo state types
export type PhotoState = 'empty' | 'uploading' | 'processing' | 'complete';

export interface PhotoData {
    file: File | null;
    url: string;
    state: PhotoState;
}

// Outfit selection method types
type OutfitMethod = 'upload' | 'wardrobe' | 'auto' | null;

// Payment status types
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface Outfit {
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

export interface StylingOptions {
    makeup: boolean;
    makeupType: 'light' | 'heavy' | 'glam' | null;
    hairstyle: boolean;
    hairstyleText: string;
    background: boolean;
    backgroundText: string;
}

// Complete booking state interface
export interface BookingState {
    // Step 1 - Category
    category: string | null;

    // Step 2 - Package
    package: Package | null;
    groupSize: number;

    // Step 3 - Photos
    photos: {
        face: PhotoData;
        body: PhotoData;
    };

    // Contact
    contact: {
        countryCode: string;
        phoneNumber: string;
    };

    // Styling (optional)
    styling: {
        makeup: boolean;
        hairstyle: string;
        background: string;
    };

    // Step 4 - Outfits
    outfits: {
        method: OutfitMethod;
        selectedIds: string[];
        uploadedFiles: File[];
        autoStyle: boolean;
    };

    // Add-ons
    addOns: string[];

    // Calculated
    total: number;

    // Order status
    orderId: string | null;
    paymentStatus: PaymentStatus;
}

// Initial state
const initialState: BookingState = {
    category: null,
    package: null,
    groupSize: 2,
    photos: {
        face: { file: null, url: '', state: 'empty' },
        body: { file: null, url: '', state: 'empty' }
    },
    contact: {
        countryCode: '+234',
        phoneNumber: ''
    },
    styling: {
        makeup: false,
        hairstyle: '',
        background: ''
    },
    outfits: {
        method: null,
        selectedIds: [],
        uploadedFiles: [],
        autoStyle: false
    },
    addOns: [],
    total: 0,
    orderId: null,
    paymentStatus: 'idle'
};

const STORAGE_KEY = 'radikal_nigeria_booking';

export function useBookingState() {
    const [state, setState] = useState<BookingState>(initialState);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Don't restore file objects (can't be serialized)
                    setState(prev => ({
                        ...prev,
                        ...parsed,
                        photos: {
                            face: { ...initialState.photos.face, state: parsed.photos?.face?.state || 'empty' },
                            body: { ...initialState.photos.body, state: parsed.photos?.body?.state || 'empty' }
                        },
                        outfits: {
                            ...prev.outfits,
                            ...parsed.outfits,
                            uploadedFiles: []
                        }
                    }));
                } catch (e) {
                    console.error('Error loading booking state:', e);
                }
            }
        }
    }, []);

    // Save to localStorage on state change (excluding file objects)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const toSave = {
                ...state,
                photos: {
                    face: { ...state.photos.face, file: null, url: '' },
                    body: { ...state.photos.body, file: null, url: '' }
                },
                outfits: {
                    ...state.outfits,
                    uploadedFiles: []
                }
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
        }
    }, [state]);

    // Calculate total whenever relevant fields change
    useEffect(() => {
        let total = 0;

        if (state.package) {
            // Base package price (with group size calculation)
            if (state.category === 'group' && state.package.basePrice) {
                total = calculateGroupPrice(state.package, state.groupSize);
            } else {
                total = state.package.price;
            }

            // Add-ons
            state.addOns.forEach(addOnId => {
                const addOn = ADD_ONS.find(a => a.id === addOnId);
                if (addOn) {
                    total += addOn.price;
                }
            });
        }

        setState(prev => ({ ...prev, total }));
    }, [state.package, state.groupSize, state.addOns, state.category]);

    // Action creators
    const setCategory = useCallback((category: string | null) => {
        setState(prev => ({
            ...prev,
            category,
            package: null // Reset package when category changes
        }));
    }, []);

    const setPackage = useCallback((pkg: Package | null) => {
        setState(prev => ({ ...prev, package: pkg }));
    }, []);

    const setGroupSize = useCallback((size: number) => {
        const clampedSize = Math.max(2, Math.min(5, size));
        setState(prev => ({ ...prev, groupSize: clampedSize }));
    }, []);

    const setFacePhoto = useCallback((file: File | null, url: string, photoState: PhotoState) => {
        setState(prev => ({
            ...prev,
            photos: {
                ...prev.photos,
                face: { file, url, state: photoState }
            }
        }));
    }, []);

    const setBodyPhoto = useCallback((file: File | null, url: string, photoState: PhotoState) => {
        setState(prev => ({
            ...prev,
            photos: {
                ...prev.photos,
                body: { file, url, state: photoState }
            }
        }));
    }, []);

    const setContact = useCallback((countryCode: string, phoneNumber: string) => {
        setState(prev => ({
            ...prev,
            contact: { countryCode, phoneNumber }
        }));
    }, []);

    const setStyling = useCallback((styling: Partial<BookingState['styling']>) => {
        setState(prev => ({
            ...prev,
            styling: { ...prev.styling, ...styling }
        }));
    }, []);

    const setOutfitMethod = useCallback((method: OutfitMethod) => {
        setState(prev => ({
            ...prev,
            outfits: {
                ...prev.outfits,
                method,
                autoStyle: method === 'auto'
            }
        }));
    }, []);

    const toggleOutfit = useCallback((outfitId: string) => {
        setState(prev => ({
            ...prev,
            outfits: {
                ...prev.outfits,
                selectedIds: prev.outfits.selectedIds.includes(outfitId)
                    ? prev.outfits.selectedIds.filter(id => id !== outfitId)
                    : [...prev.outfits.selectedIds, outfitId]
            }
        }));
    }, []);

    const setUploadedOutfits = useCallback((files: File[]) => {
        setState(prev => ({
            ...prev,
            outfits: {
                ...prev.outfits,
                uploadedFiles: files
            }
        }));
    }, []);

    const toggleAddOn = useCallback((addOnId: string) => {
        setState(prev => ({
            ...prev,
            addOns: prev.addOns.includes(addOnId)
                ? prev.addOns.filter(id => id !== addOnId)
                : [...prev.addOns, addOnId]
        }));
    }, []);

    const setOrderId = useCallback((orderId: string) => {
        setState(prev => ({ ...prev, orderId }));
    }, []);

    const setPaymentStatus = useCallback((status: PaymentStatus) => {
        setState(prev => ({ ...prev, paymentStatus: status }));
    }, []);

    const resetBooking = useCallback(() => {
        setState(initialState);
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    // Validation helpers
    const canProceedToPhotos = state.category !== null && state.package !== null;

    const canProceedToPayment =
        canProceedToPhotos &&
        state.photos.face.state === 'complete' &&
        state.photos.body.state === 'complete' &&
        state.contact.phoneNumber.length >= 10;

    return {
        state,
        actions: {
            setCategory,
            setPackage,
            setGroupSize,
            setFacePhoto,
            setBodyPhoto,
            setContact,
            setStyling,
            setOutfitMethod,
            toggleOutfit,
            setUploadedOutfits,
            toggleAddOn,
            setOrderId,
            setPaymentStatus,
            resetBooking
        },
        validation: {
            canProceedToPhotos,
            canProceedToPayment
        }
    };
}

export default useBookingState;
