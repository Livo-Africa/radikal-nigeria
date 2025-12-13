// src/utils/bookingDataNigeria.ts
// All category, package, and add-on data for Nigeria booking flow

export interface Category {
    id: 'professional' | 'graduation' | 'birthday' | 'group' | 'jersey';
    icon: string;
    label: string;
    priceRange: string;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    basePrice?: number; // For group packages
    images: number;
    outfits: number;
    popular?: boolean;
    description: string;
    addOns?: Record<string, number>; // For group size pricing
}

export interface AddOn {
    id: string;
    name: string;
    price: number;
    description?: string;
}

// Category data
export const CATEGORIES: Category[] = [
    {
        id: 'professional',
        icon: '💼',
        label: 'Professional',
        priceRange: '₦2,500+'
    },
    {
        id: 'graduation',
        icon: '🎓',
        label: 'Graduation',
        priceRange: '₦7,500+'
    },
    {
        id: 'birthday',
        icon: '🎉',
        label: 'Birthday',
        priceRange: '₦4,500+'
    },
    {
        id: 'group',
        icon: '👥',
        label: 'Group/Family',
        priceRange: '₦8,500+'
    },
    {
        id: 'jersey',
        icon: '⚽',
        label: 'Jersey Shoot',
        priceRange: '₦1,500+'
    }
];

// Package data by category
export const PACKAGES_BY_CATEGORY: Record<string, Package[]> = {
    professional: [
        {
            id: 'profile-headshots',
            name: 'PROFILE HEADSHOTS',
            price: 2500,
            images: 3,
            outfits: 1,
            description: 'LinkedIn & professional shots'
        },
        {
            id: 'occupation-shots',
            name: 'OCCUPATION SHOTS',
            price: 5000,
            images: 3,
            outfits: 1,
            popular: true,
            description: 'Professional theme, studio background'
        }
    ],
    graduation: [
        {
            id: 'graduation-shots',
            name: 'GRADUATION SHOTS',
            price: 7500,
            images: 3,
            outfits: 1,
            popular: true,
            description: 'Custom gown, custom sash'
        }
    ],
    birthday: [
        {
            id: 'birthday-basic',
            name: 'BIRTHDAY BASIC',
            price: 4500,
            images: 4,
            outfits: 1,
            description: 'Simple birthday layout'
        },
        {
            id: 'birthday-deluxe',
            name: 'BIRTHDAY DELUXE',
            price: 7500,
            images: 6,
            outfits: 2,
            popular: true,
            description: 'Enhanced birthday layout'
        },
        {
            id: 'birthday-royal',
            name: 'BIRTHDAY ROYAL',
            price: 10000,
            images: 10,
            outfits: 3,
            description: 'Luxury birthday layout'
        }
    ],
    group: [
        {
            id: 'group-standard',
            name: 'GROUP STANDARD',
            basePrice: 8500,
            price: 8500,
            images: 4,
            outfits: 2,
            description: 'Studio group layout',
            addOns: {
                '3': 3500,
                '4': 5500,
                '5': 5500
            }
        },
        {
            id: 'group-deluxe',
            name: 'GROUP DELUXE',
            basePrice: 13000,
            price: 13000,
            images: 6,
            outfits: 3,
            popular: true,
            description: 'Creative group poses',
            addOns: {
                '3': 3500,
                '4': 5500,
                '5': 5500
            }
        },
        {
            id: 'group-supreme',
            name: 'GROUP SUPREME',
            basePrice: 20000,
            price: 20000,
            images: 10,
            outfits: 5,
            description: 'Premium group concept',
            addOns: {
                '3': 3500,
                '4': 5500,
                '5': 5500
            }
        }
    ],
    jersey: [
        {
            id: 'jersey-shoot',
            name: 'JERSEY SHOOT',
            price: 1500,
            images: 3,
            outfits: 1,
            popular: true,
            description: 'Customized name on jersey'
        }
    ]
};

// Add-ons
export const ADD_ONS: AddOn[] = [
    { id: 'extra-image', name: 'Extra Image', price: 500, description: 'One additional edited photo' },
    { id: 'extra-outfit', name: 'Extra Outfit', price: 1000, description: 'One additional outfit change' },
    { id: 'advanced-retouch', name: 'Advanced Retouch', price: 1500, description: 'Professional skin smoothing' },
    { id: 'body-restructuring', name: 'Body Restructuring', price: 3000, description: 'Subtle body shaping' },
    { id: 'rush-delivery', name: 'Rush Delivery', price: 1000, description: 'Get photos in 1 hour' }
];

// Helper tips for each section
export const HELPER_TIPS: Record<string, string[]> = {
    category: [
        "Professional: Perfect for LinkedIn, job applications, and professional profiles",
        "Graduation: Celebrate your achievement with customized graduation shots",
        "Birthday: Special celebration photos with themed backgrounds",
        "Group/Family: Photos for families, friends, or team portraits",
        "Jersey Shoot: Showcase your team spirit with customized jersey photos"
    ],
    package: [
        "More photos = more variety in your final selection",
        "Popular packages offer the best value for most clients",
        "Group packages: Price increases with additional people",
        "Select based on your needs and budget"
    ],
    photos: [
        "Face photo: Clear, front-facing selfie with good lighting",
        "Body photo: Full body shot in fitted clothes against simple background",
        "Avoid sunglasses, hats, or heavy filters for best results",
        "Good lighting makes a huge difference in final quality"
    ],
    phone: [
        "We'll deliver your photos to this WhatsApp number",
        "Make sure to enter a valid Nigerian number",
        "You'll receive order updates via WhatsApp",
        "Double-check the number before proceeding"
    ],
    styling: [
        "All styling options are optional and free with your package",
        "Our team will contact you for further clarification",
        "Makeup option is for female clients only",
        "Be specific with preferences for best results"
    ],
    outfits: [
        "Upload: Use photos of outfits you already own",
        "Browse: Choose from our curated digital wardrobe",
        "Let us choose: Our stylists will select based on your package",
        "You can mix and match methods"
    ],
    payment: [
        "Add-ons can enhance your photoshoot experience",
        "Extra images and outfits can be added later if needed",
        "Secure payment processed instantly",
        "You'll receive order confirmation immediately"
    ]
};

// Calculate group package price based on size
export function calculateGroupPrice(pkg: Package, groupSize: number): number {
    if (!pkg.basePrice || !pkg.addOns) {
        return pkg.price;
    }

    const basePrice = pkg.basePrice;
    const addon = pkg.addOns[groupSize.toString()] || 0;

    return basePrice + addon;
}

// Format Nigerian currency
export function formatNaira(amount: number): string {
    return `₦${amount.toLocaleString()}`;
}

// Generate order ID
export function generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-6);
    return `RAD-${timestamp}`;
}

// WhatsApp deep link generator - Message FROM client TO team
export function generateWhatsAppLink(orderId: string, packageName: string, amount: number, businessNumber: string = '233207472307'): string {
    const message = `Hi Radikal Team! 👋

I just booked a photoshoot and would like to track my order.

📌 Order ID: ${orderId}
📦 Package: ${packageName}
💰 Amount: ₦${amount.toLocaleString()}

Please let me know the status of my order. Thank you!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${businessNumber}?text=${encoded}`;
}
