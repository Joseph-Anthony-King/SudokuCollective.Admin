import { ComputedRef, computed } from "vue";

export default function () {
  const isChrome: ComputedRef<boolean> = computed(() => {
    return /Chrome/.test(navigator.userAgent);
  });

  const getLicense = (): string | undefined => {
    return process.env.VUE_APP_LICENSE;
  }

  const repairAutoComplete = (): void => {
    document.querySelectorAll('input[type="text"][autocomplete="off"').forEach((element) => {
      element.setAttribute("autocomplete", "new-password")
    });
  }

  return {
    isChrome,
    getLicense,
    repairAutoComplete
  }
}
