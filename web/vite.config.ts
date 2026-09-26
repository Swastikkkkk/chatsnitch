import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: { rollupOptions: { input: { main: path.resolve(__dirname, "index.html"), video: path.resolve(__dirname, "video.html") } } },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
