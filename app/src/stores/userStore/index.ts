import { Ref, ref, ComputedRef, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import { useConfirmEmailStore } from "@/stores/confirmEmailStore";
import { useGlobalStore } from "@/stores/globalStore";
import { useOkDialogStore } from "@/stores/okDialogStore";
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

  const globalStore = useGlobalStore();
  const okDialogStore = useOkDialogStore();

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
      globalStore.updateToken(response.token);
      globalStore.updateTokenExpirationDate(response.tokenExpirationDate);
      globalStore.updateStayLoggedIn(data.stayLoggedIn);
      okDialogStore.updateTitle("Welcome to Sudoku Collective");
      okDialogStore.updateMessage(`Thank you for joining <span class="primary-color">Sudoku Collective</span> ${user.value.userName}!<br /><br />Please note that you will have to confirm your email adress of <span class="primary-color">${user.value.email}</span> or you may lose access to your profile if you forget your password.  An email from <span class="primary-color">sudokucollective@gmail.com</span> has been sent to <span class="primary-color">${user.value.email}</span>, please review the link contained within the email from <span class="primary-color">sudokucollective@gmail.com</span> to confirm the address you provided.  Please do not respond to <span class="primary-color">sudokucollective@gmail.com</span> as this email is not monitored.<br /><br />If you cannot find the email from <span class="primary-color">sudokucollective@gmail.com</span> please review your spam folder and you can always request another copy if you cannot find the original.<br /><br />Most importantly I sincerely hope you have fun coding, welcome to <span class="primary-color">Sudoku Collective</span>!`);
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
