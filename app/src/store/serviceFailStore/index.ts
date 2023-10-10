
import { 
	computed, 
	ComputedRef, 
	ref, 
	Ref 
} from 'vue';
import { defineStore } from 'pinia';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
	const isSuccess: Ref<boolean | null> = ref(null);
	const message = ref('');
	const statusCode = ref(0);

	const getIsSuccess: ComputedRef<boolean | null> = computed(() => isSuccess.value);
	const getMessage: ComputedRef<string> = computed(() => message.value);
	const getStatusCode: ComputedRef<number> = computed(() => statusCode.value);

	const initializeStore = (): void => {
		isSuccess.value = null;
		message.value = '';
		statusCode.value = 0;
	};
	const updateIsSuccess = (success: boolean): void => {
		isSuccess.value = success;
	};
	const updateMessage = (param: string): void => {
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
