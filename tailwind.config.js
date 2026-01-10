/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soltan: {
          black: '#000000', // Solid Pitch Black
          midnight: '#0a0015', // Deep Violet hint
          white: '#ffffff',
          chrome: '#e2e8f0', // Silver/Chrome accent
          // Keeping these for limited accents if needed, but primary is chrome/white
          purple: '#b026ff', 
          cyan: '#00fff5', 
          gray: '#111111', 
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // I'll need to load a nice font
        mono: ['Space Mono', 'monospace'], // For technical specs
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'slow-spin': 'spin 20s linear infinite',
      }
    },
  },
  plugins: [],
}
