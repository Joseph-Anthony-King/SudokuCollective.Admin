import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NavigationDrawer from '@/components/navigation/NavigationDrawer.vue';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { NavDrawerLinks } from '@/utilities/links/navDrawerLinks';

const linkFixtures = NavDrawerLinks.slice();
const linkFixtureValues = NavDrawerLinks.map((item) => ({ ...item }));

const SlotStub = defineComponent({
  setup(_, { slots }) {
    return () => h('div', slots.default?.());
  },
});

const DrawerStub = defineComponent({
  props: {
    modelValue: { type: Boolean, default: false },
    permanent: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'aside',
        {
          'data-model-value': String(props.modelValue),
          'data-permanent': String(props.permanent),
        },
        slots.default?.(),
      );
  },
});

describe('NavigationDrawer.vue', () => {
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    userStore = useUserStore();
    userStore.updateUser(new User());
    NavDrawerLinks.splice(0, NavDrawerLinks.length, ...linkFixtures);
    NavDrawerLinks.forEach((item, index) => {
      Object.assign(item, linkFixtureValues[index]);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mountDrawer = (
    props: { navDrawerStatus?: boolean; userLoggedIn?: boolean } = {
      navDrawerStatus: true,
      userLoggedIn: true,
    },
    mdAndUp = false,
  ) =>
    mount(NavigationDrawer, {
      props,
      global: {
        mocks: {
          $vuetify: { display: { mdAndUp } },
        },
        stubs: {
          VNavigationDrawer: DrawerStub,
          VList: SlotStub,
          VListItem: SlotStub,
          VListItemTitle: SlotStub,
          VIcon: { template: '<i><slot /></i>' },
          RouterLink: {
            props: ['to'],
            template: '<a :href="to"><slot /></a>',
          },
        },
      },
    });

  it('does not render when the userLoggedIn prop is false', () => {
    const wrapper = mountDrawer({ userLoggedIn: false });

    expect(wrapper.find('aside').exists()).toBe(false);
  });

  it('renders the profile, available links, drawer props, and morning greeting', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 8));
    const user = new User();
    user.userName = 'sudoku-user';
    user.isLoggedIn = true;
    user.isSuperUser = true;
    userStore.updateUser(user);

    const wrapper = mountDrawer({ navDrawerStatus: true, userLoggedIn: true }, true);

    expect(wrapper.get('aside').attributes('data-model-value')).toBe('true');
    expect(wrapper.get('aside').attributes('data-permanent')).toBe('true');
    expect(wrapper.text()).toContain('Good Morning,');
    expect(wrapper.text()).toContain('sudoku-user');
    expect(wrapper.findAll('.nav-drawer-item').map((link) => link.text())).toEqual([
      'Home',
      'Dashboard',
      'Site Administration',
      'User Profile',
    ]);
    expect(wrapper.get('a[href="/user-profile"]').text()).toBe('User Profile');
  });

  it('shows the afternoon greeting and keeps the site admin link hidden for non-superusers', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 14));
    const user = new User();
    user.userName = 'regular-user';
    user.isLoggedIn = true;
    user.isSuperUser = false;
    userStore.updateUser(user);

    const wrapper = mountDrawer({ navDrawerStatus: false, userLoggedIn: true });

    expect(wrapper.get('aside').attributes('data-model-value')).toBe('false');
    expect(wrapper.get('aside').attributes('data-permanent')).toBe('false');
    expect(wrapper.text()).toContain('Good Afternoon,');
    expect(wrapper.text()).not.toContain('Site Administration');
  });

  it('handles a navigation list without a site administration item', () => {
    NavDrawerLinks.splice(2, 1);
    const user = new User();
    user.isLoggedIn = true;
    user.isSuperUser = true;
    userStore.updateUser(user);

    const wrapper = mountDrawer();

    expect(wrapper.findAll('.nav-drawer-item').map((link) => link.text())).toEqual([
      'Home',
      'Dashboard',
      'User Profile',
    ]);
  });

  it('shows the evening greeting and hides the site admin link when a superuser becomes a regular user', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 20));
    const superUser = new User();
    superUser.userName = 'admin-user';
    superUser.isLoggedIn = true;
    superUser.isSuperUser = true;
    userStore.updateUser(superUser);

    const wrapper = mountDrawer();

    expect(wrapper.text()).toContain('Good Evening,');
    expect(wrapper.text()).toContain('Site Administration');

    const regularUser = new User();
    regularUser.userName = 'regular-user';
    regularUser.isLoggedIn = true;
    regularUser.isSuperUser = false;
    userStore.updateUser(regularUser);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('Site Administration');
    expect(wrapper.text()).toContain('regular-user');
  });

  it('refreshes the greeting on the minute interval', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 11, 59));
    const wrapper = mountDrawer();

    expect(wrapper.text()).toContain('Good Morning,');
    await vi.advanceTimersByTimeAsync(60_000);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Good Afternoon,');
  });
});