import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { MutationTypes } from '@/store/mutationTypes';
import valuesModule from '@/store/modules/valuesModule';
import sudokuModule from '@/store/modules/sudokuModule';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default createStore({
  state: {
    license: '',
    expirationDate: new Date(),
   },
  getters: {
    getState(state) {
      return state;
    },
    getLicense(state) {
      return state.license;
    }
  },
  mutations: {
    [MutationTypes.UPDATELICENSE](state, license: string) {
      state.license = license;
    },
    [MutationTypes.UPDATEEXPIRATIONDATE](state) {
      const currentDate = new Date();
      state.expirationDate.setDate(currentDate.getDate() + 1);
    },
  },
  actions: {
    addLicense({ commit, state }, license: string) {
    
      if (new Date() > state.expirationDate && license !== '') {
        commit(MutationTypes.UPDATELICENSE, license);
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    }
  },
  modules: {
    valuesModule,
    sudokuModule,
  },
  plugins: [vuexLocal.plugin],
})
