import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { AppsService } from '@/services/appsService';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import type { IApp } from '@/interfaces/domain/iApp';
import type { IUpdateAppRequestData } from '@/interfaces/requests/iUpdateAppRequestData';
import type { App } from '@/models/domain/app';

export const useAppStore = defineStore('appStore', () => {
  //#region State
  const myApps: Ref<Array<IApp>> = ref([]);
  const myRegisteredApps: Ref<Array<IApp>> = ref([]);
  const selectedApp: Ref<IApp | null | undefined> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  //#endregion

  //#region Getters
  const getMyApps: ComputedRef<Array<IApp>> = computed(() => toRaw(myApps.value));
  const getMyRegisteredApps: ComputedRef<Array<IApp>> = computed(() =>
    toRaw(myRegisteredApps.value),
  );
  const getSelectedApp: ComputedRef<IApp | null | undefined> = computed(() =>
    toRaw(selectedApp.value),
  );
  //#endregion

  //#region Mutations
  const updateApp = (app: App): void => {
    const index = myApps.value.findIndex((a) => a.id === app.id);
    if (index !== -1) {
      myApps.value[index] = app;
      if (
        selectedApp.value !== null &&
        selectedApp.value !== undefined &&
        selectedApp.value.id === app.id
      ) {
        selectedApp.value = app;
      }
    }
  };
  const setSelectedApp = (id = 0): void => {
    selectedApp.value =
      id !== 0 && myApps.value.findIndex((a) => a.id === id) !== -1
        ? myApps.value.find((a) => a.id === id)
        : null;
  };
  const updateServiceMessage = (param: string | null = null): void => {
    serviceMessage.value = param;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    myApps.value = [];
    myRegisteredApps.value = [];
    selectedApp.value = null;
    serviceMessage.value = null;
  };
  const putUpdateAppAsync = async (data: IUpdateAppRequestData): Promise<boolean> => {
    const response: IServicePayload = await AppsService.putUpdateAppAsync(data);
    if (response.isSuccess) {
      updateApp(response.app);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const getMyAppsAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await AppsService.getMyAppsAsync();
    if (response.isSuccess) {
      myApps.value = response.apps;
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const getMyRegisteredAppsAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await AppsService.getMyRegisteredAppsAsync();
    if (response.isSuccess) {
      myRegisteredApps.value = response.apps;
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  //#endregion

  return {
    myApps,
    myRegisteredApps,
    selectedApp,
    serviceMessage,
    getMyApps,
    getMyRegisteredApps,
    getSelectedApp,
    updateApp,
    setSelectedApp,
    updateServiceMessage,
    initializeStore,
    putUpdateAppAsync,
    getMyAppsAsync,
    getMyRegisteredAppsAsync,
  };
});
