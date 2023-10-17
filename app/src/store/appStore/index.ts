import { 
  Ref,
  ref,
  ComputedRef,
  computed
} from 'vue';
import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';
import { useUserStore } from '@/store/userStore/index';
import { LoginService } from '@/services/loginService';
import { UsersService } from '@/services/usersService';
import router from '@/router';
import { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { User } from '@/models/domain/user';
import commonUtitlities from '@/utilities/common';

export const useAppStore = defineStore('appStore', () => {
	const license: Ref<string | null> = ref(process.env.VUE_APP_LICENSE);
	const token: Ref<string | null> = ref(null);
	const tokenExpirationDate: Ref<Date | null> = ref(null);
	const redirectUrl: Ref<string | null> = ref(null);
	const processingMessage: Ref<string | null> = ref(null);
	const serviceMessage: Ref<string | null> = ref(null);
  const processingStatus: Ref<boolean> = ref(false);
	const navDrawerStatus: Ref<boolean> = ref(false);

	const getLicense: ComputedRef<string> = computed(() => license.value ? license.value : '');
	const getToken: ComputedRef<string> = computed(() => token.value ? token.value : '');
	const getTokenExpirationDate: ComputedRef<Date | null> = computed(() => tokenExpirationDate.value);
	const getRedirectUrl: ComputedRef<string> = computed(() => redirectUrl.value ? redirectUrl.value : '');
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value ? processingMessage.value : '');
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value ? serviceMessage.value : '');
  const getProcessingStatus: ComputedRef<boolean> = computed(() => processingStatus.value);
	const getNavDrawerStatus: ComputedRef<boolean> = computed(() => navDrawerStatus.value);

  const initializeStore = (): void => {
    token.value = null;
    tokenExpirationDate.value = null;
    redirectUrl.value = null;
    processingMessage.value = null;
    serviceMessage.value = null;
    processingStatus.value = false;
    navDrawerStatus.value = false;
  };
	const updateToken = (param: string | null = null): void => {
		token.value = param;
	};
	const updateTokenExpirationDate = (param: Date | null = null): void => {
		tokenExpirationDate.value = param;
	};
	const updateRedirectUrl = (param: string | null = null): void => {
		redirectUrl.value = param;
	};
	const updateProcessingMessage = (param: string | null = null): void => {
		processingMessage.value = param;
	};
	const updateServiceMessage = (param: string | null = null): void => {
		serviceMessage.value = param;
	};
  const updateProcessingStatus = (param: boolean): void => {
    processingStatus.value = param;
  }
	const updateNavDrawerStatus = (param: boolean): void => {
		navDrawerStatus.value = param;
	};
	const loginAsync = async (data: ILoginRequestData): Promise<void> => {
		const response: IServicePayload = await LoginService.postLoginAsync(data);
		if (response.isSuccess) {
      const userStore = useUserStore();
			userStore.updateUser(response.user);
			updateToken(response.token);
			updateTokenExpirationDate(response.tokenExpirationDate);
			if (redirectUrl.value !== null) {
				window.location.href = redirectUrl.value;
				updateRedirectUrl();
			}
		}
	};
	const logout = (): void => {
		const { clearStores } = commonUtitlities();
		clearStores();
	};
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
      const userStore = useUserStore();
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
		if (tokenExpirationDate.value !== null && new Date(tokenExpirationDate.value) < new Date()) {
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
    processingStatus,
		navDrawerStatus,
		getLicense,
		getToken,
		getTokenExpirationDate,
		getRedirectUrl,
		getProcessingMessage,
		getServiceMessage,
    getProcessingStatus,
		getNavDrawerStatus,
    initializeStore,
		updateToken,
		updateTokenExpirationDate,
		updateRedirectUrl,
		updateProcessingMessage,
		updateServiceMessage,
		updateNavDrawerStatus,
    updateProcessingStatus,
		loginAsync,
		logout,
		confirmUserNameAsync,
		requestPasswordResetAsync,
		isTokenExpired,
		tokenHasExpired
	}
});
