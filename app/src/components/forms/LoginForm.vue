<template>
  <v-card>
    <v-card-title class='justify-center text-center'>
      <span class='headline'>Login</span>
    </v-card-title>
    <v-form v-model='formValid' ref='form' onsubmit='event.preventDefault();'>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols='12'>
              <v-tooltip open-delay='2000' location='bottom'>
                <template v-slot:activator='{ props }'>
                  <v-text-field
                    label='User Name'
                    v-model='userName'
                    prepend-icon='mdi-account-circle'
                    :rules='userNameRules(invalidUserNames, "No user is using this user name")'
                    autocomplete='off'
                    color='primary'
                    v-bind='props'
                  >
                  </v-text-field>
                </template>
                <span>{{ RulesMessages.userNameRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols='12'>
              <v-tooltip open-delay='2000' location='bottom'>
                <template v-slot:activator='{ props }'>
                  <v-text-field
                    label='Password'
                    v-model='password'
                    :type="showPassword ? 'text' : 'password'"
                    :rules='passwordRules(invalidPasswords)'
                    prepend-icon='mdi-lock'
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append='showPassword = !showPassword'
                    autocomplete='off'
                    color='primary'
                    v-bind='props'
                  >
                  </v-text-field>
                </template>
                <span>{{ RulesMessages.passwordRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols='12'>
              <v-tooltip location='bottom'>
                <template v-slot:activator='{ props }'>
                  <v-checkbox
                    v-model='stayLoggedIn'
                    label='Stay Logged in for 30 Days'
                    color='primary'
                    v-bind='props'
                  ></v-checkbox>
                </template>
                <span>If set to false this will clear your authorization token when you navigate away from the app</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col>
            <v-tooltip location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='helpHandlerAsync($event)'
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
                  @click='cancelHandlerAsync($event)'
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
                  @click.prevent='submitHandlerAsync($event)'
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
      </AvailableActions>
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
      v-on:action-confirmed='resetHandlerAsync'
      v-on:action-not-confirmed='confirmFormReset = false' />
  </v-dialog>
</template>

<script setup lang='ts'>
import {
  Ref,
  ref,
  ComputedRef,
  computed,
  toRaw,
  onMounted,
  onUpdated,
  onUnmounted
} from 'vue';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import { useAppStore } from '@/store/appStore';
import { useLoginFormStore } from '@/store/loginFormStore';
import { useServiceFailStore } from '@/store/serviceFailStore';
import { useUserStore } from '@/store/userStore';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { LoginRequestData } from '@/models/requests/loginRequestData';
import commonUtilities from '@/utilities/common';
import rules from '@/utilities/rules/index';
import { RulesMessages } from '@/utilities/rules/rulesMessages';
  
const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['obtain-login-assistance', 'cancel-login']);

// Instantiate the stores
const appStore = useAppStore();
const loginFormStore = useLoginFormStore();
const serviceFailStore = useServiceFailStore();
const userStore = useUserStore();

const { passwordRules, userNameRules } = rules();
const { 
  isChrome, 
  displayFailedToastAsync,
  repairAutoComplete,
  resetViewPort,
  updateAppProcessingAsync } = commonUtilities();

const userName: Ref<string | null> = ref(loginFormStore.getUserName);
const password: Ref<string | null> = ref(loginFormStore.getPassword);
const showPassword: Ref<boolean> = ref(false);
const stayLoggedIn: Ref<boolean> =ref(appStore.getStayedLoggedIn);
const confirmFormReset: Ref<boolean> = ref(false);
const invalidUserNames: Ref<string[]> = ref(loginFormStore.getInvalidUserNames);
const invalidPasswords: Ref<string[]> = ref(loginFormStore.getInvalidPasswords);

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
const submitHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    if (getFormStatus.value && userName.value !== null && password.value !== null) {
      const data = new LoginRequestData(
        userName.value, 
        password.value,
        stayLoggedIn.value);
      await appStore.loginAsync(data);
      const failedToast = await displayFailedToastAsync(
        updateInvalidValues, 
        { 
          invalidUserNames: toRaw(invalidUserNames.value), 
          invalidPasswords: toRaw(invalidPasswords.value),
          userName: toRaw(userName.value),
          password: toRaw(password.value) 
        });
      if (failedToast.failed) {
        invalidUserNames.value = failedToast.methodResult.invalidUserNames;
        invalidPasswords.value = failedToast.methodResult.invalidPasswords;
        loginFormStore.updateUserName(toRaw(userName.value));
        loginFormStore.updatePassword(toRaw(password.value))
        loginFormStore.updateInvalidUserNames(toRaw(invalidUserNames.value));
        loginFormStore.updateInvalidPasswords(toRaw(invalidPasswords.value));
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

const resetHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    serviceFailStore.initializeStore();
    loginFormStore.initializeStore();
    userName.value = loginFormStore.getUserName;
    password.value = loginFormStore.getPassword;
    stayLoggedIn.value = true;
    invalidUserNames.value = loginFormStore.getInvalidUserNames;
    invalidPasswords.value = loginFormStore.getInvalidEmails;
    form.value?.reset();
    confirmFormReset.value = false;
  });
};

const cancelHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    loginFormStore.initializeStore();
    emit('cancel-login', null, null);
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    invalidPasswords: options.invalidPasswords };
};

// Lifecycle hooks
onMounted(() => {
  if (isChrome.value) {
    repairAutoComplete();
  }
  const confirmedUserName = userStore.getConfirmedUserName;
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
  if (loginFormStore.getDirty) {
    form.value?.validate();
  }
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
