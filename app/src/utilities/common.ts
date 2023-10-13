import {
  Ref, 
  computed, 
  ComputedRef
} from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { VForm } from 'vuetify/components';
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
  
  const displayFailedToast = (param: ((message: string) => void) | undefined, form: Ref<VForm | null> | undefined): void => {
    if (!useServiceFailStore().getIsSuccess) {
      const message = useServiceFailStore().getMessage;
      if (message !== null && message !== '') {
        if (param !== undefined) {
          param(message);
        }
        toast(message, {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
        });
        useServiceFailStore().initializeStore();
        if (form !== undefined) {
          form.value?.validate();
        }
      }
    }
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
