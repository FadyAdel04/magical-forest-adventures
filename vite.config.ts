import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { devApiPlugin } from "./vite-plugin-dev-api";

export default defineConfig({
  plugins: [react(), tailwindcss(), devApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    target: "esnext",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Admin panel — its own chunk, never shipped to landing page visitors
          if (id.includes("/admin/")) return "admin";

          // Heavy vendor: framer-motion
          if (id.includes("framer-motion")) return "vendor-motion";

          // Supabase — only loaded when configured
          if (id.includes("@supabase/supabase-js")) return "vendor-supabase";

          // React core
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router-dom/") ||
            id.includes("node_modules/scheduler/")
          )
            return "vendor-react";

          // Form libraries
          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("zod")
          )
            return "vendor-form";

          // UI utilities
          if (
            id.includes("lucide-react") ||
            id.includes("sonner") ||
            id.includes("clsx") ||
            id.includes("tailwind-merge") ||
            id.includes("class-variance-authority")
          )
            return "vendor-ui";
        },
      },
    },
  },
});
