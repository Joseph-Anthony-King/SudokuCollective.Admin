<template>
  <v-app>
    <NavigationDrawer
      :navDrawerStatus="navDrawerStatus"
      :userLoggedIn="user.isLoggedIn!"
      @update:modelValue="(modelValue: boolean) => closeNavDrawerHandler(modelValue)" />
    <v-content>
      <AppBar
        v-on:user-logging-in="user.isLoggingIn = true"
        v-on:user-signing-up="user.isSigningUp = true"
        v-on:update-nav-drawer="updateNavDrawerHandler" />
      <v-main>
        <progress-widget v-if="processingStatus" />
        <router-view v-else />
        <v-dialog
          v-model="userIsLoggingIn"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxFormWidth"
          hide-overlay
          transition="dialog-top-transition">
          <LoginForm
            :formStatus="userIsLoggingIn!"
            v-on:cancel-login="user.isLoggingIn = false"
            v-on:obtain-login-assistance="openLoginAssistanceHandler"
            v-on:redirect-to-signup="redirectToSignUpHandler" />
        </v-dialog>
        <v-dialog
          v-model="userResettingPassword"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxFormWidth"
          hide-overlay
          transition="dialog-top-transition">
          <UpdatePasswordForm
            :formStatus="userResettingPassword"
            v-on:close-update-password="closeUpdatePasswordForm" />
        </v-dialog>
        <v-dialog
          v-model="userObtainingLoginAssistance"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxFormWidth"
          hide-overlay
          transition="dialog-top-transition">
          <LoginAssistanceForm
            :formStatus="userObtainingLoginAssistance!"
            v-on:return-to-login="closeLoginAssistanceHandler" />
        </v-dialog>
        <v-dialog
          v-model="userIsSigningUp"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxFormWidth"
          hide-overlay
          transition="dialog-top-transition">
          <SignUpForm
            :formStatus="userIsSigningUp"
            :isRedirect="isRedirect"
            v-on:cancel-signup="
              () => {
                user.isSigningUp = false;
                isRedirect = false;
              }
            "
            v-on:reset-redirect="isRedirect = false" />
        </v-dialog>
        <v-dialog
          v-model="emailConfirmed"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxFormWidth"
          hide-overlay
          transition="dialog-top-transition">
          <ConfirmEmailResultWidget
            v-on:close-email-confirmed-widget="closeConfirmEmailResultWidget" />
        </v-dialog>
        <v-dialog
          v-model="okDialogIsActive"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition">
          <OkDialog />
        </v-dialog>
        <v-dialog
          v-model="confirmDialogIsActive"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-top-transition">
          <ConfirmDialog />
        </v-dialog>
      </v-main>
    </v-content>
    <FooterNav />
  </v-app>
</template>

