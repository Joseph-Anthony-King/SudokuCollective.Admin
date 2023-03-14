import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import serviceFailModule from "@/store/modules/serviceFailModule";

export default createStore({
  modules: {
    serviceFailModule,
  },
  plugins: [createPersistedState({
    key: `${process.env.VUE_APP_CACHE_KEY}`,
    paths: [ "serviceFailModule" ],
    storage: window.localStorage,
    overwrite: true,
  })],
})
