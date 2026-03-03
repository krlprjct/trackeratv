/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{tsx,ts,jsx,js}',
    '!./node_modules/**',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#FDFCFB',
          100: '#F9F8F6',
          200: '#F2F0EB',
        },
        luminous: {
          red: '#CC4422',
          dark: '#0A0A0A',
        },
      },
    },
  },
  plugins: [],
};
