<template>
  <v-card>
    <v-card-title class='justify-center text-center'>
      <span class='headline'>Login Assistance Form</span>
    </v-card-title>
    <v-form v-model='formValid' ref='form'>
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
                  @click='submitHandler'
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

<script lang='ts'>
import { computed, ComputedRef, defineComponent, onMounted, onUpdated, Ref, ref, watch } from 'vue';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useAppStore } from '@/store/appStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import { useUserStore } from '@/store/userStore/index';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import commonUtilities from '@/utilities/common';
import rules from '@/utilities/rules/index';
import { LoginAssistanceRequestData } from '@/models/requests/loginAssistanceRequestData';

export default defineComponent({
  name: 'LoginAssistanceForm',
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
    const { emailRules } = rules();
    const form: Ref<VForm | null> = ref(null);
    const formValid: Ref<boolean> = ref(true);
    const confirmFormReset: Ref<boolean> = ref(false);
    const email: Ref<string> = ref('');
    const invalidEmails: Ref<string[]> = ref([]);

    const getFormStatus: ComputedRef<boolean> = computed(() => {
      return props.formStatus;
    });
    
    // the following line is used by vuetify to reset the form
    // eslint-disable-next-line
    const resetFormStatus: ComputedRef<boolean> = computed(() => {
      return !props.formStatus;
    });

    const submitHandler = (): void => {
      if (getFormStatus.value) {
        const data = new LoginAssistanceRequestData(email.value);
        appStore.confirmUserNameAsync(data);
      }
    }

    const resetPasswordHandlder = (): void => {
      if (getFormStatus.value) {
        const data = new LoginAssistanceRequestData(email.value);
        appStore.requestPasswordResetAsync(data);
      }
    }

    const resetHandler = (): void => {
      if (getFormStatus.value) {
        email.value = '';
        invalidEmails.value = [];
        form.value?.reset();
        confirmFormReset.value = false;
        serviceFailStore.initializeStore();
      }
    }

    const goBackHandler = (): void => {
      emit('go-back-to-login', null, null);
    }

    watch(
      () => serviceFailStore.getIsSuccess,
      () => {
        const isSuccess = serviceFailStore.getIsSuccess;
        if (isSuccess !== null && !isSuccess) {
          const message: string = serviceFailStore.getMessage;
          if (
            message === 'Status Code 404: No user is using this email' &&
            !invalidEmails.value.includes(email.value)
          ) {
            invalidEmails.value.push(email.value);
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

    watch(
      () => userStore.getConfirmedUserName,
      () => {
        const confirmedUserName = userStore.getConfirmedUserName;
        if (confirmedUserName !== '') {
          emit('go-back-to-login', null, null);
        }
      }
    );
    
    onMounted(() => {
      if (isChrome.value) {
        repairAutoComplete();
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
      confirmFormReset,
      emailRules,
      email,
      invalidEmails,
      submitHandler,
      resetPasswordHandlder,
      resetHandler,
      goBackHandler
    }
  }
});
</script>
