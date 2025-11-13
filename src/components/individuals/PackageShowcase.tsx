// src/components/individuals/PackageShowcase.tsx - MODERN MOBILE UX
export default function PackageShowcase() {
  const packageCategories = [
    {
      title: "Special Occasions",
      packages: [
        {
          name: "Birthday Basic",
          price: "₵40",
          features: ["4 pictures", "1 outfit", "1 hairstyle", "Birthday theme"],
          bestFor: "Birthday celebrations",
          popular: false
        },
        {
          name: "Birthday Basic",
          price: "₵70",
          features: ["6 pictures", "2 outfit", "2 hairstyle", "Birthday theme"],
          bestFor: "Birthday celebrations",
          popular: true
        },
        {
          name: "Graduation Shots", 
          price: "₵70",
          features: ["3 images", "Personalized gown", "1 outfit"],
          bestFor: "Graduation ceremonies",
          popular: false
        }
      ]
    },
    {
      title: "Solo Packages",
      packages: [
        {
          name: "Solo Standard",
          price: "₵50",
          features: ["4 pictures", "1 outfit", "1 hairstyle"],
          bestFor: "Social media & casual use",
          popular: false
        },
        {
          name: "Solo Medium",
          price: "₵90", 
          features: ["8 pictures", "2 outfits", "2 hairstyles"],
          bestFor: "Personal branding",
          popular: true
        }
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4 font-playfair">
          Choose Your Package
        </h2>
        
        {/* Modern Mobile Design - Stacked Cards */}
        <div className="lg:hidden space-y-6">
          {packageCategories.flatMap(category => 
            category.packages.map((pkg, index) => (
              <div 
                key={`${category.title}-${index}`}
                className={`bg-white rounded-3xl p-6 shadow-2xl border-2 transition-all duration-500 transform hover:scale-[1.02] ${
                  pkg.popular 
                    ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/5 to-transparent' 
                    : 'border-gray-100'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="inline-block bg-[#D4AF37] text-black text-xs font-bold px-4 py-2 rounded-full mb-4">
                    ⭐ MOST POPULAR
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{pkg.bestFor}</p>
                  </div>
                  <div className="text-2xl font-bold text-[#D4AF37] bg-black/5 rounded-2xl px-4 py-2">
                    {pkg.price}
                  </div>
                </div>

                {/* Features as Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <span 
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Select Package
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:block space-y-12">
          {packageCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">
                {category.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {category.packages.map((pkg, pkgIndex) => (
                  <div 
                    key={pkg.name}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
                      <div className="text-3xl font-bold text-[#D4AF37] my-2">{pkg.price}</div>
                      <div className="text-sm text-gray-500 font-semibold">{pkg.bestFor}</div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-600">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                      Choose Package
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}