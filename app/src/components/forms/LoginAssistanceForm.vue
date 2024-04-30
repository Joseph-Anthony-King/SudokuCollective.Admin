<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login Assistance Form</span>
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
                :disabled="email !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="email"
                    label="Please enter your email to confirm your user name"
                    prepend-icon="mdi-email"
                    required
                    :rules="emailRules(invalidEmails, 'No user is using this email')"
                    autocomplete="off"
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>{{ RulesMessages.emailInvalidMessage }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col
            cols="12"
            sm="3"
            md="3"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="resetPasswordHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props">
                  Reset Password
                </v-btn>
              </template>
              <span
                >Send a link to your email to reset your password if your email has been
                confirmed</span
              >
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
            lg="3"
            xl="3"
            xxl="3">
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
                  Confirm User Name
                </v-btn>
              </template>
              <span>Obtain your user name if your email has been confirmed</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="
                ((email === '' || email === null) && invalidEmails.length === 0) || isSmallViewPort
              ">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="confirmFormResetHandler($event)"
                  :disabled="(email === '' || email === null) && invalidEmails.length === 0"
                  v-bind="props">
                  Reset
                </v-btn>
              </template>
              <span>Reset this form</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="3"
            md="3"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  variant="text"
                  @click="goBackHandlerAsync"
                  v-bind="props">
                  Go Back
                </v-btn>
              </template>
              <span>Go back to the login form</span>
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
    onUpdated,
    onUnmounted,
    watch,
    toRaw,
  } from 'vue';
  import { VForm } from 'vuetify/components';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useGlobalStore } from '@/stores/globalStore';
  import { useLoginFormStore } from '@/stores/formStores/loginFormStore';
  import { useServiceFailStore } from '@/stores/serviceFailStore';
  import { useUserStore } from '@/stores/userStore';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
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
  const emit = defineEmits(['return-to-login']);

  const {
    isChrome,
    displayFailedToastAsync,
    resetViewPort,
    repairAutoComplete,
    updateAppProcessingAsync,
  } = commonUtilities();

  //#region Destructure Stores
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  //#region GlobalStore
  const globalStore = useGlobalStore();
  const { confirmUserNameAsync } = globalStore;
  //#endregion
  //#region LoginFormStore
  const loginFormStore = useLoginFormStore();
  const { getEmail, getEmailDirty, getInvalidEmails } = storeToRefs(loginFormStore);
  const { updateEmail, updateInvalidEmails } = loginFormStore;
  //#endregion
  const serviceFailStore = useServiceFailStore();
  //#region UserStore
  const userStore = useUserStore();
  const { getConfirmedUserName } = storeToRefs(userStore);
  const { requestPasswordResetAsync } = userStore;
  //#endregion
  //#endregion

  //#region Properties
  const email: Ref<string | null> = ref(getEmail.value);
  const invalidEmails: Ref<string[]> = ref(getInvalidEmails.value);
  //#endregion

  //#region Form logic
  const { emailRules } = rules();
  const form: Ref<VForm | null> = ref(null);
  const formValid: Ref<boolean> = ref(true);
  const isSmallViewPort: Ref<boolean> = ref(true);
  const getFormStatus: ComputedRef<boolean> = computed(() => {
    return props.formStatus;
  });
  // the following line is used by vuetify to reset the form
  const resetFormStatus: ComputedRef<boolean> = computed(() => {
    return !props.formStatus;
  });
  //#endregion

  //#region Action Handlers
  const submitHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(async () => {
      if (getFormStatus.value && email.value !== null) {
        await confirmUserNameAsync(toRaw(email.value));
        const failedToast = await displayFailedToastAsync(updateInvalidValues, {
          invalidEmails: toRaw(invalidEmails.value),
          email: toRaw(email.value),
        });
        if (failedToast.failed) {
          form.value?.validate();
          invalidEmails.value = failedToast.methodResult.invalidEmails;
          updateEmail(toRaw(email.value));
          updateInvalidEmails(toRaw(invalidEmails.value));
        }
      }
    });
  };
  const resetPasswordHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(async () => {
      if (getFormStatus.value && email.value !== null) {
        await requestPasswordResetAsync(toRaw(email.value));
        const failedToast = await displayFailedToastAsync(undefined, undefined);
        if (failedToast.failed) {
          form.value?.validate();
        }
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
      if (getFormStatus.value) {
        email.value = '';
        invalidEmails.value = [];
        form.value?.reset();
        serviceFailStore.initializeStore();
        loginFormStore.initializeAssistance();
      }
    });
  };
  const goBackHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(() => {
      emit('return-to-login', null, null);
    });
  };
  const updateInvalidValues = (message: string, options: any): any => {
    if (
      message === 'Status Code 404: No user is using this email' &&
      !options.invalidEmails.includes(options.email)
    ) {
      options.invalidEmails.push(options.email);
    }
    return { invalidEmails: options.invalidEmails };
  };
  //#endregion

  //#region Watches
  watch(
    () => getConfirmedUserName.value,
    (newValue, oldValue) => {
      if (newValue !== '') {
        emit('return-to-login', null, null);
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onMounted(() => {
    if (isChrome.value) {
      repairAutoComplete();
    }
    if (getEmailDirty.value) {
      form.value?.validate();
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
  });
  //#endregion
</script>
