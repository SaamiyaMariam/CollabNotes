/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bluePastel: "#A8D1E7",
        offWhite: "#f5f2e6",
        pinkLight: "#FFBFC5",
        pinkMedium: "#EB8DB5",
        pinkPurple: "#D4A3C4",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], 
      },
    },
  },
  plugins: [],
};