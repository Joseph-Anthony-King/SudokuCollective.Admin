<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login Form</span>
    </v-card-title>
    <v-form v-model="formValid" ref="form">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="User Name"
                v-model="userName"
                prepend-icon="mdi-account-circle"
                :rules="userNameRules"
                autocomplete="off"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                autocomplete="off"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row :dense="true">
          <v-col>
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="helpHandler"
                  v-bind="props"
                >
                  Help
                </v-btn>
              </template>
              <span>Get assistance to verify your user name or change password</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="resetHandler"
                  v-bind="props"
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset the login form</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <v-tooltip close-delay="3000" location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  @click="cancelHandler"
                  v-bind="props"
                >
                  Cancel
                </v-btn>
              </template>
              <span>Cancel the login process</span>
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
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, onMounted, onUpdated, ref, Ref, toRaw, watch } from "vue";
import { VForm } from 'vuetify/components';
import store from "@/store";
import commonUtilities from "@/utilities/common";
import { LoginRequestData } from "@/models/requests/loginRequestData";

export default defineComponent({
  name: "LoginForm",
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
    const userName: Ref<string> = ref("");
    const password: Ref<string> = ref("");
    const showPassword: Ref<boolean> = ref(false);
    let invalidUserNames: string[] = [];
    let invalidPasswords: string[] = [];
    const userNameRules = computed(() => {
      return [
        (v: string) => !!v || "User Name is required",
        (v: string) =>
          /^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) ||
          "User name must be at least 4 characters and can contain alphanumeric characters and special characters of [! @ # $ % ^ & * + = ? - _ . ,]",
        (v: string) =>
          !invalidUserNames.includes(v) || "No User has this User Name",
      ];
    });
    const passwordRules = computed(() => {
      return [
        (v: string) => !!v || "Password is required",
        (v: string) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*+=?-_.,]).{4,20}$/.test(
            v
          ) ||
          "Password must be between 4 and up to 20 characters with at least 1 capital letter, 1 lower case letter, and 1 special character of [! @ # $ % ^ & * + = ? - _ . ,]",
        (v: string) => !invalidPasswords.includes(v) || "Password is incorrect",
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
        const data = new LoginRequestData(userName.value, password.value);
        store.dispatch("appModule/loginAsync", data);
      }
    };
    const helpHandler = (): void => {
      emit("obtain-login-assistance", null, null);
    };
    const resetHandler = (): void => {
      if (confirm("Are you sure you want to reset this form?")) {
        userName.value = "";
        password.value = "";
        invalidUserNames = [];
        invalidPasswords = [];
        form.value?.reset();
      }
    };
    const cancelHandler = (): void => {
      emit("cancel-login", null, null);
    };
    watch(
      () => store.getters["serviceFailModule/getIsSuccess"],
      () => {
        const isSuccess = store.getters["serviceFailModule/getIsSuccess"];
        if (isSuccess !== null && !isSuccess) {
          const message: string = store.getters["serviceFailModule/getMessage"];
          if (
            message === "Status Code 404: No User Has This User Name" &&
            !invalidUserNames.includes(userName.value)
          ) {
            invalidUserNames.push(userName.value);
          }
          if (
            message === "Status Code 404: Password is Incorrect" &&
            !invalidPasswords.includes(password.value)
          ) {
            invalidPasswords.push(password.value);
          }
          alert(message);
          store.dispatch("serviceFailModule/clearState");
          form.value?.validate();
        }
      }
    );
    watch(
      () => store.getters["appModule/getConfirmedUserName"],
      () => {
        const confirmedUserName = toRaw(store.getters["appModule/getConfirmedUserName"]);
        if (confirmedUserName !== "") {
          userName.value = confirmedUserName;
          store.dispatch("appModule/updateConfirmedUserName", "");
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
      userName,
      password,
      showPassword,
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
