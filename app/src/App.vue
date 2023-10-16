<template>
  <v-app>
    <NavigationDrawer
      :navDrawerStatus='navDrawerStatus'
      :userLoggedIn='user.isLoggedIn'
      @update:modelValue="(modelValue: boolean) => closeNavDrawerHandler(modelValue)"
    />
    <v-content>
      <app-bar
        v-on:user-logging-in='user.isLoggingIn = true'
        v-on:user-logging-out='logoutHandler'
        v-on:user-signing-up='user.isSigningUp = true'
        v-on:update-nav-drawer='updateNavDrawerHandler'
      />
      <v-main>
        <progress-widget v-if="processingStatus" />
        <router-view v-else />
        <v-dialog
          v-model='userIsLoggingIn'
          persistent
          :fullscreen='isSmallViewPort'
          :max-width='maxDialogWidth'
          hide-overlay
          transition='dialog-top-transition'
        >
          <LoginForm
            :formStatus='userIsLoggingIn'
            v-on:cancel-login='user.isLoggingIn = false'
            v-on:obtain-login-assistance='openLoginAssistanceHandler'
          />
        </v-dialog>
        <v-dialog 
          v-model='userIsSigningUp' 
          persistent 
          :fullscreen='isSmallViewPort' 
          :max-width='maxDialogWidth' 
          hide-overlay
          transition='dialog-top-transition'
        >
          <SignUpForm
            :formStatus='userIsSigningUp'
            v-on:cancel-signup='user.isSigningUp = false'/>
        </v-dialog>
        <v-dialog
          v-model='userObtainingLoginAssistance'
          persistent
          :fullscreen='isSmallViewPort'
          :max-width='maxDialogWidth'
          hide-overlay
          transition='dialog-top-transition'
        >
          <LoginAssistanceForm
            :formStatus='userObtainingLoginAssistance'
            v-on:return-to-login='closeLoginAssistanceHandler'
          />
        </v-dialog>
      </v-main>
    </v-content>
    <v-footer app inset>
      <footer-nav />
    </v-footer>
  </v-app>
</template>

<script lang='ts'>
import {
  ref,
  Ref,
  computed,
  ComputedRef,
  onMounted,
  onUnmounted,
  toRaw,
  watch,
  defineComponent
} from 'vue';
import router from '@/router/index';
import vuetify from '@/plugins/vuetify';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useAppStore } from '@/store/appStore/index';
import { useSudokuStore } from '@/store/sudokuStore/index';
import { useUserStore } from '@/store/userStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import { useValuesStore } from '@/store/valuesStore/index';
import AppBar from '@/components/navigation/AppBar.vue';
import FooterNav from '@/components/navigation/FooterNav.vue';
import NavigationDrawer from '@/components/navigation/NavigationDrawer.vue';
import LoginForm from '@/components/forms/LoginForm.vue';
import LoginAssistanceForm from '@/components/forms/LoginAssistanceForm.vue';
import SignUpForm from '@/components/forms/SignUpForm.vue';
import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
import { User } from '@/models/domain/user';

