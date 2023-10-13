
import { 
	computed, 
	ComputedRef, 
	ref, 
	Ref 
} from 'vue';
import { defineStore } from 'pinia';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
	const isSuccess: Ref<boolean | undefined> = ref(undefined);
	const message: Ref<string| undefined> = ref(undefined);
	const statusCode = ref(0);

	const getIsSuccess: ComputedRef<boolean | undefined> = computed(() => isSuccess.value);
	const getMessage: ComputedRef<string| undefined> = computed(() => message.value);
	const getStatusCode: ComputedRef<number> = computed(() => statusCode.value);

	const initializeStore = (): void => {
		isSuccess.value = undefined;
		message.value = undefined;
		statusCode.value = 0;
	};
	const updateIsSuccess = (success: boolean | undefined = undefined): void => {
		isSuccess.value = success;
	};
	const updateMessage = (param: string | undefined = undefined): void => {
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
