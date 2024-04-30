import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { useConfirmEmailStore } from '@/stores/confirmEmailStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useDialogStore } from '@/stores/dialogStore';
import { LoginService } from '@/services/loginService';
import { SignupService } from '@/services/signupService';
import { UsersService } from '@/services/usersService';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import type { IResetPasswordRequestData } from '@/interfaces/requests/iResetPasswordRequestData';
import type { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';
import type { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';
import { User } from '@/models/domain/user';
import { DialogType } from '@/enums/dialogType';
import commonUtitlities from '@/utilities/common';

export const useUserStore = defineStore('userStore', () => {
  //#region Destructure Stores
  const { updateConfirmationType, updateEmail, updateIsSuccess, updateUserName } =
    useConfirmEmailStore();
  const { updateDialog } = useDialogStore();
  const { updateToken, updateTokenExpirationDate, updateStayLoggedIn } = useGlobalStore();
  //#endregion

  //#region State
  const user: Ref<User> = ref(new User());
  const confirmedUserName: Ref<string | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  const userIsLoggingOut: Ref<boolean> = ref(false);
  //#endregion

  //#region Getters
  const getUser: ComputedRef<User> = computed(() => toRaw(user.value));
  const getUserIsLoggedIn: ComputedRef<boolean> = computed(() => toRaw(user.value.isLoggedIn));
  const getUserIsLoggingIn: ComputedRef<boolean> = computed(() => toRaw(user.value.isLoggingIn));
  const getUserIsSignedUp: ComputedRef<boolean> = computed(() => toRaw(user.value.isSignedUp));
  const getUserIsSigningUp: ComputedRef<boolean> = computed(() => toRaw(user.value.isSigningUp));
  const getConfirmedUserName: ComputedRef<string> = computed(() =>
    confirmedUserName.value ? toRaw(confirmedUserName.value) : '',
  );
  const getServiceMessage: ComputedRef<string> = computed(() =>
    serviceMessage.value ? toRaw(serviceMessage.value) : '',
  );
  const getUserIsLoggingOut: ComputedRef<boolean> = computed(() => toRaw(userIsLoggingOut.value));
  //#endregion

  //#region Mutations
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
  const updateServiceMessage = (param: string | null = null): void => {
    serviceMessage.value = param;
  };
  const updateUserIsLoggingOut = (param: boolean): void => {
    userIsLoggingOut.value = param;
    console.debug(
      `userStore updateUserIsLoggingOut userIsLoggingOut.value: ${userIsLoggingOut.value}`,
    );
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    user.value = new User();
    confirmedUserName.value = null;
    serviceMessage.value = null;
    userIsLoggingOut.value = false;
  };
  const signupUserAsync = async (data: ISignupRequestData): Promise<boolean> => {
    const response: IServicePayload = await SignupService.postAsync(data);
    if (response.isSuccess) {
      updateUser(response.user);
      updateToken(response.token);
      updateTokenExpirationDate(response.tokenExpirationDate);
      updateStayLoggedIn(data.stayLoggedIn);
      updateDialog(
        'Welcome to Sudoku Collective',
        `Thank you for joining <span class="primary-color">Sudoku Collective</span> ${user.value.userName}!<br /><br />Please note that you will have to confirm your email adress of <span class="primary-color">${user.value.email}</span> or you may lose access to your profile if you forget your password.  An email from <span class="primary-color">sudokucollective@gmail.com</span> has been sent to <span class="primary-color">${user.value.email}</span>, please review the link contained within the email.  Please do not respond to <span class="primary-color">sudokucollective@gmail.com</span> as this email is not monitored.<br /><br />If you cannot find the email from <span class="primary-color">sudokucollective@gmail.com</span> please review your spam folder and you can always request another copy if you cannot find the original.<br /><br />Most importantly I sincerely hope you have fun coding, welcome to <span class="primary-color">Sudoku Collective</span>!`,
        DialogType.OK,
      );
    }
    return response.isSuccess;
  };
  const getUserAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.getUserAsync(user.value.id);
    if (response.isSuccess) {
      updateUser(response.user);
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const updateUserAsync = async (data: IUpdateUserRequestData): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putUpdateUserAsync(data);
    if (response.isSuccess) {
      updateUser(response.user);
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const deleteUserAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.deleteUserAsync(user.value.id);
    if (response.isSuccess) {
      const { clearStores } = commonUtitlities();
      clearStores();
      updateServiceMessage(response.message);
    }
    return response.isSuccess;
  };
  const confirmUserNameAsync = async (email: string): Promise<boolean> => {
    const response: IServicePayload = await LoginService.postConfirmUserNameAsync(email);
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
      updateConfirmationType(response.data.confirmationType);
      updateUserName(response.data.userName);
      updateEmail(response.data.email);
      updateIsSuccess(response.isSuccess);
    }
    return response.isSuccess;
  };
  const resendEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putResendEmailConfirmationAsync(
      user.value.id,
    );
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putCancelResendEmailConfirmationAsync();
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
    const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(email);
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const resendPasswordResetAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putResendPasswordResetAsync(user.value.id);
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelPasswordResetAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putCancelPasswordResetAsync();
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  const cancelAllEmailRequestsAsync = async (): Promise<boolean> => {
    const response: IServicePayload = await UsersService.putCancelAllEmailRequestsAsync();
    if (response.isSuccess) {
      updateUser(response.user);
    }
    updateServiceMessage(response.message);
    return response.isSuccess;
  };
  //#endregion

  return {
    user,
    confirmedUserName,
    serviceMessage,
    userIsLoggingOut,
    getUser,
    getUserIsLoggedIn,
    getUserIsLoggingIn,
    getUserIsSignedUp,
    getUserIsSigningUp,
    getConfirmedUserName,
    getServiceMessage,
    getUserIsLoggingOut,
    updateUser,
    updateUserIsLoggingIn,
    updateUserIsSigningUp,
    deleteUserAsync,
    updateConfirmedUserName,
    updateServiceMessage,
    updateUserIsLoggingOut,
    initializeStore,
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
