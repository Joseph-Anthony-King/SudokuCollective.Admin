import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { RolesPort } from '@/ports/rolesPort';
import { Endpoints } from '@/ports/rolesPort/endpoints';
import type { IRoleRequestData } from '@/interfaces/requests/iRoleRequestData';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';

vi.mock('axios', () => ({
  default: vi.fn(),
}));

vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: vi.fn(() => ({ getToken: 'test-token' })),
}));

vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(() => ({ getUser: { id: 17 } })),
}));

const role: IRoleRequestData = {
  id: 12,
  name: 'administrator',
  roleLevel: 3,
};

const operations = [
  {
    name: 'getRoleAsync',
    run: (testErrorHandling?: boolean | null) => RolesPort.getRoleAsync(12, testErrorHandling),
    method: 'get',
    url: `${Endpoints.rolesEndpoint}/12`,
  },
  {
    name: 'getRolesAsync',
    run: (testErrorHandling?: boolean | null) => RolesPort.getRolesAsync(testErrorHandling),
    method: 'get',
    url: Endpoints.rolesEndpoint,
  },
  {
    name: 'postRoleAsync',
    run: (testErrorHandling?: boolean | null) => RolesPort.postRoleAsync(role, testErrorHandling),
    method: 'post',
    url: Endpoints.rolesEndpoint,
    data: {
      license: process.env.VITE_APP_LICENSE,
      requestorId: 17,
      appId: process.env.VITE_APP_ID,
      paginator: {},
      payload: {
        name: role.name,
        displayName: role.roleLevel,
      },
    },
  },
  {
    name: 'putRoleAsync',
    run: (testErrorHandling?: boolean | null) => RolesPort.putRoleAsync(role, testErrorHandling),
    method: 'put',
    url: Endpoints.rolesEndpoint,
    data: {
      license: process.env.VITE_APP_LICENSE,
      requestorId: 17,
      appId: process.env.VITE_APP_ID,
      paginator: {},
      payload: {
        id: role.id,
        name: role.name,
        displayName: role.roleLevel,
      },
    },
  },
  {
    name: 'deleteRoleAsync',
    run: (testErrorHandling?: boolean | null) => RolesPort.deleteRoleAsync(12, testErrorHandling),
    method: 'delete',
    url: `${Endpoints.rolesEndpoint}/12`,
  },
];

describe('the rolesPort port', () => {
  const response = { data: { isSuccess: true } } as AxiosResponse;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios).mockResolvedValue(response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should have the expected endpoint', () => {
    expect(Endpoints.rolesEndpoint).toBe('https://localhost:5001/api/v1/roles');
  });

  it.each(operations)('should call axios with the expected config for $name', async (operation) => {
    const result = await operation.run();

    expect(result).toBe(response);
    expect(axios).toHaveBeenCalledWith({
      method: operation.method,
      url: operation.url,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer test-token',
      },
      ...(operation.data === undefined ? {} : { data: operation.data }),
    });
    expect(useGlobalStore).toHaveBeenCalled();
    if (operation.data !== undefined) {
      expect(useUserStore).toHaveBeenCalled();
    }
  });

  it.each(operations)(
    'should return and log a test error for $name in development',
    async (operation) => {
      vi.stubEnv('NODE_ENV', 'development');
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const result = await operation.run(true);

      expect(result).toBeInstanceOf(Error);
      expect((result as Error).message).toContain('testing error handling');
      expect(consoleError).toHaveBeenCalledWith('error: ', result);
      expect(axios).not.toHaveBeenCalled();
    },
  );

  it.each(operations)(
    'should return an axios error without logging outside development for $name',
    async (operation) => {
      vi.stubEnv('NODE_ENV', 'test');
      const error = new Error('request failed') as AxiosError;
      vi.mocked(axios).mockRejectedValue(error);
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

      const result = await operation.run();

      expect(result).toBe(error);
      expect(consoleError).not.toHaveBeenCalled();
    },
  );
});
