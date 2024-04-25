import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { DialogType } from '@/enums/dialogType';
import commonUtilities from '@/utilities/common';

export const useDialogStore = defineStore('dialogStore', () => {
  //#region State
  const title: Ref<string | null> = ref(null);
  const message: Ref<string | null> = ref(null);
  const dialogType: Ref<DialogType | null> = ref(null);
  const response: Ref<boolean | null> = ref(null);
  const isActive: Ref<boolean> = ref(false);
  const confirmedActionDelegate: Ref<(() => void) | (() => Promise<void>) | null> = ref(null);
  const notConfirmedActionDelegate: Ref<(() => void) | (() => Promise<void>) | null> = ref(null);
  //#endregion

  //#region Getters
  const getDialogTitle: ComputedRef<string | null> = computed(() => toRaw(title.value));
  const getDialogMessage: ComputedRef<string | null> = computed(() => toRaw(message.value));
  const getDialogType: ComputedRef<DialogType | null> = computed(() => toRaw(dialogType.value));
  const getDialogResponse: ComputedRef<boolean> = computed(() =>
    response.value !== null ? toRaw(response.value) : false,
  );
  const getDialogIsActive: ComputedRef<boolean> = computed(() => toRaw(isActive.value));
  //#endregion

  //#region Mutations
  const updateDialogTitle = (param: string) => {
    title.value = param;
  };
  const updateDialogMessage = (param: string) => {
    message.value = param;
  };
  const updateDialogType = (param: DialogType) => {
    dialogType.value = param;
  };
  const updateDialogResponse = (param: boolean) => {
    response.value = param;
  };
  const updateDialogIsActive = (param: boolean) => {
    isActive.value = param;
  };
  const updateConfirmedActionDelegate = (param: (() => void) | (() => Promise<void>)): void => {
    confirmedActionDelegate.value = param;
  };
  const updateNotConfirmedActionDelegate = (param: (() => void) | (() => Promise<void>)): void => {
    notConfirmedActionDelegate.value = param;
  };
  const updateDialog = (
    title: string,
    message: string,
    type: DialogType,
    confirmedAction: (() => void) | (() => Promise<void>) | undefined = undefined,
    notConfirmedAction: (() => void) | (() => Promise<void>) | undefined = undefined,
  ): void => {
    updateDialogTitle(title);
    updateDialogMessage(message);
    updateDialogType(type);
    if (confirmedAction !== undefined) {
      updateConfirmedActionDelegate(confirmedAction);
    }
    if (notConfirmedAction !== undefined) {
      updateNotConfirmedActionDelegate(notConfirmedAction);
    }
    updateDialogIsActive(true);
  };
  //#endregion

  //#region Action Handlers
  const initializeStore = (): void => {
    title.value = null;
    message.value = null;
    dialogType.value = null;
    response.value = null;
    isActive.value = false;
    confirmedActionDelegate.value = null;
  };
  const performConfirmedAction = async (): Promise<void> => {
    if (confirmedActionDelegate.value !== null) {
      const { isAsyncFunction } = commonUtilities();

      const action = confirmedActionDelegate.value;

      if (isAsyncFunction(action)) {
        await action();
      } else {
        action();
      }
    }
  };
  const performNotConfirmedAction = async (): Promise<void> => {
    if (notConfirmedActionDelegate.value !== null) {
      const { isAsyncFunction } = commonUtilities();

      const action = notConfirmedActionDelegate.value;

      if (isAsyncFunction(action)) {
        await action();
      } else {
        action();
      }
    }
  };
  //#endregion

  return {
    title,
    message,
    dialogType,
    response,
    isActive,
    confirmedActionDelegate,
    getDialogTitle,
    getDialogMessage,
    getDialogType,
    getDialogResponse,
    getDialogIsActive,
    updateDialogTitle,
    updateDialogMessage,
    updateDialogType,
    updateDialogResponse,
    updateDialogIsActive,
    updateConfirmedActionDelegate,
    updateNotConfirmedActionDelegate,
    updateDialog,
    initializeStore,
    performConfirmedAction,
    performNotConfirmedAction,
  };
});
