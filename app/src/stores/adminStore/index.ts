import { computed, ComputedRef, Ref, ref } from 'vue';
import { defineStore } from 'pinia';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { IAdminSummary } from '@/interfaces/infrastructure/iAdminSummary';
import { IApp } from '@/interfaces/domain/iApp';
import { IUser } from '@/interfaces/domain/iUser';
import { AdminService } from '@/services/adminService';
import { UsersService } from '@/services/usersService';
import { AppsService } from '@/services/appsService';

export const useAdminStore = defineStore('adminStore', () => {
  //#region State
  const adminSummary: Ref<IAdminSummary> = ref(new AdminSummary());
  const users: Ref<IUser[]> = ref([]);
  const apps: Ref<IApp[]> = ref([]);
  //#endregion

  //#region Getters
  const getAdminSummary: ComputedRef<IAdminSummary> = computed(() => adminSummary.value);
  const getUsers: ComputedRef<IUser[]> = computed(() => users.value);
  const getApps: ComputedRef<IApp[]> = computed(() => apps.value);
  //#endregion

  //#region Mutations
  const updateAdminSummary = (data: IAdminSummary): void => {
    adminSummary.value = data;
  };
  const updateUsers = (data: IUser[]): void => {
    users.value = data;
  };
  const updateApps = (data: IApp[]): void => {
    apps.value = data;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    adminSummary.value = new AdminSummary();
    users.value = [];
    apps.value = [];
  };
  const getStatsAsync = async (): Promise<boolean> => {
    let result = false;
    const adminReponse = await AdminService.getStatsAsync();
    if (adminReponse.isSuccess) {
      adminSummary.value = adminReponse.adminSummary;
      result = true;
    } else {
      result = false;
      return result;
    }
    const usersResponse = await UsersService.getUsersAsync();
    if (usersResponse.isSuccess) {
      users.value = usersResponse.users;
      result = true;
    } else {
      result = false;
      return result;
    }
    const appsResponse = await AppsService.getAppsAsync();
    if (appsResponse.isSuccess) {
      apps.value = appsResponse.apps;
      result = true;
    } else {
      result = false;
      return result;
    }
    return result;
  };
  const putActivateAppAsync = async (appId: number): Promise<boolean> => {
    try {
      const response = await AppsService.putActivateAppAsync(appId);

      if (response.isSuccess) {
        const app = response.app;
        if (app) {
          const index = apps.value.findIndex(a => a.id === app.id);
          if (index !== -1) {
            apps.value[index] = app;
          }
        }
      }

      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return false;
    }
  };
  const putDeactivateAppAsync = async (appId: number): Promise<boolean> => {
    try {
      const response = await AppsService.putDeactivateAppAsync(appId);

      if (response.isSuccess) {
        const app = response.app;
        if (app) {
          const index = apps.value.findIndex(a => a.id === app.id);
          if (index !== -1) {
            apps.value[index] = app;
          }
        }
      }

      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return false;
    }
  };
  //#endregion

  return {
    adminSummary,
    users,
    apps,
    getAdminSummary,
    getUsers,
    getApps,
    updateAdminSummary,
    updateUsers,
    updateApps,
    initializeStore,
    getStatsAsync,
    putActivateAppAsync,
    putDeactivateAppAsync,
  };
});
