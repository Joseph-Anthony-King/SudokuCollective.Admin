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
    processingMessage: ''
   },
  getters: {
    getState(state) {
      return state;
    },
    getLicense(state) {
      return state.license;
    },
    getProcessingMessage(state) {
      return state.processingMessage;
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
    [MutationTypes.UPDATEPROCESSINGMESSAGE](state, message: string) {
      state.processingMessage = message;
    }
  },
  actions: {
    addLicense({ commit, state }, license: string) {
      if (new Date() > state.expirationDate && license !== '') {
        commit(MutationTypes.UPDATELICENSE, license);
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    },
    updateProcessingMessage({ commit }, message: string) {
      commit(MutationTypes.UPDATEPROCESSINGMESSAGE, message);
    }
  },
  modules: {
    valuesModule,
    sudokuModule,
  },
  plugins: [vuexLocal.plugin],
})
