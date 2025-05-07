// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "purple-brand": "#37045F", // Check name and hex code
        "red-accent": "#950505", // Check name and hex code
        // You can remove the dummy values now if they are still there
      },
    },
  },
  plugins: [],
};
