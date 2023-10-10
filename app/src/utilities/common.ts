import { ComputedRef, computed } from 'vue';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { useAppStore } from '@/store/appStore';
import { useUserStore } from '@/store/userStore';
import { User } from '@/models/domain/user';

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });

  const clearStores = (): void => {
    useUserStore().updateUser(new User());
    useAppStore().updateToken();
    useAppStore().updateTokenExpirationDate();
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

  return {
    isChrome,
    clearStores,
    repairAutoComplete,
    updateUrlWithAction
  }
}
