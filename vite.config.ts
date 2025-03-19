import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import qiankun from 'vite-plugin-qiankun';
import * as cheerio from 'cheerio';
import type { ViteDevServer } from 'vite';

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

const addMimeTypeHeaders = () => {
  return {
    name: 'add-mime-type-headers',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: any, res: any, next: () => void) => {
        if (req.url?.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        }
        next();
      });
    },
    transformIndexHtml(html: string) {
      let modified = html.replace(
        /<head>/,
        '<head>\n  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">'
      );
      modified = modified.replace(
        /<script([^>]*)>/g,
        (match: string, attrs: string) => {
          if (!attrs.includes('type=')) {
            return `<script${attrs} type="text/javascript">`;
          }
          return match;
        }
      );
      return modified;
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/choicepage/',
    plugins: [
      react({ jsxRuntime: 'classic' }),
      qiankun('app2', { useDevMode: true, entry: '/app2/' }),
      removeReactRefreshScript(),
      addMimeTypeHeaders(),
    ],
    define: {
      'import.meta.env': env,
    },
    server: {
      port: 5173,
      cors: {
        origin: ['https://v25.harx.ai', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'access-control-allow-origin'],
        credentials: true,
      },
      hmr: false,
      fs: { strict: true },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      outDir: 'dist/choicepage', // Ensure JS file is in dist/choicepage
      assetsDir: 'assets',
      emptyOutDir: true,
      minify: 'terser',
      terserOptions: { compress: { drop_console: false } },
      rollupOptions: {
        output: {
          format: 'es',
          name: 'app2',
          entryFileNames: 'index.js',
          chunkFileNames: 'chunk-[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'index.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, 'src') },
    },
  };
});
