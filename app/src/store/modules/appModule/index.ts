import { IAppState } from "@/interfaces/store/IAppState";
import { User, UserMethods } from "@/models/domain/user";
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
    getState(state: IAppState): IAppState {
      return state;
    },
    getLicense(state: IAppState): string {
      return state.license;
    },
    getProcessingMessage(state: IAppState): string {
      return state.processingMessage;
    },
    getUser(state: IAppState): User | null {
      return state.user;
    },
    getUserIsLoggedIn(state: IAppState): boolean {
      return state.user !== null ? state.user.isLoggedIn : false;
    },
    getToken(state: IAppState): string {
      return state.token;
    }
  },
  mutations: {
    [MutationTypes.UPDATELICENSE](state: IAppState, license: string): void {
      state.license = license;
    },
    [MutationTypes.UPDATEEXPIRATIONDATE](state: IAppState): void {
      const currentDate = new Date();
      state.expirationDate.setDate(currentDate.getDate() + 1);
    },
    [MutationTypes.UPDATEPROCESSINGMESSAGE](state: IAppState, message: string): void {
      state.processingMessage = message;
    },
    [MutationTypes.UPDATEUSER](state: IAppState, user: User): void {
      state.user = user;
    },
    [MutationTypes.UPDATETOKEN](state: IAppState, token: string): void {
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
    logout({ commit, state }: { commit: Commit, state: IAppState }): void {
      const user = UserMethods.logout(state.user as User);
      commit(MutationTypes.UPDATEUSER, user);
    }
  }
}

export default appModule;
