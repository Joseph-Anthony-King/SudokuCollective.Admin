<template>
  <v-card>
    <v-card-title class='justify-center text-center'>
      <span class='headline'>Login</span>
    </v-card-title>
    <v-form v-model='formValid' ref='form'>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols='12'>
              <v-text-field
                label='User Name'
                v-model='userName'
                prepend-icon='mdi-account-circle'
                :rules='userNameRules(invalidUserNames, "No user is using this user name")'
                autocomplete='off'
                color="primary"
              >
              </v-text-field>
            </v-col>
            <v-col cols='12'>
              <v-text-field
                label='Password'
                v-model='password'
                :type="showPassword ? 'text' : 'password'"
                :rules='passwordRules(invalidPasswords)'
                prepend-icon='mdi-lock'
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append='showPassword = !showPassword'
                autocomplete='off'
                color="primary"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <available-actions>
        <v-row dense>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='helpHandler'
                  v-bind='props'
                >
                  Help
                </v-btn>
              </template>
              <span>Get assistance to verify your user name or change password</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='confirmFormReset = true'
                  v-bind='props'
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset the login form</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='cancelHandler'
                  v-bind='props'
                >
                  Cancel
                </v-btn>
              </template>
              <span>Cancel the login process</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='submitHandler'
                  :disabled='!formValid'
                  v-bind='props'
                >
                  Submit
                </v-btn>
              </template>
              <span>Login to the app</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </available-actions>
    </v-form>
  </v-card>
  <v-dialog 
    v-model='confirmFormReset' 
    persistent 
    :fullscreen='isSmallViewPort'
    :max-width='maxDialogWidth'
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
  toRaw,
  onMounted,
  onUpdated,
  onUnmounted
} from 'vue';
import { VForm } from 'vuetify/components';
import { useAppStore } from '@/store/appStore/index';
import { useUserStore } from '@/store/userStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { LoginRequestData } from '@/models/requests/loginRequestData';
import commonUtilities from '@/utilities/common';
import rules from '@/utilities/rules/index';
  
const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['obtain-login-assistance', 'cancel-login']);

// Initialize stores
const appStore = useAppStore();
const serviceFailStore = useServiceFailStore();
const userStore = useUserStore();

const { passwordRules, userNameRules } = rules();
const { 
  isChrome, 
  displayFailedToast,
  repairAutoComplete,
  resetViewPort } = commonUtilities();

const userName: Ref<string> = ref('');
const password: Ref<string> = ref('');
const showPassword: Ref<boolean> = ref(false);
const confirmFormReset: Ref<boolean> = ref(false);
const invalidUserNames: Ref<string[]> = ref([]);
const invalidPasswords: Ref<string[]> = ref([]);

// Form logic
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(true);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref('auto');

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
  if (getFormStatus.value) {
    appStore.updateProcessingStatus(true);
    const data = new LoginRequestData(userName.value, password.value);
    await appStore.loginAsync(data);
    appStore.updateProcessingStatus(false);
    displayFailedToast(updateInvalidValues, form);
  }
};

const helpHandler = (): void => {
  emit('obtain-login-assistance', null, null);
};

const resetHandler = (): void => {
  userName.value = '';
  password.value = '';
  invalidUserNames.value = [];
  invalidPasswords.value = [];
  form.value?.reset();
  confirmFormReset.value = false;
  serviceFailStore.initializeStore();
};

const cancelHandler = (): void => {
  emit('cancel-login', null, null);
};

const updateInvalidValues = (message: string) => {
  if (
    message === 'Status Code 404: No user has this user name' &&
    !invalidUserNames.value.includes(userName.value)
  ) {
    invalidUserNames.value.push(userName.value);
  }
  if (
    message === 'Status Code 404: Password is incorrect' &&
    !invalidPasswords.value.includes(password.value)
  ) {
    invalidPasswords.value.push(password.value);
  }
};

// Lifecycle hooks
onMounted(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
  const confirmedUserName = toRaw(userStore.getConfirmedUserName);
  if (confirmedUserName !== '') {
    userName.value = confirmedUserName;
    userStore.updateConfirmedUserName('');
  }
  resetViewPort(isSmallViewPort, maxDialogWidth);
  let resizeTimeout: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resetViewPort(isSmallViewPort, maxDialogWidth);
    }, 250, 'Resized');
  });
});
onUpdated(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
});
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    resetViewPort(isSmallViewPort, maxDialogWidth);
  });
});
</script>
