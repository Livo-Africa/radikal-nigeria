// src/utils/bookingDataGhana.ts
// All category, package, and add-on data for Ghana booking flow
// Using icon names for Lucide icon rendering

export interface Category {
    id: 'profile' | 'social' | 'business' | 'couples' | 'group' | 'creative';
    iconName: string; // Lucide icon name
    label: string;
    priceRange: string;
}

export interface Package {
    id: string;
    name: string;
    price: number;
    basePrice?: number;
    images: number;
    outfits: number;
    popular?: boolean;
    description: string;
    addOns?: Record<string, number>;
    deliveryTime?: string;
    originalPrice?: number;
}

export interface AddOn {
    id: string;
    name: string;
    price: number;
    description?: string;
    iconName?: string;
    popular?: boolean;
}

// Category data - using Lucide icon names
export const CATEGORIES: Category[] = [
    {
        id: 'profile',
        iconName: 'User',
        label: 'Profile',
        priceRange: '₵30+'
    },
    {
        id: 'social',
        iconName: 'Camera',
        label: 'Social Media',
        priceRange: '₵40+'
    },
    {
        id: 'business',
        iconName: 'Briefcase',
        label: 'Business',
        priceRange: '₵50+'
    },
    {
        id: 'couples',
        iconName: 'Heart',
        label: 'Couples',
        priceRange: '₵80+'
    },
    {
        id: 'group',
        iconName: 'Users',
        label: 'Group',
        priceRange: '₵100+'
    },
    {
        id: 'creative',
        iconName: 'Star',
        label: 'Creative',
        priceRange: '₵120+'
    }
];

// Package data by category
export const PACKAGES_BY_CATEGORY: Record<string, Package[]> = {
    profile: [
        {
            id: 'basic-profile',
            name: 'Basic Profile',
            price: 30,
            originalPrice: 50,
            images: 2,
            outfits: 1,
            deliveryTime: '1-3 hours',
            description: 'Clean professional shots'
        },
        {
            id: 'professional-headshots',
            name: 'Professional Headshots',
            price: 50,
            originalPrice: 80,
            images: 3,
            outfits: 2,
            deliveryTime: '1-3 hours',
            popular: true,
            description: '3 professional poses, enhanced styling'
        },
        {
            id: 'premium-portfolio',
            name: 'Premium Portfolio',
            price: 70,
            originalPrice: 120,
            images: 5,
            outfits: 3,
            deliveryTime: '1-2 hours',
            description: '5 versatile shots, premium backgrounds'
        }
    ],
    social: [
        {
            id: 'social-essential',
            name: 'Social Essential',
            price: 40,
            originalPrice: 60,
            images: 5,
            outfits: 2,
            deliveryTime: '1-3 hours',
            popular: true,
            description: '5 social-ready photos, platform optimization'
        },
        {
            id: 'social-pro',
            name: 'Social Pro',
            price: 80,
            originalPrice: 120,
            images: 10,
            outfits: 3,
            deliveryTime: '1-2 hours',
            description: '10 curated photos, multiple styles'
        }
    ],
    // Default fallback packages for other categories
    business: [
        {
            id: 'business-standard',
            name: 'Standard Business',
            price: 50,
            images: 3,
            outfits: 2,
            description: 'Standard business portraits'
        },
        {
            id: 'business-pro',
            name: 'Pro Business',
            price: 90,
            images: 6,
            outfits: 3,
            popular: true,
            description: 'Complete business branding set'
        }
    ],
    couples: [
        {
            id: 'couples-standard',
            name: 'Couples Standard',
            price: 80,
            images: 5,
            outfits: 2,
            description: 'Romantic couple poses'
        },
        {
            id: 'couples-deluxe',
            name: 'Couples Deluxe',
            price: 150,
            images: 10,
            outfits: 3,
            popular: true,
            description: 'Extended couple session'
        }
    ],
    group: [
        {
            id: 'group-standard',
            name: 'Group Standard',
            basePrice: 100,
            price: 100,
            images: 5,
            outfits: 2,
            description: 'Standard group session'
        }
    ],
    creative: [
        {
            id: 'creative-standard',
            name: 'Creative Standard',
            price: 120,
            images: 5,
            outfits: 2,
            description: 'Artistic creative direction'
        }
    ]
};

