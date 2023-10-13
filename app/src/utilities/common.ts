import {
  Ref, 
  computed, 
  ComputedRef
} from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { useAppStore } from '@/store/appStore';
import { useUserStore } from '@/store/userStore';
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

  const repairAutoComplete = (): void => {
    document.querySelectorAll('input[type="text"][autocomplete="off"').forEach((element) => {
      element.setAttribute('autocomplete', 'new-password')
    });
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

  const resetViewPort = (isSmallViewPort: Ref<boolean>, maxDialogWidth: Ref<string>): void => {
    if (window.innerWidth <= 960) {
      isSmallViewPort.value = true;
      maxDialogWidth.value = 'auto';
    } else {
      isSmallViewPort.value = false;
      maxDialogWidth.value = '600px';
    }
  };

  return {
    isChrome,
    clearStores,
    repairAutoComplete,
    updateUrlWithAction,
    resetViewPort
  }
}
