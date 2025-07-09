import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Import path

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: ["@babel/preset-flow"],
      },
    }),
  ],
  // REMOVED explicit css section from previous attempt

  // --- ADD ALIAS CONFIGURATION ---
  resolve: {
    alias: {
      // Set up '@' alias to point to the 'src' directory
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
