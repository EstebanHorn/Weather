/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { 
      orderWidth: {
        DEFAULT: '1px',
        'small': '1px',
      },
     },
  },
  plugins: [],
}

