import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiUrl = env.VITE_DATABASE_URL;

  let proxyTarget = null;
  if (apiUrl) {
    try {
      const url = new URL(apiUrl);
      proxyTarget = `${url.protocol}//${url.host}`;
    } catch (e) {
      console.warn(
        "Invalid VITE_DATABASE_URL, proxy will not be configured",
        e
      );
    }
  } else {
    console.warn("VITE_DATABASE_URL not found in environment variables");
  }

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
      tailwindcss(),
    ],
    server: {
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          }
        : {},
    },
  };
});
