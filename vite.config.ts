import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
    },
    plugins: [react(), eslint()],
    // Helps with esm compatibility issues for nivo, see https://github.com/plouc/nivo/issues/2310
    resolve: {
      mainFields: ["module", "browser", "jsnext:main", "jsnext"],
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  };
});
