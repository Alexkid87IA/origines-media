/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'archivo': ['Archivo', 'Arial Black', 'sans-serif'],
        'inter-tight': ['Inter Tight', 'Helvetica Neue', 'sans-serif'],
        'jetbrains': ['JetBrains Mono', 'Menlo', 'monospace'],
        'fraunces': ['Fraunces', 'Georgia', 'serif'],
        // Legacy aliases — prevent breaking ~58 files that use font-montserrat / font-inter
        'montserrat': ['Archivo', 'Arial Black', 'sans-serif'],
        'inter': ['Inter Tight', 'Helvetica Neue', 'sans-serif'],
        'playfair': ['Fraunces', 'Georgia', 'serif'],
      },
      letterSpacing: {
        'archivo': '-0.03em',
        'mono': '0.14em',
        'eyebrow': '0.12em',
      },
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'origines': {
          'dark': '#0A0A0A',
          'light': '#F5F5F5',
        }
      },
      animation: {
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};