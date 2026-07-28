/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rak: {
          magenta: {
            DEFAULT: '#EC008C',
            light: '#FF33AA',
            dark: '#C80074',
            glow: 'rgba(236, 0, 140, 0.25)',
            muted: 'rgba(236, 0, 140, 0.1)',
          },
          charcoal: {
            DEFAULT: '#333731',
            dark: '#141613',
            black: '#0B0D0B',
            light: '#4A4F48',
          },
          slate: {
            50: '#F5F6F5',
            100: '#E9EAE8',
            200: '#D2D5D1',
            300: '#B0B4AE',
            400: '#888D85',
            500: '#656A62',
            600: '#4D514B',
            700: '#3A3E39',
            800: '#282B27',
            900: '#191C18',
            950: '#0E100E',
          },
          cream: '#FAFAFA',
        }
      },
      fontFamily: {
        sans: ['Gilroy', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        heading: ['Eurostile Extended', 'Eurostile', 'Gilroy', 'sans-serif'],
        eurostile: ['Eurostile Extended', 'Eurostile', 'sans-serif'],
        gilroy: ['Gilroy', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'magenta-glow': '0 0 35px -5px rgba(236, 0, 140, 0.4)',
        'magenta-sm': '0 0 15px 0px rgba(236, 0, 140, 0.25)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
