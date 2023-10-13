import { 
	computed, 
	ComputedRef, 
	ref, 
	Ref 
} from 'vue';
import { defineStore } from 'pinia';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
	const isSuccess: Ref<boolean | null> = ref(null);
	const message: Ref<string| null> = ref(null);
	const statusCode = ref(0);

	const getIsSuccess: ComputedRef<boolean | null> = computed(() => isSuccess.value);
	const getMessage: ComputedRef<string| null> = computed(() => message.value);
	const getStatusCode: ComputedRef<number> = computed(() => statusCode.value);

	const initializeStore = (): void => {
		isSuccess.value = null;
		message.value = null;
		statusCode.value = 0;
	};
	const updateIsSuccess = (success: boolean | null = null): void => {
		isSuccess.value = success;
	};
	const updateMessage = (param: string | null = null): void => {
		message.value = param;
	};
	// eslint-disable-next-line @typescript-eslint/no-inferrable-types
	const updateStatusCode = (code: number = 0): void => {
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
 });
