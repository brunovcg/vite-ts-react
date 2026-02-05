import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

import { exec } from "child_process";

// Custom plugin to watch design styles
const watchDesignStyles = () => ({
  name: "watch-design-styles",
  handleHotUpdate({ file }: { file: string }) {
    if (file.includes("src/styles/design") && file.endsWith(".css")) {
      exec("npm run register:styles", (error) => {
        if (error) {
          console.error(`Error running register:styles: ${error}`);
        }
      });
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxImportSource: "@/runtime" }), watchDesignStyles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
