import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import { MutationTypes } from '@/store/mutationTypes';
import valuesModule from '@/store/modules/valuesModule';
import sudokuModule from '@/store/modules/sudokuModule';
import { User } from '@/models/domain/user';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
});

export default createStore({
  state: {
    license: '',
    expirationDate: new Date(),
    processingMessage: '',
    user: new User(),
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
    },
    getUser(state) {
      return state.user;
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
    },
    [MutationTypes.UPDATEUSER](state, user: User) {
      state.user = user;
    }
  },
  actions: {
    addLicense({ commit, state }, license: string) {
      if (new Date() > state.expirationDate && license !== '') {
        commit(MutationTypes.UPDATELICENSE, license);
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    },
    updateUser({ commit }, user: User) {
      commit(MutationTypes.UPDATEUSER, user);
    },
    updateProcessingMessage({ commit }, message: string) {
      commit(MutationTypes.UPDATEPROCESSINGMESSAGE, message);
    },
  },
  modules: {
    valuesModule,
    sudokuModule,
  },
  plugins: [vuexLocal.plugin],
})
