import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "components": resolve(__dirname, "src/components"),
      "guards": resolve(__dirname, "src/guards"),
      "logic": resolve(__dirname, "src/logic"),
      "styles": resolve(__dirname, "src/styles")
    }
  },
  build: {
    outDir: "dist"
  }
});
