/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'consular-bg': '#E0F2F1', // Light marine/turquoise
        'consular-dark': '#00695C', // Darker blue/teal for menu
        'ro-blue': '#002B7F',
        'ro-yellow': '#FCD116',
        'ro-red': '#CE1126',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}