import { Ref, ref, ComputedRef, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import { AxiosResponse } from "axios";
import { toast } from 'vue3-toastify';
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { LoginService } from "@/services/loginService";
import router from "@/router";
import { ILoginRequestData } from "@/interfaces/requests/iLoginRequestData";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { User } from "@/models/domain/user";
import commonUtitlities from "@/utilities/common";

export const useGlobalStore = defineStore("globalStore", () => {
  const license: Ref<string | null> = ref(process.env.VUE_APP_LICENSE);
  const token: Ref<string | null> = ref(null);
  const tokenExpirationDate: Ref<Date | null> = ref(null);
  const redirectUrl: Ref<string | null> = ref(null);
  const processingMessage: Ref<string | null> = ref("Processing, please do not navigate away");
  const serviceMessage: Ref<string | null> = ref(null);
  const processingStatus: Ref<boolean> = ref(false);
  const navDrawerStatus: Ref<boolean> = ref(false);
  const stayLoggedIn: Ref<boolean> = ref(true);

  const getLicense: ComputedRef<string> = computed(() =>
    license.value ? toRaw(license.value) : ""
  );
  const getToken: ComputedRef<string> = computed(() =>
    token.value ? toRaw(token.value) : ""
  );
  const getTokenExpirationDate: ComputedRef<Date | null> = computed(() =>
    toRaw(tokenExpirationDate.value)
  );
  const getRedirectUrl: ComputedRef<string> = computed(() =>
    redirectUrl.value ? toRaw(redirectUrl.value) : ""
  );
  const getProcessingMessage: ComputedRef<string> = computed(() =>
    processingMessage.value ? toRaw(processingMessage.value) : ""
  );
  const getServiceMessage: ComputedRef<string> = computed(() =>
    serviceMessage.value ? toRaw(serviceMessage.value) : ""
  );
  const getProcessingStatus: ComputedRef<boolean> = computed(() =>
    toRaw(processingStatus.value)
  );
  const getNavDrawerStatus: ComputedRef<boolean> = computed(() =>
    toRaw(navDrawerStatus.value)
  );
  const getStayedLoggedIn: ComputedRef<boolean> = computed(() =>
    toRaw(stayLoggedIn.value)
  );

  const initializeStore = (): void => {
    token.value = null;
    tokenExpirationDate.value = null;
    redirectUrl.value = null;
    serviceMessage.value = null;
    processingStatus.value = false;
    navDrawerStatus.value = false;
    stayLoggedIn.value = true;
  };
  const updateToken = (param: string | null = null): void => {
    token.value = param;
  };
  const updateTokenExpirationDate = (param: Date | null = null): void => {
    tokenExpirationDate.value = param;
  };
  const updateRedirectUrl = (param: string | null = null): void => {
    redirectUrl.value = param;
  };
  const updateServiceMessage = (param: string | null = null): void => {
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
  const loginAsync = async (data: ILoginRequestData): Promise<void> => {
    const response: IServicePayload = await LoginService.postLoginAsync(data);
    if (response.isSuccess) {
      const appStore = useAppStore();
      const userStore = useUserStore();
      userStore.updateUser(response.user);
      updateToken(response.token);
      updateTokenExpirationDate(response.tokenExpirationDate);
      updateStayLoggedIn(data.stayLoggedIn);

      await appStore.getMyAppsAsync();
      await appStore.getMyRegisteredAppsAsync();

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
    const response: IServicePayload =
      await LoginService.postConfirmUserNameAsync(email);
    if (response.isSuccess) {
      const userStore = useUserStore();
      userStore.updateConfirmedUserName(response.confirmedUserName);
      updateToken(response.token);
    }
  };
  const isTokenExpired = (): boolean => {
    let result = false;
    if (
      tokenExpirationDate.value !== null &&
      new Date(tokenExpirationDate.value) < new Date()
    ) {
      redirectUrl.value = router.currentRoute.value.path;
      const user = new User();
      useUserStore().updateUser(user);
      result = true;
    }
    return result;
  };
  const tokenHasExpired = (data: AxiosResponse): void => {
    if (data.status === 401 || (data.status === 403 && data.data.message === "Status Code 403: Invalid request on this authorization token")) {
      const { clearStores } = commonUtitlities();
      clearStores();
      const user = new User();
      user.isLoggingIn = true;
      useUserStore().updateUser(user);
      updateRedirectUrl(router.currentRoute.value.path);
      router.push("/login");
      toast("The authorization token has expired, please sign in again", {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
    }
  };

  return {
    license,
    token,
    tokenExpirationDate,
    redirectUrl,
    processingMessage,
    serviceMessage,
    processingStatus,
    navDrawerStatus,
    stayLoggedIn,
    getLicense,
    getToken,
    getTokenExpirationDate,
    getRedirectUrl,
    getProcessingMessage,
    getServiceMessage,
    getProcessingStatus,
    getNavDrawerStatus,
    getStayedLoggedIn,
    initializeStore,
    updateToken,
    updateTokenExpirationDate,
    updateRedirectUrl,
    updateServiceMessage,
    updateNavDrawerStatus,
    updateProcessingStatus,
    updateStayLoggedIn,
    loginAsync,
    logout,
    confirmUserNameAsync,
    isTokenExpired,
    tokenHasExpired,
  };
});
