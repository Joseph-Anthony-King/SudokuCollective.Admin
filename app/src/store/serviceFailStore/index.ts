import { 
  Ref,
  ref,
  ComputedRef,
  computed,
  toRaw
} from 'vue';
import { defineStore } from 'pinia';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
	const isSuccess: Ref<boolean | null> = ref(null);
	const serviceMessage: Ref<string| null> = ref(null);
	const statusCode = ref(0);

	const getIsSuccess: ComputedRef<boolean | null> = computed(() => toRaw(isSuccess.value));
	const getServiceMessage: ComputedRef<string| null> = computed(() => toRaw(serviceMessage.value));
	const getStatusCode: ComputedRef<number> = computed(() => toRaw(statusCode.value));

	const initializeStore = (): void => {
		isSuccess.value = null;
		serviceMessage.value = null;
		statusCode.value = 0;
	};
	const updateIsSuccess = (success: boolean | null = null): void => {
		isSuccess.value = success;
	};
	const updateServiceMessage = (param: string | null = null): void => {
		serviceMessage.value = param;
	};
	// eslint-disable-next-line @typescript-eslint/no-inferrable-types
	const updateStatusCode = (code: number = 0): void => {
		statusCode.value = code;
	};

	return {
		isSuccess,
    serviceMessage,
		statusCode,
		getIsSuccess,
    getServiceMessage,
		getStatusCode,
		initializeStore,
		updateIsSuccess,
    updateServiceMessage,
		updateStatusCode
	}
 });
