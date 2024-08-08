import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { GamesService } from '@/services/gamesService/index';
import { StaticServiceMethods } from '@/services/common';
import { GamesPort } from '@/ports/gamesPort';
import { JobsPort } from '@/ports/jobsPort';
import { SolutionsPort } from '@/ports/solutionsPort';

describe('the gamesService service', () => {
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should create games by running the createGameAsync method', async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            { 
              rows: [
                [ 0, 1, 0, 0, 0, 5, 0, 0, 3 ],
                [ 0, 4, 0, 3, 1, 0, 2, 0, 0 ],
                [ 0, 0, 0, 9, 0, 6, 4, 0, 0 ],
                [ 9, 0, 7, 1, 0, 0, 0, 0, 0 ],
                [ 0, 5, 0, 7, 9, 8, 0, 6, 0 ],
                [ 0, 0, 0, 0, 0, 3, 9, 0, 1 ],
                [ 0, 0, 2, 5, 0, 9, 0, 0, 0 ],
                [ 0, 0, 8, 0, 4, 1, 0, 5, 0 ],
                [ 4, 0, 0, 8, 0, 0, 0, 3, 0 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=3',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    // Act
    const result = await sut.createGameAsync(3);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Game was created.');
    expect(result.game.length).equals(9);
  });
  it('should create hard and evil games with referral to the jobsPort by running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Game was created.');
    expect(result.game.length).equals(9);
    expect(difficultyLevel).greaterThan(3);
  });
  it('should catch AxiosErrors thrown by the gamesPort when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Game was not created.', 
            payload: [] 
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Game was not created.');
    expect(JobsPort.pollJobAsync).not.toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledOnce();
  });
  it('should catch any errors thrown by the gamesPort when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
    expect(JobsPort.pollJobAsync).not.toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalledOnce();
  });
  it('should catch AxiosErrors thrown by the jobsPort.pollJobAsync method when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Job retrieval for job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 failed.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Job retrieval for job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 failed.');
    expect(JobsPort.pollJobAsync).toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledOnce();
  });
  it('should process any errors thrown by the jobsPort.pollJobAsync method when running the createGameAsync method', {
    timeout: 6000
  }, async() => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
    expect(JobsPort.pollJobAsync).toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalledOnce();
  });
  it('should catch AxiosErrors thrown by the jobsPort.getJobAsync method when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Job retrieval for job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 failed.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Job retrieval for job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 failed.');
    expect(JobsPort.pollJobAsync).toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledOnce();
  });
  it('should process any errors thrown by the jobsPort.getJobAsync method when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
    expect(JobsPort.pollJobAsync).toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).toHaveBeenCalledOnce();
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalledOnce();
  });
  it('should return false if the createGameAsync method is called using a difficulty level of 0', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 0;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(difficultyLevel).equals(0);
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Number cannot be zero.');
    expect(GamesPort.getCreateGameAsync).not.toHaveBeenCalledOnce();
    expect(JobsPort.pollJobAsync).not.toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(sut.downloadTheGame).not.toHaveBeenCalledOnce();
  });
  it('should return false if an erroneous 200 is returned by the gamesPort.getCreateGameAsync method with an isSuccess of false when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 200: Erroneous result returned.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            {
              rows: [
                [ 0, 0, 0, 4, 0, 0, 3, 0, 6 ],
                [ 2, 7, 0, 5, 0, 8, 0, 0, 0 ],
                [ 0, 3, 9, 0, 0, 0, 5, 2, 0 ],
                [ 6, 0, 2, 9, 0, 0, 0, 3, 5 ],
                [ 0, 4, 3, 0, 0, 5, 7, 0, 0 ],
                [ 0, 5, 0, 2, 0, 0, 0, 0, 0 ],
                [ 0, 0, 0, 0, 5, 7, 0, 8, 0 ],
                [ 0, 0, 0, 0, 0, 0, 0, 6, 0 ],
                [ 8, 9, 7, 0, 0, 0, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
    expect(GamesPort.getCreateGameAsync).toHaveBeenCalledOnce();
    expect(JobsPort.pollJobAsync).not.toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).not.toHaveBeenCalledOnce();
    expect(sut.downloadTheGame).not.toHaveBeenCalledOnce();
  });
  it('should return false if an erroneous 200 is returned by the jobsPort.getJobAsync method with an isSuccess of false when running the createGameAsync method', {
    timeout: 6000
  }, async () => {
    // Arrange
    GamesPort.getCreateGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 202: Create game job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 scheduled.',
          payload: [
            {
              jobId: '4a7db2de-0673-463f-ac92-b96d8c68a2b4'
            }
          ]
        },
        status: 202,
        statusText: 'ACCEPTED',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    JobsPort.pollJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job 4a7db2de-0673-463f-ac92-b96d8c68a2b4 is completed with status succeeded.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/poll?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    JobsPort.getJobAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 200: Erroneous result returned.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'jobs/get?jobId=4a7db2de-0673-463f-ac92-b96d8c68a2b4',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const downloadTheGameSpy = vi.spyOn(GamesService, 'downloadTheGame');

    downloadTheGameSpy.mockImplementation(() => {
      return [
        [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
        [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
        [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
        [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
        [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
        [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
        [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
        [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
        [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
      ];
    });
    
    const sut = GamesService;

    const difficultyLevel = 4;

    // Act
    const result = await sut.createGameAsync(difficultyLevel);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
    expect(GamesPort.getCreateGameAsync).toHaveBeenCalledOnce();
    expect(JobsPort.pollJobAsync).toHaveBeenCalledOnce();
    expect(JobsPort.getJobAsync).toHaveBeenCalledOnce();
    expect(sut.downloadTheGame).not.toHaveBeenCalledOnce();
  });
  it('should check if games are completed by running the checkGameAsync method', async () => {
    // Arrange
    GamesPort.postCheckGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was solved.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/checkannonymous',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });
    
    const sut = GamesService;

    const matrix = [
      [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
      [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
      [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
      [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
      [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
      [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
      [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
      [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
      [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.checkGameAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Game was solved.');
  });
  it('should catch AxiosErrors thrown by the gamesPort when running the checkGameAsync method', async () => {
    // Arrange
    GamesPort.postCheckGameAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'games/checkannonymous',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: Game was not solved.',
            payload: []
          },
          status: 400,
          statusText: 'BAD REQUEST',
        }
      } as AxiosError;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [		
      [ '', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.checkGameAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 400: Game was not solved.');
  });
  it('should catch any errors thrown by the gamesPort when running the checkGameAsync method', async () => {
    // Arrange
    GamesPort.postCheckGameAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [		
      [ '0', '0', '0', '4', '0', '0', '3', '0', '6' ],
      [ '2', '7', '0', '5', '0', '8', '0', '0', '0' ],
      [ '0', '3', '9', '0', '0', '0', '5', '2', '0' ],
      [ '6', '0', '2', '9', '0', '0', '0', '3', '5' ],
      [ '0', '4', '3', '0', '0', '5', '7', '0', '0' ],
      [ '0', '5', '0', '2', '0', '0', '0', '0', '0' ],
      [ '0', '0', '0', '0', '5', '7', '0', '8', '0' ],
      [ '0', '0', '0', '0', '0', '0', '0', '6', '0' ],
      [ '8', '9', '7', '0', '0', '0', '4', '5', '3' ]
    ];

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    // Act
    const result = await sut.checkGameAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if the checkGameAsync method is called using an invalid matrix', async () => {
    // Arrange
    GamesPort.postCheckGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was solved.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/checkannonymous',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return false;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '5', '8', '1', '4', '9', '2', '3', '7' ],
      [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
      [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
      [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
      [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
      [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
      [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
      [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
      [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.checkGameAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Sudoku matrix is not valid.');
  });
  it('should return false if an erroneous 200 is returned by the gamesPort.postCheckGameAsync method with an isSuccess of false when running the createGameAsync method', async () => {
    // Arrange
    GamesPort.postCheckGameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 200: Erroneous result returned.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/checkannonymous',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
      [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
      [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
      [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
      [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
      [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
      [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
      [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
      [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.checkGameAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');

  });
  it('should solve sudoku puzzles by running the SolvePuzzleAsync method', async () => {
    // Arrange
    SolutionsPort.postSolveAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: Sudoku solution was found.',
          payload: [
            {
              rows: [
                [ 5, 8, 1, 4, 9, 2, 3, 7, 6 ],
                [ 2, 7, 6, 5, 3, 8, 9, 4, 1 ],
                [ 4, 3, 9, 7, 6, 1, 5, 2, 8 ],
                [ 6, 1, 2, 9, 7, 4, 8, 3, 5 ],
                [ 9, 4, 3, 6, 8, 5, 7, 1, 2 ],
                [ 7, 5, 8, 2, 1, 3, 6, 9, 4 ],
                [ 1, 6, 4, 3, 5, 7, 2, 8, 9 ],
                [ 3, 2, 5, 8, 4, 9, 1, 6, 7 ],
                [ 8, 9, 7, 1, 2, 6, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'solutions/solve',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });
    
    const sut = GamesService;

    const matrix = [
      [ '', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.solvePuzzleAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 201: Sudoku solution was found.');
    expect(result.puzzle.length).toBe(9);
  });
  it('should catch AxiosErrors thrown by the solutionsPort when running the SolvePuzzleAsync method', async () => {
    // Arrange
    SolutionsPort.postSolveAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'solutions/solve',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 503: Service unavailable.', 
            payload: [] 
          },
          status: 503,
          statusText: 'SERVICE UNAVAILABLE',
        }
      } as AxiosError;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '1', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.solvePuzzleAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 503: Service unavailable.');
  });
  it('should catch any errors thrown by the solutionsPort when running the SolvePuzzleAsync method', async () => {
    // Arrange
    SolutionsPort.postSolveAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '1', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.solvePuzzleAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned by the solutionsPort.postSolveAsync method with an isSuccess of false when running the SolvePuzzleAsync method', async () => {
    // Arrange
    SolutionsPort.postSolveAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 200: Erroneous result returned.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'solutions/solve',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.solvePuzzleAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should return false if the SolvePuzzleAsync method is called using an invalid matrix', async () => {
    // Arrange
    SolutionsPort.postSolveAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: Sudoku solution was found.',
          payload: [
            {
              rows: [
                [ 5, 8, 1, 4, 9, 2, 3, 7, 6 ],
                [ 2, 7, 6, 5, 3, 8, 9, 4, 1 ],
                [ 4, 3, 9, 7, 6, 1, 5, 2, 8 ],
                [ 6, 1, 2, 9, 7, 4, 8, 3, 5 ],
                [ 9, 4, 3, 6, 8, 5, 7, 1, 2 ],
                [ 7, 5, 8, 2, 1, 3, 6, 9, 4 ],
                [ 1, 6, 4, 3, 5, 7, 2, 8, 9 ],
                [ 3, 2, 5, 8, 4, 9, 1, 6, 7 ],
                [ 8, 9, 7, 1, 2, 6, 4, 5, 3 ]
              ]
            }
          ]
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'solutions/solve',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return false;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    const matrix = [
      [ '', '', '', '4', '', '', '3', '' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    const result = await sut.solvePuzzleAsync(matrix);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Sudoku matrix is not valid.');
  });
  it('it should generate sudoku puzzles by running the generateSolutionAsync method', async () => {
    // Arrange
    SolutionsPort.getGenerateAsync = vi.fn().mockImplementation(() => {      
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Solution was generated.',
          payload: [
            {
              rows: [
                [ 9, 2, 1, 7, 5, 6, 3, 8, 4 ],
                [ 3, 4, 8, 2, 1, 9, 5, 7, 6 ],
                [ 5, 6, 7, 3, 4, 8, 2, 9, 1 ],
                [ 6, 7, 3, 1, 2, 4, 9, 5, 8 ],
                [ 2, 1, 5, 9, 8, 7, 4, 6, 3 ],
                [ 8, 9, 4, 6, 3, 5, 1, 2, 7 ],
                [ 7, 3, 2, 5, 6, 1, 8, 4, 9 ],
                [ 1, 8, 9, 4, 7, 2, 6, 3, 5 ],
                [ 4, 5, 6, 8, 9, 3, 7, 1, 2 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'solutions/generate',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const isSudokuMatrixValidSpy = vi.spyOn(GamesService, 'isSudokuMatrixValid');

    isSudokuMatrixValidSpy.mockImplementation(() => {
      return true;
    });
    
    const sut = GamesService;

    // Act
    const result = await sut.generateSolutionAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Solution was generated.');
    expect(result.solution.length).toBe(9);
  });
  it('should catch AxiosErrors thrown by the solutionsPort when running the generateSolutionAsync method', async () => {
    // Arrange
    SolutionsPort.getGenerateAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'solutions/generate',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 503: Service unavailable.', 
            payload: [] 
          },
          status: 503,
          statusText: 'SERVICE UNAVAILABLE',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    // Act
    const result = await sut.generateSolutionAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 503: Service unavailable.');
  });
  it('should catch any errors thrown by the solutionsPort when running the generateSolutionAsync method', async () => {
    // Arrange
    SolutionsPort.getGenerateAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    // Act
    const result = await sut.generateSolutionAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned by the solutionsPort.getGenerateAsync method with an isSuccess of false when running the generateSolutionAsync method', async () => {
        // Arrange
    SolutionsPort.getGenerateAsync = vi.fn().mockImplementation(() => {      
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 200: Erroneous result returned.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'solutions/generate',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');
    
    const sut = GamesService;

    // Act
    const result = await sut.generateSolutionAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should download the game from an AxiosResponse by running the downloadTheGame method', () => {
    // Arrange
    const response = {
      data: {
        isSuccess: true,
        isFromCache: false,
        message: 'Status Code 200: Game was created.',
        payload: [
          { 
            rows: [
              [ 0, 1, 0, 0, 0, 5, 0, 0, 3 ],
              [ 0, 4, 0, 3, 1, 0, 2, 0, 0 ],
              [ 0, 0, 0, 9, 0, 6, 4, 0, 0 ],
              [ 9, 0, 7, 1, 0, 0, 0, 0, 0 ],
              [ 0, 5, 0, 7, 9, 8, 0, 6, 0 ],
              [ 0, 0, 0, 0, 0, 3, 9, 0, 1 ],
              [ 0, 0, 2, 5, 0, 9, 0, 0, 0 ],
              [ 0, 0, 8, 0, 4, 1, 0, 5, 0 ],
              [ 4, 0, 0, 8, 0, 0, 0, 3, 0 ]
            ]
          }
        ]
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: 'games/createannonymous?DifficultyLevel=3',
        method: 'get',
        baseURL: 'https://localhost:5001/api/v1/'
      },
      request: {}
    } as AxiosResponse;

    const sut = GamesService;

    // Act
    const result = sut.downloadTheGame(response);

    // Assert
    expect(result.length).equals(9);
    expect(result[0].length).equals(9);
    expect(result[0][0]).equals('');
  });
  it('should return an error when downloading an invalid game when running the downloadTheGame method', () => {
    try {
      // Arrange
      const response = {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Game was created.',
          payload: [
            { 
              rows: [
                [ 0, 1, 0, 0, 0, 5, 0, 0 ],
                [ 0, 4, 0, 3, 1, 0, 2, 0, 0 ],
                [ 0, 0, 0, 9, 0, 6, 4, 0, 0 ],
                [ 9, 0, 7, 1, 0, 0, 0, 0, 0 ],
                [ 0, 5, 0, 7, 9, 8, 0, 6, 0 ],
                [ 0, 0, 0, 0, 0, 3, 9, 0, 1 ],
                [ 0, 0, 2, 5, 0, 9, 0, 0, 0 ],
                [ 0, 0, 8, 0, 4, 1, 0, 5, 0 ],
                [ 4, 0, 0, 8, 0, 0, 0, 3, 0 ]
              ]
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'games/createannonymous?DifficultyLevel=3',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = GamesService;
  
      // Act
      sut.downloadTheGame(response);
    } catch (error) {
      const message = (<Error>error).message;
      expect(message).equals('Rows are invalid.')
    }
  });
  it('should return true if a sudoku matrix is valid when tested with the isSudokuMatrixValid method', () => {
    // Arrange
    const matrix = [
      [ '1', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    const sut = GamesService;

    // Act
    const result = sut.isSudokuMatrixValid(matrix);

    // Assert
    expect(matrix.length).equals(9);
    expect(matrix.filter(row => row.length === 9).length).equals(9);
    expect(result).toBe(true);
  });
  it('should return false if a sudoku matrix is valid when tested with the isSudokuMatrixValid method', () => {
    // Arrange
    const matrix = [
      [ '1', '', '', '4', '', '', '3', '' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    const sut = GamesService;

    // Act
    const result = sut.isSudokuMatrixValid(matrix);

    // Assert
    expect(matrix.length).equals(9);
    expect(matrix.filter(row => row.length === 9).length).equals(8);
    expect(result).toBe(false);
  });
});
