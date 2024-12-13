// vite.config.js
import { defineConfig, splitVendorChunkPlugin } from "file:///home/cuong/Documents/gitlab/tro-client/node_modules/vite/dist/node/index.js";
import react from "file:///home/cuong/Documents/gitlab/tro-client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import compression from "file:///home/cuong/Documents/gitlab/tro-client/node_modules/vite-plugin-compression/dist/index.mjs";
import { fileURLToPath } from "url";
var __vite_injected_original_import_meta_url = "file:///home/cuong/Documents/gitlab/tro-client/vite.config.js";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240,
      deleteOriginFile: false
    }),
    splitVendorChunkPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      },
      treeshake: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9jdW9uZy9Eb2N1bWVudHMvZ2l0bGFiL3Ryby1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2N1b25nL0RvY3VtZW50cy9naXRsYWIvdHJvLWNsaWVudC92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9jdW9uZy9Eb2N1bWVudHMvZ2l0bGFiL3Ryby1jbGllbnQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHNwbGl0VmVuZG9yQ2h1bmtQbHVnaW4gfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBjb21wcmVzc2lvbiBmcm9tIFwidml0ZS1wbHVnaW4tY29tcHJlc3Npb25cIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwidXJsXCI7XG5cbmNvbnN0IF9fZmlsZW5hbWUgPSBmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCk7XG5jb25zdCBfX2Rpcm5hbWUgPSBwYXRoLmRpcm5hbWUoX19maWxlbmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogXCJnemlwXCIsXG4gICAgICBleHQ6IFwiLmd6XCIsXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxuICAgICAgZGVsZXRlT3JpZ2luRmlsZTogZmFsc2UsXG4gICAgfSksXG4gICAgc3BsaXRWZW5kb3JDaHVua1BsdWdpbigpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgb3V0RGlyOiBcImRpc3RcIixcbiAgICBtaW5pZnk6IFwiZXNidWlsZFwiLFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJub2RlX21vZHVsZXNcIikpIHtcbiAgICAgICAgICAgIHJldHVybiBpZFxuICAgICAgICAgICAgICAudG9TdHJpbmcoKVxuICAgICAgICAgICAgICAuc3BsaXQoXCJub2RlX21vZHVsZXMvXCIpWzFdXG4gICAgICAgICAgICAgIC5zcGxpdChcIi9cIilbMF1cbiAgICAgICAgICAgICAgLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHRyZWVzaGFrZTogdHJ1ZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLFNBQVMsY0FBYyw4QkFBOEI7QUFDNVYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGlCQUFpQjtBQUN4QixTQUFTLHFCQUFxQjtBQUp3SixJQUFNLDJDQUEyQztBQU12TyxJQUFNLGFBQWEsY0FBYyx3Q0FBZTtBQUNoRCxJQUFNLFlBQVksS0FBSyxRQUFRLFVBQVU7QUFFekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLE1BQ1YsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLE1BQ0wsV0FBVztBQUFBLE1BQ1gsa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLElBQ0QsdUJBQXVCO0FBQUEsRUFDekI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLElBQ1IsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBQ2YsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBQy9CLG1CQUFPLEdBQ0osU0FBUyxFQUNULE1BQU0sZUFBZSxFQUFFLENBQUMsRUFDeEIsTUFBTSxHQUFHLEVBQUUsQ0FBQyxFQUNaLFNBQVM7QUFBQSxVQUNkO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFdBQVc7QUFBQSxJQUNiO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