// Add-ons with Lucide icon names
export const ADD_ONS: AddOn[] = [
    { id: 'extra-image', name: '+1 Extra Image', price: 10, description: 'One additional edited photo', iconName: 'ImagePlus', popular: true },
    { id: 'advanced-retouching', name: 'Advanced Retouching', price: 15, description: 'Professional skin smoothing', iconName: 'Sparkles' },
    { id: 'body-enhancement', name: 'Body Enhancement', price: 50, description: 'Subtle body shaping', iconName: 'Wand2' },
    { id: 'additional-outfit', name: 'Additional Outfit', price: 40, description: 'Add one more outfit', iconName: 'Shirt', popular: true },
    { id: 'rush-delivery', name: 'Rush Delivery', price: 30, description: 'Get photos in 1 hour', iconName: 'Zap' },
    { id: 'premium-backgrounds', name: 'Premium Backgrounds', price: 25, description: 'Exclusive background options', iconName: 'Image' }
];

// Helper tips for each section
export const HELPER_TIPS: Record<string, string[]> = {
    category: [
        "Profile: Perfect for LinkedIn and CVs",
        "Social: Trendy shots for Instagram/TikTok",
        "Business: Corporate branding and headshots",
        "Couples: Romantic shots with your partner",
        "Creative: Artistic concepts and editorial looks"
    ],
    package: [
        "More photos = more variety for your feed",
        "Social Pro offers the best value per photo",
        "Premium packages include faster delivery",
        "Select based on your outfit needs"
    ],
    photos: [
        "Face photo: Clear selfie improves auto-styling",
        "Body photo: Helps us prep the right size outfits",
        "Natural lighting works best for uploads",
        "No filters please - we need the real you"
    ],
    phone: [
        "We'll deliver your photos via WhatsApp",
        "Use your active WhatsApp number",
        "Ghana numbers usually start with 02, 05, etc.",
        "You'll get a tracking link instantly"
    ],
    styling: [
        "Describe your dream look in detail",
        "Our stylists review every request",
        "Feel free to skip if you trust our taste",
        "You can mix and match style options"
    ],
    outfits: [
        "Upload photos of your own clothes",
        "Browse our digital wardrobe (coming soon)",
        "Let us style you completely",
        "Bring backup options just in case"
    ],
    payment: [
        "Secure mobile money payment",
        "Pay with MTN, Vodafone, or AirtelTigo",
        "Cards also accepted securely",
        "Immediate booking confirmation"
    ]
};

// Calculate group package price based on size (Placeholder implementation if needed)
export function calculateGroupPrice(pkg: Package, groupSize: number): number {
    // Simple logic: base price + (size - 2) * 20 GHS per extra person
    const base = pkg.basePrice || pkg.price;
    if (groupSize <= 2) return base;
    return base + (groupSize - 2) * 20;
}

// Format Ghana currency
export function formatCurrency(amount: number): string {
    return `₵${amount.toLocaleString()}`;
}

// Generate order ID
export function generateOrderId(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `RAD-GH-${timestamp}-${random}`;
}

// WhatsApp deep link generator
export function generateWhatsAppLink(orderId: string, packageName: string, amount: number, businessNumber: string = '233207472307'): string {
    const message = `Hi Radikal Team!

I just booked a photoshoot in Ghana and would like to track my order.

Order ID: ${orderId}
Package: ${packageName}
Amount: ₵${amount.toLocaleString()}

Please let me know the status of my order. Thank you!`;

    const encoded = encodeURIComponent(message);
    return `https://wa.me/${businessNumber}?text=${encoded}`;
}
