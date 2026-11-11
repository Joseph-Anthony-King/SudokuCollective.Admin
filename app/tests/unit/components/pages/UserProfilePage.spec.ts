import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UserProfilePage from '@/components/pages/UserProfilePage.vue';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';

describe('UserProfilePage.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore(pinia);
    userStore.updateUser(new User());
  });

  const mountPage = (action?: string) =>
    mount(UserProfilePage, {
      props: action === undefined ? {} : { action },
      global: {
        plugins: [pinia],
        stubs: {
          UserProfileForm: { template: '<div data-testid="user-profile-form" />' },
          VContainer: { template: '<div><slot /></div>' },
          VCard: { template: '<section><slot /></section>' },
          VCardText: { template: '<div><slot /></div>' },
        },
      },
    });

  it('renders the user profile form', () => {
    const wrapper = mountPage();

    expect(wrapper.get('[data-testid="user-profile-form"]').attributes('data-testid')).toBe(
      'user-profile-form',
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

  it.each(['', 'profile', 'LOGIN-NOW'])(
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