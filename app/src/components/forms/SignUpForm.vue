<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Sign Up</span>
    </v-card-title>
    <v-form v-model="formValid" ref="form" onsubmit="event.preventDefault();">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="userName"
                    label="User Name"
                    prepend-icon="mdi-account-plus"
                    :rules="userNameRules(invalidUserNames, 'User name not unique')"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.userNameRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="firstName"
                    label="First Name"
                    prepend-icon="mdi-account-plus"
                    :rules="requiredRules('First Name')"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ firstNameTooltip }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="lastName"
                    label="Last Name"
                    prepend-icon="mdi-account-plus"
                    :rules="requiredRules('Last Name')"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ lastNameTooltip }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="nickName"
                label="Nickname (Not Required)"
                prepend-icon="mdi-account-plus"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="email"
                    label="Email"
                    prepend-icon="mdi-email"
                    :rules="emailRules(invalidEmails, 'Email not unique')"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.emailInvalidMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
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
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip open-delay="5000" location="bottom">
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
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordMatchMesssage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-checkbox
                    v-model="stayLoggedIn"
                    label="Stay Logged in for 30 Days"
                    color="primary"
                    v-bind="props"
                  ></v-checkbox>
                </template>
                <span
                  >If set to false this will clear your authorization token when
                  you navigate away from the app</span
                >
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col cols="4">
            <v-tooltip open-delay="5000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="confirmFormReset = true"
                  v-bind="props"
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset the sign up form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip open-delay="5000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="cancelHandlerAsync($event)"
                  v-bind="props"
                >
                  Cancel
                </v-btn>
              </template>
              <span>Cancel the sign up process</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip open-delay="5000" location="bottom" :disabled="!formValid">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="submitHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props"
                >
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
import {
  Ref,
  ref,
  ComputedRef,
  computed,
  onMounted,
  onUnmounted,
  toRaw,
} from "vue";
import { VForm } from "vuetify/components";
import { toast } from "vue3-toastify";
import { useAppStore } from "@/store/appStore";
import { useServiceFailStore } from "@/store/serviceFailStore";
import { useSignUpFormStore } from "@/store/forms/signUpFormStore";
import { useUserStore } from "@/store/userStore";
import AvailableActions from "@/components/buttons/AvailableActions.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { SignupRequestData } from "@/models/requests/signupRequestData";
import rules from "@/utilities/rules/index";
import { RulesMessages } from "@/utilities/rules/rulesMessages";
import commonUtilities from "@/utilities/common";

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["cancel-signup"]);

// Instantiate the stores
const appStore = useAppStore();
const serviceFailStore = useServiceFailStore();
const signUpFormStore = useSignUpFormStore();
const userStore = useUserStore();

const {
  isChrome,
  displayFailedToastAsync,
  repairAutoComplete,
  resetViewPort,
  updateAppProcessingAsync,
} = commonUtilities();
const {
  confirmPasswordRules,
  emailRules,
  requiredRules,
  passwordRules,
  userNameRules,
} = rules();

const userName: Ref<string | null> = ref(signUpFormStore.getUserName);
const firstName: Ref<string | null> = ref(signUpFormStore.getFirstName);
const lastName: Ref<string | null> = ref(signUpFormStore.getLastName);
const nickName: Ref<string | null> = ref(signUpFormStore.getNickName);
const email: Ref<string | null> = ref(signUpFormStore.getEmail);
const password: Ref<string | null> = ref(signUpFormStore.getPassword);
const confirmPassword: Ref<string | null> = ref(
  signUpFormStore.getConfirmPassword
);
const showPassword: Ref<boolean> = ref(false);
const stayLoggedIn: Ref<boolean> = ref(appStore.getStayedLoggedIn);
const confirmFormReset: Ref<boolean> = ref(false);
const invalidUserNames: Ref<string[]> = ref(
  signUpFormStore.getInvalidUserNames
);
const invalidEmails: Ref<string[]> = ref(signUpFormStore.getInvalidEmails);
const firstNameTooltip: ComputedRef<string> = computed(() =>
  RulesMessages.requiredMessage.replace("{{value}}", "First Name")
);
const lastNameTooltip: ComputedRef<string> = computed(() =>
  RulesMessages.requiredMessage.replace("{{value}}", "Last Name")
);

