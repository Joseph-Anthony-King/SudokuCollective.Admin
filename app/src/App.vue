<template>
  <v-app>
    <NavigationDrawer
      :navDrawerStatus="navDrawerStatus"
      :userLoggedIn="user.isLoggedIn"
      @update:modelValue="(modelValue: boolean) => closeNavDrawerHandler(modelValue)"
    />
    <v-content>
      <AppBar
        v-on:user-logging-in="user.isLoggingIn = true"
        v-on:user-logging-out="logoutHandler"
        v-on:user-signing-up="user.isSigningUp = true"
        v-on:update-nav-drawer="updateNavDrawerHandler"
      />
      <v-main>
        <progress-widget v-if="processingStatus" />
        <router-view v-else />
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
            v-on:redirect-to-signup="redirectToSignUpHandler"
          />
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
            v-on:return-to-login="closeLoginAssistanceHandler"
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
            :isRedirect="isRedirect"
            v-on:cancel-signup="() => { user.isSigningUp = false; isRedirect = false }"
            v-on:reset-redirect="isRedirect = false"
          />
        </v-dialog>
        <v-dialog
          v-model="emailConfirmed"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition"
        >        
          <ConfirmEmailResultWidget v-on:close-email-confirmed-widget="closeConfirmEmailResultWidget" />
        </v-dialog>
        <v-dialog
          v-model="okDialogIsActive"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition"
        >
          <OkDialog v-on:close-ok-dialog="closeOkDialog" />
        </v-dialog>
      </v-main>
    </v-content>
    <FooterNav />
  </v-app>
</template>

<script lang="ts">
import {
  Ref,
  ref,
  ComputedRef,
  computed,
  onMounted,
  onUnmounted,
  watch,
  toRaw,
  defineComponent,
} from "vue";
import router from "@/router/index";
import vuetify from "@/plugins/vuetify";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useAppStore } from "@/store/appStore";
import { useConfirmEmailStore } from "@/store/confirmEmailStore";
import { useOkDialogStore } from "@/store/okDialogStore";
import { useServiceFailStore } from "@/store/serviceFailStore";
import { useSudokuStore } from "@/store/sudokuStore";
import { useUserStore } from "@/store/userStore";
import { useValuesStore } from "@/store/valuesStore";
import AppBar from "@/components/navigation/AppBar.vue";
import FooterNav from "@/components/navigation/FooterNav.vue";
import NavigationDrawer from "@/components/navigation/NavigationDrawer.vue";
import OkDialog from "@/components/dialogs/OkDialog.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import LoginAssistanceForm from "@/components/forms/LoginAssistanceForm.vue";
import SignUpForm from "@/components/forms/SignUpForm.vue";
import ProgressWidget from "@/components/widgets/common/ProgressWidget.vue";
import ConfirmEmailResultWidget from "@/components/widgets/confirmEmail/ConfirmEmailResultWidget.vue";
import { User } from "@/models/domain/user";
import commonUtilities from "@/utilities/common";

