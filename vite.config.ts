import { defineConfig, loadEnv } from 'vite';
import type { RollupOptions } from 'rollup';
import react from '@vitejs/plugin-react';
import path from 'path';
import qiankun from 'vite-plugin-qiankun';
import * as cheerio from 'cheerio';

// Plugin to remove React Refresh preamble
const removeReactRefreshScript = () => {
  return {
    name: 'remove-react-refresh',
    transformIndexHtml(html: any) {
      const $ = cheerio.load(html);
      $('script[src="/@react-refresh"]').remove();
      return $.html();
    },
  };
};

// Plugin to set correct MIME types
const setProperMimeTypes = () => {
  return {
    name: 'set-proper-mime-types',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url.match(/\.(js|mjs)$/)) {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        }
        next();
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isQiankun = env.VITE_QIANKUN === 'true';

  return {
    base: '/choicepage/',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      qiankun('app2', {
        useDevMode: true,
      }),
      removeReactRefreshScript(), // Add the script removal plugin
      setProperMimeTypes(), // Add MIME type plugin
    ],

    define: {
      'import.meta.env': env,
    },
    server: {
      port: 5157,
      cors: true,
      hmr: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization',
        'Content-Type': 'application/javascript; charset=UTF-8',
      },
      fs: {
        strict: true, // Ensure static assets are correctly resolved
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      outDir: 'dist',
      assetsDir: 'assets',
      // Generate source maps for easier debugging
      sourcemap: mode !== 'production',
      rollupOptions: {
        external: isQiankun ? ['react', 'react-dom'] : [],
        output: {
          format: 'umd',
          name: 'app2',
          entryFileNames: 'index.js', // Fixed name for the JS entry file
          chunkFileNames: 'chunk-[name].js', // Fixed name for chunks
          assetFileNames: (assetInfo) => {
            // Ensure CSS files are consistently named
            if (assetInfo.name?.endsWith('.css')) {
              return 'index.css';
            }
            return '[name].[ext]'; // Default for other asset types
          },
          // Ensure the output is properly exposing content to global scope for qiankun
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
          },
          // Add module type for proper loading
          intro: 'if (typeof process === "undefined") { var process = { env: {} }; }',
        } as RollupOptions['output'],
      },
      // Prevent minification for better debugging in non-production modes
      minify: mode === 'production',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});