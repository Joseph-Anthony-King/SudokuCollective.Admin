/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ComputedRef, computed, type Ref } from 'vue';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useAppStore } from '@/stores/appStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useLoginFormStore } from '@/stores/formStores/loginFormStore';
import { useServiceFailStore } from '@/stores/serviceFailStore';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useSudokuStore } from '@/stores/sudokuStore';
import { useUserStore } from '@/stores/userStore';
import { StoreType } from '@/enums/storeTypes';

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });
  const clearStores = (): void => {
    useAppStore().initializeStore();
    useGlobalStore().initializeStore();
    useLoginFormStore().initializeStore();
    useServiceFailStore().initializeStore();
    useSignUpFormStore().initializeStore();
    useUserStore().initializeStore();
  };
  const displaySuccessfulToast = (store: StoreType): void => {
    let message = '';
    if (store === StoreType.USERSTORE) {
      message = useUserStore().getServiceMessage;
    } else if (store === StoreType.SUDOKUSTORE) {
      message = useSudokuStore().getServiceMessage;
    }
    if (message !== null && message !== '') {
      toast(message, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
      useUserStore().setServiceMessage();
    }
  };
  // Returns true if there was an error so form components can run validation
  const displayFailedToastAsync = async (
    method: ((message: string, options: any) => any) | undefined,
    options: any | undefined,
  ): Promise<any> => {
    let failed = useServiceFailStore().getIsSuccess;
    let methodResult: any | undefined = undefined;
    failed = failed !== null ? failed : true;
    if (!useServiceFailStore().getIsSuccess) {
      const message = useServiceFailStore().getServiceMessage;
      if (message !== null && message !== '') {
        if (method !== undefined) {
          if (isAsyncFunction(method)) {
            methodResult = await method(message, options);
          } else {
            methodResult = method(message, options);
          }
        }
        toast(message, {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
        });
        useServiceFailStore().initializeStore();
      }
    }
    const result = { failed: !failed, methodResult };
    return result;
  };
  const isAsyncFunction = (
    fn:
      | (() => void)
      | (() => Promise<void>)
      | (() => unknown)
      | (() => Promise<unknown>)
      | ((message: string, options: any) => any)
      | ((message: string, options: any) => Promise<any>)
      | ((event: Event | null) => void)
      | ((event: Event | null) => Promise<void>),
  ): boolean => {
    return fn.constructor.name === 'AsyncFunction';
  };
  const repairAutoComplete = (): void => {
    document.querySelectorAll('input[type="text"][autocomplete="off"').forEach((element) => {
      element.setAttribute('autocomplete', 'new-password');
    });
  };
  const resetViewPort = (isSmallViewPort: Ref<boolean>): void => {
    if (window.innerWidth <= 960) {
      isSmallViewPort.value = true;
    } else {
      isSmallViewPort.value = false;
    }
  };
  const sleepAsync = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));
  const updateAppProcessingAsync = async (method: () => unknown): Promise<void | unknown> => {
    useGlobalStore().updateProcessingStatus(true);
    let result: unknown;
    if (isAsyncFunction(method)) {
      result = await method();
    } else {
      result = method();
    }
    useGlobalStore().updateProcessingStatus(false);
    if (result !== undefined) {
      return result;
    }
  };
  const updateUrlWithAction = (
    criteria: boolean,
    url: string,
    action: string,
    router: Router,
    route: RouteLocationNormalizedLoaded,
  ): void => {
    if (criteria === false) {
      router.push(url);
    } else if (criteria === true && route.params.action === '') {
      if (url !== '/') {
        url = `${url}/`;
      }
      router.push(`${url}${action}`);
    }
  };

  return {
    isChrome,
    clearStores,
    displaySuccessfulToast,
    displayFailedToastAsync,
    isAsyncFunction,
    repairAutoComplete,
    resetViewPort,
    sleepAsync,
    updateAppProcessingAsync,
    updateUrlWithAction,
  };
}
