import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false,
    }),
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
      treeshake: true,
    },
  },
});
