const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      "light-red": "#EE6868",
      red: "#CF1717",
      "dark-red": "#910000",
      "light-grey": "#F2F2F2",
      grey: "#7F7F7F",
      "dark-grey": "#262626",
      "med-grey": "#444444",
      black: "#262626",
      blue: "#1E59FE",
      white: "#FFFFFF",
    },
    extend: {
      fontFamily: {
        sans: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
