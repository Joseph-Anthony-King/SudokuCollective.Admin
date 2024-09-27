import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import type { AxiosResponse } from 'axios';
import { toast } from 'vue3-toastify';
import { useAppStore } from '@/stores/appStore';
import { useDialogStore } from '@/stores/dialogStore';
import { useUserStore } from '@/stores/userStore';
import { LoginService } from '@/services/loginService';
import router from '@/router';
import type { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { User } from '@/models/domain/user';
import commonUtitlities from '@/utilities/common';

export const useGlobalStore = defineStore('globalStore', () => {
  //#region State
  const license: Ref<string | undefined> = ref(process.env.VITE_APP_LICENSE);
  const token: Ref<string | null> = ref(null);
  const tokenExpirationDate: Ref<Date | null> = ref(null);
  const redirectUrl: Ref<string | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  const processingStatus: Ref<boolean> = ref(false);
  const navDrawerStatus: Ref<boolean> = ref(false);
  const stayLoggedIn: Ref<boolean> = ref(true);
  const redirectToSignUp: Ref<boolean> = ref(false);
  const cancelApiRequestDelegate: Ref<(() => void) | null> = ref(null);
  const cancelApiRequestDelayInMilliseconds: Ref<number | null> = ref(null);
  //#endregion

  //#region Getters
  const getLicense: ComputedRef<string> = computed(() =>
    license.value ? toRaw(license.value) : '',
  );
  const getToken: ComputedRef<string> = computed(() => (token.value ? toRaw(token.value) : ''));
  const getTokenExpirationDate: ComputedRef<Date | null> = computed(() =>
    toRaw(tokenExpirationDate.value),
  );
  const getRedirectUrl: ComputedRef<string> = computed(() =>
    redirectUrl.value ? toRaw(redirectUrl.value) : '',
  );
  const getServiceMessage: ComputedRef<string> = computed(() =>
    serviceMessage.value ? toRaw(serviceMessage.value) : '',
  );
  const getProcessingStatus: ComputedRef<boolean> = computed(() => toRaw(processingStatus.value));
  const getNavDrawerStatus: ComputedRef<boolean> = computed(() => toRaw(navDrawerStatus.value));
  const getStayedLoggedIn: ComputedRef<boolean> = computed(() => toRaw(stayLoggedIn.value));
  const getRedirectToSignUp: ComputedRef<boolean> = computed(() => toRaw(redirectToSignUp.value));
  const getCancelApiRequestDelegateIsNotNull: ComputedRef<boolean> = computed(() =>
    cancelApiRequestDelegate.value !== null ? true : false,
  );
  const getCancelApiRequestDelayInMilliseconds: ComputedRef<number | null> = computed(() =>
    toRaw(cancelApiRequestDelayInMilliseconds.value),
  );
  //#endregion

  //#region Mutations
  const updateToken = (param: string | null = null): void => {
    token.value = param;
  };
  const updateTokenExpirationDate = (param: Date | null = null): void => {
    tokenExpirationDate.value = param;
  };
  const updateRedirectUrl = (param: string | null = null): void => {
    redirectUrl.value = param;
  };
  const setServiceMessage = (param: string | null = null): void => {
    serviceMessage.value = param;
  };
  const updateProcessingStatus = (param: boolean): void => {
    processingStatus.value = param;
  };
  const updateNavDrawerStatus = (param: boolean): void => {
    navDrawerStatus.value = param;
  };
  const updateStayLoggedIn = (param: boolean): void => {
    stayLoggedIn.value = param;
  };
  const updateRedirectToSignUp = (param: boolean): void => {
    redirectToSignUp.value = param;
  };
  const updateCancelApiRequestDelegate = (
    action: (() => void) | null = null,
    milliseconds: number | null = null,
  ): void => {
    cancelApiRequestDelegate.value = action;
    cancelApiRequestDelayInMilliseconds.value = milliseconds;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    token.value = null;
    tokenExpirationDate.value = null;
    redirectUrl.value = null;
    serviceMessage.value = null;
    processingStatus.value = false;
    navDrawerStatus.value = false;
    stayLoggedIn.value = true;
    redirectToSignUp.value = false;
    cancelApiRequestDelegate.value = null;
  };
  const loginAsync = async (data: ILoginRequestData): Promise<void> => {
    const response: IServicePayload = await LoginService.postLoginAsync(data);
    if (response.isSuccess) {
      const { updateUser } = useUserStore();
      const { getMyAppsAsync, getMyRegisteredAppsAsync } = useAppStore();
      const { initializeStore } = useDialogStore();
      updateUser(response.user);
      updateToken(response.token);
      updateTokenExpirationDate(response.tokenExpirationDate);
      updateStayLoggedIn(data.stayLoggedIn);
      initializeStore();

      await getMyAppsAsync();
      await getMyRegisteredAppsAsync();

      if (redirectUrl.value !== null) {
        window.location.href = redirectUrl.value;
        updateRedirectUrl();
      }
    }
  };
  const logout = (): void => {
    const { clearStores } = commonUtitlities();
    clearStores();
  };
  const confirmUserNameAsync = async (email: string): Promise<void> => {
    const response: IServicePayload = await LoginService.postConfirmUserNameAsync(email);
    if (response.isSuccess) {
      const userStore = useUserStore();
      userStore.updateConfirmedUserName(response.confirmedUserName);
      updateToken(response.token);
    }
  };
  const isTokenExpired = (): boolean => {
    let result = false;
    if (tokenExpirationDate.value !== null && new Date(tokenExpirationDate.value) < new Date()) {
      redirectUrl.value = router.currentRoute.value.path;
      const user = new User();
      useUserStore().updateUser(user);
      result = true;
    }
    return result;
  };
  const tokenHasExpired = (data: AxiosResponse): void => {
    if (
      data.status === 401 ||
      (data.status === 403 &&
        data.data.message === 'Status Code 403: Invalid request on this authorization token')
    ) {
      const { clearStores } = commonUtitlities();
      clearStores();
      const user = new User();
      user.isLoggingIn = true;
      useUserStore().updateUser(user);
      updateRedirectUrl(router.currentRoute.value.path);
      router.push('/login');
      toast('The authorization token has expired, please sign in again', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
    }
  };
  const cancelApiRequest = (event: Event | null = null): void => {
    event?.preventDefault();
    if (cancelApiRequestDelegate.value !== null) {
      cancelApiRequestDelegate.value();
    }
  };
  //#endregion

  return {
    license,
    token,
    tokenExpirationDate,
    redirectUrl,
    serviceMessage,
    processingStatus,
    navDrawerStatus,
    stayLoggedIn,
    redirectToSignUp,
    cancelApiRequestDelegate,
    cancelApiRequestDelayInMilliseconds,
    getLicense,
    getToken,
    getTokenExpirationDate,
    getRedirectUrl,
    getServiceMessage,
    getProcessingStatus,
    getNavDrawerStatus,
    getStayedLoggedIn,
    getRedirectToSignUp,
    getCancelApiRequestDelegateIsNotNull,
    getCancelApiRequestDelayInMilliseconds,
    updateToken,
    updateTokenExpirationDate,
    updateRedirectUrl,
    setServiceMessage,
    updateNavDrawerStatus,
    updateProcessingStatus,
    updateStayLoggedIn,
    updateRedirectToSignUp,
    updateCancelApiRequestDelegate,
    initializeStore,
    loginAsync,
    logout,
    confirmUserNameAsync,
    isTokenExpired,
    tokenHasExpired,
    cancelApiRequest,
  };
});
