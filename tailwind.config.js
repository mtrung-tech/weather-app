/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'weather-blue': '#3B82F6',
        'weather-dark': '#1E293B',
        'weather-light': '#F8FAFC',
      }
    },
  },
  plugins: [],
}
