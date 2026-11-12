import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SiteAdminPage from '@/components/pages/SiteAdminPage.vue';
import { useAdminStore } from '@/stores/adminStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { useDialogStore } from '@/stores/dialogStore';
import { DialogType } from '@/enums/dialogType';

describe('SiteAdminPage.vue', () => {
  let pinia: ReturnType<typeof createPinia>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
    userStore = useUserStore(pinia);
    userStore.updateUser(new User());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
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
          AvailableActions: { template: '<div><slot /></div>' },
          VContainer: { template: '<div><slot /></div>' },
          VCard: { template: '<section><slot /></section>' },
          VCardText: { template: '<div><slot /></div>' },
          VCardTitle: { template: '<h1><slot /></h1>' },
          VRow: { template: '<div><slot /></div>' },
          VCol: { template: '<div><slot /></div>' },
          VTooltip: { template: '<div><slot name="activator" :props="{}" /><slot /></div>' },
          VBtn: { template: '<button><slot /></button>' },
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

  it('requires confirmation before calling each corresponding store action', async () => {
    const adminStore = useAdminStore(pinia);
    const dialogStore = useDialogStore(pinia);
    const addSolutions = vi.spyOn(adminStore, 'postAddSolutionsAsync').mockResolvedValue(true);
    const flushCache = vi.spyOn(adminStore, 'postFlushCacheAsync').mockResolvedValue(true);
    const wrapper = mountPage();
    const buttons = wrapper.findAll('button');
    const addSolutionsButton = buttons.find((button) => button.text() === 'Add Solutions');
    const flushButton = buttons.find((button) => button.text() === 'Flush Cache');

    expect(addSolutionsButton).toBeDefined();
    expect(flushButton).toBeDefined();
    await addSolutionsButton!.trigger('click');
    expect(dialogStore.getDialogTitle).toBe('Confirm Add Solutions');
    expect(dialogStore.getDialogMessage).toBe('Are you sure you want to add 100 solutions to the system?');
    expect(dialogStore.getDialogType).toBe(DialogType.CONFIRM);
    expect(dialogStore.getDialogIsActive).toBe(true);
    expect(addSolutions).not.toHaveBeenCalled();

    await dialogStore.performConfirmedAction();
    expect(addSolutions).toHaveBeenCalledOnce();
    expect(addSolutions).toHaveBeenCalledWith();
    expect(flushCache).not.toHaveBeenCalled();

    await flushButton!.trigger('click');
    expect(dialogStore.getDialogTitle).toBe('Confirm Flush Cache');
    expect(dialogStore.getDialogMessage).toBe('Are you sure you want to flush the system cache?');
    expect(dialogStore.getDialogType).toBe(DialogType.CONFIRM);
    await dialogStore.performConfirmedAction();
    expect(flushCache).toHaveBeenCalledOnce();
    expect(flushCache).toHaveBeenCalledWith();
    expect(addSolutions).toHaveBeenCalledOnce();
  });

  it('polls stats every 30 seconds for super users', async () => {
    vi.useFakeTimers();
    const user = new User();
    user.isSuperUser = true;
    userStore.updateUser(user);
    const getStats = vi.spyOn(useAdminStore(pinia), 'getStatsAsync').mockResolvedValue(true);
    mountPage();

    await vi.advanceTimersByTimeAsync(29999);
    expect(getStats).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(getStats).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(30000);
    expect(getStats).toHaveBeenCalledTimes(2);
  });

  it('does not poll stats for users who are not super users', async () => {
    vi.useFakeTimers();
    const getStats = vi.spyOn(useAdminStore(pinia), 'getStatsAsync').mockResolvedValue(true);
    mountPage();

    await vi.advanceTimersByTimeAsync(60000);
    expect(getStats).not.toHaveBeenCalled();
  });
});