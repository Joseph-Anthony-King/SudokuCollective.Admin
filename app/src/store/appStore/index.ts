import { 
	computed,
	ComputedRef, 
	ref, 
	Ref  
} from 'vue';
import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';
import { useUserStore } from '@/store/userStore/index';
import { LoginService } from '@/services/loginService';
import { UsersService } from '@/services/usersService';
import router from '@/router';
import { User } from '@/models/domain/user';
import { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import commonUtitlities from '@/utilities/common';

export const useAppStore = defineStore('appStore', () => {
	const license: Ref<string | undefined> = ref(process.env.VUE_APP_LICENSE);
	const token: Ref<string | undefined> = ref(undefined);
	const tokenExpirationDate: Ref<Date | undefined> = ref(undefined);
	const redirectUrl: Ref<string | undefined> = ref(undefined);
	const processingMessage: Ref<string | undefined> = ref(undefined);
	const serviceMessage: Ref<string | undefined> = ref(undefined);
	const navDrawerStatus: Ref<boolean> = ref(false);

	const getLicense: ComputedRef<string> = computed(() => license.value ? license.value : '');
	const getToken: ComputedRef<string> = computed(() => token.value ? token.value : '');
	const getTokenExpirationDate: ComputedRef<Date | undefined> = computed(() => tokenExpirationDate.value);
	const getRedirectUrl: ComputedRef<string> = computed(() => redirectUrl.value ? redirectUrl.value : '');
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value ? processingMessage.value : '');
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value ? serviceMessage.value : '');
	const getNavDrawerStatus: ComputedRef<boolean> = computed(() => navDrawerStatus.value);

	const updateToken = (param: string | undefined = undefined): void => {
		token.value = param;
	};
	const updateTokenExpirationDate = (param: Date | undefined = undefined): void => {
		tokenExpirationDate.value = param;
	};
	const updateRedirectUrl = (param: string | undefined = undefined): void => {
		redirectUrl.value = param;
	};
	const updateProcessingMessage = (param: string | undefined = undefined): void => {
		processingMessage.value = param;
	};
	const updateServiceMessage = (param: string | undefined = undefined): void => {
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
			updateTokenExpirationDate(response.tokenExpirationDate);
			if (redirectUrl.value !== undefined) {
				window.location.href = redirectUrl.value
				updateRedirectUrl();
			}
		}
	};
	const logout = (): void => {
		const { clearStores } = commonUtitlities();
		clearStores();
	};
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const userStore = useUserStore();
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
			userStore.updateConfirmedUserName(response.confirmedUserName);
			updateToken(response.token);
		}
	};
	const requestPasswordResetAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(data);
		if (response.isSuccess) {
			updateServiceMessage(response.message);
		}
	};
	const isTokenExpired = (): boolean => {
		let result = false;
		if (tokenExpirationDate.value !== undefined && new Date(tokenExpirationDate.value) < new Date()) {
			redirectUrl.value = router.currentRoute.value.path;
			const user = new User();
			useUserStore().updateUser(user);
			result = true;
		}
		return result;
	};
	const tokenHasExpired = (data: AxiosResponse): void => {
		if (data.status === 401) {
			const { clearStores } = commonUtitlities();
			clearStores();
			updateRedirectUrl(router.currentRoute.value.path);
			router.push('/login');
		}
	};

	return {
		license,
		token,
		tokenExpirationDate,
		redirectUrl,
		processingMessage,
		serviceMessage,
		navDrawerStatus,
		getLicense,
		getToken,
		getTokenExpirationDate,
		getRedirectUrl,
		getProcessingMessage,
		getServiceMessage,
		getNavDrawerStatus,
		updateToken,
		updateTokenExpirationDate,
		updateRedirectUrl,
		updateProcessingMessage,
		updateServiceMessage,
		updateNavDrawerStatus,
		loginAsync,
		logout,
		confirmUserNameAsync,
		requestPasswordResetAsync,
		isTokenExpired,
		tokenHasExpired
	}
});