<script lang="ts">
  /* eslint-disable no-unused-vars */
  import {
    type ComputedRef,
    computed,
    type Ref,
    ref,
    onMounted,
    onUnmounted,
    watch,
    toRaw,
    defineComponent,
  } from 'vue';
  import router from '@/router/index';
  import vuetify from '@/plugins/vuetify';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { storeToRefs } from 'pinia';
  import { useConfirmEmailStore } from '@/stores/confirmEmailStore';
  import { useGlobalStore } from '@/stores/globalStore';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useServiceFailStore } from '@/stores/serviceFailStore';
  import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
  import { useSudokuStore } from '@/stores/sudokuStore';
  import { useUserStore } from '@/stores/userStore';
  import { useValueStore } from '@/stores/valuesStore';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/FooterNav.vue';
  import NavigationDrawer from '@/components/navigation/NavigationDrawer.vue';
  import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
  import OkDialog from '@/components/dialogs/OkDialog.vue';
  import LoginForm from '@/components/forms/LoginForm.vue';
  import LoginAssistanceForm from '@/components/forms/LoginAssistanceForm.vue';
  import SignUpForm from '@/components/forms/SignUpForm.vue';
  import UpdatePasswordForm from '@/components/forms/UpdatePasswordForm.vue';
  import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
  import ConfirmEmailResultWidget from '@/components/widgets/confirmEmail/ConfirmEmailResultWidget.vue';
  import { User } from '@/models/domain/user';
  import { DialogType } from './enums/dialogType';
  import commonUtilities from '@/utilities/common';

  // This vue file uses defineComponent in order to resolve a 'file is not a module' error in main.ts.
  export default defineComponent({
    name: 'App',
    components: {
      AppBar,
      FooterNav,
      NavigationDrawer,
      OkDialog,
      ConfirmDialog,
      ProgressWidget,
      LoginForm,
      LoginAssistanceForm,
      SignUpForm,
      UpdatePasswordForm,
      ConfirmEmailResultWidget,
    },
    setup() {
      const { clearStores, updateAppProcessingAsync } = commonUtilities();

      const clearStoresIfUserIsNotLoggedIn = (): void => {
        if (!getStayedLoggedIn.value) {
          clearStores();
        }
      };

      //#region Destructure Stores
      //#region ConfirmEmailStore
      const confirmEmailStore = useConfirmEmailStore();
      const { getIsSuccess } = storeToRefs(confirmEmailStore);
      //#endregion
      //#region GlobalStore
      const globalStore = useGlobalStore();
      const {
        getNavDrawerStatus,
        getProcessingStatus,
        getServiceMessage,
        getStayedLoggedIn,
        getRedirectToSignUp,
      } = storeToRefs(globalStore);
      const { logout, updateServiceMessage, updateNavDrawerStatus, updateRedirectToSignUp } =
        globalStore;
      //#endregion
      //#region DialogStore
      const dialogStore = useDialogStore();
      const { getDialogIsActive, getDialogType } = storeToRefs(dialogStore);
      const { updateDialogIsActive } = dialogStore;
      //#endregion
      const serviceFailStore = useServiceFailStore();
      //#region SignUpFormStore
      const signUpFormStore = useSignUpFormStore();
      const { getOpenPasswordResetForm } = storeToRefs(signUpFormStore);
      //#endregion
      const sudokuStore = useSudokuStore();
      //#region UserStore
      const userStore = useUserStore();
      const {
        getConfirmedUserName,
        getUser,
        getUserIsLoggedIn,
        getUserIsLoggingIn,
        getUserIsLoggingOut,
        getUserIsSignedUp,
        getUserIsSigningUp,
      } = storeToRefs(userStore);
      const { updateUser, updateUserIsLoggingIn, updateUserIsLoggingOut, updateUserIsSigningUp } =
        userStore;
      //#endregion
      const valuesStore = useValueStore();
      //#endregion

      //#region Navbar functionality
      const navDrawerStatus: Ref<boolean> = ref(getNavDrawerStatus.value);
      const updateNavDrawerHandler = (): void => {
        if (vuetify.display.smAndDown.value) {
          navDrawerStatus.value = !navDrawerStatus.value;
        } else {
          navDrawerStatus.value = true;
        }
        updateNavDrawerStatus(navDrawerStatus.value);
      };
      const closeNavDrawerHandler = (modelValue: boolean): void => {
        if (modelValue === false && navDrawerStatus.value === true) {
          navDrawerStatus.value = modelValue;
          updateNavDrawerStatus(navDrawerStatus.value);
        }
      };
      //#endregion

      //#region App Processing logic
      const processingStatus: Ref<boolean> = ref(getProcessingStatus.value);
      watch(
        () => getProcessingStatus.value,
        (newValue, oldValue) => {
          processingStatus.value = newValue;
        },
        {
          immediate: true,
          deep: true,
        },
      );
      //#endregion

      //#region User set up
      const user: Ref<User> = ref(getUser.value);
      watch(
        () => getUser.value,
        (newValue, oldValue) => {
          user.value = newValue;
        },
        {
          immediate: true,
          deep: true,
        },
      );
      //#endregion

      //#region Login/logout functionality
      const userObtainingLoginAssistance: ComputedRef<boolean> = computed(() => {
        return user.value?.isObtainingAssistance! && !processingStatus.value;
      });
      const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
        return user.value?.isLoggingIn! && !processingStatus.value;
      });
      const logoutHandler = (event: Event | null = null): void => {
        event?.preventDefault();
        navDrawerStatus.value = false;
        const userName = user.value.userName;
        logout();
        dialogStore.initializeStore();
        updateUserIsLoggingOut(false);
        if (
          router.currentRoute.value.name !== 'home' &&
          router.currentRoute.value.name !== 'sudoku'
        ) {
          router.push('/');
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
        updateUser(toRaw(user.value));
        dialogStore.initializeStore();
        updateRedirectToSignUp(false);
      };

      watch(
        () => getServiceMessage.value,
        (newValue, oldValue) => {
          if (
            newValue === 'Status Code 200: Processed password reset request' ||
            newValue === 'Status Code 200: Resent password reset request'
          ) {
            toast(newValue, {
              position: toast.POSITION.TOP_CENTER,
              type: toast.TYPE.SUCCESS,
            });
            user.value.isLoggingIn = false;
            user.value.isObtainingAssistance = false;
            updateServiceMessage('');
          }
        },
      );
      watch(
        () => user.value.isLoggingIn,
        (newValue, oldValue) => {
          if (getUserIsLoggingIn.value !== newValue) {
            updateUserIsLoggingIn(newValue!);
          }
        },
      );
      watch(
        () => getUserIsLoggingIn.value,
        (newValue, oldValue) => {
          if (newValue !== user.value.isLoggingIn) {
            user.value.isLoggingIn = newValue;
          }
        },
      );
      watch(
        () => getUserIsLoggedIn.value,
        (newValue, oldValue) => {
          const isSignedUp = getUserIsSignedUp.value;
          if (newValue) {
            updateNavDrawerHandler();
            user.value = getUser.value;
            if (!isSignedUp) {
              toast(`Welcome back ${user.value.userName}!`, {
                position: toast.POSITION.TOP_CENTER,
                type: toast.TYPE.SUCCESS,
              });
              if (router.currentRoute.value.name !== 'sudoku') {
                router.push('/dashboard');
              }
            } else {
              user.value.isSignedUp = false;
              updateUser(user.value);
              window.location.href = '/user-profile';
              updateDialogIsActive(true);
            }
          }
        },
      );
      watch(
        () => getUserIsLoggingOut.value,
        (newValue, oldValue) => {
          if (newValue) {
            logoutHandler();
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      watch(
        () => getConfirmedUserName.value,
        (newValue, oldValue) => {
          if (newValue !== '') {
            closeLoginAssistanceHandler();
          }
        },
      );
      //#endregion

      //#region Sign up functionality
      const isRedirect: Ref<boolean> = ref(false);
      const userIsSigningUp: ComputedRef<boolean> = computed(() => {
        return user.value?.isSigningUp! && !processingStatus.value;
      });
      watch(
        () => user.value.isSigningUp,
        (newValue, oldValue) => {
          if (getUserIsSigningUp.value !== newValue) {
            updateUserIsSigningUp(newValue!);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      watch(
        () => getUserIsSigningUp.value,
        (newValue, oldValue) => {
          if (newValue !== user.value.isSigningUp) {
            user.value.isSigningUp = newValue;
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      watch(
        () => getRedirectToSignUp.value,
        (newValue, oldValue) => {
          if (newValue) {
            redirectToSignUpHandler(newValue);
          }
        },
        {
          immediate: true,
          deep: true,
        },
      );
      //#endregion

      //#region Email confirmed results
      const emailConfirmed: ComputedRef<boolean> = computed(() =>
        getIsSuccess.value ? getIsSuccess.value && !processingStatus.value : false,
      );
      const closeConfirmEmailResultWidget = (): void => {
        confirmEmailStore.initializeStore();
      };
      //#endregion

      //#region Reset Password
      const userResettingPassword: ComputedRef<boolean> = computed(
        () => getOpenPasswordResetForm.value && !processingStatus.value,
      );
      const closeUpdatePasswordForm = (): void => {
        signUpFormStore.initializeStore();
      };
      //#endregion

      //#region Dialog Logic
      const isSmallViewPort: Ref<boolean> = ref(true);
      const maxFormWidth: Ref<string> = ref(window.innerWidth <= 960 ? 'auto' : '960px');
      const maxDialogWidth: Ref<string> = ref(window.innerWidth <= 960 ? 'auto' : '480px');
      const okDialogIsActive: ComputedRef<boolean> = computed(
        () =>
          getDialogIsActive.value &&
          getDialogType.value === DialogType.OK &&
          !processingStatus.value,
      );
      const confirmDialogIsActive: ComputedRef<boolean> = computed(
        () =>
          getDialogIsActive.value &&
          getDialogType.value === DialogType.CONFIRM &&
          !processingStatus.value,
      );
      const resetAppDialogViewPort = (): void => {
        if (window.innerWidth <= 960) {
          isSmallViewPort.value = true;
          maxFormWidth.value = 'auto';
          maxDialogWidth.value = 'auto';
          navDrawerStatus.value = false;
          updateNavDrawerStatus(navDrawerStatus.value);
        } else {
          isSmallViewPort.value = false;
          maxFormWidth.value = '960px';
          maxDialogWidth.value = '480px';
          navDrawerStatus.value = true;
          updateNavDrawerStatus(navDrawerStatus.value);
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
          window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(
              () => {
                resetAppDialogViewPort();
              },
              250,
              'Resized',
            );
            resizeTimeout;
          });
        });
      });
      onUnmounted(() => {
        // Remove event listeners
        window.removeEventListener('resize', () => {
          resetAppDialogViewPort();
        });
        clearStoresIfUserIsNotLoggedIn();
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
        userResettingPassword,
        closeUpdatePasswordForm,
        okDialogIsActive,
        confirmDialogIsActive,
        isSmallViewPort,
        maxFormWidth,
        maxDialogWidth,
      };
    },
  });
</script>

<style lang="scss">
  @import '@/assets/styles/site.scss';
</style>
