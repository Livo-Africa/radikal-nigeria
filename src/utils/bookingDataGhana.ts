// src/utils/bookingDataGhana.ts
// All category, package, and add-on data for Ghana booking flow
// Using icon names for Lucide icon rendering

export interface Category {
    id: 'specialty' | 'birthday' | 'solo' | 'couple' | 'group' | 'digital' | 'kids' | 'video';
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
        id: 'birthday',
        iconName: 'Cake',
        label: 'Birthday',
        priceRange: '₵40+'
    },
    {
        id: 'solo',
        iconName: 'User',
        label: 'Solo Collection',
        priceRange: '₵50+'
    },
    {
        id: 'couple',
        iconName: 'Users',
        label: 'Couple Collection',
        priceRange: '₵80+'
    },
    {
        id: 'group',
        iconName: 'Users',
        label: 'Group Collection',
        priceRange: '₵150+'
    },
    {
        id: 'specialty',
        iconName: 'Star',
        label: 'Special',
        priceRange: '₵30+'
    },
    {
        id: 'digital',
        iconName: 'Smartphone',
        label: 'Digital Services',
        priceRange: '₵10+'
    },
    {
        id: 'kids',
        iconName: 'Baby',
        label: 'Kids',
        priceRange: '₵50+'
    },
    {
        id: 'video',
        iconName: 'Video',
        label: 'Short Video Services',
        priceRange: '₵15+'
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
            description: 'Perfect for LinkedIn or ID cards.'
        },
        {
            id: 'jersey-shoot',
            name: 'Jersey Shoot',
            price: 20,
            images: 3,
            outfits: 1, // Assumed 1 outfit (the jersey)
            description: 'Customized name on jersey + Studio theme.'
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
            id: 'grad-basic',
            name: 'GRAD BASIC',
            price: 70,
            images: 3,
            outfits: 1, // Gown
            description: 'Headshot, Medium, Full. Graduation gown & cap.'
        },
        {
            id: 'grad-sash',
            name: 'GRAD BASIC + Custom Sash',
            price: 90,
            images: 3,
            outfits: 1,
            description: 'Basic package + Custom Sash with name & school.'
        },
        {
            id: 'grad-props',
            name: 'GRAD BASIC + Sash + Props',
            price: 110,
            images: 3,
            outfits: 1,
            description: 'Basic package + Custom Sash + Props (Certificate, Flowers, Balloons).'
        }
    ],
    birthday: [
        {
            id: 'birthday-basic',
            name: 'Birthday Basic',
            price: 40,
            images: 4,
            outfits: 1,
            description: 'The Simple Balloon Look. Balloon background only.'
        },
        {
            id: 'birthday-deluxe',
            name: 'Birthday Deluxe',
            price: 70,
            images: 6,
            outfits: 2,
            description: 'The Complete Party Look. Balloons + Party Props (e.g. happy birthday banner or age). 1 Hairstyle.'
        },
        {
            id: 'birthday-royal',
            name: 'Birthday Royal',
            price: 100,
            images: 9,
            outfits: 3,
            description: 'The VIP Luxury Experience. Props based on client preference. 2 Hairstyles. Priority Express Processing.'
        }
    ],
    solo: [
        {
            id: 'solo-standard',
            name: 'SOLO STANDARD',
            price: 50,
            images: 3,
            outfits: 1,
            description: 'Basic poses. Basic editing.'
        },
        {
            id: 'solo-medium',
            name: 'SOLO MEDIUM',
            price: 90,
            images: 6,
            outfits: 2,
            description: 'Varied creative poses. Premium editing.'
        },
        {
            id: 'solo-supreme',
            name: 'SOLO SUPREME',
            price: 130,
            images: 10,
            outfits: 3,
            popular: true,
            description: 'Premium creative poses. Advanced retouching. Priority Delivery.'
        }
    ],
    couple: [
        {
            id: 'couple-standard',
            name: 'COUPLE STANDARD',
            price: 80,
            images: 3,
            outfits: 1,
            description: 'Studio layout. 1 Outfit theme.'
        },
        {
            id: 'couple-medium',
            name: 'COUPLE MEDIUM',
            price: 150,
            images: 6,
            outfits: 2,
            description: 'Creative poses (Studio). 2 Outfit themes.'
        },
        {
            id: 'couple-supreme',
            name: 'COUPLE SUPREME',
            price: 280,
            images: 9,
            outfits: 3,
            description: 'Premium concept (Outdoor/Studio). 3 Outfit themes.'
        }
    ],
    group: [
        {
            id: 'group-lite',
            name: 'GROUP LITE',
            basePrice: 150,
            price: 150,
            images: 3,
            outfits: 1,
            description: 'Studio group layout. 1 Outfit theme.'
        },
        {
            id: 'group-plus',
            name: 'GROUP PLUS',
            basePrice: 280,
            price: 280,
            images: 6,
            outfits: 2,
            description: 'Creative group poses (Studio). 2 Outfit themes.'
        },
        {
            id: 'group-max',
            name: 'GROUP MAX',
            basePrice: 500,
            price: 500,
            images: 9,
            outfits: 3,
            description: 'Premium group concept (Outdoor / Studio). 3 Outfit themes.'
        }
    ],
    kids: [
        {
            id: 'kids-package',
            name: 'KIDS',
            price: 50,
            images: 3,
            outfits: 1,
            description: 'Premium editing. Note: Want more than one outfit? Simply book multiple packages.'
        }
    ],
    video: [
        {
            id: 'ai-animation',
            name: 'AI Animation',
            price: 25,
            images: 1,
            outfits: 0,
            description: 'One photo comes alive (smile, wave). 80% face likeness. (6 secs)'
        },
        {
            id: 'simple-slideshow',
            name: 'Simple Slideshow',
            price: 15,
            images: 10,
            outfits: 0,
            description: 'Basic photo transitions with music (10-20 photos). (30 secs)'
        },
        {
            id: 'cinematic-slideshow',
            name: 'Cinematic Slideshow',
            price: 20,
            images: 10,
            outfits: 0,
            description: 'Fancy zooms and fades. Professional movie style (10-20 photos). (30-40 secs)'
        },
        {
            id: 'creative-video',
            name: 'Creative Video',
            price: 25,
            images: 1,
            outfits: 0,
            description: 'Advanced video compilation effects. Professional touch (1-2 photos). (20-30 secs)'
        },
        {
            id: 'text-on-video',
            name: 'Text on Video',
            price: 25,
            images: 0,
            outfits: 0,
            description: 'Moving text added to your video/photo. Perfect for birthdays.'
        }
    ],
    digital: [
        {
            id: 'basic-photo-retouch',
            name: 'Basic Photo Retouch',
            price: 30,
            images: 1,
            outfits: 0,
            description: 'Standard editing enhancements.'
        },
        {
            id: 'digital-advanced-retouch',
            name: 'Advanced Retouch',
            price: 50,
            images: 1,
            outfits: 0,
            description: 'Professional editing.'
        },
        {
            id: 'outfit-change',
            name: 'Outfit Change',
            price: 15,
            images: 1,
            outfits: 0,
            description: 'Replace clothing digitally.'
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
            id: 'makeup',
            name: 'Makeup Application',
            price: 20,
            images: 1,
            outfits: 0,
            description: 'Professional eyes, lips, skin glow.'
        },
        {
            id: 'pose-adjustment',
            name: 'Pose Adjustment / Correction',
            price: 10,
            images: 1,
            outfits: 0,
            description: 'Corecting and switching body posturing digitally.'
        },
        {
            id: 'background-replacement',
            name: 'Background Change / Replacement',
            price: 10,
            images: 1,
            outfits: 0,
            description: 'Swap to studio, outdoor, etc. No package required.'
        },
        {
            id: 'combine-people',
            name: 'Two People Combined into One Image',
            price: 50,
            images: 1,
            outfits: 0,
            description: 'Merge separate individuals realistically.'
        },
        {
            id: 'object-removal',
            name: 'Object or Person Removal',
            price: 20,
            images: 1,
            outfits: 0,
            description: 'Removing undesired elements.'
        },
        {
            id: 'digital-body-restructuring',
            name: 'Body Restructuring',
            price: 60,
            images: 1,
            outfits: 0,
            description: 'Shape adjustment or slimming.'
        },
        {
            id: 'full-scene-replacement',
            name: 'Full Scene Replacement (Indoor/Outdoor)',
            price: 50,
            images: 1,
            outfits: 0,
            description: 'Replace the entire environment.'
        },
        {
            id: 'photo-to-illustration',
            name: 'Photo-to-Illustration / Cartoon Style',
            price: 40,
            images: 1,
            outfits: 0,
            description: 'Convert photo to cartoon illustration.'
        },
        {
            id: 'environmental-enhancement',
            name: 'Environmental Enhancement',
            price: 30,
            images: 1,
            outfits: 0,
            description: 'Sky, Nature, Studio enhancement.'
        },
        {
            id: 'mood-filter-pack',
            name: 'Mood / Filter Pack Application',
            price: 20,
            images: 1,
            outfits: 0,
            description: 'Cinematic Tones and mood application.'
        },
        {
            id: 'single-object-pet-addition',
            name: 'Single Object / Pet Addition',
            price: 20,
            images: 1,
            outfits: 0,
            description: 'Digitally add objects or pets.'
        },
        {
            id: 'photo-restoration',
            name: 'Photo Restoration',
            price: 50,
            images: 1,
            outfits: 0,
            description: 'Restore old / damaged photos.'
        },
        {
            id: 'mirror-reflection-effect',
            name: 'Mirror / Reflection Effect',
            price: 25,
            images: 1,
            outfits: 0,
            description: 'Add reflection effects.'
        }
    ]
};

