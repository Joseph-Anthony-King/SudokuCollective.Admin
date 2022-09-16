import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import valuesModule from '@/store/modules/valuesModule/valuesModule';

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
    updateLicense(state, license: string) {
      state.license = license;
    },
    updateExpirationDate(state) {
      const currentDate = new Date();
      state.expirationDate.setDate(currentDate.getDate() + 1);
    },
  },
  actions: {
    addLicense({ commit, state }, license: string) {
    
      if (new Date() > state.expirationDate && license !== '') {
        commit('updateLicense', license);
        commit('updateExpirationDate');
      }
    }
  },
  modules: {
    valuesModule,
  },
  plugins: [createPersistedState()],
})
