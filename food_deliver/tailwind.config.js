/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          primary: '#FC8019',
          'primary-hover': '#E46F12',
          heading: '#282C3F',
          secondary: '#686B78',
          bg: '#F8F8F8',
          card: '#FFFFFF',
          success: '#60B246',
          warning: '#FFB800',
          error: '#FF5252',
        },
        // Old Colors (Mapping to new for safety)
        primary: '#FC8019',
        'primary-hover': '#E46F12',
        'bg-color': '#F8F8F8',
        'surface-color': '#FFFFFF',
        'text-main': '#282C3F',
        'text-light': '#686B78',
        'border-color': '#E9E9EB',
      }
    },
  },
  plugins: [],
}
