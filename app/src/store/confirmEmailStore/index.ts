import { ComputedRef, computed, Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';
import { EmailConfirmationType } from '@/enums/emailConfirmationType';

export const useConfirmEmailStore = defineStore("confirmEmailStore", () => {
  const isSuccess: Ref<boolean | null> = ref(null);
  const confirmationType: Ref<EmailConfirmationType> = ref(EmailConfirmationType.NULL);
  const userName: Ref<string | null> = ref(null);
  const email: Ref<string | null> = ref(null);

  const getIsSuccess: ComputedRef<boolean | null> = computed(() => toRaw(isSuccess.value));
  const getConfirmationType: ComputedRef<EmailConfirmationType> = computed(() => toRaw(confirmationType.value));
  const getUserName: ComputedRef<string | null> = computed(() => toRaw(userName.value));
  const getEmail: ComputedRef<string | null> = computed(() => toRaw(email.value));

  const initializeStore = (): void => {
    isSuccess.value = null;
    confirmationType.value = EmailConfirmationType.NULL;
    userName.value = null;
    email.value = null;
  };
  const updateIsSuccess = (param: boolean): void => {
    isSuccess.value = param;
  };
  const updateConfirmationType = (param: EmailConfirmationType): void => {
    confirmationType.value = param;
  };
  const updateUserName = (param: string): void => {
    userName.value = param;
  };
  const updateEmail = (param: string): void => {
    email.value = param;
  };

  return {
    isSuccess,
    confirmationType,
    userName,
    email,
    getIsSuccess,
    getConfirmationType,
    getUserName,
    getEmail,
    initializeStore,
    updateIsSuccess,
    updateConfirmationType,
    updateUserName,
    updateEmail,
  }
});
