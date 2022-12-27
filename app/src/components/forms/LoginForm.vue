<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Login Form</span>
    </v-card-title>
    <v-form v-model="loginFormIsValid" ref="loginForm">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="User Name"
                v-model="userName"
                prepend-icon="mdi-account-circle"
                :rules="userNameRules"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              >
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-col>
          <v-tooltip bottom>
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
          <v-tooltip bottom>
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text
                @click="loginHandler"
                v-bind="props"
              >
                Login
              </v-btn>
            </template>
            <span>Login to the api</span>
          </v-tooltip>
        </v-col>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { LoginRequestData } from "@/models/requests/loginRequestData";
import store from "@/store";
import { computed, ComputedRef, defineComponent, ref, Ref, watch } from "vue";

export default defineComponent({
  name: "LoginForm",
  setup(props, { emit }) {
    const loginFormIsValid: Ref<boolean> = ref(true);
    const userName: Ref<string> = ref("");
    const password: Ref<string> = ref("");
    const showPassword: Ref<boolean> = ref(false);
    const userNameRules: ComputedRef<any> = computed(() => {
      return [(v: string) => !!v || "User Name is required"];
    });
    function cancelHandler(): void {
      emit("cancel-login", null, null);
    }
    function loginHandler(): void {
      const data = new LoginRequestData(userName.value, password.value);
      store.dispatch("appModule/loginAsync", data);
    }
    watch(
      () => store.getters["serviceFailModule/getIsSuccess"],
      function () {
        const isSuccess = store.getters["serviceFailModule/getIsSuccess"];
        if (isSuccess !== null && !isSuccess) {
          alert(store.getters["serviceFailModule/getMessage"]);
          store.dispatch("serviceFailModule/clearState");
        }
      }
    );
    return {
      loginFormIsValid,
      userName,
      password,
      showPassword,
      userNameRules,
      cancelHandler,
      loginHandler,
    };
  },
});
</script>
