import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { name } from './package.json';
import qiankun from 'vite-plugin-qiankun';
import * as cheerio from 'cheerio';

// Plugin to remove React Refresh preamble
const removeReactRefreshPreamble = () => {
  return {
    name: 'remove-react-refresh-preamble',
    transform(code: string, id: string) {
      if (id.includes('node_modules')) return;
      return code.replace('import.meta.hot', '/* removed */');
    }
  };
};

// Plugin to fix module script MIME type issues
const fixModuleScriptMimeType = () => {
  return {
    name: 'fix-module-script-mime-type',
    transformIndexHtml(html: string) {
      return html.replace(
        /<script type="module"/g,
        '<script type="application/javascript"'
      );
    }
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isQiankun = mode === 'qiankun';
  const base = isQiankun ? '/choicepage/' : '/';

  return {
    base,
    plugins: [
      react(),
      qiankun(name, {
        useDevMode: true
      }),
      removeReactRefreshPreamble(),
      fixModuleScriptMimeType()
    ],
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      cssCodeSplit: false,
      sourcemap: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          drop_debugger: false
        }
      },
      rollupOptions: {
        output: {
          format: 'system',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[ext]',
          globals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router-dom': 'ReactRouterDOM'
          }
        },
        external: ['react', 'react-dom', 'react-router-dom']
      }
    },
    server: {
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Content-Type': 'application/javascript; charset=utf-8'
      }
    },
    optimizeDeps: {
      exclude: ['systemjs']
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  };
});
