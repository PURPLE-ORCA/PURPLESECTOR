// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Import path

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REMOVED explicit css section from previous attempt

  // --- ADD ALIAS CONFIGURATION ---
  resolve: {
    alias: {
      // Set up '@' alias to point to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