// This vue file uses defineComponent in order to resolve a 'file is not a module' error in main.ts.
export default defineComponent({
  name: "App",
  components: {
    AppBar,
    FooterNav,
    NavigationDrawer,
    OkDialog,
    ProgressWidget,
    LoginForm,
    LoginAssistanceForm,
    SignUpForm,
    ConfirmEmailResultWidget,
},
  setup() {
    const { clearStores, updateAppProcessingAsync } = commonUtilities();

    const clearStoresIfUserIsNotLoggedIn = (): void => {
      if (!appStore.getStayedLoggedIn) {
        clearStores();
      }
    };

    //#region Instantiate the Stores
    const appStore = useAppStore();
    const confirmEmailStore = useConfirmEmailStore();
    const okDialogStore =useOkDialogStore();
    const serviceFailStore = useServiceFailStore();
    const sudokuStore = useSudokuStore();
    const userStore = useUserStore();
    const valuesStore = useValuesStore();
    //#endregion

    //#region User set up
    const user: Ref<User> = ref(userStore.getUser);
    watch(
      () => userStore.getUser,
      () => {
        user.value = userStore.getUser;
      }
    );
    //#endregion

    //#region Login/logout functionality
    const userObtainingLoginAssistance: ComputedRef<boolean> = computed(() => {
      return user.value?.isObtainingAssistance && !processingStatus.value;
    });
    const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
      return user.value?.isLoggingIn && !processingStatus.value;
    });
    const logoutHandler = (event: Event | null = null): void => {
      event?.preventDefault();
      navDrawerStatus.value = false;
      const userName = user.value.userName;
      appStore.logout();
      if (
        router.currentRoute.value.name !== "home" &&
        router.currentRoute.value.name !== "sudoku"
      ) {
        router.push("/");
      }
      toast(`${userName}, you are logged out.`, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
    };
    const openLoginAssistanceHandler = (event: Event | null = null): void => {
      event?.preventDefault();
      user.value.isLoggingIn = false;
      user.value.isObtainingAssistance = true;
    };
    const closeLoginAssistanceHandler = (event: Event | null = null): void => {
      event?.preventDefault();
      user.value.isLoggingIn = true;
      user.value.isObtainingAssistance = false;
    };
    const redirectToSignUpHandler = (redirect: boolean, event: Event | null = null): void => {
      isRedirect.value = redirect;
      event?.preventDefault();
      user.value.isLoggingIn = false;
      user.value.isSigningUp = true;
      userStore.updateUser(toRaw(user.value));
    };
    
    watch(
      () => appStore.getServiceMessage,
      () => {
        const serviceMessage = appStore.getServiceMessage;
        if (
          serviceMessage ===
            "Status Code 200: Processed password reset request" ||
          serviceMessage === "Status Code 200: Resent password reset request"
        ) {
          toast(serviceMessage, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.SUCCESS,
          });
          user.value.isLoggingIn = false;
          user.value.isObtainingAssistance = false;
          appStore.updateServiceMessage("");
        }
      }
    );
    watch(
      () => user.value.isLoggingIn,
      () => {
        if (userStore.getUserIsLoggingIn !== user.value.isLoggingIn) {
          userStore.updateUserIsLoggingIn(toRaw(user.value.isLoggingIn));
        }
      }
    );
    watch(
      () => userStore.getUserIsLoggingIn,
      () => {
        if (userStore.getUserIsLoggingIn !== user.value.isLoggingIn) {
          user.value.isLoggingIn = userStore.getUserIsLoggingIn;
        }
      }
    );
    watch(
      () => userStore.getUserIsLoggedIn,
      () => {
        const isLoggedIn = userStore.getUserIsLoggedIn;
        const isSignedUp = userStore.getUserIsSignedIn;
        if (isLoggedIn) {
          updateNavDrawerHandler();
          user.value = userStore.getUser;
          if (!isSignedUp) {
            toast(`Welcome back ${user.value.userName}!`, {
              position: toast.POSITION.TOP_CENTER,
              type: toast.TYPE.SUCCESS,
            });
            if (router.currentRoute.value.name !== "sudoku") {
              router.push("/dashboard");
            }
          } else {
            user.value.isSignedUp = false;
            userStore.updateUser(user.value);
            window.location.href = "/user-profile";
            okDialogStore.updateIsActive(true);
          }
        }
      }
    );
    watch(
      () => userStore.getConfirmedUserName,
      () => {
        const confirmedUserName = userStore.getConfirmedUserName;
        if (confirmedUserName !== "") {
          closeLoginAssistanceHandler();
        }
      }
    );
    //#endregion

    //#region Sign up functionality
    const isRedirect: Ref<boolean> = ref(false);
    const userIsSigningUp: ComputedRef<boolean> = computed(() => {
      return user.value?.isSigningUp && !processingStatus.value;
    });
    watch(
      () => user.value.isSigningUp,
      () => {
        if (userStore.getUserIsSigningUp !== user.value.isSigningUp) {
          userStore.updateUserIsSigningUp(toRaw(user.value.isSigningUp));
        }
      }
    );
    watch(
      () => userStore.getUserIsSigningUp,
      () => {
        if (userStore.getUserIsSigningUp !== user.value.isSigningUp) {
          user.value.isSigningUp = userStore.getUserIsSigningUp;
        }
      }
    );
    //#endregion

    //#region Navbar functionality
    const navDrawerStatus: Ref<boolean> = ref(appStore.getNavDrawerStatus);
    const updateNavDrawerHandler = (): void => {
      if (vuetify.display.smAndDown.value) {
        navDrawerStatus.value = !navDrawerStatus.value;
      } else {
        navDrawerStatus.value = true;
      }
      appStore.updateNavDrawerStatus(navDrawerStatus.value);
    };
    const closeNavDrawerHandler = (modelValue: boolean): void => {
      if (modelValue === false && navDrawerStatus.value === true) {
        navDrawerStatus.value = modelValue;
        appStore.updateNavDrawerStatus(navDrawerStatus.value);
      }
    };
    //#endregion
    
    //#region App Processing logic
    const processingStatus: Ref<boolean> = ref(appStore.getProcessingStatus);
    watch(
      () => appStore.getProcessingStatus,
      () => {
        processingStatus.value = appStore.getProcessingStatus;
      }
    )
    //#endregion

    //#region Email confirmed results
    const emailConfirmed: ComputedRef<boolean> = computed(() => confirmEmailStore.getIsSuccess ? confirmEmailStore.getIsSuccess && !processingStatus.value : false);
    const closeConfirmEmailResultWidget = (): void => {
      confirmEmailStore.initializeStore();
    };
    //#endregion

    //#region Ok dialog
    const okDialogIsActive: ComputedRef<boolean> = computed(() => okDialogStore.getIsActive && !processingStatus.value);
    const closeOkDialog = (): void => {
      okDialogStore.initializeStore();
    };
    //#endregion

    //#region Dialog formatting
    const isSmallViewPort: Ref<boolean> = ref(true);
    const maxDialogWidth: Ref<string> = ref("auto");
    const resetAppDialogViewPort = (): void => {
      if (window.innerWidth <= 960) {
        isSmallViewPort.value = true;
        maxDialogWidth.value = "auto";
        navDrawerStatus.value = false;
        appStore.updateNavDrawerStatus(navDrawerStatus.value);
      } else {
        isSmallViewPort.value = false;
        maxDialogWidth.value = "960px";
        navDrawerStatus.value = true;
        appStore.updateNavDrawerStatus(navDrawerStatus.value);
      }
    };
    //#endregion

    //#region Lifecycle Hooks
    onMounted(async () => {
      updateAppProcessingAsync(async () => {
        // Initialize the value, sudoku and serviceFailure stores
        await valuesStore.initializeStoreAsync();
        sudokuStore.initializeStore();
        serviceFailStore.initializeStore();

        // Especially for mobile, if the user rejected a 30 day sign in clear the stores
        clearStoresIfUserIsNotLoggedIn();

        // Set the app dialog viewport for mobil or desktop
        resetAppDialogViewPort();
        let resizeTimeout: number | undefined;

        // Add event listeners
        window.addEventListener("resize", () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(
            () => {
              resetAppDialogViewPort();
            },
            250,
            "Resized"
          );
        });
        window.addEventListener("beforeunload", (e) => {
          e.preventDefault();
          clearStoresIfUserIsNotLoggedIn();
        });
      });
    });
    onUnmounted(() => {
      // Remove event listeners
      window.removeEventListener("resize", () => {
        resetAppDialogViewPort();
      });
      window.removeEventListener("beforeunload", () => {
        clearStoresIfUserIsNotLoggedIn();
      });
    });
    //#endregion

    return {
      processingStatus,
      navDrawerStatus,
      updateNavDrawerHandler,
      closeNavDrawerHandler,
      user,
      userObtainingLoginAssistance,
      userIsLoggingIn,
      logoutHandler,
      openLoginAssistanceHandler,
      closeLoginAssistanceHandler,
      redirectToSignUpHandler,
      isRedirect,
      userIsSigningUp,
      emailConfirmed,
      closeConfirmEmailResultWidget,
      okDialogIsActive,
      closeOkDialog,
      isSmallViewPort,
      maxDialogWidth,
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/styles/site.scss";
</style>
