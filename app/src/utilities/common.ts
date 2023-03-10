import { ComputedRef, computed } from "vue";
import { RouteLocationNormalizedLoaded, Router } from "vue-router";

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });

  const getLicense = (): string => {
    return process.env.VUE_APP_LICENSE;
  }

  const repairAutoComplete = (): void => {
    document.querySelectorAll('input[type="text"][autocomplete="off"').forEach((element) => {
      element.setAttribute("autocomplete", "new-password")
    });
  }

  const updateUrlWithAction = (
    criteria: boolean,
    url: string,
    action: string,
    router: Router,
    route: RouteLocationNormalizedLoaded
  ): void => {
    if (criteria === false) {
      router.push(url);
    } else if (criteria === true && route.params.action === "") {
      if (url !== "/") {
        url = `${url}/`;
      }
      router.push(`${url}${action}`);
    }
  }

  return {
    isChrome,
    getLicense,
    repairAutoComplete,
    updateUrlWithAction
  }
}
