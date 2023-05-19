import { ComputedRef, Ref, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '@/store/userStore/index';
import { LoginService } from '@/services/loginService';
import { UsersService } from '@/services/usersService';
import { UserMethods } from '@/models/domain/user';
import { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';

export const useAppStore = defineStore('appStore', () => {
	const license: Ref<string> = ref('');
	const token: Ref<string> = ref('');
	const processingMessage: Ref<string> = ref('');
	const serviceMessage: Ref<string> = ref('');
	const navDrawerStatus: Ref<boolean> = ref(false);

	const getLicense: ComputedRef<string> = computed(() => license.value);
	const getToken: ComputedRef<string> = computed(() => token.value);
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value);
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value);
	const getNavDrawerStatus: ComputedRef<boolean> = computed(() => navDrawerStatus.value);
	
	const addLicense = (param: string): void => {
		if (param !== '') {
			license.value = param;
		}
	};
	const updateToken = (param: string): void => {
		token.value = param;
	};
	const updateProcessingMessage = (param: string): void => {
		processingMessage.value = param;
	};
	const updateServiceMessage = (param: string): void => {
		serviceMessage.value = param;
	};
	const updateNavDrawerStatus = (param: boolean): void => {
		navDrawerStatus.value = param;
	};
	const loginAsync = async (data: ILoginRequestData): Promise<void> => {
		const userStore = useUserStore();
		const response: IServicePayload = await LoginService.postLoginAsync(data);
		if (response.isSuccess) {
			userStore.updateUser(response.user);
			updateToken(response.token);
		}
	};
	const logout = (): void => {
		const userStore = useUserStore();
		userStore.updateUser(UserMethods.logout(userStore.getUser));
	};
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const userStore = useUserStore();
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
			userStore.updateUser(response.user);
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
		processingMessage,
		serviceMessage,
		navDrawerStatus,
		getLicense,
		getToken,
		getProcessingMessage,
		getServiceMessage,
		getNavDrawerStatus,
		addLicense,
		updateToken,
		updateProcessingMessage,
		updateServiceMessage,
		updateNavDrawerStatus,
		loginAsync,
		logout,
		confirmUserNameAsync,
		requestPasswordResetAsync
	}
}, {
	persist: true
});
