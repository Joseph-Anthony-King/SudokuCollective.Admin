<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login Assistance Form</span>
    </v-card-title>
    <v-form v-model="formValid" ref="form" onsubmit="event.preventDefault();">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-tooltip open-delay="2000" location="bottom" :disabled="email !== null || isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="email"
                    label="Please enter your email to confirm your user name"
                    prepend-icon="mdi-email"
                    required
                    :rules="emailRules(invalidEmails, 'No user is using this email')"
                    autocomplete="off"
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.emailInvalidMessage }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3" xxl="3">
            <v-tooltip open-delay="2000" location="bottom" :disabled="!formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="resetPasswordHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props"
                >
                  Reset Password
                </v-btn>
              </template>
              <span>Send a link to your email to reset your password if your email has been confirmed</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3" xxl="3">
            <v-tooltip open-delay="2000" location="bottom" :disabled="!formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="submitHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props"
                >
                  Confirm User Name
                </v-btn>
              </template>
              <span>Obtain your user name if your email has been confirmed</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3" xxl="3">
            <v-tooltip open-delay="2000" location="bottom" :disabled="(email === '' || email === null) && invalidEmails.length === 0 || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="confirmFormReset = true"
                  :disabled="(email === '' || email === null) && invalidEmails.length === 0"
                  v-bind="props"
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset this form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="3" md="3" lg="3" xl="3" xxl="3">
            <v-tooltip open-delay="2000" location="bottom" :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="goBackHandlerAsync"
                  v-bind="props"
                >
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
  <v-dialog
    v-model="confirmFormReset"
    persistent
    :fullscreen="isSmallViewPort"
    :max-width="maxDialogWidth"
    hide-overlay
    transition="dialog-top-transition"
  >
    <ConfirmDialog
      title="Reset Form"
      message="Are you sure you want to reset this form?"
      v-on:action-confirmed="resetHandlerAsync"
      v-on:action-not-confirmed="confirmFormReset = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-explicit-any*/
import {
  Ref,
  ref,
  ComputedRef,
  computed,
  onMounted,
  onUpdated,
  onUnmounted,
  watch,
  toRaw,
} from "vue";
import { VForm } from "vuetify/components";
import { useGlobalStore } from "@/stores/globalStore";
import { useLoginFormStore } from "@/stores/formStores/loginFormStore";
import { useServiceFailStore } from "@/stores/serviceFailStore";
import { useUserStore } from "@/stores/userStore";
import AvailableActions from "@/components/buttons/AvailableActions.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import commonUtilities from "@/utilities/common";
import rules from "@/utilities/rules/index";
import { RulesMessages } from '@/utilities/rules/rulesMessages';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["return-to-login"]);

const {
  isChrome,
  displayFailedToastAsync,
  resetViewPort,
  repairAutoComplete,
  updateAppProcessingAsync,
} = commonUtilities();

//#region Instantiate the Stores
const globalStore = useGlobalStore();
const loginFormStore = useLoginFormStore();
const serviceFailStore = useServiceFailStore();
const userStore = useUserStore();
//#endregion

//#region Properties
const confirmFormReset: Ref<boolean> = ref(false);
const email: Ref<string | null> = ref(loginFormStore.getEmail);
const invalidEmails: Ref<string[]> = ref(loginFormStore.getInvalidEmails);
//#endregion

//#region Form logic
const { emailRules } = rules();
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(true);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref("auto");
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
      await globalStore.confirmUserNameAsync(toRaw(email.value));
      const failedToast = await displayFailedToastAsync(updateInvalidValues, {
        invalidEmails: toRaw(invalidEmails.value),
        email: toRaw(email.value),
      });
      if (failedToast.failed) {
        form.value?.validate();
        invalidEmails.value = failedToast.methodResult.invalidEmails;
        loginFormStore.updateEmail(toRaw(email.value));
        loginFormStore.updateInvalidEmails(toRaw(invalidEmails.value));
      }
    }
  });
};
const resetPasswordHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    if (getFormStatus.value && email.value !== null) {
      await userStore.requestPasswordResetAsync(toRaw(email.value));
      const failedToast = await displayFailedToastAsync(undefined, undefined);
      if (failedToast.failed) {
        form.value?.validate();
      }
    }
  });
};
const resetHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    if (getFormStatus.value) {
      email.value = "";
      invalidEmails.value = [];
      form.value?.reset();
      confirmFormReset.value = false;
      serviceFailStore.initializeStore();
      loginFormStore.initializeAssistance();
    }
  });
};
const goBackHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    emit("return-to-login", null, null);
  });
};
const updateInvalidValues = (message: string, options: any): any => {
  if (
    message === "Status Code 404: No user is using this email" &&
    !options.invalidEmails.includes(options.email)
  ) {
    options.invalidEmails.push(options.email);
  }
  return { invalidEmails: options.invalidEmails };
};
//#endregion

//#region Watches
watch(
  () => userStore.getConfirmedUserName,
  () => {
    const confirmedUserName = userStore.getConfirmedUserName;
    if (confirmedUserName !== "") {
      emit("return-to-login", null, null);
    }
  }
);
//#endregion

//#region Lifecycle Hooks
onMounted(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
  if (loginFormStore.getEmailDirty) {
    form.value?.validate();
  }
  resetViewPort(isSmallViewPort, maxDialogWidth);
  let resizeTimeout: number | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(
      () => {
        resetViewPort(isSmallViewPort, maxDialogWidth);
      },
      250,
      "Resized"
    );
  });
});
onUpdated(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    resetViewPort(isSmallViewPort, maxDialogWidth);
  });
});
//#endregion
</script>
@/stores/formStores/loginFormStore@/stores/globalStore@/stores/serviceFailStore@/stores/userStore