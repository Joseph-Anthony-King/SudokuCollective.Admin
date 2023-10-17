<template>
  <v-card>
    <v-card-title class='justify-center text-center'>
      <span class='headline'>Login Assistance Form</span>
    </v-card-title>
    <v-form v-model='formValid' ref='form'  @submit.prevent='submitHandler'>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols='12'>
              <v-text-field
                v-model='email'
                label='Please enter your email to confirm your user name'
                prepend-icon='mdi-email'
                required
                :rules='emailRules(invalidEmails, "No user is using this email")'
                autocomplete='off'
                color="primary"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class='text-center'>
        <v-row dense>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='resetPasswordHandlder'
                  :disabled='!formValid'
                  v-bind='props'
                >
                  Reset Password
                </v-btn>
              </template>
              <span
                >Send a link to your email to reset your password if your email
                has been confirmed</span
              >
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click.prevent='submitHandler'
                  :disabled='!formValid'
                  v-bind='props'
                >
                  Confirm User Name
                </v-btn>
              </template>
              <span>Obtain your user name if your email has been confirmed</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='confirmFormReset = true'
                  :disabled='(email === "" || email === null) && invalidEmails.length === 0'
                  v-bind='props'
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset this form</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='goBackHandler'
                  v-bind='props'
                >
                  Go Back
                </v-btn>
              </template>
              <span>Go back to the login form</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-dialog 
    v-model='confirmFormReset' 
    persistent max-width='600' 
    hide-overlay 
    transition='dialog-top-transition'>
    <ConfirmDialog 
      title='Reset Form' 
      message='Are you sure you want to reset this form?' 
      v-on:action-confirmed='resetHandler'
      v-on:action-not-confirmed='confirmFormReset = false' />
  </v-dialog>
</template>

<script setup lang='ts'>
import { 
  ref,
  Ref,
  computed,
  ComputedRef,
  onMounted, 
  onUpdated, 
  watch, 
  toRaw
} from 'vue';
import { VForm } from 'vuetify/components';
import { useAppStore } from '@/store/appStore/index';
import { useLoginFormStore } from '@/store/loginFormStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import { useUserStore } from '@/store/userStore/index';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import commonUtilities from '@/utilities/common';
import rules from '@/utilities/rules/index';
import { LoginAssistanceRequestData } from '@/models/requests/loginAssistanceRequestData';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['return-to-login']);

// Initialize stores
const appStore = useAppStore();
const loginFormStore = useLoginFormStore();
const serviceFailStore = useServiceFailStore();
const userStore = useUserStore();

const { 
  isChrome, 
  displayFailedToast, 
  repairAutoComplete } = commonUtilities();

const confirmFormReset: Ref<boolean> = ref(false);
const email: Ref<string | null> = ref(loginFormStore.getEmail);
const invalidEmails: Ref<string[]> = ref(loginFormStore.getInvalidEmails);

// Form logic
const { emailRules } = rules();
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(true);

const getFormStatus: ComputedRef<boolean> = computed(() => {
  return props.formStatus;
});

// the following line is used by vuetify to reset the form
// eslint-disable-next-line
const resetFormStatus: ComputedRef<boolean> = computed(() => {
  return !props.formStatus;
});

// Form actions
const submitHandler = async (): Promise<void> => {
  if (getFormStatus.value && email.value !== null) {
    appStore.updateProcessingStatus(true);
    const data = new LoginAssistanceRequestData(email.value);
    await appStore.confirmUserNameAsync(data);
    appStore.updateProcessingStatus(false);
    const failedToast = displayFailedToast(
      updateInvalidValues, 
      { 
        invalidEmails: toRaw(invalidEmails.value), 
        email: email.value });
    if (failedToast.failed) {
      form.value?.validate();
      invalidEmails.value = failedToast.methodResult.invalidEmails;
      loginFormStore.updateEmail(toRaw(email.value));
      loginFormStore.updateInvalidEmails(toRaw(invalidEmails.value));
    }
  }
};

const resetPasswordHandlder = async (): Promise<void> => {
  if (getFormStatus.value && email.value !== null) {
    appStore.updateProcessingStatus(true);
    const data = new LoginAssistanceRequestData(email.value);
    await appStore.requestPasswordResetAsync(data);
    appStore.updateProcessingStatus(false);
    const failedToast = displayFailedToast(undefined, undefined);
    if (failedToast.failed) {
      form.value?.validate();
    }
  }
};

const resetHandler = (): void => {
  if (getFormStatus.value) {
    email.value = '';
    invalidEmails.value = [];
    form.value?.reset();
    confirmFormReset.value = false;
    serviceFailStore.initializeStore();
    loginFormStore.initializeAssistance();
  }
};

const goBackHandler = (): void => {
  emit('return-to-login', null, null);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateInvalidValues = (message: string, options: any): any => {
  if (
    message === 'Status Code 404: No user is using this email' &&
    !options.invalidEmails.includes(options.email)
  ) {
    options.invalidEmails.push(options.email);
  }
  return { invalidEmails: options.invalidEmails }
};

watch(
  () => userStore.getConfirmedUserName,
  () => {
    const confirmedUserName = userStore.getConfirmedUserName;
    if (confirmedUserName !== '') {
      emit('return-to-login', null, null);
    }
  }
);

// lifecycle hooks
onMounted(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
  if (loginFormStore.getEmailDirty) {
    form.value?.validate();
  }
});
onUpdated(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
});
</script>
