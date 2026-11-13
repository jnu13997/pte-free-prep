/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearson: {
          navy: '#022340',
          blue: '#0071c5',
          lightBlue: '#e8f4fc',
          lightGray: '#f4f6f8',
          borderGray: '#d9d9d9',
          textGray: '#333333',
        }
      }
    },
  },
  plugins: [],
}
