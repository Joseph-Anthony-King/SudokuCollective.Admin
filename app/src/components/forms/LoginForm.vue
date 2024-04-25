<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login</span>
    </v-card-title>
    <v-form
      v-model="formValid"
      ref="form"
      onsubmit="event.preventDefault();">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="userName !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="User Name"
                    v-model="userName"
                    prepend-icon="mdi-account-circle"
                    :rules="userNameRules(invalidUserNames, 'No user is using this user name')"
                    autocomplete="off"
                    color="primary"
                    v-bind="props">
                  </v-text-field>
                </template>
                <span>{{ RulesMessages.userNameRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="password !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    label="Password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="passwordRules(invalidPasswords)"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="off"
                    color="primary"
                    v-bind="props">
                  </v-text-field>
                </template>
                <span>{{ RulesMessages.passwordRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                location="bottom"
                :disabled="isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-checkbox
                    v-model="stayLoggedIn"
                    label="Stay Logged in for 30 Days"
                    color="primary"
                    v-bind="props"></v-checkbox>
                </template>
                <span
                  >If set to false this will clear your authorization token when you navigate away
                  from the app</span
                >
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col cols="2.4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="helpHandlerAsync($event)"
                  v-bind="props">
                  Help
                </v-btn>
              </template>
              <span>Get assistance to verify your user name or change password</span>
            </v-tooltip>
          </v-col>
          <v-col cols="2.4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="confirmResetHandler($event)"
                  v-bind="props">
                  Reset
                </v-btn>
              </template>
              <span>Reset the login form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="2.4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="cancelHandlerAsync($event)"
                  v-bind="props">
                  Cancel
                </v-btn>
              </template>
              <span>Cancel the login process</span>
            </v-tooltip>
          </v-col>
          <v-col cols="2.4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!loginFailed">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="confirmRedirectSignUpHandler($event)"
                  v-bind="props"
                  :disabled="!loginFailed">
                  Sign Up
                </v-btn>
              </template>
              <span>Redirect to sign up if you haven't done so already</span>
            </v-tooltip>
          </v-col>
          <v-col cols="2.4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click.prevent="submitHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props">
                  Submit
                </v-btn>
              </template>
              <span>Login to the app</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </AvailableActions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars*/
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  import {
    type ComputedRef,
    computed,
    type Ref,
    ref,
    toRaw,
    onMounted,
    onUpdated,
    onUnmounted,
  } from 'vue';
  import { VForm } from 'vuetify/components';
  import { toast } from 'vue3-toastify';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useGlobalStore } from '@/stores/globalStore';
  import { useLoginFormStore } from '@/stores/formStores/loginFormStore';
  import { useServiceFailStore } from '@/stores/serviceFailStore';
  import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
  import { useUserStore } from '@/stores/userStore';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import { LoginRequestData } from '@/models/requests/loginRequestData';
  import { DialogType } from '@/enums/dialogType';
  import commonUtilities from '@/utilities/common';
  import rules from '@/utilities/rules/index';
  import { RulesMessages } from '@/utilities/rules/rulesMessages';

  const props = defineProps({
    formStatus: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['obtain-login-assistance', 'cancel-login', 'redirect-to-signup']);

  const { passwordRules, userNameRules } = rules();
  const {
    isChrome,
    displayFailedToastAsync,
    repairAutoComplete,
    resetViewPort,
    updateAppProcessingAsync,
  } = commonUtilities();

  //#region Destructure Stores
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  //#region GlobalStore
  const globalStore = useGlobalStore();
  const { getStayedLoggedIn } = storeToRefs(globalStore);
  const { updateRedirectToSignUp } = globalStore;
  //#endregion
  //#region LoginFormStore
  const loginFormStore = useLoginFormStore();
  const {
    getDirty,
    getUserName,
    getPassword,
    getLoginFailed,
    getInvalidEmails,
    getInvalidUserNames,
    getInvalidPasswords,
  } = storeToRefs(loginFormStore);
  const {
    updateLoginFailed,
    updateUserName,
    updatePassword,
    updateInvalidUserNames,
    updateInvalidPasswords,
  } = loginFormStore;
  //#endregion
  const serviceFailStore = useServiceFailStore();
  const signUpFormStore = useSignUpFormStore();
  //#region UserStore
  const userStore = useUserStore();
  const { getConfirmedUserName } = storeToRefs(userStore);
  const { updateConfirmedUserName } = userStore;
  //#endregion
  //#endregion

  //#region Properties
  const userName: Ref<string | null> = ref(getUserName.value);
  const password: Ref<string | null> = ref(getPassword.value);
  const showPassword: Ref<boolean> = ref(false);
  const loginFailed: Ref<boolean> = ref(getLoginFailed.value);
  const stayLoggedIn: Ref<boolean> = ref(getStayedLoggedIn.value);
  const invalidUserNames: Ref<string[]> = ref(getInvalidUserNames.value);
  const invalidPasswords: Ref<string[]> = ref(getInvalidPasswords.value);
  //#endregion

  //#region Form Logic
  const form: Ref<VForm | null> = ref(null);
  const formValid: Ref<boolean> = ref(true);
  const isSmallViewPort: Ref<boolean> = ref(true);
  const getFormStatus: ComputedRef<boolean> = computed(() => {
    return props.formStatus;
  });
  const resetFormStatus: ComputedRef<boolean> = computed(() => {
    return !props.formStatus;
  });
  //#endregion

  //#region Action Handlers
  const submitHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(async () => {
      if (getFormStatus.value && userName.value !== null && password.value !== null) {
        const data = new LoginRequestData(userName.value, password.value, stayLoggedIn.value);
        await globalStore.loginAsync(data);
        const failedToast = await displayFailedToastAsync(updateInvalidValues, {
          invalidUserNames: toRaw(invalidUserNames.value),
          invalidPasswords: toRaw(invalidPasswords.value),
          userName: toRaw(userName.value),
          password: toRaw(password.value),
        });
        if (failedToast.failed) {
          loginFailed.value = true;
          updateLoginFailed(toRaw(loginFailed.value));
          invalidUserNames.value = failedToast.methodResult.invalidUserNames;
          invalidPasswords.value = failedToast.methodResult.invalidPasswords;
          updateUserName(toRaw(userName.value));
          updatePassword(toRaw(password.value));
          updateInvalidUserNames(toRaw(invalidUserNames.value));
          updateInvalidPasswords(toRaw(invalidPasswords.value));
          form.value?.validate();
        } else {
          loginFormStore.initializeStore();
        }
      } else {
        toast('Login form is invalid', {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
        });
      }
    });
  };
  const helpHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      emit('obtain-login-assistance', null, null);
    });
  };
  const confirmResetHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Reset Form',
      'Are you sure you want to reset this form?',
      DialogType.CONFIRM,
      resetHandlerAsync,
    );
  };
  const resetHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      userName.value = getUserName.value;
      password.value = getPassword.value;
      stayLoggedIn.value = true;
      loginFailed.value = getLoginFailed.value;
      invalidUserNames.value = getInvalidUserNames.value;
      invalidPasswords.value = getInvalidEmails.value;
      form.value?.reset();
      dialogStore.initializeStore();
      serviceFailStore.initializeStore();
      loginFormStore.initializeStore();
    });
  };
  const cancelHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      loginFormStore.initializeStore();
      emit('cancel-login', null, null);
    });
  };
  const confirmRedirectSignUpHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Redirect to Sign Up',
      'Are you sure you want to redirect to Sign Up?',
      DialogType.CONFIRM,
      redirectToSignUpAsync,
    );
  };
  const redirectToSignUpAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      loginFormStore.initializeStore();
      signUpFormStore.updateUserName(toRaw(userName.value));
      updateRedirectToSignUp(true);
    });
  };
  const updateInvalidValues = (message: string, options: any): any => {
    if (
      message === 'Status Code 404: No user is using this user name' &&
      !options.invalidUserNames.includes(options.userName)
    ) {
      options.invalidUserNames.push(options.userName);
    }
    if (
      message === 'Status Code 404: Password is incorrect' &&
      !options.invalidPasswords.includes(options.password)
    ) {
      options.invalidPasswords.push(options.password);
    }
    return {
      invalidUserNames: options.invalidUserNames,
      invalidPasswords: options.invalidPasswords,
    };
  };
  //#endregion

  //#region Lifecycle Hooks
  onMounted(async () => {
    if (isChrome.value) {
      repairAutoComplete();
    }
    const confirmedUserName = getConfirmedUserName.value;
    if (confirmedUserName !== '') {
      userName.value = confirmedUserName;
      updateConfirmedUserName('');
    }
    resetViewPort(isSmallViewPort);
    let resizeTimeout: number | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(
          () => {
            resetViewPort(isSmallViewPort);
          },
          250,
          'Resized',
        );
      },
      { once: true },
    );
    if (getDirty.value) {
      form.value?.validate();
    }
    if (getFormStatus.value) {
      window.addEventListener(
        'keyup',
        async (event) => {
          if (event.key === 'Enter' && getFormStatus.value) {
            await submitHandlerAsync();
          }
        },
        { once: true },
      );
    }
  });
  onUpdated(() => {
    if (isChrome.value) {
      repairAutoComplete();
    }
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      resetViewPort(isSmallViewPort);
    });
    window.removeEventListener('keyup', () => {});
  });
  //#endregion
</script>
