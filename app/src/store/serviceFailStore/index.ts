
import { 
	computed, 
	ComputedRef, 
	ref, 
	Ref 
} from 'vue';
import { defineStore } from 'pinia';
import router from '@/router/index';
import { useAppStore } from '@/store/appStore/index';
import { useUserStore } from '@/store/userStore/index';
import { User } from '@/models/domain/user';

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
		if (param === 'Status Code 401: The authorization token has expired, please sign in again' && appStore.isTokenExpired()) {
			const user = new User();
			useUserStore().updateUser(user);
			appStore.updateRedirectUrl(router.currentRoute.value.path);
			router.push('/login');
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
