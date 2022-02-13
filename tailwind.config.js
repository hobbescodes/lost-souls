module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "header-font": ['"Indie Flower"', "cursive"],
      },
      width: {
        "98%": "98vw",
      },
      backgroundImage: {
        spooky: "url(/images/spooky.jpeg)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
