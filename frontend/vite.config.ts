import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBaseUrl = env.VITE_API_BASE_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/capture-logs": {
          target: apiBaseUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
