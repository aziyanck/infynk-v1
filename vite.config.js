import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), 
    react(),
    nodePolyfills({
      include: ['util', 'stream', 'path', 'fs', 'buffer'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Add other heavy libraries here if you use them (e.g., three.js)
        },
      },
    },
  },
});