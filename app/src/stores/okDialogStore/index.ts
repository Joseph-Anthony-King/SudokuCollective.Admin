import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';

export const useOkDialogStore = defineStore('okDialogStore', () => {
  const title: Ref<string | null> = ref(null);
  const message: Ref<string | null> = ref(null);
  const isActive: Ref<boolean> = ref(false);

  const getTitle: ComputedRef<string | null> = computed(() => toRaw(title.value));
  const getMessage: ComputedRef<string | null> = computed(() => toRaw(message.value));
  const getIsActive: ComputedRef<boolean> = computed(() => toRaw(isActive.value));

  const initializeStore = (): void => {
    title.value = null;
    message.value = null;
    isActive.value = false;
  };
  const updateTitle = (param: string) => {
    title.value = param;
  };
  const updateMessage = (param: string) => {
    message.value = param;
  };
  const updateIsActive = (param: boolean) => {
    isActive.value = param;
  };

  return {
    title,
    message,
    isActive,
    getTitle,
    getMessage,
    getIsActive,
    initializeStore,
    updateTitle,
    updateMessage,
    updateIsActive,
  };
});
