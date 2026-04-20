'use client';
import { useState } from 'react';
import { ArrowRight, Star, Clock, Image, Shirt, Check } from 'lucide-react';
import { PACKAGES_BY_CATEGORY as NG_PACKAGES_DATA } from '@/utils/bookingDataNigeria';
import { PACKAGES_BY_CATEGORY as GH_PACKAGES_DATA, CATEGORIES as GH_CATEGORIES_DATA } from '@/utils/bookingDataGhana';

interface Package {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  photos: number;
  outfits: number;
  deliveryTime: string;
  features: string[];
  popular: boolean;
  category: string;
}

interface PackageShowcaseProps {
  country?: 'GH' | 'NG';
}



export default function PackageShowcase({ country = 'GH' }: PackageShowcaseProps) {
  const [showAll, setShowAll] = useState(false);

  let allPackages: Package[];

  if (country === 'NG') {
    const ngPackages: Package[] = [];
    Object.keys(NG_PACKAGES_DATA).forEach(key => {
      const packages = NG_PACKAGES_DATA[key];
      packages.forEach(pkg => {
        ngPackages.push({
          id: pkg.id,
          name: pkg.name,
          price: `₦${pkg.price.toLocaleString()}`,
          originalPrice: undefined,
          photos: pkg.images,
          outfits: pkg.outfits,
          deliveryTime: "1-3 hours",
          features: [pkg.description],
          popular: pkg.popular || false,
          category: key.charAt(0).toUpperCase() + key.slice(1)
        });
      });
    });
    allPackages = ngPackages;
  } else {
    const ghPackages: Package[] = [];
    GH_CATEGORIES_DATA.forEach(cat => {
      const packages = GH_PACKAGES_DATA[cat.id] || [];
      packages.forEach(pkg => {
        ghPackages.push({
          id: pkg.id,
          name: pkg.name,
          price: `₵${pkg.price.toLocaleString()}`,
          originalPrice: pkg.originalPrice ? `₵${pkg.originalPrice.toLocaleString()}` : undefined,
          photos: pkg.images,
          outfits: pkg.outfits || 0,
          deliveryTime: pkg.deliveryTime || "1-3 hours",
          features: [pkg.description],
          popular: pkg.popular || false,
          category: cat.label
        });
      });
    });
    allPackages = ghPackages;
  }

  const displayedPackages = showAll ? allPackages : allPackages.slice(0, 6);
  const hiddenCount = Math.max(0, allPackages.length - 6);

  const handlePackageSelect = (pkg: Package) => {
    const packageData = {
      package: pkg,
      selectedAt: new Date().toISOString()
    };
    localStorage.setItem('radikal_preselected_package', JSON.stringify(packageData));

    if (country === 'NG') {
      window.location.href = '/individuals/book';
    } else {
      window.location.href = '/individuals/style-journey?step=2';
    }
  };

  return (
    <section className="py-16 bg-[#0A0A0F] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Popular Packages
          </h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Choose from our most popular photoshoot packages in {country === 'GH' ? 'Ghana' : 'Nigeria'}
          </p>
        </div>

        {/* Packages Grid - Dark Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 pt-6 px-2">
          {displayedPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-amber-500/30 shadow-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.08)] transition-all duration-500 hover:-translate-y-1 group"
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3 -left-1 z-20">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 shadow-[0_0_15px_rgba(244,114,182,0.4)] transform -rotate-3 rounded-lg">
                    ✨ POPULAR
                  </div>
                </div>
              )}

              {/* Price Tag */}
              <div className="absolute -top-4 -right-1 z-20">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-black p-0.5 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <div className="px-3 py-1.5 rounded-[10px]">
                    <div className="text-xl font-black">{pkg.price}</div>
                  </div>
                </div>
              </div>

              {/* Package Header */}
              <div className="mb-4 relative z-10 pt-2">
                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs text-white/40 uppercase tracking-wider font-medium mt-1">{pkg.category}</p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2.5 mb-8 relative z-10 px-1">
                {/* Photos */}
                <div className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                  <Image className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                  <span className="font-medium text-white/80">{pkg.photos} Professional photos</span>
                </div>

                {/* Outfits */}
                <div className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                  <Shirt className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                  <span className="font-medium text-white/80">{pkg.outfits} Outfit{pkg.outfits > 1 ? 's' : ''}</span>
                </div>

                {/* Delivery Time */}
                <div className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                  <span className="font-medium text-white/80">Delivery in {pkg.deliveryTime}</span>
                </div>

                {/* Other Features */}
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm bg-white/[0.04] p-2.5 rounded-xl border border-white/5">
                    <Check className="w-4 h-4 text-amber-400 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium text-white/70">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Select Button */}
              <button
                onClick={() => handlePackageSelect(pkg)}
                className="relative z-10 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] active:scale-[0.98]"
              >
                <span>Select Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {allPackages.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white/5 backdrop-blur-xl text-white/70 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 hover:text-white transition-all border border-white/10 hover:border-white/20 flex items-center space-x-2 mx-auto"
            >
              <span>{showAll ? 'Show Less' : `View All Packages (${hiddenCount} more)`}</span>
              <ArrowRight className={`w-4 h-4 transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
