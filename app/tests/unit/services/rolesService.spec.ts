import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { RolesPort } from '@/ports/rolesPort';
import { RolesService } from '@/services/rolesService';
import { StaticServiceMethods } from '@/services/common';
import type { IRoleRequestData } from '@/interfaces/requests/iRoleRequestData';

vi.mock('@/ports/rolesPort', () => ({
  RolesPort: {
    getRoleAsync: vi.fn(),
    getRolesAsync: vi.fn(),
    postRoleAsync: vi.fn(),
    putRoleAsync: vi.fn(),
    deleteRoleAsync: vi.fn(),
  },
}));

const role = {
  id: 12,
  name: 'administrator',
  roleLevel: 3,
};

const roles = [role, { ...role, id: 13, name: 'moderator' }];

const requestData: IRoleRequestData = { ...role };

const operations = [
  {
    name: 'getRoleAsync',
    run: () => RolesService.getRoleAsync(role.id),
    getPortMock: () => vi.mocked(RolesPort.getRoleAsync),
    expected: { role },
  },
  {
    name: 'getRolesAsync',
    run: () => RolesService.getRolesAsync(),
    getPortMock: () => vi.mocked(RolesPort.getRolesAsync),
    expected: { roles },
  },
  {
    name: 'postRoleAsync',
    run: () => RolesService.postRoleAsync(requestData),
    getPortMock: () => vi.mocked(RolesPort.postRoleAsync),
    expected: { role },
  },
  {
    name: 'putRoleAsync',
    run: () => RolesService.putRoleAsync(requestData),
    getPortMock: () => vi.mocked(RolesPort.putRoleAsync),
    expected: { role },
  },
  {
    name: 'deleteRoleAsync',
    run: () => RolesService.deleteRoleAsync(role.id),
    getPortMock: () => vi.mocked(RolesPort.deleteRoleAsync),
    expected: {},
  },
];

describe('the rolesService service', () => {
  const successMessage = 'Status Code 200: Role request succeeded.';
  let processFailedResponse: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    processFailedResponse = vi
      .spyOn(StaticServiceMethods, 'processFailedResponse')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it.each(operations)('should handle successful $name responses', async (operation) => {
    operation.getPortMock().mockResolvedValue({
      data: {
        isSuccess: true,
        message: successMessage,
        payload: operation.name === 'getRolesAsync' ? roles : [role],
      },
    } as AxiosResponse);

    const result = await operation.run();

    expect(result).toEqual({
      ...operation.expected,
      isSuccess: true,
      message: successMessage,
    });
    expect(processFailedResponse).not.toHaveBeenCalled();
  });

  it.each(operations)('should handle unsuccessful $name responses', async (operation) => {
    const message = 'Role request failed.';
    operation.getPortMock().mockResolvedValue({
      data: {
        isSuccess: false,
        message,
        payload: [],
      },
    } as AxiosResponse);

    const result = await operation.run();

    expect(result).toEqual({ isSuccess: false, message });
    expect(processFailedResponse).not.toHaveBeenCalled();
  });

  it.each(operations)('should process Axios errors from $name', async (operation) => {
    vi.stubEnv('NODE_ENV', 'development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const response = {
      data: { isSuccess: false, message: 'Not found.' },
      status: 404,
    };
    const error = Object.assign(new Error('Request failed'), { response }) as AxiosError;
    operation.getPortMock().mockResolvedValue(error);

    const result = await operation.run();

    expect(result).toEqual({ isSuccess: false, message: 'Not found.' });
    expect(processFailedResponse).toHaveBeenCalledWith(response);
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
  });

  it.each(operations)('should handle non-Axios errors from $name', async (operation) => {
    vi.stubEnv('NODE_ENV', 'test');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const error = new Error('Unexpected failure');
    operation.getPortMock().mockResolvedValue(error as never);

    const result = await operation.run();

    expect(result).toEqual({ isSuccess: false, message: error.message });
    expect(processFailedResponse).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });
});
