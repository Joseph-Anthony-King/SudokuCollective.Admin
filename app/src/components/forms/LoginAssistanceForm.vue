<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login Assistance Form</span>
    </v-card-title>
    <v-form v-model="formValid" ref="form">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="Please enter your email to confirm your user name"
                prepend-icon="mdi-email"
                required
                :rules="emailRules"
                autocomplete="off"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer>
        </v-spacer>
        <v-row :dense="true">
          <v-col>
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="resetPasswordHandlder"
                  :disabled="!formValid"
                  v-bind="props"
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
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="submitHandler"
                  :disabled="!formValid"
                  v-bind="props"
                >
                  Confirm User Name
                </v-btn>
              </template>
              <span>Obtain your user name if your email has been confirmed</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="goBackHandler"
                  v-bind="props"
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
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, onUpdated, Ref, ref, watch } from 'vue';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import store from '@/store';
import commonUtilities from "@/utilities/common";
import { LoginAssistanceRequestData } from '@/models/requests/loginAssistanceRequestData';

export default defineComponent({
  name: "LoginAssistanceForm",
  props: {
    formStatus: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { isChrome, repairAutoComplete } = commonUtilities();
    const form: Ref<VForm | null> = ref(null);
    const formValid: Ref<boolean> = ref(true);
    const email: Ref<string> = ref("");
    let invalidEmails: string[] = [];
    const emailRules = computed(() => {
      return [
        (v: string) => !!v || "Email is required",
        (v: string) =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be in a valid format",
        (v: string) => !invalidEmails.includes(v) || "No user is using this email",
      ];
    });
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
        store.dispatch("appModule/confirmUserNameAsync", data);
      }
    }
    const resetPasswordHandlder = (): void => {
      if (getFormStatus.value) {
        const data = new LoginAssistanceRequestData(email.value);
        store.dispatch("appModule/requestPasswordResetAsync", data);
      }
    }
    const goBackHandler = (): void => {
      emit("go-back-to-login", null, null);
    }
    watch(
      () => store.getters["serviceFailModule/getIsSuccess"],
      () => {
        const isSuccess = store.getters["serviceFailModule/getIsSuccess"];
        if (isSuccess !== null && !isSuccess) {
          const message: string = store.getters["serviceFailModule/getMessage"];
          if (
            message === "Status Code 404: No user is using this email" &&
            !invalidEmails.includes(email.value)
          ) {
            invalidEmails.push(email.value);
          }
          toast(message, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.ERROR,
          });
          store.dispatch("serviceFailModule/clearState");
          form.value?.validate();
        }
      }
    );
    watch(
      () => store.getters["appModule/getConfirmedUserName"],
      () => {
        const confirmedUserName = store.getters["appModule/getConfirmedUserName"];
        if (confirmedUserName !== "") {
          emit("go-back-to-login", null, null);
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
      email,
      emailRules,
      submitHandler,
      resetPasswordHandlder,
      goBackHandler
    }
  }
});
</script>
