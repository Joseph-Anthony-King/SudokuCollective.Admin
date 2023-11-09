import { defineStore } from "pinia";
import { AppsService } from "@/services/appsService"
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { ComputedRef, Ref, computed, ref, toRaw } from "vue";
import { IApp } from "@/interfaces/domain/iApp";

export const useAppStore = defineStore("appStore", () => {
  const myApps: Ref<Array<IApp>> = ref([]);
  const myRegisteredApps: Ref<Array<IApp>> = ref([]);
  const selectedApp: Ref<IApp | null | undefined> = ref(null);
  const getMyApps: ComputedRef<Array<IApp>> = computed(() => toRaw(myApps.value));
  const getMyRegisteredApps: ComputedRef<Array<IApp>> = computed(() => toRaw(myRegisteredApps.value));
  const getSelectedApp: ComputedRef<IApp | null | undefined> = computed(() => toRaw(selectedApp.value));

  const initializeStore = (): void => {
    myApps.value = [];
    myRegisteredApps.value = [];
    selectedApp.value = null;
  };
  
  const getMyAppsAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await AppsService.getMyAppsAsync();
    myApps.value = response.apps;
    return response.isSuccess;
  };
  const getMyRegisteredAppsAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await AppsService.getMyRegisteredAppsAsync();
    myRegisteredApps.value = response.apps;
    return response.isSuccess;
  };
  const updateSelectedApp = (id = 0): void => {
    selectedApp.value = id !== 0 && myApps.value.findIndex(a => a.id === id) !== -1 ? myApps.value.find(a => a.id === id) : null;
  };

  return {
    myApps,
    myRegisteredApps,
    selectedApp,
    getMyApps,
    getMyRegisteredApps,
    getSelectedApp,
    initializeStore,
    getMyAppsAsync,
    getMyRegisteredAppsAsync,
    updateSelectedApp
  }
});
