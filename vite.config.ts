import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  plugins: [
    react(),
    // Only include runtime error overlay in development
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@/components/ui": path.resolve(import.meta.dirname, "client", "src", "shared", "ui", "components"),
      "@/lib": path.resolve(import.meta.dirname, "client", "src", "shared", "lib"),
      "@/hooks": path.resolve(import.meta.dirname, "client", "src", "shared", "ui", "hooks"),
      "@/contexts": path.resolve(import.meta.dirname, "client", "src", "app", "providers"),
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Fix potential bundling issues
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['zustand', '@tanstack/react-query'],
        },
      },
    },
    // Ensure proper minification
    minify: true,
  },
});
