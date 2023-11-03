import { Ref, ref, ComputedRef, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import { useAppStore } from "@/store/appStore";
import { useConfirmEmailStore } from "@/store/confirmEmailStore";
import { LoginService } from "@/services/loginService";
import { SignupService } from "@/services/signupService";
import { UsersService } from "@/services/usersService";
import { User } from "@/models/domain/user";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { IResetPasswordRequestData } from "@/interfaces/requests/iResetPasswordRequestData";
import { ISignupRequestData } from "@/interfaces/requests/iSignupRequestData";
import { IUpdateUserRequestData } from "@/interfaces/requests/iUpdateUserRequestData";
import commonUtitlities from "@/utilities/common";

export const useUserStore = defineStore("userStore", () => {
  const user: Ref<User> = ref(new User());
  const confirmedUserName: Ref<string | null> = ref(null);
  const processingMessage: Ref<string | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);

  const getUser: ComputedRef<User> = computed(() => toRaw(user.value));
  const getUserIsLoggedIn: ComputedRef<boolean> = computed(() =>
    toRaw(user.value.isLoggedIn)
  );
  const getUserIsLoggingIn: ComputedRef<boolean> = computed(() =>
    toRaw(user.value.isLoggingIn)
  );
  const getUserIsSignedIn: ComputedRef<boolean> = computed(() =>
    toRaw(user.value.isSignedUp)
  );
  const getUserIsSigningUp: ComputedRef<boolean> = computed(() =>
    toRaw(user.value.isSigningUp)
  );
  const getConfirmedUserName: ComputedRef<string> = computed(() =>
    confirmedUserName.value ? toRaw(confirmedUserName.value) : ""
  );
  const getProcessingMessage: ComputedRef<string> = computed(() =>
    processingMessage.value ? toRaw(processingMessage.value) : ""
  );
  const getServiceMessage: ComputedRef<string> = computed(() =>
    serviceMessage.value ? toRaw(serviceMessage.value) : ""
  );

  const appStore = useAppStore();

  const initializeStore = (): void => {
    user.value = new User();
    confirmedUserName.value = null;
    processingMessage.value = null;
    serviceMessage.value = null;
  };
  const updateUser = (param: User): void => {
    user.value = param;
  };
  const updateUserIsLoggingIn = (param: boolean): void => {
    user.value.isLoggingIn = param;
  };
  const updateUserIsSigningUp = (param: boolean): void => {
    user.value.isSigningUp = param;
  };
  const updateConfirmedUserName = (param: string | null = null): void => {
    confirmedUserName.value = param;
  };
  const updateProcessingMessage = (param: string | null = null): void => {
    processingMessage.value = param;
  };
  const updateServiceMessage = (param: string | null = null): void => {
    serviceMessage.value = param;
  };
  const signupUserAsync = async (data: ISignupRequestData): Promise<boolean> => {
    const response: IServicePayload = await SignupService.postAsync(data);
    if (response.isSuccess) {
      updateUser(response.user);
      appStore.updateToken(response.token);
      appStore.updateTokenExpirationDate(response.tokenExpirationDate);
      appStore.updateStayLoggedIn(data.stayLoggedIn);
    }
    return response.isSuccess;
  };
  const getUserAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.getUserAsync(
      user.value.id
    );
    if (response.isSuccess) {
      updateUser(response.user);
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const updateUserAsync = async (data: IUpdateUserRequestData): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putUpdateUserAsync(
      data
    );
    if (response.isSuccess) {
      updateUser(response.user);
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const deleteUserAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.deleteUserAsync(
      user.value.id
    );
    if (response.isSuccess) {
      const { clearStores } = commonUtitlities();
      clearStores();
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const confirmUserNameAsync = async (email: string): Promise<boolean> => {
    const response: IServicePayload =
      await LoginService.postConfirmUserNameAsync(email);
    if (response.isSuccess) {
      updateUser(response.user);
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const confirmEmailAsync = async (token: string): Promise<boolean> => {
    const response: IServicePayload = await UsersService.getConfirmEmailAsync(token);
    if (response.isSuccess) {
      updateServiceMessage(response.message);
      useConfirmEmailStore().updateConfirmationType(response.data.confirmationType);
      useConfirmEmailStore().updateUserName(response.data.userName);
      useConfirmEmailStore().updateEmail(response.data.email);
      useConfirmEmailStore().updateIsSuccess(response.isSuccess);
    }
    return response.isSuccess;
  };
  const resendEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.putResendEmailConfirmationAsync(user.value.id);
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.putCancelResendEmailConfirmationAsync();
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const resetPasswordAsync = async (data: IResetPasswordRequestData): Promise<boolean> => {    
    const response: IServicePayload = await UsersService.putResetPasswordAsync(data);
    if (response.isSuccess) {
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const requestPasswordResetAsync = async (email: string): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.postRequestPasswordResetAsync(email);
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const resendPasswordResetAsync = async (): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.putResendPasswordResetAsync(user.value.id);
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelPasswordResetAsync = async (): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.putCancelPasswordResetAsync();
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelAllEmailRequestsAsync = async (): Promise<boolean> => {
    const response: IServicePayload =
      await UsersService.putCancelAllEmailRequestsAsync();
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };

  return {
    user,
    confirmedUserName,
    processingMessage,
    serviceMessage,
    getUser,
    getUserIsLoggedIn,
    getUserIsLoggingIn,
    getUserIsSignedIn,
    getUserIsSigningUp,
    getConfirmedUserName,
    getProcessingMessage,
    getServiceMessage,
    initializeStore,
    updateUser,
    updateUserIsLoggingIn,
    updateUserIsSigningUp,
    deleteUserAsync,
    updateConfirmedUserName,
    updateProcessingMessage,
    updateServiceMessage,
    signupUserAsync,
    getUserAsync,
    updateUserAsync,
    confirmUserNameAsync,
    confirmEmailAsync,
    resendEmailConfirmationRequestAsync,
    cancelEmailConfirmationRequestAsync,
    resetPasswordAsync,
    requestPasswordResetAsync,
    resendPasswordResetAsync,
    cancelPasswordResetAsync,
    cancelAllEmailRequestsAsync,
  };
});
