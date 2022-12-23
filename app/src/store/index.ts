import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import appModule from '@/store/modules/appModule';
import serviceFailModule from '@/store/modules/serviceFailModule';
import sudokuModule from '@/store/modules/sudokuModule';
import valuesModule from '@/store/modules/valuesModule';

export default createStore({
  modules: {
    appModule,
    serviceFailModule,
    sudokuModule,
    valuesModule,
  },
  plugins: [createPersistedState({
    key: 'admin.sudokuCollective',
    paths: ['appModule', 'serviceFailModule', 'sudokuModule', 'valuesModule'],
    storage: window.localStorage         
  })],
})
