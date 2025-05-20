/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          // Add other shades from our earlier configuration
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Add secondary and accent colors from earlier config
      },
    },
  },
  plugins: [],
}