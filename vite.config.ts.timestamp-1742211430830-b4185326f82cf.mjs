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
      },
      headers: {
        // Set proper MIME types for JavaScript modules
        "Content-Type": "application/javascript; charset=utf-8"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxob3Vzc2FtXFxcXERvY3VtZW50c1xcXFxoYXJ4XFxcXHRlc3QyXFxcXHYyNV9jaG9pY2VwYWdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxob3Vzc2FtXFxcXERvY3VtZW50c1xcXFxoYXJ4XFxcXHRlc3QyXFxcXHYyNV9jaG9pY2VwYWdlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9ob3Vzc2FtL0RvY3VtZW50cy9oYXJ4L3Rlc3QyL3YyNV9jaG9pY2VwYWdlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcWlhbmt1biBmcm9tICd2aXRlLXBsdWdpbi1xaWFua3VuJztcbmltcG9ydCAqIGFzIGNoZWVyaW8gZnJvbSAnY2hlZXJpbyc7XG5cbi8vIFBsdWdpbiB0byByZW1vdmUgUmVhY3QgUmVmcmVzaCBwcmVhbWJsZVxuY29uc3QgcmVtb3ZlUmVhY3RSZWZyZXNoU2NyaXB0ID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdyZW1vdmUtcmVhY3QtcmVmcmVzaCcsXG4gICAgdHJhbnNmb3JtSW5kZXhIdG1sKGh0bWw6IHN0cmluZykge1xuICAgICAgY29uc3QgJCA9IGNoZWVyaW8ubG9hZChodG1sKTtcbiAgICAgICQoJ3NjcmlwdFtzcmM9XCIvQHJlYWN0LXJlZnJlc2hcIl0nKS5yZW1vdmUoKTtcbiAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICB9LFxuICB9O1xufTtcblxuLy8gUGx1Z2luIHRvIGZpeCBtb2R1bGUgc2NyaXB0IE1JTUUgdHlwZSBpc3N1ZXNcbmNvbnN0IGZpeE1vZHVsZVNjcmlwdE1pbWVUeXBlID0gKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdmaXgtbW9kdWxlLXNjcmlwdC1taW1lLXR5cGUnLFxuICAgIHRyYW5zZm9ybUluZGV4SHRtbChodG1sOiBzdHJpbmcpIHtcbiAgICAgIGNvbnN0ICQgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XG4gICAgICAvLyBDaGFuZ2UgaW1wb3J0IHNjcmlwdCB0byB1c2UgZGVmZXIgaW5zdGVhZCBvZiB0eXBlPVwibW9kdWxlXCJcbiAgICAgICQoJ3NjcmlwdCcpLmVhY2goKF8sIGVsKSA9PiB7XG4gICAgICAgIGNvbnN0IHNjcmlwdCA9ICQoZWwpO1xuICAgICAgICBjb25zdCBjb250ZW50ID0gc2NyaXB0Lmh0bWwoKSB8fCAnJztcbiAgICAgICAgaWYgKGNvbnRlbnQuaW5jbHVkZXMoJ2ltcG9ydCgnKSAmJiAhc2NyaXB0LmF0dHIoJ3R5cGUnKSkge1xuICAgICAgICAgIHNjcmlwdC5hdHRyKCd0eXBlJywgJ21vZHVsZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiAkLmh0bWwoKTtcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksICcnKTtcbiAgY29uc3QgaXNEZXZlbG9wbWVudCA9IG1vZGUgPT09ICdkZXZlbG9wbWVudCc7XG5cbiAgcmV0dXJuIHtcbiAgICAvLyBVc2UgYSByZWxhdGl2ZSBiYXNlIHBhdGggZm9yIHByb2R1Y3Rpb24gdG8gYXZvaWQgTUlNRSB0eXBlIGlzc3Vlc1xuICAgIGJhc2U6IGlzRGV2ZWxvcG1lbnQgPyAnLycgOiAnLi8nLFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KHtcbiAgICAgICAganN4UnVudGltZTogJ2NsYXNzaWMnLFxuICAgICAgfSksXG4gICAgICBxaWFua3VuKCdhcHAyJywge1xuICAgICAgICB1c2VEZXZNb2RlOiB0cnVlLFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHNjb3BlQ3NzOiB0cnVlLFxuICAgICAgfSksXG4gICAgICByZW1vdmVSZWFjdFJlZnJlc2hTY3JpcHQoKSwgLy8gQWRkIHRoZSBzY3JpcHQgcmVtb3ZhbCBwbHVnaW5cbiAgICAgIGZpeE1vZHVsZVNjcmlwdE1pbWVUeXBlKCksIC8vIEFkZCB0aGUgTUlNRSB0eXBlIGZpeCBwbHVnaW5cbiAgICBdLFxuXG4gICAgZGVmaW5lOiB7XG4gICAgICAnaW1wb3J0Lm1ldGEuZW52JzogZW52LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgY29yczoge1xuICAgICAgICBvcmlnaW46IFsnaHR0cHM6Ly92MjUuaGFyeC5haScsICdodHRwOi8vbG9jYWxob3N0OjMwMDAnXSwgLy8gQWxsb3cgYm90aCBwcm9kdWN0aW9uIGFuZCBsb2NhbCBkZXZlbG9wbWVudFxuICAgICAgICBtZXRob2RzOiBbJ0dFVCcsICdQT1NUJywgJ09QVElPTlMnXSwgLy8gQWxsb3dlZCBIVFRQIG1ldGhvZHNcbiAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnQ29udGVudC1UeXBlJywgJ0F1dGhvcml6YXRpb24nLCAnYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luJ10sIC8vIEFsbG93ZWQgaGVhZGVyc1xuICAgICAgICBjcmVkZW50aWFsczogdHJ1ZSwgLy8gSWYgeW91IG5lZWQgdG8gc2VuZCBjcmVkZW50aWFscyAoY29va2llcywgSFRUUCBhdXRoZW50aWNhdGlvbiwgZXRjLilcbiAgICAgIH0sXG4gICAgICBobXI6IGZhbHNlLFxuICAgICAgZnM6IHtcbiAgICAgICAgc3RyaWN0OiB0cnVlLCAvLyBFbnN1cmUgc3RhdGljIGFzc2V0cyBhcmUgY29ycmVjdGx5IHJlc29sdmVkXG4gICAgICB9LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBTZXQgcHJvcGVyIE1JTUUgdHlwZXMgZm9yIEphdmFTY3JpcHQgbW9kdWxlc1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2phdmFzY3JpcHQ7IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICAgIG91dERpcjogJ2Rpc3QnLFxuICAgICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgICAgY29tcHJlc3M6IHtcbiAgICAgICAgICBkcm9wX2NvbnNvbGU6IGZhbHNlLCAvLyBLZWVwIGNvbnNvbGUgbG9ncyBmb3IgZGVidWdnaW5nXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBmb3JtYXQ6ICdlcycsIC8vIENoYW5nZSBmcm9tICd1bWQnIHRvICdlcycgZm9yIHByb3BlciBtb2R1bGUgbG9hZGluZ1xuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnaW5kZXguanMnLFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnY2h1bmstW25hbWVdLmpzJyxcbiAgICAgICAgICBhc3NldEZpbGVOYW1lczogKGFzc2V0SW5mbykgPT4ge1xuICAgICAgICAgICAgLy8gRW5zdXJlIENTUyBmaWxlcyBhcmUgY29uc2lzdGVudGx5IG5hbWVkXG4gICAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWU/LmVuZHNXaXRoKCcuY3NzJykpIHtcbiAgICAgICAgICAgICAgcmV0dXJuICdpbmRleC5jc3MnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICdhc3NldHMvW25hbWVdLltleHRdJztcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRWLFNBQVMsY0FBYyxlQUFlO0FBQ2xZLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxhQUFhO0FBQ3BCLFlBQVksYUFBYTtBQUp6QixJQUFNLG1DQUFtQztBQU96QyxJQUFNLDJCQUEyQixNQUFNO0FBQ3JDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLG1CQUFtQixNQUFjO0FBQy9CLFlBQU0sSUFBWSxhQUFLLElBQUk7QUFDM0IsUUFBRSwrQkFBK0IsRUFBRSxPQUFPO0FBQzFDLGFBQU8sRUFBRSxLQUFLO0FBQUEsSUFDaEI7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFNLDBCQUEwQixNQUFNO0FBQ3BDLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLG1CQUFtQixNQUFjO0FBQy9CLFlBQU0sSUFBWSxhQUFLLElBQUk7QUFFM0IsUUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEdBQUcsT0FBTztBQUMxQixjQUFNLFNBQVMsRUFBRSxFQUFFO0FBQ25CLGNBQU0sVUFBVSxPQUFPLEtBQUssS0FBSztBQUNqQyxZQUFJLFFBQVEsU0FBUyxTQUFTLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxHQUFHO0FBQ3ZELGlCQUFPLEtBQUssUUFBUSxRQUFRO0FBQUEsUUFDOUI7QUFBQSxNQUNGLENBQUM7QUFDRCxhQUFPLEVBQUUsS0FBSztBQUFBLElBQ2hCO0FBQUEsRUFDRjtBQUNGO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksR0FBRyxFQUFFO0FBQzNDLFFBQU0sZ0JBQWdCLFNBQVM7QUFFL0IsU0FBTztBQUFBO0FBQUEsSUFFTCxNQUFNLGdCQUFnQixNQUFNO0FBQUEsSUFDNUIsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLFFBQ0osWUFBWTtBQUFBLE1BQ2QsQ0FBQztBQUFBLE1BQ0QsUUFBUSxRQUFRO0FBQUEsUUFDZCxZQUFZO0FBQUE7QUFBQSxRQUVaLFVBQVU7QUFBQSxNQUNaLENBQUM7QUFBQSxNQUNELHlCQUF5QjtBQUFBO0FBQUEsTUFDekIsd0JBQXdCO0FBQUE7QUFBQSxJQUMxQjtBQUFBLElBRUEsUUFBUTtBQUFBLE1BQ04sbUJBQW1CO0FBQUEsSUFDckI7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxRQUNKLFFBQVEsQ0FBQyx1QkFBdUIsdUJBQXVCO0FBQUE7QUFBQSxRQUN2RCxTQUFTLENBQUMsT0FBTyxRQUFRLFNBQVM7QUFBQTtBQUFBLFFBQ2xDLGdCQUFnQixDQUFDLGdCQUFnQixpQkFBaUIsNkJBQTZCO0FBQUE7QUFBQSxRQUMvRSxhQUFhO0FBQUE7QUFBQSxNQUNmO0FBQUEsTUFDQSxLQUFLO0FBQUEsTUFDTCxJQUFJO0FBQUEsUUFDRixRQUFRO0FBQUE7QUFBQSxNQUNWO0FBQUEsTUFDQSxTQUFTO0FBQUE7QUFBQSxRQUVQLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLElBQ0EsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLE1BQ1IsY0FBYztBQUFBLE1BQ2QsUUFBUTtBQUFBLE1BQ1IsV0FBVztBQUFBLE1BQ1gsYUFBYTtBQUFBLE1BQ2IsUUFBUTtBQUFBLE1BQ1IsZUFBZTtBQUFBLFFBQ2IsVUFBVTtBQUFBLFVBQ1IsY0FBYztBQUFBO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixRQUFRO0FBQUEsVUFDTixRQUFRO0FBQUE7QUFBQSxVQUNSLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQjtBQUFBLFVBQ2hCLGdCQUFnQixDQUFDLGNBQWM7QUFFN0IsZ0JBQUksVUFBVSxNQUFNLFNBQVMsTUFBTSxHQUFHO0FBQ3BDLHFCQUFPO0FBQUEsWUFDVDtBQUNBLG1CQUFPO0FBQUEsVUFDVDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLE1BQ3BDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
