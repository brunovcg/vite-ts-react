import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { checker } from "vite-plugin-checker";

import { exec } from "child_process";

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

const watchConfigVariables = () => ({
  name: "watch-config-variables",
  handleHotUpdate({ file }: { file: string }) {
    if (file.includes("src/styles/config/variables.css")) {
      exec("npm run register:variables", (error) => {
        if (error) {
          console.error(`Error running register:variables: ${error}`);
        }
      });
    }
  },
});

export default defineConfig({
  plugins: [
    react({ jsxImportSource: "@/runtime" }),
    watchDesignStyles(),
    watchConfigVariables(),
    checker({ typescript: true }),
    ...(process.env.ANALYZE === "true"
      ? [
          visualizer({
            open: false,
            filename: "./.reports/bundle-analysis.html",
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("src/locales")) {
            return "locales";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
