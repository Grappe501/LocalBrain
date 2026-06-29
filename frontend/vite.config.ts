import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number(process.env.LOCALBRAIN_FRONTEND_PORT ?? 5174);

export default defineConfig({
  plugins: [react()],
  server: {
    port,
    proxy: {
      "/api": {
        target: `http://localhost:${Number(process.env.LOCALBRAIN_PORT ?? 4545)}`,
        changeOrigin: true,
      },
    },
  },
});
