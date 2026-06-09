/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'mobile-body': '14px',
        'desktop-body': '16px',
      },
      colors: {
        forest: {
          light: '#EAF4EF',
          mint: '#F0FDFA',
          DEFAULT: '#0A5C36',
          dark: '#053C22',
        },
        teal: {
          light: '#E6F9F6',
          DEFAULT: '#0D9488',
          dark: '#0F766E',
        },
        coral: {
          light: '#FFF1F2',
          DEFAULT: '#E11D48',
          dark: '#BE123C',
        },
        gold: {
          light: '#FEF9C3',
          DEFAULT: '#EAB308',
          dark: '#A16207',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        cursive: ['Playball', 'Cookie', 'cursive'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(10, 92, 54, 0.08), 0 2px 8px -1px rgba(10, 92, 54, 0.04)',
        'premium-hover': '0 12px 30px -4px rgba(10, 92, 54, 0.15), 0 4px 12px -2px rgba(10, 92, 54, 0.08)',
        'app-bar': '0 -4px 16px -1px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite linear',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
}
