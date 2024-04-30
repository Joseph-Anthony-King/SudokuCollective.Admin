<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Sign Up</span>
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
                    v-model="userName"
                    label="User Name"
                    prepend-icon="mdi-account-plus"
                    :rules="
                      !isRedirect ? userNameRules(invalidUserNames, 'User name not unique') : []
                    "
                    :required="!isRedirect ? true : false"
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ RulesMessages.userNameRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="firstName !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    prepend-icon="mdi-account-plus"
                    :rules="requiredRules('First Name')"
                    required
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ firstNameTooltip }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="lastName !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    prepend-icon="mdi-account-plus"
                    :rules="requiredRules('Last Name')"
                    required
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ lastNameTooltip }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="nickName"
                label="Nickname (Not Required)"
                prepend-icon="mdi-account-plus"
                color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="email !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="emailRules(invalidEmails, 'Email not unique')"
                    required
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ RulesMessages.emailInvalidMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="password !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-account-key"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="new-password"
                    :rules="passwordRules()"
                    required
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="confirmPassword !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-account-key"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="new-password"
                    :rules="confirmPasswordRules(password)"
                    required
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordMatchMesssage }}</span>
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
          <v-col cols="4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="confirmFormResetHandler($event)"
                  v-bind="props">
                  Reset
                </v-btn>
              </template>
              <span>Reset the sign up form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="cancelHandlerAsync($event)"
                  v-bind="props">
                  Cancel
                </v-btn>
              </template>
              <span>Cancel the sign up process</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="submitHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props">
                  Submit
                </v-btn>
              </template>
              <span>Sign up with SudokuCollective.com</span>
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
    onMounted,
    onUnmounted,
    toRaw,
    watch,
  } from 'vue';
  import { VForm, VTextField } from 'vuetify/components';
  import { toast } from 'vue3-toastify';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useGlobalStore } from '@/stores/globalStore';
  import { useServiceFailStore } from '@/stores/serviceFailStore';
  import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
  import { useUserStore } from '@/stores/userStore';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import { SignupRequestData } from '@/models/requests/signupRequestData';
  import { DialogType } from '@/enums/dialogType';
  import commonUtilities from '@/utilities/common';
  import rules from '@/utilities/rules/index';
  import { RulesMessages } from '@/utilities/rules/rulesMessages';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    formStatus: {
      type: Boolean,
      default: false,
    },
    isRedirect: {
      type: Boolean,
      default: false,
    },
  });
  const emit = defineEmits(['cancel-signup', 'reset-redirect']);

  const {
    isChrome,
    displayFailedToastAsync,
    repairAutoComplete,
    resetViewPort,
    updateAppProcessingAsync,
  } = commonUtilities();
  const { confirmPasswordRules, emailRules, requiredRules, passwordRules, userNameRules } = rules();

  //#region Destructure Stores
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  //#region GlobalStore
  const globalStore = useGlobalStore();
  const { getStayedLoggedIn } = storeToRefs(globalStore);
  //#endregion
  const serviceFailStore = useServiceFailStore();
  //#region SignUpFormStore
  const signUpFormStore = useSignUpFormStore();
  const {
    getDirty,
    getUserName,
    getFirstName,
    getLastName,
    getNickName,
    getEmail,
    getPassword,
    getConfirmPassword,
    getInvalidUserNames,
    getInvalidEmails,
  } = storeToRefs(signUpFormStore);
  const {
    updateUserName,
    updateFirstName,
    updateLastName,
    updateNickName,
    updateEmail,
    updatePassword,
    updateConfirmPassword,
    updateInvalidUserNames,
    updateInvalidEmails,
  } = signUpFormStore;
  //#endregion
  //#region UserStore
  const userStore = useUserStore();
  const { signupUserAsync } = userStore;
  //#endregion
  //#endregion

  //#region Properties
  const userName: Ref<string | null> = ref(getUserName.value);
  const firstName: Ref<string | null> = ref(getFirstName.value);
  const lastName: Ref<string | null> = ref(getLastName.value);
  const nickName: Ref<string | null> = ref(getNickName.value);
  const email: Ref<string | null> = ref(getEmail.value);
  const password: Ref<string | null> = ref(getPassword.value);
  const confirmPassword: Ref<string | null> = ref(getConfirmPassword.value);
  const showPassword: Ref<boolean> = ref(false);
  const stayLoggedIn: Ref<boolean> = ref(getStayedLoggedIn.value);
  const invalidUserNames: Ref<string[]> = ref(getInvalidUserNames.value);
  const invalidEmails: Ref<string[]> = ref(getInvalidEmails.value);
  const firstNameTooltip: ComputedRef<string> = computed(() =>
    RulesMessages.requiredMessage.replace('{{value}}', 'First Name'),
  );
  const lastNameTooltip: ComputedRef<string> = computed(() =>
    RulesMessages.requiredMessage.replace('{{value}}', 'Last Name'),
  );
  //#endregion

  //#region Form Logic
  const form: Ref<VForm | null> = ref(null);
  const formValid: Ref<boolean> = ref(true);
  const userNameTextField: Ref<VTextField | null> = ref(null);
  const isSmallViewPort: Ref<boolean> = ref(true);
  const maxDialogWidth: Ref<string> = ref('auto');
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
      if (getFormStatus.value) {
        updateUserName(toRaw(userName.value));
        updateFirstName(toRaw(firstName.value));
        updateLastName(toRaw(lastName.value));
        updateNickName(toRaw(nickName.value));
        updateEmail(toRaw(email.value));
        updatePassword(toRaw(password.value));
        updateConfirmPassword(toRaw(confirmPassword.value));

        const data = new SignupRequestData(
          userName.value ? userName.value : '',
          firstName.value ? firstName.value : '',
          lastName.value ? lastName.value : '',
          nickName.value ? nickName.value : '',
          email.value ? email.value : '',
          password.value ? password.value : '',
          stayLoggedIn.value,
        );
        await signupUserAsync(data);
        const failedToast = await displayFailedToastAsync(updateInvalidValues, {
          invalidUserNames: toRaw(invalidUserNames.value),
          invalidEmails: toRaw(invalidEmails.value),
          userName: toRaw(userName.value),
          email: toRaw(email.value),
        });
        if (failedToast.failed) {
          form.value?.validate();
          invalidUserNames.value = failedToast.methodResult.invalidUserNames;
          updateInvalidUserNames(failedToast.methodResult.invalidUserNames);
          invalidEmails.value = failedToast.methodResult.invalidEmails;
          updateInvalidEmails(failedToast.methodResult.invalidEmails);
        } else {
          signUpFormStore.initializeStore();
        }
      } else {
        toast('Sign up form is invalid', {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.ERROR,
        });
      }
    });
  };
  const confirmFormResetHandler = (event: Event | null = null): void => {
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
      serviceFailStore.initializeStore();
      signUpFormStore.initializeStore();
      userName.value = getUserName.value;
      firstName.value = getFirstName.value;
      lastName.value = getLastName.value;
      nickName.value = getNickName.value;
      email.value = getEmail.value;
      password.value = getPassword.value;
      confirmPassword.value = getConfirmPassword.value;
      stayLoggedIn.value = true;
      invalidUserNames.value = [];
      invalidEmails.value = [];
      form.value?.reset();
    });
  };
  const cancelHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      signUpFormStore.initializeStore();
      emit('cancel-signup', null, null);
    });
  };
  const updateInvalidValues = (message: string, options: any): any => {
    if (
      message === 'Status Code 404: User name not unique' &&
      !options.invalidUserNames.includes(options.userName as string)
    ) {
      options.invalidUserNames.push(options.userName as string);
    }
    if (
      message === 'Status Code 404: Email not unique' &&
      !options.invalidEmails.includes(options.email as string)
    ) {
      options.invalidEmails.push(options.email as string);
    }
    return {
      invalidUserNames: options.invalidUserNames,
      invalidEmails: options.invalidEmails,
    };
  };
  //#endregion

  //#region Watches
  watch(
    () => userName.value,
    (newValue, oldValue) => {
      emit('reset-redirect', null, null);
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onMounted(async () => {
    if (isChrome.value) {
      repairAutoComplete();
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
    if (getDirty.value && !props.isRedirect) {
      form.value?.validate();
    } else if (userName.value !== null) {
      userNameTextField.value?.validate();
    }
    if (getFormStatus.value) {
      document.addEventListener('keyup', async (event) => {
        if (event.key === 'Enter' && getFormStatus.value) {
          await submitHandlerAsync();
        }
      });
    }
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      resetViewPort(isSmallViewPort);
    });
    document.removeEventListener('keyup', () => {});
  });
  //#endregion
</script>
