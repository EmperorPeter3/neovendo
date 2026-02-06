import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  // Leaflet deps can be fragile with prebundling; keep them excluded,
  // but make sure react-dom is optimized so named exports like createPortal work.
  optimizeDeps: {
    exclude: ["react-leaflet", "@react-leaflet/core", "leaflet"],
    include: ["react-dom", "react-dom/client"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
