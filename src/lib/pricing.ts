// src/lib/pricing.ts
// Server-side pricing calculation - authoritative source of truth for order totals
// This prevents price manipulation attacks where clients send false totals

import {
    PACKAGES_BY_CATEGORY as NIGERIA_PACKAGES,
    ADD_ONS as NIGERIA_ADD_ONS,
    calculateGroupPrice as calculateNigeriaGroupPrice,
    Package as NigeriaPackage
} from '@/utils/bookingDataNigeria';

import {
    PACKAGES_BY_CATEGORY as GHANA_PACKAGES,
    ADD_ONS as GHANA_ADD_ONS,
    calculateGroupPrice as calculateGhanaGroupPrice,
    Package as GhanaPackage
} from '@/utils/bookingDataGhana';

export interface OrderPricingData {
    orderId: string;
    shootType: string;
    package: {
        id: string;
        name: string;
        price?: number;
    };
    groupSize?: number;
    addOns?: string[];
}

export interface PricingResult {
    success: boolean;
    calculatedTotal: number;
    breakdown: {
        packagePrice: number;
        addOnsTotal: number;
        addOnDetails: { id: string; name: string; price: number }[];
    };
    error?: string;
    country: 'nigeria' | 'ghana';
}

/**
 * Detect country from order ID prefix
 * RAD-GH-... = Ghana
 * RAD-... = Nigeria
 */
function detectCountry(orderId: string): 'nigeria' | 'ghana' {
    if (orderId.includes('RAD-GH')) {
        return 'ghana';
    }
    return 'nigeria';
}

/**
 * Calculate server-side price for an order
 * This is the authoritative price calculation that cannot be manipulated by clients
 */
export function calculateServerPrice(orderData: OrderPricingData): PricingResult {
    const country = detectCountry(orderData.orderId);
    const { shootType, package: pkg, groupSize = 1, addOns = [] } = orderData;

    // Select correct pricing data based on country
    const packages = country === 'ghana' ? GHANA_PACKAGES : NIGERIA_PACKAGES;
    const addOnsList = country === 'ghana' ? GHANA_ADD_ONS : NIGERIA_ADD_ONS;
    const calculateGroupPrice = country === 'ghana' ? calculateGhanaGroupPrice : calculateNigeriaGroupPrice;

    // Find the package in server data
    const categoryPackages = packages[shootType];
    if (!categoryPackages) {
        return {
            success: false,
            calculatedTotal: 0,
            breakdown: { packagePrice: 0, addOnsTotal: 0, addOnDetails: [] },
            error: `Invalid category: ${shootType}`,
            country
        };
    }

    const serverPackage = categoryPackages.find(p => p.id === pkg.id);
    if (!serverPackage) {
        return {
            success: false,
            calculatedTotal: 0,
            breakdown: { packagePrice: 0, addOnsTotal: 0, addOnDetails: [] },
            error: `Invalid package: ${pkg.id} in category ${shootType}`,
            country
        };
    }

    // Calculate package price (handle group pricing)
    let packagePrice: number;
    if (shootType === 'group' && serverPackage.basePrice) {
        packagePrice = calculateGroupPrice(serverPackage as any, groupSize);
    } else {
        packagePrice = serverPackage.price;
    }

    // Calculate add-ons total
    let addOnsTotal = 0;
    const addOnDetails: { id: string; name: string; price: number }[] = [];

    for (const addOnId of addOns) {
        const addOn = addOnsList.find(a => a.id === addOnId);
        if (addOn) {
            addOnsTotal += addOn.price;
            addOnDetails.push({ id: addOn.id, name: addOn.name, price: addOn.price });
        }
        // Silently ignore invalid add-on IDs (don't add fake prices)
    }

    const calculatedTotal = packagePrice + addOnsTotal;

    return {
        success: true,
        calculatedTotal,
        breakdown: {
            packagePrice,
            addOnsTotal,
            addOnDetails
        },
        country
    };
}

/**
 * Verify that a client-provided total matches server calculation
 * Allows small tolerance for floating point issues
 */
export function verifyOrderPrice(
    orderData: OrderPricingData,
    clientTotal: number,
    tolerancePercent: number = 1 // 1% tolerance
): { valid: boolean; serverTotal: number; difference: number; error?: string } {
    const result = calculateServerPrice(orderData);

    if (!result.success) {
        return {
            valid: false,
            serverTotal: 0,
            difference: clientTotal,
            error: result.error
        };
    }

    const difference = Math.abs(result.calculatedTotal - clientTotal);
    const tolerance = result.calculatedTotal * (tolerancePercent / 100);

    // Allow exact match or within tolerance
    const valid = difference <= Math.max(tolerance, 1); // At least 1 unit tolerance

    return {
        valid,
        serverTotal: result.calculatedTotal,
        difference,
        error: valid ? undefined : `Price mismatch: client sent ${clientTotal}, server calculated ${result.calculatedTotal}`
    };
}
