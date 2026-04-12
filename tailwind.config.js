/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        surface: '#F8FAFC',
        'surface-alt': '#F1F5F9',
        border: '#E2E8F0',
        text: '#0F172A',
        'text-secondary': '#475569',
        'text-tertiary': '#94A3B8',
        teal: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#F0FDFA',
        },
        'grade-a': '#2563EB',
        'grade-b': '#7C3AED',
        'grade-c': '#8B5CF6',
        'grade-d': '#64748B',
        'priority-high': '#DC2626',
        'priority-medium': '#D97706',
        'priority-low': '#64748B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
