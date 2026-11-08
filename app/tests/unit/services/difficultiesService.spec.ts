import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { DifficultiesPort } from '@/ports/difficultiesPort';
import { DifficultiesService } from '@/services/difficultiesService';
import { StaticServiceMethods } from '@/services/common';
import type { IDifficultyRequestData } from '@/interfaces/requests/iDifficultyRequestData';

vi.mock('@/ports/difficultiesPort', () => ({
  DifficultiesPort: {
    getDifficultyAsync: vi.fn(),
    getDifficultiesAsync: vi.fn(),
    postDifficultyAsync: vi.fn(),
    putDifficultyAsync: vi.fn(),
    deleteDifficultyAsync: vi.fn(),
  },
}));

const difficulty = {
  id: 12,
  name: 'test-difficulty',
  displayName: 'Test Difficulty',
  difficultyLevel: 3,
};

const difficulties = [difficulty, { ...difficulty, id: 13, name: 'another-difficulty' }];

const requestData: IDifficultyRequestData = {
  ...difficulty,
};

const operations = [
  {
    name: 'getDifficultyAsync',
    run: () => DifficultiesService.getDifficultyAsync(difficulty.id),
    getPortMock: () => vi.mocked(DifficultiesPort.getDifficultyAsync),
    expected: { difficulty },
  },
  {
    name: 'getDifficultiesAsync',
    run: () => DifficultiesService.getDifficultiesAsync(),
    getPortMock: () => vi.mocked(DifficultiesPort.getDifficultiesAsync),
    expected: { difficulties },
  },
  {
    name: 'postDifficultyAsync',
    run: () => DifficultiesService.postDifficultyAsync(requestData),
    getPortMock: () => vi.mocked(DifficultiesPort.postDifficultyAsync),
    expected: { difficulty },
  },
  {
    name: 'putDifficultyAsync',
    run: () => DifficultiesService.putDifficultyAsync(requestData),
    getPortMock: () => vi.mocked(DifficultiesPort.putDifficultyAsync),
    expected: { difficulty },
  },
  {
    name: 'deleteDifficultyAsync',
    run: () => DifficultiesService.deleteDifficultyAsync(difficulty.id),
    getPortMock: () => vi.mocked(DifficultiesPort.deleteDifficultyAsync),
    expected: {},
  },
];

describe('the difficultiesService service', () => {
  const successMessage = 'Status Code 200: Difficulty request succeeded.';
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
        payload: operation.name === 'getDifficultiesAsync' ? difficulties : [difficulty],
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
    const message = 'Difficulty request failed.';
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
