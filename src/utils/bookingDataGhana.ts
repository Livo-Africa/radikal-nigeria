// src/utils/bookingDataGhana.ts
// All category, package, and add-on data for Ghana booking flow
// Using icon names for Lucide icon rendering

export interface Category {
    id: 'specialty' | 'birthday' | 'solo' | 'group' | 'digital';
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
    outfits: number; // 0 for digital services if applicable
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
        id: 'specialty',
        iconName: 'Star',
        label: 'Specialty & Themed',
        priceRange: '₵20+'
    },
    {
        id: 'birthday',
        iconName: 'Cake',
        label: 'Birthday',
        priceRange: '₵40+'
    },
    {
        id: 'solo',
        iconName: 'User',
        label: 'General Solo',
        priceRange: '₵50+'
    },
    {
        id: 'group',
        iconName: 'Users',
        label: 'Group & Duo',
        priceRange: '₵80+'
    },
    {
        id: 'digital',
        iconName: 'Smartphone',
        label: 'Digital Services',
        priceRange: '₵10+'
    }
];

// Package data by category
export const PACKAGES_BY_CATEGORY: Record<string, Package[]> = {
    specialty: [
        {
            id: 'profile-headshots',
            name: 'Profile Headshots',
            price: 30,
            images: 3,
            outfits: 1,
            description: 'Social media profiles or ID cards. 1 Headshot, 1 Medium, 1 Full.'
        },
        {
            id: 'jersey-shoot',
            name: 'Jersey Shoot',
            price: 20,
            images: 3,
            outfits: 1, // Assumed 1 outfit (the jersey)
            description: 'Sports fans. Customized name on jersey + Studio theme.'
        },
        {
            id: 'occupation-shots',
            name: 'Occupation Shots',
            price: 50,
            images: 3,
            outfits: 1,
            description: 'CVs, LinkedIn. Professional outfit theme + Studio background.'
        },
        {
            id: 'graduation-shots',
            name: 'Graduation Shots',
            price: 70,
            images: 3,
            outfits: 1, // Gown
            description: 'Celebrating finishing school. Custom gown & sash.'
        }
    ],
    birthday: [
        {
            id: 'birthday-basic',
            name: 'Birthday Basic',
            price: 40,
            images: 4,
            outfits: 1,
            description: 'Simple birthday layout. Mandatory custom birthday-themed background.'
        },
        {
            id: 'birthday-deluxe',
            name: 'Birthday Deluxe',
            price: 70,
            images: 6,
            outfits: 2,
            description: 'Enhanced birthday layout.'
        },
        {
            id: 'birthday-royal',
            name: 'Birthday Royal',
            price: 100,
            images: 10,
            outfits: 3,
            description: 'Luxury birthday layout.'
        }
    ],
    solo: [
        {
            id: 'solo-standard',
            name: 'Solo Standard',
            price: 50,
            images: 4,
            outfits: 1,
            description: 'Multiple poses. Great photos just for you.'
        },
        {
            id: 'solo-medium',
            name: 'Solo Medium',
            price: 90,
            images: 8,
            outfits: 2,
            description: 'Multiple poses per outfit.'
        },
        {
            id: 'solo-supreme',
            name: 'Solo Supreme',
            price: 130,
            images: 15,
            outfits: 3,
            popular: true,
            description: 'Wide pose variety & Premium lighting look.'
        }
    ],
    group: [
        {
            id: 'group-standard',
            name: 'Group Standard',
            basePrice: 80,
            price: 80,
            images: 4,
            outfits: 2, // "Outfit themes"
            description: 'Studio group layout. Max 2 people base price.'
        },
        {
            id: 'group-deluxe',
            name: 'Group Deluxe',
            basePrice: 130,
            price: 130,
            images: 6,
            outfits: 3,
            description: 'Creative group poses.'
        },
        {
            id: 'group-supreme',
            name: 'Group Supreme',
            basePrice: 200,
            price: 200,
            images: 10,
            outfits: 5,
            description: 'Premium group concept.'
        }
    ],
    digital: [
        {
            id: 'background-replacement',
            name: 'Background Replacement',
            price: 10,
            images: 1,
            outfits: 0,
            description: 'Swap to studio, outdoor, etc. No package required.'
        },
        {
            id: 'hairstyle-change',
            name: 'Hairstyle Change',
            price: 15,
            images: 1,
            outfits: 0,
            description: 'Braids, curls, straight, etc.'
        },
        {
            id: 'digital-advanced-retouch',
            name: 'Advanced Retouch',
            price: 15,
            images: 1,
            outfits: 0,
            description: 'Professional editing.'
        },
        {
            id: 'outfit-change',
            name: 'Outfit Change',
            price: 20,
            images: 1,
            outfits: 0,
            description: 'Replace clothing digitally.'
        },
        {
            id: 'makeup',
            name: 'Makeup',
            price: 45,
            images: 1,
            outfits: 0,
            description: 'Professional eyes, lips, skin glow.'
        },
        {
            id: 'digital-body-restructuring',
            name: 'Body Restructuring',
            price: 60,
            images: 1,
            outfits: 0,
            description: 'Shape adjustment or slimming.'
        }
    ]
};

// Add-ons with Lucide icon names
export const ADD_ONS: AddOn[] = [
    { id: 'extra-image', name: 'Extra Image', price: 5, description: '+1 additional edited photo', iconName: 'ImagePlus' },
    { id: 'background-pose-change', name: 'Background/Pose Change', price: 5, description: 'Change scenery or pose', iconName: 'Image' },
    { id: 'extra-outfit', name: 'Extra Outfit', price: 10, description: 'Add one more outfit', iconName: 'Shirt', popular: true },
    { id: 'advanced-retouch', name: 'Advanced Retouch', price: 15, description: 'Professional skin smoothing', iconName: 'Sparkles' },
    { id: 'body-restructuring', name: 'Body Restructuring', price: 30, description: 'Pregnancy, weight, height adjustment', iconName: 'Wand2' }
];

// Helper tips for each section
export const HELPER_TIPS: Record<string, string[]> = {
    category: [
        "Specialty: Role-based & event shoots",
        "Birthday: Celebrate your day in style (Mandatory background)",
        "Solo: Just for you, multiple outfits",
        "Group: For couples, friends, siblings",
        "Digital: Quick edits for existing photos"
    ],
    package: [
        "Select based on how many outfits you have",
        "More images = more variety",
        "Supreme/Royal packages offer the best value",
        "Digital services require no booking visit"
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
        "Full payment required before work begins",
        "Secure mobile money payment",
        "No refunds once processing starts",
        "Immediate booking confirmation"
    ]
};

// Calculate group package price based on size
export function calculateGroupPrice(pkg: Package, groupSize: number): number {
    // Base price is for 2 people
    // Add 1 extra person: +GH₵30
    const base = pkg.basePrice || pkg.price;
    if (groupSize <= 2) return base;
    return base + (groupSize - 2) * 30;
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
