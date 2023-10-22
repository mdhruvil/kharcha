import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifest: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest: {
    short_name: "Hisab | By Dhruvil",
    description: "App for maintaining Hisab",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "icons/16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "icons/32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "icons/72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "icons/96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "icons/120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        src: "icons/128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "icons/144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        src: "icons/152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "icons/180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "icons/192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "icons/384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "icons/512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icons/512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    name: "Hisab | By Dhruvil",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifest)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
