import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const currentDir = import.meta.dirname || process.cwd();

export default defineConfig({
    root: "frontend",
    publicDir: "public",
    plugins: [react()],
    server: {
        port: 5173,
        open: false,
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_URL || "http://localhost:5000",
                changeOrigin: true,
                secure: false
            }
        }
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(currentDir, "frontend/index.html")
            }
        }
    }
});
