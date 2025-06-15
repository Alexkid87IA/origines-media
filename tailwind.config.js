/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'origines': {
          'dark': '#0A0A0A',
          'light': '#F5F5F5',
        }
      }
    },
  },
  plugins: [],
};