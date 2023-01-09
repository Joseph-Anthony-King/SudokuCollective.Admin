<template>
  <v-app>
    <div class="app-viewport">
      <app-bar
        v-on:user-logging-in="user.isLoggingIn = true"
        v-on:user-logging-out="logoutHandler"
      />
      <v-main>
        <router-view />
        <v-dialog
          v-model="userIsLoggingIn"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <LoginForm
            :formStatus="userIsLoggingIn"
            v-on:cancel-login="user.isLoggingIn = false"
            v-on:obtain-login-assistance="openLoginAssistanceHandler"
          />
        </v-dialog>
        <v-dialog
          v-model="userObtainingLoginAssistance"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <LoginAssistanceForm
            :formStatus="userObtainingLoginAssistance"
            v-on:go-back-to-login="closeLoginAssistanceHandler"
          />
        </v-dialog>
      </v-main>
    </div>
    <div>
      <v-footer>
        <footer-nav />
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  toRaw,
  watch,
} from "vue";
import store from "@/store";
import AppBar from "@/components/navigation/AppBar.vue";
import FooterNav from "@/components/navigation/FooterNav.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import LoginAssistanceForm from "@/components/forms/LoginAssistanceForm.vue";
import commonUtilities from "@/utilities/common";
import { User } from "@/models/domain/user";

export default defineComponent({
  name: "App",
  components: { AppBar, FooterNav, LoginForm, LoginAssistanceForm },
  setup() {
    const { getLicense } = commonUtilities();
    const isSmallViewPort: Ref<boolean> = ref(true);
    const maxDialogWidth: Ref<string> = ref("auto");
    const user: Ref<User> = ref(
      toRaw(store.getters["appModule/getUser"]) as User
    );
    const userObtainingLoginAssistance: Ref<boolean> = ref(false);
    const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
      return user.value?.isLoggingIn;
    });
    const resetAppViewPort = (): void => {
      if (window.innerWidth <= 960) {
        isSmallViewPort.value = true;
        maxDialogWidth.value = "auto";
      } else {
        isSmallViewPort.value = false;
        maxDialogWidth.value = "960px";
      }
    };
    const logoutHandler = (): void => {
      store.dispatch("appModule/logout");
      store.dispatch("appModule/updateToken", "");
    };
    const openLoginAssistanceHandler = (): void => {
      user.value.isLoggingIn = false;
      userObtainingLoginAssistance.value = true;
    }
    const closeLoginAssistanceHandler = (): void => {
      user.value.isLoggingIn = true;
      userObtainingLoginAssistance.value = false;
    }
    watch(
      () => store.getters["appModule/getUser"],
      () => {
        user.value = toRaw(store.getters["appModule/getUser"]) as User;
      }
    );
    watch(
      () => store.getters["appModule/getUserIsLoggedIn"],
      () => {
        const isLoggedIn = toRaw(store.getters["appModule/getUserIsLoggedIn"]);
        if (isLoggedIn) {
          user.value = toRaw(store.getters["appModule/getUser"]) as User;
          alert(`Welcome back ${user.value.userName}!`);
        }
      }
    );
    watch(
      () => store.getters["appModule/getConfirmedUserName"],
      () => {
        const confirmedUserName = store.getters["appModule/getConfirmedUserName"];
        if (confirmedUserName !== "") {
          closeLoginAssistanceHandler();
        }
      }
    );
    watch(
      () => store.getters["appModule/getServiceMessage"],
      () => {
        const serviceMessage = store.getters["appModule/getServiceMessage"];
        if (serviceMessage === "Status Code 200: Processed password reset request" || serviceMessage === "Status Code 200: Resent password reset request" ) {
          alert(serviceMessage);
          user.value.isLoggingIn = false;
          userObtainingLoginAssistance.value = false;
          store.dispatch("appModule/updateServiceMessage", "")
        }
      }
    );
    onMounted(() => {
      store.dispatch("appModule/addLicense", getLicense());
      store.dispatch("valuesModule/initializeModuleAsync");
      store.dispatch("sudokuModule/initializeModule");
      resetAppViewPort();
      window.addEventListener("resize", () => {
        resetAppViewPort();
      });
    });
    onUnmounted(() => {
      window.removeEventListener("resize", () => {
        resetAppViewPort();
      });
    });
    return {
      isSmallViewPort,
      maxDialogWidth,
      user,
      userObtainingLoginAssistance,
      userIsLoggingIn,
      logoutHandler,
      openLoginAssistanceHandler,
      closeLoginAssistanceHandler,
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/styles/site.scss";
</style>
