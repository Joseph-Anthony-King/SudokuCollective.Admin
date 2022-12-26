import { IAppState } from "@/interfaces/store/IAppState";
import { User } from "@/models/domain/user";
import { MutationTypes } from "./mutationTypes";
import { Commit } from "vuex";
import { ILoginRequestData } from "@/interfaces/requests/iLoginRequestData";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { LoginService } from "@/services/loginService";

const appModule = {
  namespaced: true,
  state: (): IAppState => ({
    license: '',
    expirationDate: new Date(),
    processingMessage: '',
    user: new User(),
    token: '',
  }),
  getters: {
    getState(state: IAppState) {
      return state;
    },
    getLicense(state: IAppState) {
      return state.license;
    },
    getProcessingMessage(state: IAppState) {
      return state.processingMessage;
    },
    getUser(state: IAppState) {
      return state.user;
    },
    getUserIsLoggedIn(state: IAppState) {
      return state.user.isLoggedIn;
    },
    getToken(state: IAppState) {
      return state.token;
    }
  },
  mutations: {
    [MutationTypes.UPDATELICENSE](state: IAppState, license: string) {
      state.license = license;
    },
    [MutationTypes.UPDATEEXPIRATIONDATE](state: IAppState) {
      const currentDate = new Date();
      state.expirationDate.setDate(currentDate.getDate() + 1);
    },
    [MutationTypes.UPDATEPROCESSINGMESSAGE](state: IAppState, message: string) {
      state.processingMessage = message;
    },
    [MutationTypes.UPDATEUSER](state: IAppState, user: User) {
      state.user = user;
    },
    [MutationTypes.UPDATETOKEN](state: IAppState, token: string) {
      state.token = token;
    }
  },
	actions: {
    addLicense({ commit, state }: { commit: Commit, state: IAppState }, license: string): void {
      if (new Date() > state.expirationDate && license !== '') {
        commit(MutationTypes.UPDATELICENSE, license);
        commit(MutationTypes.UPDATEEXPIRATIONDATE);
      }
    },
    updateUser({ commit }: { commit: Commit }, user: User): void {
      commit(MutationTypes.UPDATEUSER, user);
    },
    updateToken({ commit }: { commit: Commit }, token: string): void {
      commit(MutationTypes.UPDATETOKEN, token);
    },
    updateProcessingMessage({ commit }: { commit: Commit }, message: string): void {
      commit(MutationTypes.UPDATEPROCESSINGMESSAGE, message);
    },
    async loginAsync({ commit }: { commit: Commit }, data: ILoginRequestData): Promise<void> {
      const response: IServicePayload = await LoginService.postLoginAsync(data);
      if (response.isSuccess) {
        commit(MutationTypes.UPDATEUSER, response.user);
        commit(MutationTypes.UPDATETOKEN, response.token);
      }
    },
  }
}

export default appModule;