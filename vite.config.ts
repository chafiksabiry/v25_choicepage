import { defineConfig, loadEnv, Plugin } from 'vite';
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

// Plugin to ensure correct MIME types
const ensureCorrectMimeTypes = (): Plugin => {
  return {
    name: 'ensure-correct-mime-types',
    configureServer(server) {
      return () => {
        server.middlewares.use((req, res, next) => {
          // Add proper MIME type header for JS files
          if (req.url?.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          }
          next();
        });
      };
    },
    generateBundle(_, bundle) {
      // Ensure JS files have the correct MIME type in production build
      Object.values(bundle).forEach(chunk => {
        if (chunk.type === 'chunk' || chunk.fileName.endsWith('.js')) {
          chunk.fileName = chunk.fileName.replace(/\.js$/, '.js');
        }
      });
    },
  };
};

// Plugin for setting response headers
const setResponseHeaders = (): Plugin => {
  return {
    name: 'set-response-headers',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Set MIME types for JavaScript files
        if (req.url?.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        next();
      });
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  //const isDevelopment = mode === 'development';

  return {
    // Use a relative base path for development to avoid CORS issues
    base: '/',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      qiankun('app2', {
        useDevMode: true
      }),
      removeReactRefreshScript(), // Add the script removal plugin
      ensureCorrectMimeTypes(), // Add the MIME type plugin
      setResponseHeaders(), // Add headers plugin
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
      // Disable HMR when running as a micro-app to prevent conflicts with qiankun
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
      // Configure as a library for Qiankun integration
      lib: {
        entry: path.resolve(__dirname, 'src/main.tsx'),
        name: 'app2',
        formats: ['system'],
        fileName: () => 'index.js'
      },
      rollupOptions: {
        // Make sure to externalize dependencies that shouldn't be bundled
        external: ['react', 'react-dom'],
        output: {
          // Global variables to use in UMD build for externalized deps
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          },
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
