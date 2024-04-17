/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      "process.env.VITE_APP_TITLE": JSON.stringify(env.VITE_APP_TITLE),
      "process.env.NODE_ENV": JSON.stringify(env.VITE_APP_ENV),
      "process.env.VITE_APP_ID": JSON.stringify(env.VITE_APP_ID),
      "process.env.VITE_APP_LICENSE": JSON.stringify(env.VITE_APP_LICENSE),
      "process.env.VITE_APP_API_URL": JSON.stringify(env.VITE_APP_API_URL),
      "process.env.VITE_APP_CACHE_KEY": JSON.stringify(env.VITE_APP_CACHE_KEY),
      "process.env.VITE_APP_CACHE_SECRET": JSON.stringify(env.VITE_APP_CACHE_SECRET),
    },
    plugins: [
      vue(),
      vuetify(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      minify: env.VITE_APP_ENV === 'development' ? false : true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          assetFileNames: "assets/[name]-[hash:20][extname]",
          entryFileNames: "assets/[name]-[hash:20].js",
          chunkFileNames: "assets/chunk-[hash:20].js"
        }
      }
    },
    base: "./",
    test: {
      environment: "jsdom",
      server: {
        deps: {
          inline: ['vuetify'],
        },
      }
    },
  };
});
