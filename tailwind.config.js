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
            glow: 'rgba(236, 0, 140, 0.35)',
            muted: 'rgba(236, 0, 140, 0.12)',
          },
          cyan: {
            DEFAULT: '#06B6D4',
            light: '#67E8F9',
            dark: '#0891B2',
            glow: 'rgba(6, 182, 212, 0.35)',
          },
          violet: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
            dark: '#7C3AED',
            glow: 'rgba(139, 92, 246, 0.35)',
          },
          charcoal: {
            DEFAULT: '#333731',
            dark: '#141613',
            black: '#07080B',
            light: '#4A4F48',
          },
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            900: '#0F172A',
            950: '#07080B',
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
        'magenta-glow': '0 0 45px -5px rgba(236, 0, 140, 0.5)',
        'magenta-sm': '0 0 20px 0px rgba(236, 0, 140, 0.3)',
        'cyan-glow': '0 0 45px -5px rgba(6, 182, 212, 0.5)',
        'violet-glow': '0 0 45px -5px rgba(139, 92, 246, 0.5)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glass-light': '0 10px 40px -10px rgba(15, 23, 42, 0.1)',
        'card-hover': '0 25px 50px -12px rgba(236, 0, 140, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'marquee': 'marquee 25s linear infinite',
        'spin-slow': 'spin 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
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
