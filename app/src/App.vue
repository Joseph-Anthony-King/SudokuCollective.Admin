<template>
  <v-app>
    <div class="app-viewport">
      <app-bar
        v-on:user-logging-in="user.isLoggingIn = true"
        v-on:user-logging-out="logoutHandler"
        v-on:user-signing-up="user.isSigningUp = true"
      />
      <v-main>
        <router-view />
        <v-dialog
          v-model="userIsLoggingIn"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition"
        >
          <LoginForm
            :formStatus="userIsLoggingIn"
            v-on:cancel-login="user.isLoggingIn = false"
            v-on:obtain-login-assistance="openLoginAssistanceHandler"
          />
        </v-dialog>
        <v-dialog 
          v-model="userIsSigningUp" 
          persistent 
          :fullscreen="isSmallViewPort" 
          :max-width="maxDialogWidth" 
          hide-overlay
          transition="dialog-top-transition"
        >
          <SignUpForm
            :formStatus="userIsSigningUp"
            v-on:cancel-signup="user.isSigningUp = false"/>
        </v-dialog>
        <v-dialog
          v-model="userObtainingLoginAssistance"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition"
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import store from "@/store";
import { useAppStore } from "@/store/appStore/index";
import AppBar from "@/components/navigation/AppBar.vue";
import FooterNav from "@/components/navigation/FooterNav.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import LoginAssistanceForm from "@/components/forms/LoginAssistanceForm.vue";
import SignUpForm from "@/components/forms/SignUpForm.vue"
import commonUtilities from "@/utilities/common";
import { User } from "@/models/domain/user";

export default defineComponent({
  name: "App",
  components: {
    AppBar,
    FooterNav,
    LoginForm,
    LoginAssistanceForm,
    SignUpForm
  },
  setup() {
    // Initialize stores
    const appStore = useAppStore();

    // User set up
    const user: Ref<User> = ref(
      toRaw(appStore.getUser)
    );
    watch(
      () => appStore.getUser,
      () => {
        user.value = toRaw(appStore.getUser);
      }
    );

    // Login/logout functionality
    const { getLicense } = commonUtilities();
    const userObtainingLoginAssistance: Ref<boolean> = ref(false);
    const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
      return user.value?.isLoggingIn;
    });
    const logoutHandler = (): void => {
      const userName = user.value.userName;
      appStore.logout();
      appStore.updateToken("");
      toast(`${userName}, you are logged out.`, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
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
      () => user.value.isLoggingIn,
      () => {
        appStore.updateUser(user.value);
      }
    );
    watch(
      () => appStore.getUserIsLoggedIn,
      () => {
        const isLoggedIn = toRaw(appStore.getUserIsLoggedIn);
        if (isLoggedIn) {
          user.value = toRaw(appStore.getUser);
          toast(`Welcome back ${user.value.userName}!`, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.SUCCESS,
          });
        }
      }
    );
    watch(
      () => appStore.getConfirmedUserName,
      () => {
        const confirmedUserName = appStore.getConfirmedUserName;
        if (confirmedUserName !== "") {
          closeLoginAssistanceHandler();
        }
      }
    );
    watch(
      () => appStore.getServiceMessage,
      () => {
        const serviceMessage = appStore.getServiceMessage;
        if (serviceMessage === "Status Code 200: Processed password reset request" || serviceMessage === "Status Code 200: Resent password reset request" ) {
          toast(serviceMessage, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.ERROR,
          });
          user.value.isLoggingIn = false;
          userObtainingLoginAssistance.value = false;
          appStore.updateServiceMessage("");
        }
      }
    );

    // Sign up functionality
    const userIsSigningUp: ComputedRef<boolean> = computed(() => {
      return user.value?.isSigningUp;
    });
    watch(
      () => user.value.isSigningUp,
      () => {
        appStore.updateUser(user.value);
      }
    );

    // Dialog formatting
    const isSmallViewPort: Ref<boolean> = ref(true);
    const maxDialogWidth: Ref<string> = ref("auto");
    const resetAppViewPort = (): void => {
      if (window.innerWidth <= 960) {
        isSmallViewPort.value = true;
        maxDialogWidth.value = "auto";
      } else {
        isSmallViewPort.value = false;
        maxDialogWidth.value = "960px";
      }
    };

    // Lifecycle hooks
    onMounted(() => {
      appStore.addLicense(getLicense());
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
      userIsSigningUp,
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
