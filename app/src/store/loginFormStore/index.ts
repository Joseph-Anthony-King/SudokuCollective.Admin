import {  
  ref,
  Ref, 
  computed,
  ComputedRef 
} from "vue";
import { defineStore } from "pinia";

export const useLoginFormStore = defineStore('loginFormStore', () => {
  const dirty: Ref<boolean> = ref(false);
  const userName: Ref<string | null> = ref(null);
  const password: Ref<string | null> = ref(null);
  const invalidUserNames: Ref<string[]> = ref([]);
  const invalidPasswords: Ref<string[]> = ref([]);

  const getDirty: ComputedRef<boolean> = computed(() => dirty.value);
  const getUserName: ComputedRef<string | null> = computed(() => userName.value);
  const getPassword: ComputedRef<string | null> = computed(() => password.value);
  const getInvalidUserNames: ComputedRef<string[]> = computed(() => invalidUserNames.value);
  const getInvalidPassword: ComputedRef<string[]> = computed(() => invalidPasswords.value);

  const initializeStore = (): void => {
    dirty.value = false;
    userName.value = null;
    password.value = null;
    invalidUserNames.value = [];
    invalidPasswords.value = [];
  };
  const updateUserName = (name: string | null) => {
    dirty.value = true;
    userName.value = name;
  };
  const updatePassword = (word: string | null) => {
    dirty.value = true;
    password.value = word;
  };
  const updateInvalidUserName = (names: string[]) => {
    dirty.value = true;
    invalidUserNames.value = names;
  };
  const updateInvalidPasswords = (passwords: string[]) => {
    dirty.value = true;
    invalidPasswords.value = passwords;
  }

  return {
    dirty,
    userName,
    password,
    invalidUserNames,
    invalidPasswords,
    getDirty,
    getUserName,
    getPassword,
    getInvalidUserNames,
    getInvalidPassword,
    initializeStore,
    updateUserName,
    updatePassword,
    updateInvalidUserName,
    updateInvalidPasswords
  }
});
