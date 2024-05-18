const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    animation: {
      goaround: 'goaround 0.2s linear infinite',
      stop: 'stop 1s ease-in-out',
    },
    keyframes: {
      goaround: {
        '0%': { transform: 'translateY(0)' },
        '100%': { transform: 'translateY(-1000px)' },
      },
      stop: {
        '0%': { transform: 'translateY(-1000px)' },
        '50%': { transform: 'translateY(-100px)' },
        '100%': { transform: 'translateY(0)' },
      },
    },
  },
  plugins: [addVariablesForColors,],
}

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

