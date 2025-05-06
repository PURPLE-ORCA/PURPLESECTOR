// frontend/postcss.config.cjs
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // <-- Make sure this is @tailwindcss/postcss
    autoprefixer: {},
  },
};