// Form logic
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(true);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref("auto");
const getFormStatus: ComputedRef<boolean> = computed(() => {
  return props.formStatus;
});
// eslint-disable-next-line
const resetFormStatus: ComputedRef<boolean> = computed(() => {
  return !props.formStatus;
});

// Form actions
const submitHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    if (getFormStatus.value) {
      signUpFormStore.updateUserName(toRaw(userName.value));
      signUpFormStore.updateFirstName(toRaw(firstName.value));
      signUpFormStore.updateLastName(toRaw(lastName.value));
      signUpFormStore.updateNickName(toRaw(nickName.value));
      signUpFormStore.updateEmail(toRaw(email.value));
      signUpFormStore.updatePassword(toRaw(password.value));
      signUpFormStore.updateConfirmPassword(toRaw(confirmPassword.value));

      const data = new SignupRequestData(
        userName.value ? userName.value : "",
        firstName.value ? firstName.value : "",
        lastName.value ? lastName.value : "",
        nickName.value ? nickName.value : "",
        email.value ? email.value : "",
        password.value ? password.value : "",
        stayLoggedIn.value
      );
      await userStore.signupUserAsync(data);
      const failedToast = await displayFailedToastAsync(updateInvalidValues, {
        invalidUserNames: toRaw(invalidUserNames.value),
        invalidEmails: toRaw(invalidEmails.value),
        userName: toRaw(userName.value),
        email: toRaw(email.value),
      });
      if (failedToast.failed) {
        form.value?.validate();
        invalidUserNames.value = failedToast.methodResult.invalidUserNames;
        signUpFormStore.updateInvalidUserNames(
          failedToast.methodResult.invalidUserNames
        );
        invalidEmails.value = failedToast.methodResult.invalidEmails;
        signUpFormStore.updateInvalidEmails(
          failedToast.methodResult.invalidEmails
        );
      } else {
        signUpFormStore.initializeStore();
      }
    } else {
      toast("Sign up form is invalid", {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
    }
  });
};
const resetHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    serviceFailStore.initializeStore();
    signUpFormStore.initializeStore();
    userName.value = signUpFormStore.getUserName;
    firstName.value = signUpFormStore.getFirstName;
    lastName.value = signUpFormStore.getLastName;
    nickName.value = signUpFormStore.getNickName;
    email.value = signUpFormStore.getEmail;
    password.value = signUpFormStore.getPassword;
    confirmPassword.value = signUpFormStore.getConfirmPassword;
    stayLoggedIn.value = true;
    invalidUserNames.value = [];
    invalidEmails.value = [];
    form.value?.reset();
    confirmFormReset.value = false;
  });
};
const cancelHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    signUpFormStore.initializeStore();
    emit("cancel-signup", null, null);
  });
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateInvalidValues = (message: string, options: any): any => {
  if (
    message === "Status Code 404: User name not unique" &&
    !options.invalidUserNames.includes(options.userName as string)
  ) {
    options.invalidUserNames.push(options.userName as string);
  }
  if (
    message === "Status Code 404: Email not unique" &&
    !options.invalidEmails.includes(options.email as string)
  ) {
    options.invalidEmails.push(options.email as string);
  }
  return {
    invalidUserNames: options.invalidUserNames,
    invalidEmails: options.invalidEmails,
  };
};
// Lifecycle hooks
onMounted(async () => {
  if (isChrome.value) {
    repairAutoComplete();
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
  if (signUpFormStore.getDirty) {
    form.value?.validate();
  }
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    resetViewPort(isSmallViewPort, maxDialogWidth);
  });
});
</script>
