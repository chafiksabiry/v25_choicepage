import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import qiankun from 'vite-plugin-qiankun';
import * as cheerio from 'cheerio';

// Plugin to remove React Refresh preamble
const removeReactRefreshScript = () => {
  return {
    name: 'remove-react-refresh',
    transformIndexHtml(html: string) {
      const $ = cheerio.load(html);
      $('script[src="/@react-refresh"]').remove();
      return $.html();
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    // Use a relative base path for production to avoid MIME type issues
    base: isDevelopment ? '/' : './',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      qiankun('app2', {
        useDevMode: true,
        // @ts-ignore
        scopeCss: true,
      }),
      removeReactRefreshScript(), // Add the script removal plugin
    ],

    define: {
      'import.meta.env': env,
    },
    server: {
      port: 5173,
      cors: {
        origin: ['https://v25.harx.ai', 'http://localhost:3000'], // Allow both production and local development
        methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'], // Allowed headers
        credentials: true, // If you need to send credentials (cookies, HTTP authentication, etc.)
      },
      hmr: false,
      fs: {
        strict: true, // Ensure static assets are correctly resolved
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Keep console logs for debugging
        },
      },
      rollupOptions: {
        output: {
          format: 'umd', // Universal Module Definition format for better compatibility
          name: 'app2', // Required for UMD format
          entryFileNames: 'index.js',
          chunkFileNames: 'chunk-[name].js',
          assetFileNames: (assetInfo) => {
            // Ensure CSS files are consistently named
            if (assetInfo.name?.endsWith('.css')) {
              return 'index.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
