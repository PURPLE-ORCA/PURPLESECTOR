/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        "purple-brand": "#37045F", 
        "red-accent": "#950505", 
      },
    },
  },
  plugins: [],
};
