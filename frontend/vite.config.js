// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// REMOVE the postcss imports
// import tailwindcss from '@tailwindcss/postcss'
// import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REMOVE the explicit css.postcss section
  // css: {
  //   postcss: {
  //     plugins: [
  //       tailwindcss,
  //       autoprefixer,
  //     ],
  //   },
  // },
});
