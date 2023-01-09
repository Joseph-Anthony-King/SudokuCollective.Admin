import { IServiceFailState } from "@/interfaces/store/IServiceFailState";
import { MutationTypes } from "@/store/modules/serviceFailModule/mutationTypes";
import { Commit } from "vuex";

const serviceFailModule = {
	namespaced: true,
	state: (): IServiceFailState => ({
		isSuccess: null,
		message: "",
		statusCode: 0,
	}),
	getters: {
    getState: (state: IServiceFailState): IServiceFailState => {
      return state;
    },
		getIsSuccess: (state: IServiceFailState): boolean | null => {
			return state.isSuccess;
		},
		getMessage: (state: IServiceFailState): string => {
			return state.message;
		},
		getStatusCode: (state: IServiceFailState): number => {
			return state.statusCode;
		}
	},
	mutations: {
		[MutationTypes.CLEARSTATE](state: IServiceFailState): void {
			state.isSuccess = null;
			state.message = "";
			state.statusCode = 0;
		},
		[MutationTypes.UPDATEISSUCCESS](state: IServiceFailState, isSuccess: boolean): void {
			state.isSuccess = isSuccess;
		},
		[MutationTypes.UPDATEMESSAGE](state: IServiceFailState, message: string): void {
			state.message = message;
		},
		[MutationTypes.UPDATESTATUSCODE](state: IServiceFailState, statusCode: number): void {
			state.statusCode = statusCode;
		}
	},
	actions: {
		clearState({ commit }: { commit: Commit }): void {
			commit(MutationTypes.CLEARSTATE);
		},
		updateIsSuccess({ commit }: { commit: Commit }, isSuccess: boolean): void {
			commit(MutationTypes.UPDATEISSUCCESS, isSuccess);
		},
		updateMessage({ commit }: { commit: Commit }, message: string): void {
			commit(MutationTypes.UPDATEMESSAGE, message);
		},
		updateStatusCode({ commit }: { commit: Commit }, statusCode: number): void {
			commit(MutationTypes.UPDATESTATUSCODE, statusCode);
		}
	}
}

export default serviceFailModule;
