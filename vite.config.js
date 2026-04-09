import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      // Docker Desktop + montajes de enlace en Windows pueden perder eventos del sistema de archivos sin sondeo.      usePolling: true,
      interval: 120,
    },
    hmr: {
      host: "localhost",
      clientPort: 5173,
    },
  },
});
