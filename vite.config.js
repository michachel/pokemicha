import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/pokemicha/", // À adapter selon le nom de ton repo GitHub
});
