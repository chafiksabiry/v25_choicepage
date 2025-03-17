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

// Enhanced plugin to fix module script MIME type issues
const fixModuleScriptMimeType = () => {
  return {
    name: 'fix-module-script-mime-type',
    transformIndexHtml(html: string) {
      const $ = cheerio.load(html);
      
      // Ensure all scripts have proper type attributes
      $('script').each((_, el) => {
        const script = $(el);
        const content = script.html() || '';
        
        // For dynamic imports, ensure type="module"
        if (content.includes('import(') && !script.attr('type')) {
          script.attr('type', 'module');
        }
        
        // Add crossorigin attribute to help with CORS
        if (!script.attr('crossorigin')) {
          script.attr('crossorigin', 'anonymous');
        }
        
        // Convert relative paths to absolute for deployed environment
        const src = script.attr('src');
        if (src && src.startsWith('/') && !src.startsWith('//')) {
          script.attr('src', `./choicepage${src}`);
        }
      });
      
      return $.html();
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';

  return {
    // Use a relative base path for production to avoid MIME type issues
    base: isDevelopment ? '/' : '/choicepage/',
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
      fixModuleScriptMimeType(), // Add the MIME type fix plugin
    ],

    define: {
      'import.meta.env': env,
    },
    server: {
      port: 5173,
      cors: {
        origin: ['https://v25.harx.ai', 'http://localhost:3000', 'http://localhost:5173'], // Allow both production and local development
        methods: ['GET', 'POST', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'], // Allowed headers
        credentials: true, // If you need to send credentials (cookies, HTTP authentication, etc.)
      },
      hmr: false,
      fs: {
        strict: true, // Ensure static assets are correctly resolved
      },
      headers: {
        // Set proper MIME types for JavaScript modules
        'Content-Type': 'application/javascript; charset=utf-8',
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
          format: 'es', // Use ES module format
          entryFileNames: 'index.js',
          chunkFileNames: 'chunk-[name].js',
          assetFileNames: (assetInfo) => {
            // Ensure CSS files are consistently named
            if (assetInfo.name?.endsWith('.css')) {
              return 'index.css';
            }
            return 'assets/[name].[ext]';
          },
          // Add manualChunks to better control code splitting
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
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
