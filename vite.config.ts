import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/atwood-machine-visualiser/", // MUST match repo name
});
