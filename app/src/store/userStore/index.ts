import { ComputedRef, Ref, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAppStore } from '@/store/appStore/index';
import { LoginService } from '@/services/loginService';
import { SignupService } from '@/services/signupService';
import { UsersService } from '@/services/usersService';
import { User } from '@/models/domain/user';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';

export const useUserStore = defineStore('userStore', () => {
	const user: Ref<User> = ref(new User());
	const confirmedUserName: Ref<string> = ref('');
	const processingMessage: Ref<string> = ref('');
	const serviceMessage: Ref<string> = ref('');

	const getUser: ComputedRef<User> = computed(() => user.value);
	const getUserIsLoggedIn: ComputedRef<boolean> = computed(() => user.value.isLoggedIn);
	const getUserIsLoggingIn: ComputedRef<boolean> = computed(() => user.value.isLoggingIn);
	const getUserIsSignedIn: ComputedRef<boolean> = computed(() => user.value.isSignedUp);
	const getUserIsSigningUp: ComputedRef<boolean> = computed(() => user.value.isSigningUp);
	const getConfirmedUserName: ComputedRef<string> = computed(() => confirmedUserName.value);
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value);
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value);

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
	const signupUserAsync = async (data: ISignupRequestData): Promise<void> => {
		const appStore = useAppStore();
		const response: IServicePayload = await SignupService.postAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
			appStore.updateToken(response.token);
		}
	};
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const appStore = useAppStore();
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
			appStore.updateToken(response.token);
		}
	};
	const requestPasswordResetAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(data);
		if (response.isSuccess) {
			updateServiceMessage(response.message);
		}
	};

	return {
		user,
		confirmedUserName,
		processingMessage,
		serviceMessage,
		getUser,
		getUserIsLoggedIn,
		getUserIsLoggingIn,
		getUserIsSignedIn,
		getUserIsSigningUp,
		getConfirmedUserName,
		getProcessingMessage,
		getServiceMessage,
		updateUser,
		updateConfirmedUserName,
		updateProcessingMessage,
		updateServiceMessage,
		signupUserAsync,
		confirmUserNameAsync,
		requestPasswordResetAsync
	}
}, {
	persist: true
});
