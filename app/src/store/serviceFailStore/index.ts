import { defineStore } from 'pinia';
import { ComputedRef, Ref, computed, ref } from 'vue';
import router from '@/router/index';
import { useAppStore } from '@/store/appStore/index';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
	const isSuccess: Ref<boolean | null> = ref(null);
	const message = ref('');
	const statusCode = ref(0);

	const getIsSuccess: ComputedRef<boolean | null> = computed(() => isSuccess.value);
	const getMessage: ComputedRef<string> = computed(() => message.value);
	const getStatusCode: ComputedRef<number> = computed(() => statusCode.value);

	const appStore = useAppStore();

	const initializeStore = (): void => {
		isSuccess.value = null;
		message.value = '';
		statusCode.value = 0;
	};
	const updateIsSuccess = (success: boolean): void => {
		isSuccess.value = success;
	};
	const updateMessage = (param: string): void => {
		if (param === 'Status Code 403: Invalid request on this token' && appStore.isTokenExpired()) {
			param = 'Login has expired, please sign in again.';
			appStore.updateRefreshTokenRedirectUrl(router.currentRoute.value.path);
			router.push(`${router.currentRoute.value}\\login`);
		}
		message.value = param;
	};
	const updateStatusCode = (code: number): void => {
		statusCode.value = code;
	};

	return {
		isSuccess,
		message,
		statusCode,
		getIsSuccess,
		getMessage,
		getStatusCode,
		initializeStore,
		updateIsSuccess,
		updateMessage,
		updateStatusCode
	}
 }, {
	persist: true
});
