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
      <v-card-actions class='text-center'>
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
import rules from '@/utilities/rules/index';
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
    const { passwordRules, userNameRules } = rules();
    const form: Ref<VForm | null> = ref(null);
    const formValid: Ref<boolean> = ref(true);
    const userName: Ref<string> = ref('');
    const password: Ref<string> = ref('');
    const showPassword: Ref<boolean> = ref(false);
    const confirmFormReset: Ref<boolean> = ref(false);
    const invalidUserNames: Ref<string[]> = ref([]);
    const invalidPasswords: Ref<string[]> = ref([]);

    const getFormStatus: ComputedRef<boolean> = computed(() => {
      return props.formStatus;
    });

    // the following line is used by vuetify to reset the form
    // eslint-disable-next-line
    const resetFormStatus: ComputedRef<boolean> = computed(() => {
      return !props.formStatus;
    });
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

    const submitHandler = (): void => {
      if (getFormStatus.value) {
        const data = new LoginRequestData(userName.value, password.value);
        appStore.loginAsync(data);
      }
    };

    watch(
      () => serviceFailStore.getIsSuccess,
      () => {
        const isSuccess = serviceFailStore.getIsSuccess;
        if (isSuccess !== null && !isSuccess) {
          const message: string = serviceFailStore.getMessage;
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
      invalidUserNames,
      userNameRules,
      invalidPasswords,
      passwordRules,
      submitHandler,
      helpHandler,
      resetHandler,
      cancelHandler,
    };
  },
});
</script>