// This vue file uses defineComponent in order to resolve a 'file is not a module' error in main.ts.
export default defineComponent({
  name: 'App',
  components: {
    AppBar,
    FooterNav,
    NavigationDrawer,
    ProgressWidget,
    LoginForm,
    LoginAssistanceForm,
    SignUpForm
  },
  setup() {
    // Initialize stores
    const appStore = useAppStore();
    const sudokuStore = useSudokuStore();
    const userStore = useUserStore();
    const serviceFailStore = useServiceFailStore();
    const valuesStore = useValuesStore();

    const processingStatus: Ref<boolean> = ref(appStore.getProcessingStatus);

    // Navbar functionality
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

    // User set up
    const user: Ref<User> = ref(
      toRaw(userStore.getUser)
    );
    watch(
      () => userStore.getUser,
      () => {
        user.value = toRaw(userStore.getUser);
      }
    );

    // Login/logout functionality
    const userObtainingLoginAssistance: Ref<boolean> = ref(false);
    const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
      return user.value?.isLoggingIn && !processingStatus.value;
    });
    const logoutHandler = (): void => {
      navDrawerStatus.value = false;
      const userName = user.value.userName;
      appStore.logout();
      if (router.currentRoute.value.name !== 'home' && router.currentRoute.value.name !== 'sudoku') {
        router.push({ name: 'home' });
      }
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
      () => appStore.getProcessingStatus,
      () => {
        processingStatus.value = appStore.getProcessingStatus;
      }
    );
    watch(
      () => appStore.getServiceMessage,
      () => {
        const serviceMessage = appStore.getServiceMessage;
        if (serviceMessage === 'Status Code 200: Processed password reset request' 
          || serviceMessage === 'Status Code 200: Resent password reset request') {
          toast(serviceMessage, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.ERROR,
          });
          user.value.isLoggingIn = false;
          userObtainingLoginAssistance.value = false;
          appStore.updateServiceMessage('');
        }
      }
    );
    watch(
      () => user.value.isLoggingIn,
      () => {
        userStore.updateUser(user.value);
      }
    );
    watch(
      () => userStore.getUserIsLoggedIn,
      () => {
        const isLoggedIn = toRaw(userStore.getUserIsLoggedIn);
        const isSignedUp = toRaw(userStore.getUserIsSignedIn);
        if (isLoggedIn) {
          updateNavDrawerHandler();
          let toastMessage: string;
          user.value = toRaw(userStore.getUser);
          if (!isSignedUp) {
            toastMessage = `Welcome back ${user.value.userName}!`;
          } else {
            toastMessage = `Welcome to Sudoku Collective ${user.value.userName}!`;
            user.value.isSignedUp = false;
            userStore.updateUser(user.value);
          }
          toast(toastMessage, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.SUCCESS,
          });
        }
      }
    );
    watch(
      () => userStore.getConfirmedUserName,
      () => {
        const confirmedUserName = userStore.getConfirmedUserName;
        if (confirmedUserName !== '') {
          closeLoginAssistanceHandler();
        }
      }
    );

    // Sign up functionality
    const userIsSigningUp: ComputedRef<boolean> = computed(() => {
      return user.value?.isSigningUp && !processingStatus.value;
    });
    watch(
      () => user.value.isSigningUp,
      () => {
        userStore.updateUser(user.value);
      }
    );

    // Dialog formatting
    const isSmallViewPort: Ref<boolean> = ref(true);
    const maxDialogWidth: Ref<string> = ref('auto');
    const resetAppDialogViewPort = (): void => {
      if (window.innerWidth <= 960) {
        isSmallViewPort.value = true;
        maxDialogWidth.value = 'auto';
        navDrawerStatus.value = false;
        appStore.updateNavDrawerStatus(navDrawerStatus.value);
      } else {
        isSmallViewPort.value = false;
        maxDialogWidth.value = '960px';
        navDrawerStatus.value = true;
        appStore.updateNavDrawerStatus(navDrawerStatus.value);
      }
    };

    // Lifecycle hooks
    onMounted(async () => {
      await valuesStore.initializeStoreAsync();
      sudokuStore.initializeStore();
      serviceFailStore.initializeStore();
      resetAppDialogViewPort();
      let resizeTimeout: number | undefined;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          resetAppDialogViewPort();
        }, 250, 'Resized');
      });
    });
    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        resetAppDialogViewPort();
      });
    });

    return {
      isSmallViewPort,
      maxDialogWidth,
      user,
      processingStatus,
      navDrawerStatus,
      closeNavDrawerHandler,
      userObtainingLoginAssistance,
      userIsLoggingIn,
      userIsSigningUp,
      logoutHandler,
      openLoginAssistanceHandler,
      closeLoginAssistanceHandler,
      updateNavDrawerHandler
    };
  }
});
</script>

<style lang='scss'>
@import '@/assets/styles/site.scss';
</style>
