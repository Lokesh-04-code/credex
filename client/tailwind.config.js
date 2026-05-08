/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f1ff',
          100: '#e2e4ff',
          200: '#c7cbff',
          300: '#a5acff',
          400: '#8186ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          50:  '#f8f9ff',
          100: '#f1f2ff',
          900: '#0d0e1a',
          950: '#080910',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #0d0e1a 40%, #0a0a14 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(99,102,241,0.15)',
        'glow-sm': '0 0 20px rgba(99,102,241,0.1)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 40px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.25)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
