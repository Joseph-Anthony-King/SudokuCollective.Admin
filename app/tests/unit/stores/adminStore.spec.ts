import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia } from 'pinia';
import { toRaw } from 'vue';
import { App } from '@/models/domain/app';
import { User } from '@/models/domain/user';
import { AdminSummary } from '@/models/infrastructure/adminSummary';
import { AdminService } from '@/services/adminService';
import { AppsService } from '@/services/appsService';
import { UsersService } from '@/services/usersService';
import { useAdminStore } from '@/stores/adminStore';

vi.mock('@/services/adminService', () => ({
  AdminService: {
    getStatsAsync: vi.fn(),
  },
}));

vi.mock('@/services/usersService', () => ({
  UsersService: {
    getUsersAsync: vi.fn(),
  },
}));

vi.mock('@/services/appsService', () => ({
  AppsService: {
    getAppsAsync: vi.fn(),
    putActivateAppAsync: vi.fn(),
    putDeactivateAppAsync: vi.fn(),
  },
}));

describe('the adminStore store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('initializes state and exposes its getters', () => {
    const store = useAdminStore(createPinia());

    expect(store.adminSummary).toBeInstanceOf(AdminSummary);
    expect(store.getAdminSummary).toBe(store.adminSummary);
    expect(store.users).toEqual([]);
    expect(store.getUsers).toBe(store.users);
    expect(store.apps).toEqual([]);
    expect(store.getApps).toBe(store.apps);
  });

  it('updates the summary, users, and apps', () => {
    const store = useAdminStore(createPinia());
    const adminSummary = new AdminSummary(1);
    const users = [new User()];
    const apps = [new App()];

    store.updateAdminSummary(adminSummary);
    store.updateUsers(users);
    store.updateApps(apps);

    expect(toRaw(store.adminSummary)).toBe(adminSummary);
    expect(toRaw(store.getAdminSummary)).toBe(adminSummary);
    expect(toRaw(store.users)).toBe(users);
    expect(toRaw(store.getUsers)).toBe(users);
    expect(toRaw(store.apps)).toBe(apps);
    expect(toRaw(store.getApps)).toBe(apps);
  });

  it('clears state when initialized', () => {
    const store = useAdminStore(createPinia());
    store.updateAdminSummary(new AdminSummary(5));
    store.updateUsers([new User()]);
    store.updateApps([new App()]);

    store.initializeStore();

    expect(store.adminSummary).toEqual(new AdminSummary());
    expect(store.users).toEqual([]);
    expect(store.apps).toEqual([]);
  });

  it('loads stats, users, and apps when every service succeeds', async () => {
    const store = useAdminStore(createPinia());
    const adminSummary = new AdminSummary(5);
    const users = [new User()];
    const apps = [new App()];
    vi.mocked(AdminService.getStatsAsync).mockResolvedValue({
      isSuccess: true,
      adminSummary,
    });
    vi.mocked(UsersService.getUsersAsync).mockResolvedValue({
      isSuccess: true,
      users,
    });
    vi.mocked(AppsService.getAppsAsync).mockResolvedValue({
      isSuccess: true,
      apps,
    });

    const result = await store.getStatsAsync();

    expect(result).toBe(true);
    expect(toRaw(store.adminSummary)).toBe(adminSummary);
    expect(toRaw(store.users)).toBe(users);
    expect(toRaw(store.apps)).toBe(apps);
    expect(AdminService.getStatsAsync).toHaveBeenCalledOnce();
    expect(UsersService.getUsersAsync).toHaveBeenCalledOnce();
    expect(AppsService.getAppsAsync).toHaveBeenCalledOnce();
  });

  it('stops loading when the stats service fails', async () => {
    const store = useAdminStore(createPinia());
    vi.mocked(AdminService.getStatsAsync).mockResolvedValue({ isSuccess: false });

    const result = await store.getStatsAsync();

    expect(result).toBe(false);
    expect(UsersService.getUsersAsync).not.toHaveBeenCalled();
    expect(AppsService.getAppsAsync).not.toHaveBeenCalled();
  });

  it('stops loading when the users service fails', async () => {
    const store = useAdminStore(createPinia());
    const adminSummary = new AdminSummary(5);
    vi.mocked(AdminService.getStatsAsync).mockResolvedValue({
      isSuccess: true,
      adminSummary,
    });
    vi.mocked(UsersService.getUsersAsync).mockResolvedValue({ isSuccess: false });

    const result = await store.getStatsAsync();

    expect(result).toBe(false);
    expect(toRaw(store.adminSummary)).toBe(adminSummary);
    expect(AppsService.getAppsAsync).not.toHaveBeenCalled();
  });

  it('returns false when the apps service fails', async () => {
    const store = useAdminStore(createPinia());
    const adminSummary = new AdminSummary(5);
    const users = [new User()];
    vi.mocked(AdminService.getStatsAsync).mockResolvedValue({
      isSuccess: true,
      adminSummary,
    });
    vi.mocked(UsersService.getUsersAsync).mockResolvedValue({
      isSuccess: true,
      users,
    });
    vi.mocked(AppsService.getAppsAsync).mockResolvedValue({ isSuccess: false });

    const result = await store.getStatsAsync();

    expect(result).toBe(false);
    expect(toRaw(store.adminSummary)).toBe(adminSummary);
    expect(toRaw(store.users)).toBe(users);
  });

  it('activates an app and updates it in the store', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    existingApp.isActive = false;
    const updatedApp = new App();
    updatedApp.id = 1;
    updatedApp.isActive = true;
    store.updateApps([existingApp]);
    vi.mocked(AppsService.putActivateAppAsync).mockResolvedValue({
      isSuccess: true,
      app: updatedApp,
    });

    const result = await store.putActivateAppAsync(1);

    expect(result).toBe(true);
    expect(AppsService.putActivateAppAsync).toHaveBeenCalledWith(1);
    expect(toRaw(store.apps[0])).toBe(updatedApp);
  });

  it('does not update stored apps when activation returns no app or a different app', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    store.updateApps([existingApp]);
    const differentApp = new App();
    differentApp.id = 2;
    vi.mocked(AppsService.putActivateAppAsync)
      .mockResolvedValueOnce({ isSuccess: true })
      .mockResolvedValueOnce({ isSuccess: true, app: differentApp });

    expect(await store.putActivateAppAsync(1)).toBe(true);
    expect(await store.putActivateAppAsync(1)).toBe(true);
    expect(toRaw(store.apps[0])).toBe(existingApp);
  });

  it('returns false when app activation fails', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    store.updateApps([existingApp]);
    vi.mocked(AppsService.putActivateAppAsync).mockResolvedValue({
      isSuccess: false,
      app: new App(),
    });

    const result = await store.putActivateAppAsync(1);

    expect(result).toBe(false);
    expect(toRaw(store.apps[0])).toBe(existingApp);
  });

  it('catches activation errors with and without development logging', async () => {
    const store = useAdminStore(createPinia());
    const developmentError = new Error('Development error');
    const testError = new Error('Test error');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubEnv('NODE_ENV', 'development');
    vi.mocked(AppsService.putActivateAppAsync)
      .mockRejectedValueOnce(developmentError)
      .mockRejectedValueOnce(testError);

    expect(await store.putActivateAppAsync(1)).toBe(false);
    vi.stubEnv('NODE_ENV', 'test');
    expect(await store.putActivateAppAsync(1)).toBe(false);
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith('error: ', developmentError);
  });

  it('deactivates an app and updates it in the store', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    existingApp.isActive = true;
    const updatedApp = new App();
    updatedApp.id = 1;
    updatedApp.isActive = false;
    store.updateApps([existingApp]);
    vi.mocked(AppsService.putDeactivateAppAsync).mockResolvedValue({
      isSuccess: true,
      app: updatedApp,
    });

    const result = await store.putDeactivateAppAsync(1);

    expect(result).toBe(true);
    expect(AppsService.putDeactivateAppAsync).toHaveBeenCalledWith(1);
    expect(toRaw(store.apps[0])).toBe(updatedApp);
  });

  it('does not update stored apps when deactivation returns no app or a different app', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    store.updateApps([existingApp]);
    const differentApp = new App();
    differentApp.id = 2;
    vi.mocked(AppsService.putDeactivateAppAsync)
      .mockResolvedValueOnce({ isSuccess: true })
      .mockResolvedValueOnce({ isSuccess: true, app: differentApp });

    expect(await store.putDeactivateAppAsync(1)).toBe(true);
    expect(await store.putDeactivateAppAsync(1)).toBe(true);
    expect(toRaw(store.apps[0])).toBe(existingApp);
  });

  it('returns false when app deactivation fails', async () => {
    const store = useAdminStore(createPinia());
    const existingApp = new App();
    existingApp.id = 1;
    store.updateApps([existingApp]);
    vi.mocked(AppsService.putDeactivateAppAsync).mockResolvedValue({
      isSuccess: false,
      app: new App(),
    });

    const result = await store.putDeactivateAppAsync(1);

    expect(result).toBe(false);
    expect(toRaw(store.apps[0])).toBe(existingApp);
  });

  it('catches deactivation errors with and without development logging', async () => {
    const store = useAdminStore(createPinia());
    const developmentError = new Error('Development error');
    const testError = new Error('Test error');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubEnv('NODE_ENV', 'development');
    vi.mocked(AppsService.putDeactivateAppAsync)
      .mockRejectedValueOnce(developmentError)
      .mockRejectedValueOnce(testError);

    expect(await store.putDeactivateAppAsync(1)).toBe(false);
    vi.stubEnv('NODE_ENV', 'test');
    expect(await store.putDeactivateAppAsync(1)).toBe(false);
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith('error: ', developmentError);
  });
});