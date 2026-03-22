import { createRequire } from "node:module";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const require = createRequire(import.meta.url);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": { target: "http://localhost:3001", secure: false },
      "/socket.io": {
        target: "http://localhost:3001",
        ws: true,
        secure: false,
      },
      "/announce": {
        target: "http://localhost:3001",
        ws: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      webtorrent: require.resolve("webtorrent/dist/webtorrent.min.js"),
    },
  },
});
