import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { loadFonts } from '@/plugins/webfontloader';

loadFonts()

createApp(App)
  .use(router)
  .use(vuetify)
  .use(createPinia().use(piniaPluginPersistedstate))
  .mount('#app')
