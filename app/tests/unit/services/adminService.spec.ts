import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminPort } from '@/ports/adminPort';
import { StaticServiceMethods } from '@/services/common';
import { AdminService } from '@/services/adminService';

vi.mock('@/ports/adminPort', () => ({
  AdminPort: {
    getStatsAsync: vi.fn(),
  },
}));

vi.mock('@/services/common', () => ({
  StaticServiceMethods: {
    processFailedResponse: vi.fn(),
  },
}));

describe('the adminService service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('returns the admin summary when the stats request succeeds', async () => {
    const adminSummary = { applicationsCount: 3 };
    vi.mocked(AdminPort.getStatsAsync).mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Stats retrieved.',
        payload: [adminSummary],
      },
    } as never);

    const result = await AdminService.getStatsAsync();

    expect(result).toEqual({
      adminSummary,
      isSuccess: true,
      message: 'Stats retrieved.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });

  it('returns the unsuccessful response message', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(AdminPort.getStatsAsync).mockResolvedValue({
      data: {
        isSuccess: false,
        message: 'Stats could not be retrieved.',
      },
    } as never);

    const result = await AdminService.getStatsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Stats could not be retrieved.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });

  it('logs and returns an error response and processes its failure details', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = {
      status: 500,
      data: {
        isSuccess: false,
        message: 'Server error.',
      },
    };
    const error = { response };
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(AdminPort.getStatsAsync).mockResolvedValue(error as never);

    const result = await AdminService.getStatsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Server error.',
    });
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });

  it('returns a plain error message without processing a failed response', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const error = new Error('Network error.');
    vi.mocked(AdminPort.getStatsAsync).mockResolvedValue(error as never);

    const result = await AdminService.getStatsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Network error.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
});