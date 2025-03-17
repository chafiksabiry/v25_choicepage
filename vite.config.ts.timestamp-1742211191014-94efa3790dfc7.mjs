// vite.config.ts
import { defineConfig, loadEnv } from "file:///C:/Users/houssam/Documents/harx/test2/v25_choicepage/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/houssam/Documents/harx/test2/v25_choicepage/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import qiankun from "file:///C:/Users/houssam/Documents/harx/test2/v25_choicepage/node_modules/vite-plugin-qiankun/dist/index.js";
import * as cheerio from "file:///C:/Users/houssam/Documents/harx/test2/v25_choicepage/node_modules/cheerio/dist/esm/index.js";
var __vite_injected_original_dirname = "C:\\Users\\houssam\\Documents\\harx\\test2\\v25_choicepage";
var removeReactRefreshScript = () => {
  return {
    name: "remove-react-refresh",
    transformIndexHtml(html) {
      const $ = cheerio.load(html);
      $('script[src="/@react-refresh"]').remove();
      return $.html();
    }
  };
};
var fixModuleScriptMimeType = () => {
  return {
    name: "fix-module-script-mime-type",
    transformIndexHtml(html) {
      const $ = cheerio.load(html);
      $("script").each((_, el) => {
        const script = $(el);
        const content = script.html() || "";
        if (content.includes("import(") && !script.attr("type")) {
          script.attr("type", "module");
        }
      });
      return $.html();
    }
  };
};
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDevelopment = mode === "development";
  return {
    // Use a relative base path for production to avoid MIME type issues
    base: isDevelopment ? "/" : "./",
    plugins: [
      react({
        jsxRuntime: "classic"
      }),
      qiankun("app2", {
        useDevMode: true,
        // @ts-ignore
        scopeCss: true
      }),
      removeReactRefreshScript(),
      // Add the script removal plugin
      fixModuleScriptMimeType()
      // Add the MIME type fix plugin
    ],
    define: {
      "import.meta.env": env
    },
    server: {
      port: 5173,
      cors: {
        origin: ["https://v25.harx.ai", "http://localhost:3000"],
        // Allow both production and local development
        methods: ["GET", "POST", "OPTIONS"],
        // Allowed HTTP methods
        allowedHeaders: ["Content-Type", "Authorization", "access-control-allow-origin"],
        // Allowed headers
        credentials: true
        // If you need to send credentials (cookies, HTTP authentication, etc.)
      },
      hmr: false,
      fs: {
        strict: true
        // Ensure static assets are correctly resolved
      }
    },
    build: {
      target: "esnext",
      cssCodeSplit: false,
      outDir: "dist",
      assetsDir: "assets",
      emptyOutDir: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: false
          // Keep console logs for debugging
        }
      },
      rollupOptions: {
        output: {
          format: "es",
          // Change from 'umd' to 'es' for proper module loading
          entryFileNames: "index.js",
          chunkFileNames: "chunk-[name].js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith(".css")) {
              return "index.css";
            }
            return "assets/[name].[ext]";
          }
        }
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxob3Vzc2FtXFxcXERvY3VtZW50c1xcXFxoYXJ4XFxcXHRlc3QyXFxcXHYyNV9jaG9pY2VwYWdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxob3Vzc2FtXFxcXERvY3VtZW50c1xcXFxoYXJ4XFxcXHRlc3QyXFxcXHYyNV9jaG9pY2VwYWdlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ob3Vzc2FtL0RvY3VtZW50cy9oYXJ4L3Rlc3QyL3YyNV9jaG9pY2VwYWdlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcWlhbmt1biBmcm9tICd2aXRlLXBsdWdpbi1xaWFua3VuJztcbmltcG9ydCAqIGFzIGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5cbi8vIFBsdWdpbiB0byByZW1vdmUgUmVhY3QgUmVmcmVzaCBwcmVhbWJsZVxuY29uc3QgcmVtb3ZlUmVhY3RSZWZyZXNoU2NyaXB0ID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdyZW1vdmUtcmVhY3QtcmVmcmVzaCcsXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZykge1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChodG1sKTtcbiAgICAgICQoJ3NjcmlwdFtzcmM9XCIvQHJlYWN0LXJlZnJlc2hcIl0nKS5yZW1vdmUoKTtcbiAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICB9LFxuICB9O1xufTtcblxuLy8gUGx1Z2luIHRvIGZpeCBtb2R1bGUgc2NyaXB0IE1JTUUgdHlwZSBpc3N1ZXNcbmNvbnN0IGZpeE1vZHVsZVNjcmlwdE1pbWVUeXBlID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdmaXgtbW9kdWxlLXNjcmlwdC1taW1lLXR5cGUnLFxuICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XG4gICAgICAvLyBDaGFuZ2UgaW1wb3J0IHNjcmlwdCB0byB1c2UgZGVmZXIgaW5zdGVhZCBvZiB0eXBlPVwibW9kdWxlXCJcbiAgICAgICQoJ3NjcmlwdCcpLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9ICQoZWwpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gc2NyaXB0Lmh0bWwoKSB8fCAnJztcbiAgICAgICAgaWYgKGNvbnRlbnQuaW5jbHVkZXMoJ2ltcG9ydCgnKSAmJiAhc2NyaXB0LmF0dHIoJ3R5cGUnKSkge1xuICAgICAgICAgIHNjcmlwdC5hdHRyKCd0eXBlJywgJ21vZHVsZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCc7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBVc2UgYSByZWxhdGl2ZSBiYXNlIHBhdGggZm9yIHByb2R1Y3Rpb24gdG8gYXZvaWQgTUlNRSB0eXBlIGlzc3Vlc1xuICAgIGJhc2U6IGlzRGV2ZWxvcG1lbnQgPyAnLycgOiAnLi8nLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KHtcbiAgICAgICAganN4UnVudGltZTogJ2NsYXNzaWMnLFxuICAgICAgfSksXG4gICAgICBxaWFua3VuKCdhcHAyJywge1xuICAgICAgICB1c2VEZXZNb2RlOiB0cnVlLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHNjb3BlQ3NzOiB0cnVlLFxuICAgICAgfSksXG4gICAgICByZW1vdmVSZWFjdFJlZnJlc2hTY3JpcHQoKSwgLy8gQWRkIHRoZSBzY3JpcHQgcmVtb3ZhbCBwbHVnaW5cbiAgICAgIGZpeE1vZHVsZVNjcmlwdE1pbWVUeXBlKCksIC8vIEFkZCB0aGUgTUlNRSB0eXBlIGZpeCBwbHVnaW5cbiAgICBdLFxuXG4gICAgZGVmaW5lOiB7XG4gICAgICAnaW1wb3J0Lm1ldGEuZW52JzogZW52LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgY29yczoge1xuICAgICAgICBvcmlnaW46IFsnaHR0cHM6Ly92MjUuaGFyeC5haScsICdodHRwOi8vbG9jYWxob3N0OjMwMDAnXSwgLy8gQWxsb3cgYm90aCBwcm9kdWN0aW9uIGFuZCBsb2NhbCBkZXZlbG9wbWVudFxuICAgICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJywgJ09QVElPTlMnXSwgLy8gQWxsb3dlZCBIVFRQIG1ldGhvZHNcbiAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnQ29udGVudC1UeXBlJywgJ0F1dGhvcml6YXRpb24nLCAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10sIC8vIEFsbG93ZWQgaGVhZGVyc1xuICAgICAgICBjcmVkZW50aWFsczogdHJ1ZSwgLy8gSWYgeW91IG5lZWQgdG8gc2VuZCBjcmVkZW50aWFscyAoY29va2llcywgSFRUUCBhdXRoZW50aWNhdGlvbiwgZXRjLilcbiAgICAgIH0sXG4gICAgICBobXI6IGZhbHNlLFxuICAgICAgZnM6IHtcbiAgICAgICAgc3RyaWN0OiB0cnVlLCAvLyBFbnN1cmUgc3RhdGljIGFzc2V0cyBhcmUgY29ycmVjdGx5IHJlc29sdmVkXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICBjc3NDb2RlU3BsaXQ6IGZhbHNlLFxuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxuICAgICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgICAgdGVyc2VyT3B0aW9uczoge1xuICAgICAgICBjb21wcmVzczoge1xuICAgICAgICAgIGRyb3BfY29uc29sZTogZmFsc2UsIC8vIEtlZXAgY29uc29sZSBsb2dzIGZvciBkZWJ1Z2dpbmdcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIGZvcm1hdDogJ2VzJywgLy8gQ2hhbmdlIGZyb20gJ3VtZCcgdG8gJ2VzJyBmb3IgcHJvcGVyIG1vZHVsZSBsb2FkaW5nXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdpbmRleC5qcycsXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdjaHVuay1bbmFtZV0uanMnLFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICAvLyBFbnN1cmUgQ1NTIGZpbGVzIGFyZSBjb25zaXN0ZW50bHkgbmFtZWRcbiAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZT8uZW5kc1dpdGgoJy5jc3MnKSkge1xuICAgICAgICAgICAgICByZXR1cm4gJ2luZGV4LmNzcyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJ2Fzc2V0cy9bbmFtZV0uW2V4dF0nO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH07XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFYsU0FBUyxjQUFjLGVBQWU7QUFDbFksT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFDcEIsWUFBWSxhQUFhO0FBSnpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU0sMkJBQTJCLE1BQU07QUFDckMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sbUJBQW1CLE1BQWM7QUFDL0IsWUFBTSxJQUFZLGFBQUssSUFBSTtBQUMzQixRQUFFLCtCQUErQixFQUFFLE9BQU87QUFDMUMsYUFBTyxFQUFFLEtBQUs7QUFBQSxJQUNoQjtBQUFBLEVBQ0Y7QUFDRjtBQUdBLElBQU0sMEJBQTBCLE1BQU07QUFDcEMsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sbUJBQW1CLE1BQWM7QUFDL0IsWUFBTSxJQUFZLGFBQUssSUFBSTtBQUUzQixRQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsR0FBRyxPQUFPO0FBQzFCLGNBQU0sU0FBUyxFQUFFLEVBQUU7QUFDbkIsY0FBTSxVQUFVLE9BQU8sS0FBSyxLQUFLO0FBQ2pDLFlBQUksUUFBUSxTQUFTLFNBQVMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLEdBQUc7QUFDdkQsaUJBQU8sS0FBSyxRQUFRLFFBQVE7QUFBQSxRQUM5QjtBQUFBLE1BQ0YsQ0FBQztBQUNELGFBQU8sRUFBRSxLQUFLO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsUUFBTSxnQkFBZ0IsU0FBUztBQUUvQixTQUFPO0FBQUE7QUFBQSxJQUVMLE1BQU0sZ0JBQWdCLE1BQU07QUFBQSxJQUM1QixTQUFTO0FBQUEsTUFDUCxNQUFNO0FBQUEsUUFDSixZQUFZO0FBQUEsTUFDZCxDQUFDO0FBQUEsTUFDRCxRQUFRLFFBQVE7QUFBQSxRQUNkLFlBQVk7QUFBQTtBQUFBLFFBRVosVUFBVTtBQUFBLE1BQ1osQ0FBQztBQUFBLE1BQ0QseUJBQXlCO0FBQUE7QUFBQSxNQUN6Qix3QkFBd0I7QUFBQTtBQUFBLElBQzFCO0FBQUEsSUFFQSxRQUFRO0FBQUEsTUFDTixtQkFBbUI7QUFBQSxJQUNyQjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLFFBQ0osUUFBUSxDQUFDLHVCQUF1Qix1QkFBdUI7QUFBQTtBQUFBLFFBQ3ZELFNBQVMsQ0FBQyxPQUFPLFFBQVEsU0FBUztBQUFBO0FBQUEsUUFDbEMsZ0JBQWdCLENBQUMsZ0JBQWdCLGlCQUFpQiw2QkFBNkI7QUFBQTtBQUFBLFFBQy9FLGFBQWE7QUFBQTtBQUFBLE1BQ2Y7QUFBQSxNQUNBLEtBQUs7QUFBQSxNQUNMLElBQUk7QUFBQSxRQUNGLFFBQVE7QUFBQTtBQUFBLE1BQ1Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUEsTUFDZCxRQUFRO0FBQUEsTUFDUixXQUFXO0FBQUEsTUFDWCxhQUFhO0FBQUEsTUFDYixRQUFRO0FBQUEsTUFDUixlQUFlO0FBQUEsUUFDYixVQUFVO0FBQUEsVUFDUixjQUFjO0FBQUE7QUFBQSxRQUNoQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxVQUNOLFFBQVE7QUFBQTtBQUFBLFVBQ1IsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCO0FBQUEsVUFDaEIsZ0JBQWdCLENBQUMsY0FBYztBQUU3QixnQkFBSSxVQUFVLE1BQU0sU0FBUyxNQUFNLEdBQUc7QUFDcEMscUJBQU87QUFBQSxZQUNUO0FBQ0EsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsTUFDcEM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
