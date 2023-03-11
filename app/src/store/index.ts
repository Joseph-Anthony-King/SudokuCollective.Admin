import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import serviceFailModule from "@/store/modules/serviceFailModule";
import sudokuModule from "@/store/modules/sudokuModule";

export default createStore({
  modules: {
    serviceFailModule,
    sudokuModule
  },
  plugins: [createPersistedState({
    key: `${process.env.VUE_APP_CACHE_KEY}`,
    paths: [ "serviceFailModule", "sudokuModule" ],
    storage: window.localStorage,
    overwrite: true,
  })],
})
