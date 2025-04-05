/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'deep-plum': '#6D214F',
        'warm-beige': '#E3C4A8',
        
        // Neutral Base
        'pure-white': '#FFFFFF',
        'soft-gray': '#F4F1ED',
        
        // Accents
        'olive-green': '#3D9970',
        'burnt-orange': '#D35400',
        'crimson-red': '#C0392B',
        
        // Typography & Contrast
        'dark-espresso': '#3B2C35',
        'muted-taupe': '#8E8275',
      },
    },
  },
  plugins: [],
} 