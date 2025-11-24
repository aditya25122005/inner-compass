/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFEF9',
          100: '#FFFCF0',
          200: '#FFF8E1',
          300: '#FFF3D1',
          400: '#FFEFC2',
          500: '#FFEAB3',
          600: '#F5DFA3',
          700: '#E8D193',
          800: '#D9C283',
          900: '#C8B373',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'gentle-pulse': 'gentlePulse 4s ease-in-out infinite',
        'breathe': 'breathe 5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 1.2s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'fade-in-left': 'fadeInLeft 0.8s ease-out',
        'fade-in-right': 'fadeInRight 0.8s ease-out',
      },
    },
  },
  plugins: [],
}