// Add-ons with Lucide icon names
export const ADD_ONS: AddOn[] = [
    { id: 'extra-image', name: 'Extra Edited Image', price: 5, description: '+1 additional edited photo', iconName: 'ImagePlus' },
    { id: 'extra-outfit', name: 'Additional Outfit', price: 10, description: 'Add one more outfit', iconName: 'Shirt', popular: true },
    { id: 'extra-person', name: 'Additional Person', price: 30, description: 'Add 1 more person to group package', iconName: 'UserPlus' },
    { id: 'hairstyle-change-addon', name: 'Hairstyle Change', price: 10, description: 'Braids, curls, straight, etc.', iconName: 'Scissors' },
    { id: 'makeup-addon', name: 'Makeup Application', price: 15, description: 'Professional eyes, lips, skin glow', iconName: 'Sparkles' },
    { id: 'pose-change', name: 'Pose Change', price: 5, description: 'Change body posturing naturally', iconName: 'PersonStanding' },
    { id: 'background-change', name: 'Background Change', price: 7, description: 'Change scenery naturally', iconName: 'Image' },
    { id: 'body-restructuring-addon', name: 'Advanced Body Restructure', price: 30, description: 'Pregnancy, weight, height adjustment', iconName: 'Wand2' },
    { id: 'priority-handling', name: 'Priority Handling', price: 15, description: 'Front of Queue delivery', iconName: 'Zap' },
    { id: 'accessory-addition', name: 'Accessory Addition (Hats, Glasses, Jewelry)', price: 5, description: 'Enhance the look with accessories', iconName: 'Sparkles' },
    { id: 'lens-filter-effect', name: 'Lens / Filter Effect', price: 5, description: 'Creative lens and filter effects', iconName: 'Camera' },
    { id: 'color-boost', name: 'Color Boost / Saturation Adjustment', price: 10, description: 'Enhance image colors', iconName: 'Palette' },
    { id: 'shadow-removal', name: 'Shadow Removal / Brightness Fix', price: 7, description: 'Fix dark areas and shadows', iconName: 'Sun' },
    { id: 'background-blur', name: 'Background Blur / Bokeh Effect', price: 10, description: 'Professional depth of field', iconName: 'Aperture' },
    { id: 'outfit-pattern-change', name: 'Outfit Pattern Change', price: 15, description: 'Change clothing patterns', iconName: 'Shirt' },
    { id: 'facial-feature-enhancement', name: 'Full Facial Feature Enhancement', price: 20, description: 'Detailed facial retouching', iconName: 'Smile' },
    { id: 'virtual-lighting-adjustment', name: 'Virtual Lighting Adjustment', price: 10, description: 'Fix or enhance lighting', iconName: 'Lightbulb' },
    { id: 'watermark-removal', name: 'Watermark Removal', price: 5, description: 'Remove existing watermarks', iconName: 'Eraser' },
    { id: 'themed-shoot-addon', name: 'Themed shoot (Anniversary, Save the Date, etc.)', price: 50, description: 'Add theme to package', iconName: 'PartyPopper' }
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
export function calculateGroupPrice(pkg: Package, groupSize: number, categoryId: string = 'group'): number {
    const base = pkg.basePrice || pkg.price;
    
    // Couple is for 2, Group is for up to 4
    const includedPeople = categoryId === 'group' ? 4 : 2;
    
    if (groupSize <= includedPeople) return base;
    return base + (groupSize - includedPeople) * 30;
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

// Find the best package for a given number of outfits (used by wardrobe → booking flow)
export function findBestPackageForOutfits(outfitCount: number): { category: string; package: Package } | null {
    if (outfitCount <= 0) return null;

    // Search solo categories (not group, not digital)
    const searchCategories = ['solo', 'birthday', 'specialty'];
    let bestMatch: { category: string; package: Package } | null = null;

    for (const catId of searchCategories) {
        const packages = PACKAGES_BY_CATEGORY[catId];
        if (!packages) continue;

        for (const pkg of packages) {
            if (pkg.outfits >= outfitCount) {
                if (!bestMatch || pkg.outfits < bestMatch.package.outfits) {
                    bestMatch = { category: catId, package: pkg };
                }
                if (pkg.outfits === outfitCount) {
                    return bestMatch;
                }
            }
        }
    }

    return bestMatch;
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
