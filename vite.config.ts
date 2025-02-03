import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import qiankun from 'vite-plugin-qiankun';

const isQiankun = process.env.QIANKUN === 'true'; // Use an environment variable to differentiate modes

export default defineConfig({
  base: isQiankun ? './' : '/', // Set base path dynamically for qiankun compatibility
  plugins: [react(),
    qiankun('app-name', { useDevMode: true }), // Plugin Qiankun, si utilisé
  ],
  server: {
    port: 5173, // Set the development server to use port 5172
    cors: true, // Enable CORS to allow communication between host and microfrontends
    hmr : true, // Disable HMR to prevent conflicts with qiankun
  },
  build: {
    target: 'esnext', // Ensure compatibility with modern browsers for qiankun
    modulePreload: true,
    cssCodeSplit: true, // Enable CSS splitting for modular builds
    rollupOptions: {
      external: ['systemjs'],
      treeshake: false, // Disable treeshaking to prevent issues with qiankun
      output: {
        format: 'system', // Use SystemJS for qiankun integration
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Alias for cleaner imports
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // Exclude lucide-react as before
  },
});
