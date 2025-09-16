// tailwind.config.js or tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // default body
        heading: ["Montserrat", "sans-serif"], // custom for headings
      },
    },
  },
};

export default config
