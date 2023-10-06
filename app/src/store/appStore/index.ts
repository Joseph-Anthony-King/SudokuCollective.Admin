import { 
	computed,
	ComputedRef, 
	ref, 
	Ref  
} from 'vue';
import { defineStore } from 'pinia';
import { useUserStore } from '@/store/userStore/index';
import { LoginService } from '@/services/loginService';
import { UsersService } from '@/services/usersService';
import router from '@/router/index';
import { UserMethods } from '@/models/domain/user';
import { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';

export const useAppStore = defineStore('appStore', () => {
	const license: Ref<string> = ref(process.env.VUE_APP_LICENSE);
	const token: Ref<string | undefined> = ref(undefined);
	const expirationDate: Ref<Date | undefined> = ref(undefined);
	const refreshTokenRedirectUrl: Ref<string | undefined> = ref(undefined);
	const processingMessage: Ref<string | undefined> = ref(undefined);
	const serviceMessage: Ref<string | undefined> = ref(undefined);
	const navDrawerStatus: Ref<boolean> = ref(false);

	const getLicense: ComputedRef<string> = computed(() => license.value);
	const getToken: ComputedRef<string> = computed(() => token.value ? token.value : '');
	const getExpirationDate: ComputedRef<Date> = computed(() => expirationDate.value ? expirationDate.value : new Date());
	const getRefreshTokenRedirectUrl: ComputedRef<string> = computed(() => refreshTokenRedirectUrl.value ? refreshTokenRedirectUrl.value : '');
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value ? processingMessage.value : '');
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value ? serviceMessage.value : '');
	const getNavDrawerStatus: ComputedRef<boolean> = computed(() => navDrawerStatus.value);

	const updateToken = (param: string | undefined = undefined): void => {
		token.value = param;
	};
	const updateExpirationDate = (param: Date | undefined = undefined): void => {
		expirationDate.value = param;
	};
	const updateRefreshTokenRedirectUrl = (param: string | undefined = undefined): void => {
		refreshTokenRedirectUrl.value = param;
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
			updateExpirationDate(response.expirationDate);
			if (refreshTokenRedirectUrl.value !== undefined) {
				router.push(refreshTokenRedirectUrl.value);
				updateRefreshTokenRedirectUrl();
			}
		}
	};
	const logout = (): void => {
		const userStore = useUserStore();
		userStore.updateUser(UserMethods.logout(userStore.getUser));
		updateExpirationDate()
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
		return expirationDate.value !== undefined ? new Date(expirationDate.value) < new Date() : false;
	};

	return {
		license,
		token,
		expirationDate,
		refreshTokenRedirectUrl,
		processingMessage,
		serviceMessage,
		navDrawerStatus,
		getLicense,
		getToken,
		getExpirationDate,
		getRefreshTokenRedirectUrl,
		getProcessingMessage,
		getServiceMessage,
		getNavDrawerStatus,
		updateToken,
		updateExpirationDate,
		updateRefreshTokenRedirectUrl,
		updateProcessingMessage,
		updateServiceMessage,
		updateNavDrawerStatus,
		loginAsync,
		logout,
		confirmUserNameAsync,
		requestPasswordResetAsync,
		isTokenExpired,
	}
}, {
	persist: true
});
