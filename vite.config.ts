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

// Plugin to set MIME types
const addMimeTypeHeaders = () => {
  return {
    name: 'add-mime-type-headers',
    configureServer(server: { middlewares: { use: (arg0: (req: any, res: any, next: any) => void) => void; }; }) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        next();
      });
    },
    transformIndexHtml(html: string) {
      // Add a meta tag to specify the JavaScript MIME type
      return html.replace(
        /<head>/,
        '<head>\n  <meta http-equiv="Content-Type" content="application/javascript; charset=utf-8">'
      );
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Use a relative base path for development to avoid CORS issues
    base: '/choicepage/',
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
      addMimeTypeHeaders(), // Add MIME type headers
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
          format: 'umd', // System format for better compatibility
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
