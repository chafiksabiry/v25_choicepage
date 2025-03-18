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
      });
      
      return $.html();
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDevelopment = mode === 'development';
  const isQiankun = mode === 'qiankun';

  return {
    base: isQiankun ? '/app2/' : isDevelopment ? '/' : '/choicepage/',
    plugins: [
      react({
        jsxRuntime: 'classic',
      }),
      qiankun('app2', {
        useDevMode: true,
      }),
      removeReactRefreshScript(),
      fixModuleScriptMimeType(),
    ],
    define: {
      'process.env.VITE_QIANKUN': JSON.stringify(isQiankun),
      'import.meta.env': env,
    },
    server: {
      port: 5173,
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/javascript; charset=utf-8',
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: false,
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          format: 'umd',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          assetFileNames: 'assets/[name].[ext]',
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
