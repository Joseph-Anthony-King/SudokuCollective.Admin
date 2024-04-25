import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { defineStore } from 'pinia';

export const useLoginFormStore = defineStore('loginFormStore', () => {
  //#region State
  const dirty: Ref<boolean> = ref(false);
  const emailDirty: Ref<boolean> = ref(false);
  const userName: Ref<string | null> = ref(null);
  const password: Ref<string | null> = ref(null);
  const email: Ref<string | null> = ref(null);
  const invalidUserNames: Ref<string[]> = ref([]);
  const invalidPasswords: Ref<string[]> = ref([]);
  const invalidEmails: Ref<string[]> = ref([]);
  const loginFailed: Ref<boolean> = ref(false);
  //#endregion

  //#region Getters
  const getDirty: ComputedRef<boolean> = computed(() => toRaw(dirty.value));
  const getEmailDirty: ComputedRef<boolean> = computed(() => toRaw(emailDirty.value));
  const getUserName: ComputedRef<string | null> = computed(() => toRaw(userName.value));
  const getPassword: ComputedRef<string | null> = computed(() => toRaw(password.value));
  const getEmail: ComputedRef<string | null> = computed(() => toRaw(email.value));
  const getInvalidUserNames: ComputedRef<string[]> = computed(() => toRaw(invalidUserNames.value));
  const getInvalidPasswords: ComputedRef<string[]> = computed(() => toRaw(invalidPasswords.value));
  const getInvalidEmails: ComputedRef<string[]> = computed(() => toRaw(invalidEmails.value));
  const getLoginFailed: ComputedRef<boolean> = computed(() => toRaw(loginFailed.value));
  //#endregion

  //#region Mutations
  const updateUserName = (name: string | null) => {
    dirty.value = true;
    userName.value = name;
  };
  const updatePassword = (word: string | null) => {
    dirty.value = true;
    password.value = word;
  };
  const updateEmail = (mail: string | null) => {
    emailDirty.value = true;
    email.value = mail;
  };
  const updateInvalidUserNames = (names: string[]) => {
    dirty.value = true;
    invalidUserNames.value = names;
  };
  const updateInvalidPasswords = (passwords: string[]) => {
    dirty.value = true;
    invalidPasswords.value = passwords;
  };
  const updateInvalidEmails = (emails: string[]) => {
    emailDirty.value = true;
    invalidEmails.value = emails;
  };
  const updateLoginFailed = (failed: boolean) => {
    dirty.value = true;
    loginFailed.value = failed;
  };
  //#endregion

  //#region Actions
  const initializeStore = (): void => {
    dirty.value = false;
    userName.value = null;
    password.value = null;
    email.value = null;
    invalidUserNames.value = [];
    invalidPasswords.value = [];
    invalidEmails.value = [];
    loginFailed.value = false;
  };
  const initializeAssistance = (): void => {
    email.value = null;
    invalidEmails.value = [];
  };
  //#endregion

  return {
    dirty,
    emailDirty,
    userName,
    password,
    email,
    invalidUserNames,
    invalidPasswords,
    invalidEmails,
    loginFailed,
    getDirty,
    getEmailDirty,
    getUserName,
    getPassword,
    getEmail,
    getInvalidUserNames,
    getInvalidPasswords,
    getInvalidEmails,
    getLoginFailed,
    updateUserName,
    updatePassword,
    updateEmail,
    updateInvalidUserNames,
    updateInvalidPasswords,
    updateInvalidEmails,
    updateLoginFailed,
    initializeStore,
    initializeAssistance,
  };
});
