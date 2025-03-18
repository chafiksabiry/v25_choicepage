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
      
      // Update all script tags
      $('script').each((_, el) => {
        const script = $(el);
        script.attr('crossorigin', 'anonymous');
        
        // Set proper type for SystemJS scripts
        if (script.attr('src')?.includes('system')) {
          script.removeAttr('type');
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
      react(),
      qiankun('app2', {
        useDevMode: isDevelopment,
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
      modulePreload: false,
      sourcemap: true,
      manifest: true,
      minify: 'terser',
      terserOptions: {
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          format: 'system',
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
          inlineDynamicImports: false,
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM'
          }
        },
        external: ['react', 'react-dom', 'react-router-dom'],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },
  };
});
