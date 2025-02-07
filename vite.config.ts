import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';

const isQiankun = process.env.QIANKUN === 'true';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: './', // Adjust base path for Qiankun compatibility
  plugins: [
    react(),
    qiankun('app-name', { useDevMode: !isProduction }) // Disable dev mode in production
  ],
  server: {

    host: '0.0.0.0', // Allow access from Docker
    port: 5173,
    cors: {
      origin: "http://localhost:3000",
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, // Allow cookies to be sent with requests (if needed)
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    hmr: false,
  },
  build: {
    target: 'esnext',
    modulePreload: true,
    cssCodeSplit: true,
    rollupOptions: {
      treeshake: false,
      output: {
        format: 'umd',       // Qiankun requires UMD format
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },

    },
  },
  define: {
    'process.env.VITE_QIANKUN': isQiankun ? 'true' : 'false', // Expose whether Qiankun mode is enabled
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude specific dependencies from pre-bundling
  },
});
