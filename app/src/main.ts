import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import { createPinia } from "pinia";
import createPersistedState from "pinia-persistedstate";
import SecureLS from "secure-ls";
import { loadFonts } from "@/plugins/webfontloader";

const ls = new SecureLS({
  encodingType: "aes",
  isCompression: false,
  encryptionSecret: process.env.VUE_APP_CACHE_SECRET,
});

loadFonts();

createApp(App)
  .use(router)
  .use(vuetify)
  .use(
    createPinia().use(
      createPersistedState({
        key: process.env.VUE_APP_CACHE_KEY,
        paths: [
          "confirmEmailStore",
          "loginFormStore",
          "signUpFormStore",
          "okDialogStore",
          "serviceFailStore",
          "globalStore",
          "sudokuStore",
          "userStore",
          "valueStore",
        ],
        storage: {
          getItem: (key) => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: (key) => ls.remove(key),
        },
      })
    )
  )
  .mount("#app");
