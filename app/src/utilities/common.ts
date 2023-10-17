import {
  Ref,
  ComputedRef,
  computed,
} from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useAppStore } from '@/store/appStore';
import { useUserStore } from '@/store/userStore';
import { useSudokuStore } from '@/store/sudokuStore';
import { useServiceFailStore } from '@/store/serviceFailStore';
import { StoreType } from '@/enums/storeTypes';

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });

  const clearStores = (): void => {
    useAppStore().initializeStore();
    useUserStore().initializeStore();
    useServiceFailStore().initializeStore();
  };

  const displaySuccessfulToast = (store: StoreType): void => {
    let message = ''
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
      useUserStore().updateServiceMessage();
    }
  };
  
  // Returns true if there was an error so form components can run validation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayFailedToastAsync = async (method: ((message: string, options: any) => any) | undefined, options: any | undefined): Promise<any> => {
    let failed = useServiceFailStore().getIsSuccess;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let methodResult: any | undefined = undefined;
    failed = failed !== null ? failed : true;
    if (!useServiceFailStore().getIsSuccess) {
      const message = useServiceFailStore().getServiceMessage;
      if (message !== null && message !== '') {
        if (method !== undefined) {
          if (isAsyncFunction(method)) {
            methodResult = await method(message, options)
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
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isAsyncFunction = (fn: (() => unknown) | ((message: string, options: any) => any)): boolean => {
    return fn.constructor.name === 'AsyncFunction';
  };

  const repairAutoComplete = (): void => {
    document.querySelectorAll('input[type="text"][autocomplete="off"').forEach((element) => {
      element.setAttribute('autocomplete', 'new-password')
    });
  };

  const resetViewPort = (isSmallViewPort: Ref<boolean>, maxDialogWidth: Ref<string>): void => {
    if (window.innerWidth <= 960) {
      isSmallViewPort.value = true;
      maxDialogWidth.value = 'auto';
    } else {
      isSmallViewPort.value = false;
      maxDialogWidth.value = '600px';
    }
  };

  const updateAppProcessingAsync = async (method: () => unknown): Promise<void | unknown> => {
    useAppStore().updateProcessingStatus(true);
    let result: unknown;
    if (isAsyncFunction(method)) {
      result = await method();
    } else {
      result = method();
    }
    useAppStore().updateProcessingStatus(false);
    if (result !== undefined) {
      return result;
    }
  };

  const updateUrlWithAction = (
    criteria: boolean,
    url: string,
    action: string,
    router: Router,
    route: RouteLocationNormalizedLoaded
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
    updateAppProcessingAsync,
    updateUrlWithAction,
  };
}
