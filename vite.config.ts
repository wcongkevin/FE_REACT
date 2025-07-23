import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import EnvironmentPlugin from "vite-plugin-environment";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin("all")],
  build: {
    outDir: "build",
    assetsDir: "",
  },
  server: {
    host: "localhost",
    port: parseInt(process.env.PORT) || 8080,
  },
  base: process.env.PUBLIC_URL || "/",
});
