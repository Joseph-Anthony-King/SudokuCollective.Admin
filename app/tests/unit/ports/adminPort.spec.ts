import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminPort } from '@/ports/adminPort';
import { Endpoints } from '@/ports/adminPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';

vi.mock('axios', () => ({
  default: vi.fn(),
}));

vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: vi.fn(),
}));

vi.mock('@/stores/userStore', () => ({
  useUserStore: vi.fn(),
}));

describe('the adminPort port', () => {
  const globalStore = { getToken: 'test-token' };
  const userStore = { getUser: { id: 42 } };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGlobalStore).mockReturnValue(globalStore as ReturnType<typeof useGlobalStore>);
    vi.mocked(useUserStore).mockReturnValue(userStore as ReturnType<typeof useUserStore>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('should post stats with the authorization and request data', async () => {
    const response = { data: { total: 10 } };
    vi.mocked(axios).mockResolvedValue(response as never);

    const result = await AdminPort.getStatsAsync();

    expect(result).toBe(response);
    expect(useGlobalStore).toHaveBeenCalledOnce();
    expect(useUserStore).toHaveBeenCalledOnce();
    expect(axios).toHaveBeenCalledWith({
      method: 'post',
      url: Endpoints.adminEndpoint,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer test-token',
      },
      data: {
        license: process.env.VITE_APP_LICENSE,
        requestorId: 42,
        appId: process.env.VITE_APP_ID,
        paginator: {},
        payload: {},
      },
    });
  });

  it('should return and log a forced error in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await AdminPort.getStatsAsync(true);

    expect(result).toMatchObject({
      message: 'testErrorHandling is true, testing error handling...',
    });
    expect(axios).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith('error: ', result);
  });

  it('should return errors without logging outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const error = new Error('request failed');
    vi.mocked(axios).mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await AdminPort.getStatsAsync(false);

    expect(result).toBe(error);
    expect(consoleError).not.toHaveBeenCalled();
  });

  it('should post a cache flush with the authorization and request data', async () => {
    const response = { data: { success: true } };
    vi.mocked(axios).mockResolvedValue(response as never);

    const result = await AdminPort.postFlushCacheAsync();

    expect(result).toBe(response);
    expect(useGlobalStore).toHaveBeenCalledOnce();
    expect(useUserStore).toHaveBeenCalledOnce();
    expect(axios).toHaveBeenCalledOnce();
    expect(axios).toHaveBeenCalledWith({
      method: 'post',
      url: Endpoints.adminFlushEndpoint,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer test-token',
      },
      data: {
        license: process.env.VITE_APP_LICENSE,
        requestorId: 42,
        appId: process.env.VITE_APP_ID,
        paginator: {},
        payload: {},
      },
    });
  });

  it('should return and log a forced cache flush error in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await AdminPort.postFlushCacheAsync(true);

    expect(result).toMatchObject({
      message: 'testErrorHandling is true, testing error handling...',
    });
    expect(useGlobalStore).not.toHaveBeenCalled();
    expect(useUserStore).not.toHaveBeenCalled();
    expect(axios).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledOnce();
    expect(consoleError).toHaveBeenCalledWith('error: ', result);
  });

  it('should return cache flush request errors without logging outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const error = new Error('request failed');
    vi.mocked(axios).mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    const result = await AdminPort.postFlushCacheAsync(false);

    expect(result).toBe(error);
    expect(axios).toHaveBeenCalledOnce();
    expect(consoleError).not.toHaveBeenCalled();
  });
});