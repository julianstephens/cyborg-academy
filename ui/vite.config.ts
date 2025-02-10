import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target:
  //         // process.env.NODE_ENV === "production"
  //         // ? "https://academy.julianstephens.net"
  //         "http://localhost:8080",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, "/api/v1/"),
  //     },
  //   },
  // },
});
