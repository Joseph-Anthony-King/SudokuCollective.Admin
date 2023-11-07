import { defineStore } from "pinia";
import { AppsService } from "@/services/appsService"
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { ComputedRef, Ref, computed, ref, toRaw } from "vue";
import { IApp } from "@/interfaces/domain/iApp";
import { App } from "@/models/domain/app";

export const useAppStore = defineStore("appStore", () => {
  const myApps: Ref<Array<IApp>> = ref([]);
  const selectedApp: Ref<IApp | null | undefined> = ref(null);
  const getMyApps: ComputedRef<Array<IApp>> = computed(() => toRaw(myApps.value));
  const getSelectedApp: ComputedRef<IApp> = computed(() => selectedApp.value ? selectedApp.value : new App());

  const initializeStore = (): void => {
    myApps.value = [];
    selectedApp.value = null;
  };
  
  const getMyAppsAsync = async (): Promise<void> => {
    const response: IServicePayload = await AppsService.getMyAppsAsync();
    myApps.value = response.apps;
    return response.isSuccess;
  };
  const selectApp = (id = 0): void => {
    selectedApp.value = id !== 0 && myApps.value.findIndex(a => a.id === id) !== -1 ? myApps.value.find(a => a.id === id) : null;
  };

  return {
    myApps,
    selectedApp,
    getMyApps,
    getSelectedApp,
    initializeStore,
    getMyAppsAsync,
    selectApp
  }
});
