// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#000000',
        'primary-gold': '#eef10e',
        'accent-red': '#B91C1C',
        'clean-white': '#FFFFFF',
        'light-grey': '#F5F5F5',
      },
      fontFamily: {
  playfair: ['var(--font-playfair)', 'serif'], // CHANGE THIS LINE
},
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
        'slideUp': 'slideUp 0.8s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'bounce-glow': 'bounce-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-glow': {
          '0%, 100%': { 
            transform: 'translateY(0) scale(1)',
            boxShadow: '0 0 20px #25D366, 0 0 30px #25D366'
          },
          '50%': { 
            transform: 'translateY(-10px) scale(1.1)',
            boxShadow: '0 0 30px #25D366, 0 0 50px #25D366'
          },
        }
      }
    },
  },
  plugins: [],
}