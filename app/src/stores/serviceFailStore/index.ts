/* eslint-disable @typescript-eslint/no-inferrable-types */
import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';

export const useServiceFailStore = defineStore('serviceFailStore', () => {
  //#region State
  const isSuccess: Ref<boolean | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  const statusCode = ref(0);
  //#endregion

  //#region Getters
  const getIsSuccess: ComputedRef<boolean | null> = computed(() => toRaw(isSuccess.value));
  const getServiceMessage: ComputedRef<string | null> = computed(() => toRaw(serviceMessage.value));
  const getStatusCode: ComputedRef<number> = computed(() => toRaw(statusCode.value));
  //#endregion

  //#region Mutations
  const updateIsSuccess = (success: boolean | null = null): void => {
    isSuccess.value = success;
  };
  const setServiceMessage = (param: string | null = null): void => {
    serviceMessage.value = param;
  };
  const updateStatusCode = (code: number = 0): void => {
    statusCode.value = code;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    isSuccess.value = null;
    serviceMessage.value = null;
    statusCode.value = 0;
  };
  //#endregion

  return {
    isSuccess,
    serviceMessage,
    statusCode,
    getIsSuccess,
    getServiceMessage,
    getStatusCode,
    updateIsSuccess,
    setServiceMessage,
    updateStatusCode,
    initializeStore,
  };
});
