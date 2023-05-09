<template>
  <v-card>
    <v-card-title class='justify-center text-center'>
      <span class='headline'>Login Form</span>
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
                :rules='userNameRules'
                autocomplete='off'
              >
              </v-text-field>
            </v-col>
            <v-col cols='12'>
              <v-text-field
                label='Password'
                v-model='password'
                :type="showPassword ? 'text' : 'password'"
                :rules='passwordRules'
                prepend-icon='mdi-lock'
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append='showPassword = !showPassword'
                autocomplete='off'
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row :dense='true'>
          <v-col>
            <v-tooltip close-delay='3000' location='bottom'>
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
            <v-tooltip close-delay='3000' location='bottom'>
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
            <v-tooltip close-delay='3000' location='bottom'>
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
            <v-tooltip close-delay='3000' location='bottom'>
              <template v-slot:activator='{ props }'>
                <v-btn
                  color='blue darken-1'
                  text
                  @click='submitHandler'
                  :disabled='!formValid'
                  v-bind='props'
                >
                  Login
                </v-btn>
              </template>
              <span>Login to the api</span>
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
      title='Reset Login Form' 
      message='Are you sure you want to reset this form?' 
      v-on:action-confirmed='resetHandler'
      v-on:action-not-confirmed='confirmFormReset = false' />
  </v-dialog>
</template>

<script lang='ts'>
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  onUpdated,
  ref,
  Ref,
  toRaw,
  watch
} from 'vue';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useAppStore } from '@/store/appStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore';
import { useUserStore } from '@/store/userStore/index';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import commonUtilities from '@/utilities/common';
import { LoginRequestData } from '@/models/requests/loginRequestData';

export default defineComponent({
  name: 'LoginForm',
  components: { ConfirmDialog },
  props: {
    formStatus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const appStore = useAppStore();
    const serviceFailStore = useServiceFailStore();
    const userStore = useUserStore();
    const { isChrome, repairAutoComplete } = commonUtilities();
    const form: Ref<VForm | null> = ref(null);
    const formValid: Ref<boolean> = ref(true);
    const userName: Ref<string> = ref('');
    const password: Ref<string> = ref('');
    const showPassword: Ref<boolean> = ref(false);
    const confirmFormReset: Ref<boolean> = ref(false);
    let invalidUserNames: string[] = [];
    let invalidPasswords: string[] = [];
    const userNameRules = computed(() => {
      return [
        (v: string) => !!v || 'User Name is required',
        (v: string) =>
          /^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) ||
          'User name must be at least 4 characters and can contain alphanumeric characters and special characters of [! @ # $ % ^ & * + = ? - _ . ,]',
        (v: string) =>
          !invalidUserNames.includes(v) || 'No user has this user name',
      ];
    });
    const passwordRules = computed(() => {
      return [
        (v: string) => !!v || 'Password is required',
        (v: string) =>
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(
            v
          ) ||
          'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,',
        (v: string) => !invalidPasswords.includes(v) || 'Password is incorrect',
      ];
    });
    const helpHandler = (): void => {
      emit('obtain-login-assistance', null, null);
    };
    const resetHandler = (): void => {
      userName.value = '';
      password.value = '';
      invalidUserNames = [];
      invalidPasswords = [];
      form.value?.reset();
      confirmFormReset.value = false;
      serviceFailStore.initializeStore();
    };
    const cancelHandler = (): void => {
      emit('cancel-login', null, null);
    };
    const submitHandler = (): void => {
      if (getFormStatus.value) {
        const data = new LoginRequestData(userName.value, password.value);
        appStore.loginAsync(data);
      }
    };
    const getFormStatus: ComputedRef<boolean> = computed(() => {
      return props.formStatus;
    });
    // the following line is used by vuetify to reset the form
    // eslint-disable-next-line
    const resetFormStatus: ComputedRef<boolean> = computed(() => {
      return !props.formStatus;
    });
    watch(
      () => serviceFailStore.getIsSuccess,
      () => {
        const isSuccess = serviceFailStore.getIsSuccess;
        if (isSuccess !== null && !isSuccess) {
          const message: string = serviceFailStore.getMessage;
          if (
            message === 'Status Code 404: No user has this user name' &&
            !invalidUserNames.includes(userName.value)
          ) {
            invalidUserNames.push(userName.value);
          }
          if (
            message === 'Status Code 404: Password is incorrect' &&
            !invalidPasswords.includes(password.value)
          ) {
            invalidPasswords.push(password.value);
          }
          toast(message, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.ERROR,
          });
          serviceFailStore.initializeStore();
          form.value?.validate();
        }
      }
    );
    onMounted(() => {
      if (isChrome.value) {
        repairAutoComplete();
      }
      const confirmedUserName = toRaw(userStore.getConfirmedUserName);
      if (confirmedUserName !== '') {
        userName.value = confirmedUserName;
        userStore.updateConfirmedUserName('');
      }
    });
    onUpdated(() => {
      if (isChrome.value) {
        repairAutoComplete();
      }
    });
    return {
      form,
      formValid,
      userName,
      password,
      showPassword,
      confirmFormReset,
      userNameRules,
      passwordRules,
      submitHandler,
      helpHandler,
      resetHandler,
      cancelHandler,
    };
  },
});
</script>
