const withMT = require("@material-tailwind/react/utils/withMT");
 
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors : {
        bgPrimary : "#2A48DE", // Blue 
        // bgPrimary : "#0078D4", // Blue 
        bgSecondary : "#F3F3F3", // light Gray
        textPrimary : "#FFFFFF", // white
        textSecondary : '#8b8b8b', // Dark Gray 
        errorText : " #FF0000", // Red
      },
      fontFamily: {
        sans: ['"Montserrat"', "sans-serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
});