import { defineComponent, h, type PropType } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AppBar from '@/components/navigation/AppBar.vue';
import { ExteriorLinks } from '@/utilities/links/exteriorLinks';
import { useDialogStore } from '@/stores/dialogStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { DialogType } from '@/enums/dialogType';

const utilities = vi.hoisted(() => ({
  resetViewPort: vi.fn((isSmallViewPort: { value: boolean }) => {
    isSmallViewPort.value = true;
  }),
}));
const exteriorLinkFixtures = ExteriorLinks.slice();

vi.mock('@/utilities/common', () => ({
  default: () => utilities,
}));

const SlotStub = defineComponent({
  name: 'SlotStub',
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const MenuStub = defineComponent({
  name: 'VMenu',
  setup(_, { slots }) {
    return () => h('div', { class: 'v-menu' }, [slots.activator?.({ props: {} }), slots.default?.()]);
  },
});

const TooltipStub = defineComponent({
  name: 'VTooltip',
  setup(_, { slots }) {
    return () => h('div', { class: 'v-tooltip' }, [slots.activator?.({ props: {} }), slots.default?.()]);
  },
});

const ButtonStub = defineComponent({
  name: 'VBtn',
  props: {
    icon: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          'data-icon': props.icon,
        },
        slots.default?.(),
      );
  },
});

