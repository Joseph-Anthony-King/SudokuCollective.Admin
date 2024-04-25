import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import createPersistedState from 'pinia-persistedstate';
import SecureLS from 'secure-ls';
import { loadFonts } from '@/plugins/webfontloader';
import vuetify from '@/plugins/vuetify';

const ls = new SecureLS({
  encodingType: 'aes',
  isCompression: false,
  encryptionSecret: process.env.VITE_APP_CACHE_SECRET,
});

loadFonts();

createApp(App)
  .use(router)
  .use(vuetify)
  .use(
    createPinia().use(
      createPersistedState({
        key: process.env.VITE_APP_CACHE_KEY,
        paths: [
          'confirmEmailStore',
          'loginFormStore',
          'signUpFormStore',
          'dialogStore',
          'serviceFailStore',
          'globalStore',
          'sudokuStore',
          'userStore',
          'valueStore',
        ],
        storage: {
          getItem: (key) => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: (key) => ls.remove(key),
        },
      }),
    ),
  )
  .mount('#app');
