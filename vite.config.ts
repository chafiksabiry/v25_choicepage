import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';

const isQiankun = process.env.QIANKUN === 'true';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  base: isQiankun ? './' : '/', // Adjust base path for Qiankun compatibility
  plugins: [
    react(),
    qiankun('app-name', { useDevMode: !isProduction }) // Disable dev mode in production
  ],
  server: {
    host: '0.0.0.0', // Allow access from Docker
    port: 5173,
    cors: true,
    hmr: false,
  },
  build: {
    target: 'esnext',
    modulePreload: true,
    cssCodeSplit: true,
    rollupOptions: {
      treeshake: false,
      output: {
        format: 'system', // Ensures compatibility with Qiankun
        entryFileNames: '[name].js', // Avoid hashed names for micro-frontend consistency
      },
    },
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
