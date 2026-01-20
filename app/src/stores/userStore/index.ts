import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import type { AxiosError } from 'axios';
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
  const { updateStayLoggedIn, updateToken, updateTokenExpirationDate } = useGlobalStore();
  //#endregion

  //#region State
  const user: Ref<User> = ref(new User());
  const confirmedUserName: Ref<string | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  const userIsLoggingOut: Ref<boolean> = ref(false);
  //#endregion

  //#region Getters
  const getUser: ComputedRef<User> = computed(() => toRaw(user.value));
  const getUserIsLoggedIn: ComputedRef<boolean> = computed(() => toRaw(user.value.isLoggedIn!));
  const getUserIsLoggingIn: ComputedRef<boolean> = computed(() => toRaw(user.value.isLoggingIn!));
  const getUserIsSignedUp: ComputedRef<boolean> = computed(() => toRaw(user.value.isSignedUp!));
  const getUserIsSigningUp: ComputedRef<boolean> = computed(() => toRaw(user.value.isSigningUp!));
  const getConfirmedUserName: ComputedRef<string> = computed(() =>
    confirmedUserName.value ? toRaw(confirmedUserName.value) : '',
  );
  const getUserIsSuperUser: ComputedRef<boolean> = computed(() => toRaw(user.value.isSuperUser!));
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
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    user.value = new User();
    confirmedUserName.value = null;
    serviceMessage.value = null;
    userIsLoggingOut.value = false;
  };
  const getUserAsync = async (): Promise<boolean> => {
    try {
      if (user.value.id === null) {
        throw new Error('User id is invalid.');
      }
      const response: IServicePayload = await UsersService.getUserAsync(user.value.id!);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
        updateServiceMessage(response.message);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const updateUserAsync = async (data: IUpdateUserRequestData): Promise<boolean> => {
    try {
      const response: IServicePayload = await UsersService.putUpdateUserAsync(data);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
        updateServiceMessage(response.message);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const deleteUserAsync = async (): Promise<boolean> => {
    try {
      if (user.value.id === null) {
        throw new Error('User id is invalid.');
      }
      const response: IServicePayload = await UsersService.deleteUserAsync(user.value.id!);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        const { clearStores } = commonUtitlities();
        clearStores();
        updateServiceMessage(response.message);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const confirmUserNameAsync = async (email: string): Promise<boolean> => {
    try {
      if (email === null || email === '') {
        throw new Error('Email is invalid.');
      }
      const response: IServicePayload = await LoginService.postConfirmUserNameAsync(email);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateConfirmedUserName(response.confirmedUserName);
        updateServiceMessage(response.message);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const confirmEmailConfirmationTokenAsync = async (token: string): Promise<boolean> => {
    try {
      if (token === null || token === '') {
        throw new Error('Token is invalid.');
      }
      const response: IServicePayload = await UsersService.getConfirmEmailAsync(token);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateIsSuccess(response.isSuccess);
        updateServiceMessage(response.message);
        updateConfirmationType(response.data.confirmationType);
        updateUserName(response.data.userName);
        updateEmail(response.data.email);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const resendEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    try {
      if (user.value.id === null || user.value.id === 0) {
        throw new Error('User id is invalid.');
      }
      if (!user.value.receivedRequestToUpdateEmail) {
        throw new Error('There are no outstanding email confirmation requests.');
      }
      const response: IServicePayload = await UsersService.putResendEmailConfirmationAsync(
        user.value.id!,
      );
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const cancelEmailConfirmationRequestAsync = async (): Promise<boolean> => {
    try {
      if (!user.value.receivedRequestToUpdateEmail) {
        throw new Error('There are no outstanding email confirmation requests.');
      }
      const response: IServicePayload = await UsersService.putCancelResendEmailConfirmationAsync();
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const resetPasswordAsync = async (data: IResetPasswordRequestData): Promise<boolean> => {
    try {
      if (!user.value.receivedRequestToUpdatePassword) {
        throw new Error('There are no outstanding password reset requests.');
      }
      const response: IServicePayload = await UsersService.putResetPasswordAsync(data);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateServiceMessage(response.message);
      }
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const requestPasswordResetAsync = async (email: string): Promise<boolean> => {
    try {
      if (email === '' || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw new Error('Email is invalid.');
      }
      const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(email);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const resendPasswordResetAsync = async (): Promise<boolean> => {
    try {
      if (!user.value.receivedRequestToUpdatePassword) {
        throw new Error('There are no outstanding password reset requests.');
      }
      if (user.value.id === null || user.value.id === 0) {
        throw new Error('User id is invalid.');
      }
      const response: IServicePayload = await UsersService.putResendPasswordResetAsync(
        user.value.id!,
      );
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const cancelPasswordResetAsync = async (): Promise<boolean> => {
    try {
      if (!user.value.receivedRequestToUpdatePassword) {
        throw new Error('There are no outstanding password reset requests.');
      }
      const response: IServicePayload = await UsersService.putCancelPasswordResetAsync();
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const cancelAllEmailRequestsAsync = async (): Promise<boolean> => {
    try {
      if (!user.value.receivedRequestToUpdateEmail) {
        throw new Error('There are no outstanding email confirmation requests.');
      }
      if (!user.value.receivedRequestToUpdatePassword) {
        throw new Error('There are no outstanding password reset requests.');
      }
      const response: IServicePayload = await UsersService.putCancelAllEmailRequestsAsync();
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
      if (response.isSuccess) {
        updateUser(response.user);
      }
      updateServiceMessage(response.message);
      return response.isSuccess;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
  };
  const signupUserAsync = async (data: ISignupRequestData): Promise<boolean> => {
    try {
      const response: IServicePayload = await SignupService.postAsync(data);
      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }
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
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      throw error;
    }
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
    getUserIsSuperUser,
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
    getUserAsync,
    updateUserAsync,
    confirmUserNameAsync,
    confirmEmailConfirmationTokenAsync,
    resendEmailConfirmationRequestAsync,
    cancelEmailConfirmationRequestAsync,
    resetPasswordAsync,
    requestPasswordResetAsync,
    resendPasswordResetAsync,
    cancelPasswordResetAsync,
    cancelAllEmailRequestsAsync,
    signupUserAsync,
  };
});
