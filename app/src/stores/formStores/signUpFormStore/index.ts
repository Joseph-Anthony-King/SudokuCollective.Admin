import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';

export const useSignUpFormStore = defineStore('signUpFormStore', () => {
  //#region State
  const dirty: Ref<boolean> = ref(false);
  const userName: Ref<string | null> = ref(null);
  const firstName: Ref<string | null> = ref(null);
  const lastName: Ref<string | null> = ref(null);
  const nickName: Ref<string | null> = ref(null);
  const email: Ref<string | null> = ref(null);
  const password: Ref<string | null> = ref(null);
  const confirmPassword: Ref<string | null> = ref(null);
  const passwordToken: Ref<string | null> = ref(null);
  const openPasswordResetForm: Ref<boolean> = ref(false);
  const invalidUserNames: Ref<string[]> = ref([]);
  const invalidEmails: Ref<string[]> = ref([]);
  //#endregion

  //#region Getters
  const getDirty: ComputedRef<boolean> = computed(() => toRaw(dirty.value));
  const getUserName: ComputedRef<string | null> = computed(() => toRaw(userName.value));
  const getFirstName: ComputedRef<string | null> = computed(() => toRaw(firstName.value));
  const getLastName: ComputedRef<string | null> = computed(() => toRaw(lastName.value));
  const getNickName: ComputedRef<string | null> = computed(() => toRaw(nickName.value));
  const getEmail: ComputedRef<string | null> = computed(() => toRaw(email.value));
  const getPassword: ComputedRef<string | null> = computed(() => toRaw(password.value));
  const getConfirmPassword: ComputedRef<string | null> = computed(() =>
    toRaw(confirmPassword.value),
  );
  const getPasswordToken: ComputedRef<string | null> = computed(() => toRaw(passwordToken.value));
  const getOpenPasswordResetForm: ComputedRef<boolean> = computed(() =>
    toRaw(openPasswordResetForm.value),
  );
  const getInvalidUserNames: ComputedRef<string[]> = computed(() => toRaw(invalidUserNames.value));
  const getInvalidEmails: ComputedRef<string[]> = computed(() => toRaw(invalidEmails.value));
  //#endregion

  //#region Mutations
  const updateUserName = (param: string | null): void => {
    dirty.value = true;
    userName.value = param;
  };
  const updateFirstName = (param: string | null): void => {
    dirty.value = true;
    firstName.value = param;
  };
  const updateLastName = (param: string | null): void => {
    dirty.value = true;
    lastName.value = param;
  };
  const updateNickName = (param: string | null): void => {
    dirty.value = true;
    nickName.value = param;
  };
  const updateEmail = (param: string | null): void => {
    dirty.value = true;
    email.value = param;
  };
  const updatePassword = (param: string | null): void => {
    dirty.value = true;
    password.value = param;
  };
  const updateConfirmPassword = (param: string | null) => {
    dirty.value = true;
    confirmPassword.value = param;
  };
  const updatePasswordToken = (param: string | null) => {
    dirty.value = true;
    passwordToken.value = param;
    openPasswordResetForm.value = true;
  };
  const updateInvalidUserNames = (names: string[]) => {
    dirty.value = true;
    invalidUserNames.value = names;
  };
  const updateInvalidEmails = (emails: string[]) => {
    dirty.value = true;
    invalidEmails.value = emails;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    dirty.value = false;
    userName.value = null;
    firstName.value = null;
    lastName.value = null;
    nickName.value = null;
    email.value = null;
    password.value = null;
    confirmPassword.value = null;
    passwordToken.value = null;
    openPasswordResetForm.value = false;
    invalidUserNames.value = [];
    invalidEmails.value = [];
  };
  //#endregion

  return {
    dirty,
    userName,
    firstName,
    lastName,
    nickName,
    email,
    password,
    invalidUserNames,
    invalidEmails,
    passwordToken,
    openPasswordResetForm,
    getDirty,
    getUserName,
    getFirstName,
    getLastName,
    getNickName,
    getEmail,
    getPassword,
    getConfirmPassword,
    getPasswordToken,
    getOpenPasswordResetForm,
    getInvalidUserNames,
    getInvalidEmails,
    updateUserName,
    updateFirstName,
    updateLastName,
    updateNickName,
    updateEmail,
    updatePassword,
    updateConfirmPassword,
    updatePasswordToken,
    updateInvalidUserNames,
    updateInvalidEmails,
    initializeStore,
  };
});
