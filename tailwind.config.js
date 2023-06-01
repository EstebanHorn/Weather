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
      backgroundImage: {
      'sun-bg': "url('/src/assets/minimal-scenery-sunset.jpg')",
    },},
  },
  plugins: [require("daisyui")],
}

