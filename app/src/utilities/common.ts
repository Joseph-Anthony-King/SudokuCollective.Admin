import {
  Ref, 
  computed, 
  ComputedRef
} from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { toast } from 'vue3-toastify';
import { useAppStore } from '@/store/appStore';
import { useUserStore } from '@/store/userStore';
import { useSudokuStore } from '@/store/sudokuStore';
import { useServiceFailStore } from '@/store/serviceFailStore';

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });

  const clearStores = (): void => {
    useAppStore().initializeStore();
    useUserStore().initializeStore();
    useServiceFailStore().initializeStore();
  };

  const displaySuccessfulToast = (store: string): void => {
    let message = ''
    if (store === 'userStore') {
      message = useUserStore().getServiceMessage;
    } else if (store === 'sudokuStore') {
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
  const displayFailedToast = (method: ((message: string, options: any) => any) | undefined, options: any | undefined): any => {
    let failed = useServiceFailStore().getIsSuccess;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let methodResult: any | undefined = undefined;
    failed = failed !== null ? failed : true;
    if (!useServiceFailStore().getIsSuccess) {
      const message = useServiceFailStore().getMessage;
      if (message !== null && message !== '') {
        if (method !== undefined) {
          methodResult = method(message, options);
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
    displayFailedToast,
    repairAutoComplete,
    resetViewPort,
    updateUrlWithAction
  }
}
