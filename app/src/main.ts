import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { createPinia } from 'pinia';
import createPersistedState from 'pinia-persistedstate';
import { EncryptStorage } from 'encrypt-storage';
import { loadFonts } from '@/plugins/webfontloader';
import vuetify from '@/plugins/vuetify';

const encryptStorage = new EncryptStorage(<string>process.env.VITE_APP_CACHE_SECRET, {
  storageType: 'localStorage',
  encAlgorithm: 'AES'
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
          getItem: (key) => encryptStorage.getItem(key),
          setItem: (key, value) => encryptStorage.setItem(key, value),
          removeItem: (key) => encryptStorage.removeItem(key),
        },
      }),
    ),
  )
  .mount('#app');
