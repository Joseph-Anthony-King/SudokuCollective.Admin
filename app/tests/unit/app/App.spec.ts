import { createTestingPinia } from '@pinia/testing';
import { mount, flushPromises } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { defineComponent, h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App.vue';
import { DialogType } from '@/enums/dialogType';
import { User } from '@/models/domain/user';
import { useAdminStore } from '@/stores/adminStore';
import { useConfirmEmailStore } from '@/stores/confirmEmailStore';
import { useDialogStore } from '@/stores/dialogStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useServiceFailStore } from '@/stores/serviceFailStore';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useSudokuStore } from '@/stores/sudokuStore';
import { useUserStore } from '@/stores/userStore';
import { useValueStore } from '@/stores/valueStore';

const appMocks = vi.hoisted(() => ({
  router: {
    currentRoute: { value: { name: 'home', path: '/' } },
    push: vi.fn(),
  },
  vuetify: {
    display: { smAndDown: { value: true } },
  },
  toast: Object.assign(vi.fn(), {
    POSITION: { TOP_CENTER: 'top-center' },
    TYPE: { SUCCESS: 'success' },
  }),
  utilities: {
    clearStores: vi.fn(),
    updateAppProcessingAsync: vi.fn(async (method: () => unknown) => method()),
  },
}));

vi.mock('@/router/index', () => ({ default: appMocks.router }));
vi.mock('@/plugins/vuetify', () => ({ default: appMocks.vuetify }));
vi.mock('vue3-toastify', () => ({ toast: appMocks.toast }));
vi.mock('@/utilities/common', () => ({ default: () => appMocks.utilities }));

const slotStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const DialogStub = defineComponent({
  name: 'VDialog',
  emits: ['update:modelValue'],
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const AppBarStub = defineComponent({
  name: 'AppBar',
  emits: ['user-logging-in', 'user-signing-up', 'update-nav-drawer'],
  template: '<div data-testid="app-bar" />',
});

const NavigationDrawerStub = defineComponent({
  name: 'NavigationDrawer',
  emits: ['update:modelValue'],
  template: '<div data-testid="navigation-drawer" />',
});

const LoginFormStub = defineComponent({
  name: 'LoginForm',
  emits: ['cancel-login', 'obtain-login-assistance', 'redirect-to-signup'],
  template: '<div />',
});

const SignUpFormStub = defineComponent({
  name: 'SignUpForm',
  emits: ['cancel-signup', 'reset-redirect'],
  template: '<div />',
});

const UpdatePasswordFormStub = defineComponent({
  name: 'UpdatePasswordForm',
  emits: ['close-update-password'],
  template: '<div />',
});

const ConfirmEmailResultWidgetStub = defineComponent({
  name: 'ConfirmEmailResultWidget',
  emits: ['close-email-confirmed-widget'],
  template: '<div />',
});

const RouterViewStub = defineComponent({
  name: 'RouterView',
  template: '<div data-testid="router-view" />',
});

const ProgressWidgetStub = defineComponent({
  name: 'ProgressWidget',
  template: '<div data-testid="progress-widget" />',
});

const stubs = {
  'v-app': slotStub,
  'v-main': slotStub,
  'v-dialog': DialogStub,
  'router-view': RouterViewStub,
  'progress-widget': ProgressWidgetStub,
  AppBar: AppBarStub,
  NavigationDrawer: NavigationDrawerStub,
  LoginForm: LoginFormStub,
  SignUpForm: SignUpFormStub,
  UpdatePasswordForm: UpdatePasswordFormStub,
  ConfirmEmailResultWidget: ConfirmEmailResultWidgetStub,
  FooterNav: true,
  LoginAssistanceForm: true,
  ConfirmDialog: true,
  OkDialog: true,
};

interface MountOptions {
  innerWidth?: number;
  processingStatus?: boolean;
  stayLoggedIn?: boolean;
  user?: User;
}

describe('App.vue', () => {
  const wrappers: Array<{ unmount: () => void }> = [];
  let originalInnerWidth: number;
  let originalLocation: PropertyDescriptor | undefined;

  const mountApp = async (options: MountOptions = {}) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: options.innerWidth ?? 1280,
    });

    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const adminStore = useAdminStore(pinia);
    const confirmEmailStore = useConfirmEmailStore(pinia);
    const dialogStore = useDialogStore(pinia);
    const globalStore = useGlobalStore(pinia);
    const serviceFailStore = useServiceFailStore(pinia);
    const signUpFormStore = useSignUpFormStore(pinia);
    const sudokuStore = useSudokuStore(pinia);
    const userStore = useUserStore(pinia);
    const valueStore = useValueStore(pinia);

    globalStore.$state.processingStatus = options.processingStatus ?? false;
    globalStore.$state.stayLoggedIn = options.stayLoggedIn ?? true;
    userStore.$state.user = options.user ?? new User();

    const wrapper = mount(App, {
      global: {
        plugins: [pinia],
        stubs,
      },
    });
    wrappers.push(wrapper);
    await flushPromises();

    return {
      wrapper,
      adminStore,
      confirmEmailStore,
      dialogStore,
      globalStore,
      serviceFailStore,
      signUpFormStore,
      sudokuStore,
      userStore,
      valueStore,
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'addEventListener');
    appMocks.router.currentRoute.value = { name: 'home', path: '/' };
    appMocks.vuetify.display.smAndDown.value = true;
    appMocks.utilities.updateAppProcessingAsync.mockImplementation(async (method) => method());
    originalInnerWidth = window.innerWidth;
    originalLocation = Object.getOwnPropertyDescriptor(window, 'location');
  });

  afterEach(() => {
    wrappers.splice(0).forEach((wrapper) => wrapper.unmount());
    const resizeListeners = vi.mocked(window.addEventListener).mock.calls
      .filter(([type]) => type === 'resize')
      .map(([, listener]) => listener);
    resizeListeners.forEach((listener) => {
      window.removeEventListener('resize', listener as EventListener);
    });
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
    if (originalLocation) {
      Object.defineProperty(window, 'location', originalLocation);
    }
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('renders the app shell and switches between the router and progress widget', async () => {
    const { wrapper, globalStore } = await mountApp();

    expect(wrapper.find('[data-testid="app-bar"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="navigation-drawer"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="progress-widget"]').exists()).toBe(false);

    wrapper.vm.user.isObtainingAssistance = true;
    globalStore.$state.processingStatus = true;
    await nextTick();

    expect(wrapper.find('[data-testid="router-view"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="progress-widget"]').exists()).toBe(true);
    expect(wrapper.vm.userObtainingLoginAssistance).toBe(false);
  });

  it('initializes stores and clears them for a non-super-user who did not stay logged in', async () => {
    const { wrapper, adminStore, globalStore, serviceFailStore, sudokuStore, userStore, valueStore } =
      await mountApp({ innerWidth: 500, stayLoggedIn: false });

    expect(valueStore.initializeStoreAsync).toHaveBeenCalledOnce();
    expect(sudokuStore.initializeStore).toHaveBeenCalledOnce();
    expect(serviceFailStore.initializeStore).toHaveBeenCalledOnce();
    expect(adminStore.initializeStore).not.toHaveBeenCalled();
    expect(adminStore.getStatsAsync).not.toHaveBeenCalled();
    expect(appMocks.utilities.clearStores).toHaveBeenCalledOnce();
    expect(globalStore.updateNavDrawerStatus).toHaveBeenCalledWith(false);
    expect(wrapper.vm.isSmallViewPort).toBe(true);
    expect(wrapper.vm.maxFormWidth).toBe('auto');
    expect(wrapper.vm.maxDialogWidth).toBe('auto');

    wrapper.unmount();
    expect(appMocks.utilities.clearStores).toHaveBeenCalledTimes(2);
    wrappers.splice(wrappers.indexOf(wrapper), 1);
    expect(userStore.$state.user).toBeInstanceOf(User);
  });

  it('loads admin stats for super-users and debounces viewport resize handling', async () => {
    vi.useFakeTimers();
    const user = new User();
    user.isSuperUser = true;
    const { wrapper, adminStore, globalStore, userStore } = await mountApp({
      innerWidth: 1280,
      user,
    });

    expect(adminStore.initializeStore).toHaveBeenCalledOnce();
    expect(adminStore.getStatsAsync).toHaveBeenCalledOnce();
    expect(appMocks.utilities.clearStores).not.toHaveBeenCalled();
    expect(wrapper.vm.isSmallViewPort).toBe(false);
    expect(wrapper.vm.maxFormWidth).toBe('960px');
    expect(wrapper.vm.maxDialogWidth).toBe('480px');
    expect(globalStore.updateNavDrawerStatus).toHaveBeenCalledWith(true);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 });
    window.dispatchEvent(new Event('resize'));
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
    window.dispatchEvent(new Event('resize'));
    await vi.advanceTimersByTimeAsync(250);

    expect(wrapper.vm.isSmallViewPort).toBe(false);
    expect(wrapper.vm.maxFormWidth).toBe('960px');
    expect(userStore.$state.user.isSuperUser).toBe(true);
  });

  it('handles responsive navigation drawer updates and closes only an open drawer', async () => {
    const { wrapper, globalStore } = await mountApp();

    appMocks.vuetify.display.smAndDown.value = true;
    wrapper.vm.navDrawerStatus = true;
    wrapper.vm.updateNavDrawerHandler();
    expect(wrapper.vm.navDrawerStatus).toBe(false);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenLastCalledWith(false);

    appMocks.vuetify.display.smAndDown.value = false;
    wrapper.vm.updateNavDrawerHandler();
    expect(wrapper.vm.navDrawerStatus).toBe(true);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenLastCalledWith(true);

    wrapper.findComponent(NavigationDrawerStub).vm.$emit('update:modelValue', false);
    await nextTick();
    expect(wrapper.vm.navDrawerStatus).toBe(false);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenLastCalledWith(false);

    wrapper.vm.navDrawerStatus = true;
    const callsBeforeClose = vi.mocked(globalStore.updateNavDrawerStatus).mock.calls.length;
    wrapper.vm.closeNavDrawerHandler(true);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenCalledTimes(callsBeforeClose);
    wrapper.vm.closeNavDrawerHandler(false);
    expect(wrapper.vm.navDrawerStatus).toBe(false);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenLastCalledWith(false);
    wrapper.vm.closeNavDrawerHandler(false);
    expect(globalStore.updateNavDrawerStatus).toHaveBeenCalledTimes(callsBeforeClose + 1);
  });

  it('handles login, signup, assistance, and form close events', async () => {
    const { wrapper, confirmEmailStore, dialogStore, signUpFormStore, userStore } = await mountApp();
    const loginEvent = new Event('login', { cancelable: true });

    wrapper.findComponent(AppBarStub).vm.$emit('update-nav-drawer');
    wrapper.findComponent(AppBarStub).vm.$emit('user-logging-in');
    await nextTick();
    expect(wrapper.vm.user.isLoggingIn).toBe(true);

    wrapper.findComponent(AppBarStub).vm.$emit('user-signing-up');
    await nextTick();
    expect(wrapper.vm.user.isSigningUp).toBe(true);

    wrapper.findComponent(LoginFormStub).vm.$emit('obtain-login-assistance', loginEvent);
    expect(loginEvent.defaultPrevented).toBe(true);
    expect(wrapper.vm.user.isLoggingIn).toBe(false);
    expect(wrapper.vm.user.isObtainingAssistance).toBe(true);

    wrapper.vm.closeLoginAssistanceHandler(null);
    expect(wrapper.vm.user.isLoggingIn).toBe(true);
    expect(wrapper.vm.user.isObtainingAssistance).toBe(false);

    const redirectEvent = new Event('redirect', { cancelable: true });
    wrapper.vm.redirectToSignUpHandler(true, redirectEvent);
    expect(redirectEvent.defaultPrevented).toBe(true);
    expect(wrapper.vm.isRedirect).toBe(true);
    expect(wrapper.vm.user.isLoggingIn).toBe(false);
    expect(wrapper.vm.user.isSigningUp).toBe(true);
    expect(userStore.updateUser).toHaveBeenCalledWith(wrapper.vm.user);
    expect(dialogStore.initializeStore).toHaveBeenCalled();

    wrapper.findComponent(SignUpFormStub).vm.$emit('reset-redirect');
    expect(wrapper.vm.isRedirect).toBe(false);
    wrapper.vm.isRedirect = true;
    wrapper.findComponent(SignUpFormStub).vm.$emit('cancel-signup');
    expect(wrapper.vm.user.isSigningUp).toBe(false);
    expect(wrapper.vm.isRedirect).toBe(false);

    wrapper.findComponent(LoginFormStub).vm.$emit('cancel-login');
    expect(wrapper.vm.user.isLoggingIn).toBe(false);
    wrapper.findComponent(UpdatePasswordFormStub).vm.$emit('close-update-password');
    wrapper.findComponent(ConfirmEmailResultWidgetStub).vm.$emit('close-email-confirmed-widget');
    expect(signUpFormStore.initializeStore).toHaveBeenCalled();
    expect(confirmEmailStore.initializeStore).toHaveBeenCalled();

    wrapper.findAllComponents(DialogStub).forEach((dialog) => {
      dialog.vm.$emit('update:modelValue', false);
    });
  });

  it('handles logout routes and the logout-state watcher', async () => {
    const user = new User();
    user.userName = 'test-user';
    const { wrapper, dialogStore, globalStore, userStore } = await mountApp({ user });
    const event = new Event('logout', { cancelable: true });

    appMocks.router.currentRoute.value.name = 'home';
    wrapper.vm.logoutHandler(event);
    expect(event.defaultPrevented).toBe(true);
    expect(appMocks.router.push).not.toHaveBeenCalled();

    appMocks.router.currentRoute.value.name = 'sudoku';
    wrapper.vm.logoutHandler(null);
    expect(appMocks.router.push).not.toHaveBeenCalled();

    appMocks.router.currentRoute.value.name = 'dashboard';
    wrapper.vm.logoutHandler();
    expect(appMocks.router.push).toHaveBeenCalledWith('/');
    expect(appMocks.toast).toHaveBeenCalledWith(
      'test-user, you are logged out.',
      expect.objectContaining({ type: 'success' }),
    );
    expect(globalStore.logout).toHaveBeenCalledTimes(3);
    expect(dialogStore.initializeStore).toHaveBeenCalledTimes(3);

    appMocks.router.currentRoute.value.name = 'home';
    userStore.$state.userIsLoggingOut = true;
    await nextTick();
    expect(userStore.updateUserIsLoggingOut).toHaveBeenCalledWith(false);
  });

  it('handles password reset messages and confirmed-user-name updates', async () => {
    const { wrapper, globalStore, userStore } = await mountApp();

    globalStore.$state.serviceMessage = 'Some other message';
    await nextTick();
    expect(appMocks.toast).not.toHaveBeenCalled();

    globalStore.$state.serviceMessage = 'Status Code 200: Processed password reset request';
    await nextTick();
    expect(appMocks.toast).toHaveBeenCalledWith(
      'Status Code 200: Processed password reset request',
      expect.objectContaining({ type: 'success' }),
    );
    expect(globalStore.updateServiceMessage).toHaveBeenCalledWith('');

    globalStore.$state.serviceMessage = 'Status Code 200: Resent password reset request';
    await nextTick();
    expect(appMocks.toast).toHaveBeenCalledTimes(2);

    userStore.$state.confirmedUserName = 'confirmed-user';
    await nextTick();
    expect(wrapper.vm.user.isLoggingIn).toBe(true);
    expect(wrapper.vm.user.isObtainingAssistance).toBe(false);

    userStore.$state.confirmedUserName = null;
    await nextTick();
  });

  it('synchronizes login and signup state between the user and its store', async () => {
    const { wrapper, userStore } = await mountApp();

    const detachedUser = new User();
    wrapper.vm.user = detachedUser;
    detachedUser.isLoggingIn = true;
    detachedUser.isSigningUp = true;
    await nextTick();
    expect(userStore.updateUserIsLoggingIn).toHaveBeenCalledWith(true);
    expect(userStore.updateUserIsSigningUp).toHaveBeenCalledWith(true);

    wrapper.vm.user = new User();
    const storeUser = new User();
    storeUser.isLoggingIn = true;
    storeUser.isSigningUp = true;
    userStore.$state.user = storeUser;
    await nextTick();
    expect(wrapper.vm.user.isLoggingIn).toBe(true);
    expect(wrapper.vm.user.isSigningUp).toBe(true);

    const detachedStoreUser = new User();
    detachedStoreUser.isLoggingIn = true;
    detachedStoreUser.isSigningUp = true;
    wrapper.vm.user = detachedStoreUser;
    await nextTick();

    userStore.$state.user.isLoggingIn = false;
    userStore.$state.user.isSigningUp = false;
    await nextTick();
    expect(wrapper.vm.user.isLoggingIn).toBe(false);
    expect(wrapper.vm.user.isSigningUp).toBe(false);
  });

  it('routes newly logged-in users and handles the signed-up redirect branch', async () => {
    const { wrapper, dialogStore, userStore } = await mountApp();

    const returningUser = new User();
    returningUser.userName = 'returning-user';
    returningUser.isLoggedIn = true;
    appMocks.router.currentRoute.value.name = 'home';
    userStore.$state.user = returningUser;
    await nextTick();

    expect(appMocks.toast).toHaveBeenCalledWith(
      'Welcome back returning-user!',
      expect.objectContaining({ type: 'success' }),
    );
    expect(appMocks.router.push).toHaveBeenCalledWith('/dashboard');

    userStore.$state.user.isLoggedIn = false;
    await nextTick();
    const signedUpUser = new User();
    signedUpUser.isLoggedIn = true;
    signedUpUser.isSignedUp = true;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '/' },
    });
    userStore.$state.user = signedUpUser;
    await nextTick();

    expect(wrapper.vm.user.isSignedUp).toBe(false);
    expect(userStore.updateUser).toHaveBeenCalledWith(wrapper.vm.user);
    expect(window.location.href).toBe('/user-profile');
    expect(dialogStore.updateDialogIsActive).toHaveBeenCalledWith(true);
  });

  it('keeps logged-in sudoku users on the current route', async () => {
    const { userStore } = await mountApp();
    const user = new User();
    user.isLoggedIn = true;
    appMocks.router.currentRoute.value.name = 'sudoku';

    userStore.$state.user = user;
    await nextTick();

    expect(appMocks.router.push).not.toHaveBeenCalled();
  });

  it('follows signup redirects and evaluates confirmation and dialog visibility', async () => {
    const {
      wrapper,
      confirmEmailStore,
      dialogStore,
      globalStore,
      signUpFormStore,
    } = await mountApp();

    globalStore.$state.redirectToSignUp = true;
    await nextTick();
    expect(wrapper.vm.isRedirect).toBe(true);
    expect(wrapper.vm.user.isSigningUp).toBe(true);
    expect(globalStore.updateRedirectToSignUp).toHaveBeenCalledWith(false);

    confirmEmailStore.$state.isSuccess = true;
    signUpFormStore.$state.openPasswordResetForm = true;
    dialogStore.$state.isActive = true;
    dialogStore.$state.dialogType = DialogType.OK;
    await nextTick();
    expect(wrapper.vm.emailConfirmed).toBe(true);
    expect(wrapper.vm.userResettingPassword).toBe(true);
    expect(wrapper.vm.okDialogIsActive).toBe(true);
    expect(wrapper.vm.confirmDialogIsActive).toBe(false);

    dialogStore.$state.dialogType = DialogType.CONFIRM;
    await nextTick();
    expect(wrapper.vm.okDialogIsActive).toBe(false);
    expect(wrapper.vm.confirmDialogIsActive).toBe(true);

    globalStore.$state.processingStatus = true;
    await nextTick();
    expect(wrapper.vm.emailConfirmed).toBe(false);
    expect(wrapper.vm.userResettingPassword).toBe(false);
    expect(wrapper.vm.okDialogIsActive).toBe(false);
    expect(wrapper.vm.confirmDialogIsActive).toBe(false);

    confirmEmailStore.$state.isSuccess = false;
    dialogStore.$state.isActive = false;
    await nextTick();
    expect(wrapper.vm.emailConfirmed).toBe(false);
    expect(wrapper.vm.okDialogIsActive).toBe(false);
  });
});