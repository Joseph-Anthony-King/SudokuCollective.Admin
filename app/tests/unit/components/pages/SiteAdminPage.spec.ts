import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SiteAdminPage from '@/components/pages/SiteAdminPage.vue';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';

describe('SiteAdminPage.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore(pinia);
    userStore.updateUser(new User());
  });

  const mountPage = (action?: string) =>
    mount(SiteAdminPage, {
      props: action === undefined ? {} : { action },
      global: {
        plugins: [pinia],
        stubs: {
          AdminSummaryWidget: { template: '<div data-testid="admin-summary" />' },
          AdminUsersWidget: { template: '<div data-testid="admin-users" />' },
          AdminAppsWidget: { template: '<div data-testid="admin-apps" />' },
          AdminDropdownWidget: { template: '<div data-testid="admin-dropdown" />' },
          VContainer: { template: '<div><slot /></div>' },
          VCard: { template: '<section><slot /></section>' },
          VCardText: { template: '<div><slot /></div>' },
          VCardTitle: { template: '<h1><slot /></h1>' },
        },
      },
    });

  it('renders the site administration widgets', () => {
    const wrapper = mountPage();

    expect(wrapper.get('.headline').text()).toBe('Site Administration');
    expect(wrapper.get('[data-testid="admin-summary"]').attributes('data-testid')).toBe(
      'admin-summary',
    );
    expect(wrapper.get('[data-testid="admin-users"]').attributes('data-testid')).toBe(
      'admin-users',
    );
    expect(wrapper.get('[data-testid="admin-apps"]').attributes('data-testid')).toBe('admin-apps');
    expect(wrapper.get('[data-testid="admin-dropdown"]').attributes('data-testid')).toBe(
      'admin-dropdown',
    );
  });

  it('marks the current user as logging in when the action is login, ignoring case', () => {
    const user = new User();
    userStore.updateUser(user);
    const updateUser = vi.spyOn(userStore, 'updateUser');

    mountPage('LoGiN');

    expect(user.isLoggingIn).toBe(true);
    expect(updateUser).toHaveBeenCalledWith(user);
  });

  it.each(['', 'dashboard', 'LOGIN-NOW'])(
    'does not update the user for action %s',
    (action) => {
      const user = new User();
      userStore.updateUser(user);
      const updateUser = vi.spyOn(userStore, 'updateUser');

      mountPage(action);

      expect(user.isLoggingIn).toBe(false);
      expect(updateUser).not.toHaveBeenCalled();
    },
  );
});