import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir:"lib",
    lib:{
      entry: "./src/index.ts",
      name: "mp4Remux",
      formats: ["es", "cjs","umd","iife"],

    },
    minify:true,
    sourcemap: true,
  },
});