describe('AppBar.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let userStore: ReturnType<typeof useUserStore>;
  let dialogStore: ReturnType<typeof useDialogStore>;
  let originalInnerWidth: number;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore(pinia);
    dialogStore = useDialogStore(pinia);
    userStore.updateUser(new User());
    vi.spyOn(dialogStore, 'updateDialog');
    originalInnerWidth = window.innerWidth;
    vi.clearAllMocks();
  });

  afterEach(() => {
    ExteriorLinks.splice(0, ExteriorLinks.length, ...exteriorLinkFixtures);
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: originalInnerWidth,
    });
    vi.useRealTimers();
  });

  const mountBar = () =>
    mount(AppBar, {
      global: {
        plugins: [
          pinia,
        ],
        mocks: {
          $vuetify: {
            display: { smAndDown: window.innerWidth <= 600 },
          },
        },
        stubs: {
          VAppBar: SlotStub,
          VAppBarNavIcon: {
            template: '<button data-testid="nav-icon" @click="$emit(\'click\', $event)" />',
            emits: ['click'],
          },
          VAppBarTitle: SlotStub,
          RouterLink: { template: '<a><slot /></a>' },
          VImg: { template: '<img :alt="alt" :src="src" />', props: ['alt', 'src'] },
          VSpacer: { template: '<span />' },
          VMenu: MenuStub,
          VTooltip: TooltipStub,
          VBtn: ButtonStub,
          VList: SlotStub,
          VListItem: SlotStub,
          VListItemTitle: SlotStub,
          VIcon: { template: '<i><slot /></i>' },
        },
      },
    });

  it('renders the brand, interior links, and logged-out actions', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 });
    const wrapper = mountBar();

    expect(wrapper.text()).toContain('Sudoku Collective Admin Console');
    expect(wrapper.find('img[alt="Vuetify Logo"]').attributes('src')).toBe('/images/logo.png');
    expect(wrapper.text()).toContain('Play Sudoku');
    expect(wrapper.text()).toContain('Login');
    expect(wrapper.text()).toContain('Sign Up');
    expect(wrapper.text()).not.toContain('Log Out');
    expect(wrapper.find('[data-testid="nav-icon"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('API Status');
    expect(wrapper.text()).toContain('API Documentation');
    expect(wrapper.text()).toContain('API GitHub Page');
    expect(wrapper.text()).toContain('Admin App GitHub Page');
  });

  it('omits the exterior links menu and divider when only one link is available', () => {
    ExteriorLinks.splice(1);
    const wrapper = mountBar();

    expect(wrapper.findAll('.v-menu')).toHaveLength(1);
    expect(wrapper.find('hr').exists()).toBe(false);
  });

  it('emits login and signup events and prevents the default event', async () => {
    const user = new User();
    user.isLoggedIn = false;
    userStore.updateUser(user);
    const wrapper = mountBar();

    const login = wrapper.findAll('.menu-item').find((item) => item.text().includes('Login'));
    const signUp = wrapper.findAll('.menu-item').find((item) => item.text().includes('Sign Up'));
    expect(login).toBeDefined();
    expect(signUp).toBeDefined();

    const loginEvent = new Event('click', { cancelable: true });
    await login!.element.dispatchEvent(loginEvent);
    expect(loginEvent.defaultPrevented).toBe(true);
    expect(wrapper.emitted('user-logging-in')).toEqual([[null, null]]);

    const signUpEvent = new Event('click', { cancelable: true });
    await signUp!.element.dispatchEvent(signUpEvent);
    expect(signUpEvent.defaultPrevented).toBe(true);
    expect(wrapper.emitted('user-signing-up')).toEqual([[null, null]]);
  });

  it('shows logged-in menu actions, updates the user reactively, and handles logout choices', async () => {
    const user = new User();
    user.userName = 'sudoku-user';
    user.isLoggedIn = true;
    userStore.updateUser(user);

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 500 });
    const wrapper = mountBar();

    expect(wrapper.find('[data-testid="nav-icon"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Log Out');
    expect(wrapper.text()).not.toContain('Sign Up');
    expect(wrapper.text()).not.toContain('Login');

    await wrapper.find('[data-testid="nav-icon"]').trigger('click');
    expect(wrapper.emitted('update-nav-drawer')).toEqual([[null, null]]);

    const loggedOutUser = new User();
    userStore.updateUser(loggedOutUser);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Login');
    expect(wrapper.text()).not.toContain('Log Out');

    userStore.updateUser(user);
    await wrapper.vm.$nextTick();
    const logoutItem = wrapper.findAll('.menu-item').find((item) => item.text().includes('Log Out'));
    expect(logoutItem).toBeDefined();
    await logoutItem!.trigger('click');

    expect(dialogStore.updateDialog).toHaveBeenCalledWith(
      'Confirm Logout',
      'Are you sure you want to log out sudoku-user?',
      DialogType.CONFIRM,
      expect.any(Function),
      expect.any(Function),
    );
    const dialogCall = vi.mocked(dialogStore.updateDialog).mock.calls.at(-1)!;
    const confirm = dialogCall[3];
    const cancel = dialogCall[4];
    expect(typeof confirm).toBe('function');
    expect(typeof cancel).toBe('function');
    if (typeof confirm === 'function') {
      await confirm();
    }
    expect(userStore.userIsLoggingOut).toBe(true);
    if (typeof cancel === 'function') {
      await cancel();
    }
    expect(userStore.userIsLoggingOut).toBe(false);
  });

  it('handles null handler events and resize lifecycle callbacks', async () => {
    vi.useFakeTimers();
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const wrapper = mountBar();

    expect(utilities.resetViewPort).toHaveBeenCalled();
    const resizeHandler = addEventListener.mock.calls.find(([name]) => name === 'resize')?.[1];
    expect(resizeHandler).toBeDefined();
    if (typeof resizeHandler === 'function') {
      resizeHandler(new Event('resize'));
    }

    await vi.advanceTimersByTimeAsync(250);
    expect(utilities.resetViewPort).toHaveBeenCalledTimes(2);
    await wrapper.vm.$nextTick();
    wrapper.unmount();

    const cleanupHandler = removeEventListener.mock.calls.find(([name]) => name === 'resize')?.[1];
    expect(cleanupHandler).toBeDefined();
    if (typeof cleanupHandler === 'function') {
      cleanupHandler(new Event('resize'));
    }

    expect(dialogStore.updateDialog).not.toHaveBeenCalled();
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });
});