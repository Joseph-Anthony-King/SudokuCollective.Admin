import {  
  ref,
  Ref, 
  computed,
  ComputedRef 
} from "vue";
import { defineStore } from "pinia";

export const useLoginFormStore = defineStore('loginFormStore', () => {
  const dirty: Ref<boolean> = ref(false);
  const emailDirty: Ref<boolean> = ref(false);
  const userName: Ref<string | null> = ref(null);
  const password: Ref<string | null> = ref(null);
  const email: Ref<string | null> = ref(null);
  const invalidUserNames: Ref<string[]> = ref([]);
  const invalidPasswords: Ref<string[]> = ref([]);
  const invalidEmails: Ref<string[]> = ref([]);

  const getDirty: ComputedRef<boolean> = computed(() => dirty.value);
  const getEmailDirty: Ref<boolean> = ref(false);
  const getUserName: ComputedRef<string | null> = computed(() => userName.value);
  const getPassword: ComputedRef<string | null> = computed(() => password.value);
  const getEmail: ComputedRef<string | null> = computed(() => email.value);
  const getInvalidUserNames: ComputedRef<string[]> = computed(() => invalidUserNames.value);
  const getInvalidPassword: ComputedRef<string[]> = computed(() => invalidPasswords.value);
  const getInvalidEmails: ComputedRef<string[]> = computed(() => invalidEmails.value);

  const initializeStore = (): void => {
    dirty.value = false;
    userName.value = null;
    password.value = null;
    email.value = null;
    invalidUserNames.value = [];
    invalidPasswords.value = [];
    invalidEmails.value = [];
  };
  const initializeAssistance = (): void => {
    email.value = null;
    invalidEmails.value = [];
  }
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
  }
  const updateInvalidUserName = (names: string[]) => {
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

  return {
    dirty,
    emailDirty,
    userName,
    password,
    email,
    invalidUserNames,
    invalidPasswords,
    invalidEmails,
    getDirty,
    getEmailDirty,
    getUserName,
    getPassword,
    getEmail,
    getInvalidUserNames,
    getInvalidPassword,
    getInvalidEmails,
    initializeStore,
    initializeAssistance,
    updateUserName,
    updatePassword,
    updateEmail,
    updateInvalidUserName,
    updateInvalidPasswords,
    updateInvalidEmails
  }
});
