import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import type { AxiosError, AxiosResponse } from 'axios';
import { JobsPort } from '@/ports/jobsPort/index';
import { Endpoints } from '@/ports/jobsPort/endpoints';

describe('the jobsPort port', () => {
  let testServer: SetupServerApi | null;
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.getEndpoint).equals('https://localhost:5001/api/v1/jobs/get?jobId=');
    expect(Endpoints.pollEndpoint).equals('https://localhost:5001/api/v1/jobs/poll?jobId=');
  });
  it('should get the results of a completed job by running the getJobAsync method', async () => {
    testServer = setupServer(
      http.get('https://localhost:5001/api/v1/jobs/get?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: "Status Code 200: Game was created.",
          payload: [
            {
              "rows": [
                [ 0, 4, 0, 5, 0, 3, 6, 0, 8 ],
                [ 5, 3, 0, 0, 0, 4, 0, 0, 7 ],
                [ 2, 0, 0, 0, 1, 0, 0, 0, 0 ],
                [ 0, 0, 7, 0, 0, 8, 0, 4, 0 ],
                [ 4, 0, 0, 0, 0, 0, 0, 0, 2 ],
                [ 0, 8, 0, 4, 0, 0, 5, 0, 0 ],
                [ 0, 0, 0, 0, 5, 0, 0, 0, 6 ],
                [ 6, 0, 0, 0, 0, 0, 0, 2, 3 ],
                [ 1, 0, 3, 7, 0, 6, 0, 0, 0 ]
              ]
            }
          ]
        }, {
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
    );

    testServer.listen();

    const sut = JobsPort;

    // Act
    const result = await sut.getJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7') as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Game was created.');
  });
  it('should catch AxiosErrors thrown when running the getJobAsync method', async () => {
    try {
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/jobs/get?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: "Status Code 404: Job retrieval for job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 failed.",
            payload: []
          }, {
            status: 404,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = JobsPort;
  
      // Act
      await sut.getJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7') as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Job retrieval for job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 failed.');
      
    }
  });
  it('should catch any errors thrown when running the getJobAsync method', async () => {
    try {
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/jobs/get?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: "Status Code 200: Game was created.",
            payload: [
              {
                "rows": [
                  [ 0, 4, 0, 5, 0, 3, 6, 0, 8 ],
                  [ 5, 3, 0, 0, 0, 4, 0, 0, 7 ],
                  [ 2, 0, 0, 0, 1, 0, 0, 0, 0 ],
                  [ 0, 0, 7, 0, 0, 8, 0, 4, 0 ],
                  [ 4, 0, 0, 0, 0, 0, 0, 0, 2 ],
                  [ 0, 8, 0, 4, 0, 0, 5, 0, 0 ],
                  [ 0, 0, 0, 0, 5, 0, 0, 0, 6 ],
                  [ 6, 0, 0, 0, 0, 0, 0, 2, 3 ],
                  [ 1, 0, 3, 7, 0, 6, 0, 0, 0 ]
                ]
              }
            ]
          }, {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = JobsPort;
  
      // Act
      await sut.getJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should poll the api to obtain the status of a job by running the pollJobAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.get('https://localhost:5001/api/v1/jobs/poll?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 is completed with status succeeded.',
          payload: []
        }, {
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
    );

    testServer.listen();

    const sut = JobsPort;

    // Act
    const result = await sut.pollJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7') as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 is completed with status succeeded.');
  });
  it('should catch AxiosErrors thrown when running the pollJobAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/jobs/poll?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 failed.',
            payload: []
          }, {
            status: 404,
            statusText: 'NOT FOUND',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = JobsPort;
  
      // Act
      await sut.pollJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7') as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 failed.');
    }
  });
  it('should catch any errors thrown when running the pollJobAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/jobs/poll?jobId=acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Job acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7 failed.',
            payload: []
          }, {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = JobsPort;
  
      // Act
      await sut.pollJobAsync('acd0bcf9-26c5-4dc0-9c5b-7ea8333bd0a7', true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
