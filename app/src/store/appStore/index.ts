import { ComputedRef, computed, ref } from "vue";
import { defineStore } from "pinia";
import { LoginService } from "@/services/loginService";
import { UsersService } from "@/services/usersService";
import { User, UserMethods } from "@/models/domain/user";
import { ILoginRequestData } from "@/interfaces/requests/iLoginRequestData";
import { ILoginAssistanceRequestData } from "@/interfaces/requests/ilLoginAssistanceRequestData";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";

export const useAppStore = defineStore("appStore", () => {
	const license = ref("");
	const token = ref("");
	const user = ref(new User());
	const confirmedUserName = ref("");
	const processingMessage = ref("");
	const serviceMessage = ref("");

	const getLicense: ComputedRef<string> = computed(() => license.value);
	const getToken: ComputedRef<string> = computed(() => token.value);
	const getUser: ComputedRef<User> = computed(() => user.value);
	const getUserIsLoggedIn: ComputedRef<boolean> = computed(() => user.value.isLoggedIn);
	const getUserIsLoggingIn: ComputedRef<boolean> = computed(() => user.value.isLoggingIn);
	const getUserIsSigningUp: ComputedRef<boolean> = computed(() => user.value.isSigningUp);
	const getConfirmedUserName: ComputedRef<string> = computed(() => confirmedUserName.value);
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value);
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value);
	
	const addLicense = (param: string): void => {
		if (param !== "") {
			license.value = param;
		}
	};
	const updateToken = (param: string): void => {
		token.value = param;
	};
	const updateUser = (param: User): void => {
		user.value = param;
	};
	const updateConfirmedUserName = (param: string): void => {
		confirmedUserName.value = param;
	};
	const updateProcessingMessage = (param: string): void => {
		processingMessage.value = param;
	};
	const updateServiceMessage = (param: string): void => {
		serviceMessage.value = param;
	};
	const loginAsync = async (data: ILoginRequestData): Promise<void> => {
		const response: IServicePayload = await LoginService.postLoginAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
			updateToken(response.token);
		}
	};
	const logout = (): void => {
		updateUser(UserMethods.logout(user.value));
	};
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
			updateToken(response.token);
		}
	};
	const requestPasswordResetAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(data);
		if (response.isSuccess) {
			updateServiceMessage(response.message);
		}
	};

	return {
		license,
		token,
		user,
		confirmedUserName,
		processingMessage,
		serviceMessage,
		getLicense,
		getToken,
		getUser,
		getUserIsLoggedIn,
		getUserIsLoggingIn,
		getUserIsSigningUp,
		getConfirmedUserName,
		getProcessingMessage,
		getServiceMessage,
		addLicense,
		updateToken,
		updateUser,
		updateConfirmedUserName,
		updateProcessingMessage,
		updateServiceMessage,
		loginAsync,
		logout,
		confirmUserNameAsync,
		requestPasswordResetAsync
	}
}, {
	persist: true
});
