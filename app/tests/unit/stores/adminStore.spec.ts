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
  },
}));

describe('the adminStore store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
});