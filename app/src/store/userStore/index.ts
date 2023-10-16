import { ComputedRef, Ref, computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useAppStore } from '@/store/appStore/index';
import { LoginService } from '@/services/loginService';
import { SignupService } from '@/services/signupService';
import { UsersService } from '@/services/usersService';
import { User } from '@/models/domain/user';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';
import { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';
import commonUtitlities from '@/utilities/common';

export const useUserStore = defineStore('userStore', () => {
	const user: Ref<User> = ref(new User());
	const confirmedUserName: Ref<string | null> = ref(null);
	const processingMessage: Ref<string | null> = ref(null);
	const serviceMessage: Ref<string | null> = ref(null);

	const getUser: ComputedRef<User> = computed(() => user.value);
	const getUserIsLoggedIn: ComputedRef<boolean> = computed(() => user.value.isLoggedIn);
	const getUserIsLoggingIn: ComputedRef<boolean> = computed(() => user.value.isLoggingIn);
	const getUserIsSignedIn: ComputedRef<boolean> = computed(() => user.value.isSignedUp);
	const getUserIsSigningUp: ComputedRef<boolean> = computed(() => user.value.isSigningUp);
	const getConfirmedUserName: ComputedRef<string> = computed(() => confirmedUserName.value ? confirmedUserName.value : '');
	const getProcessingMessage: ComputedRef<string> = computed(() => processingMessage.value ? processingMessage.value : '');
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value ? serviceMessage.value : '');

  const appStore = useAppStore();

  const initializeStore = (): void => {
    user.value = new User();
    confirmedUserName.value = null;
    processingMessage.value = null;
    serviceMessage.value = null;
  }

	const updateUser = (param: User): void => {
		user.value = param;
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
	const signupUserAsync = async (data: ISignupRequestData): Promise<void> => {
		const response: IServicePayload = await SignupService.postAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
			appStore.updateToken(response.token);
      appStore.updateTokenExpirationDate(response.tokenExpirationDate);
		}
	};
	const getUserAsync = async (): Promise<void> => {
		const response: IServicePayload = await UsersService.getUserAsync(user.value.id);
		if (response.isSuccess) {
			updateUser(response.user);
			updateServiceMessage(response.message);
		}
	}
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
	const confirmUserNameAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await LoginService.postConfirmUserNameAsync(data);
		if (response.isSuccess) {
			updateUser(response.user);
		}
	};
	const requestPasswordResetAsync = async (data: ILoginAssistanceRequestData): Promise<void> => {
		const response: IServicePayload = await UsersService.postRequestPasswordResetAsync(data);
		updateServiceMessage(response.message);
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
    deleteUserAsync,
		updateConfirmedUserName,
		updateProcessingMessage,
		updateServiceMessage,
		signupUserAsync,
		getUserAsync,
		updateUserAsync,
		confirmUserNameAsync,
		requestPasswordResetAsync
	}
});
