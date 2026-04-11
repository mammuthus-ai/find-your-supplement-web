/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D1117',
        surface: '#161B22',
        'surface-alt': '#1C2333',
        border: '#30363D',
        text: '#F1F5F9',
        'text-secondary': '#94A3B8',
        'text-tertiary': '#64748B',
        teal: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#042F2E',
        },
        'grade-a': '#3B82F6',
        'grade-b': '#8B5CF6',
        'grade-c': '#A78BFA',
        'grade-d': '#94A3B8',
        'priority-high': '#EF4444',
        'priority-medium': '#F59E0B',
        'priority-low': '#94A3B8',
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
