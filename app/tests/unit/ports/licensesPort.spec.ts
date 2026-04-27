import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { AxiosError, type AxiosResponse } from 'axios';
import { LicensePort } from '@/ports/licensesPort/index';
import { Endpoints } from '@/ports/licensesPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import type { ICreateAppLicenseRequestData } from '@/interfaces/requests/iCreateAppLicenseRequestData';

describe('the licensesPort port', () => {
  let testingPinia: TestingPinia;
  let testServer: SetupServerApi | null;

  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });

    const globalStore = useGlobalStore(testingPinia);
    globalStore.$state.token = 'test-token-123';

    const userStore = useUserStore(testingPinia);
    const year = new Date().getFullYear();
    userStore.$state.user = new User(
      1,
      'testuser',
      'Test',
      'User',
      'Tester',
      'Test User',
      'test@example.com',
      true,
      false,
      false,
      true,
      false,
      true,
      new Date(`01/01/${year}`),
      new Date(`01/15/${year}`),
      true,
      true
    );

    setActivePinia(testingPinia);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });

  it('should have the expected endpoint', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.createLicenseEndpoint).equals('https://localhost:5001/api/v1/licenses');
  });

  it('should create a license by running the createLicense method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [
              {
                id: 2,
                name: 'New Test App',
                license: 'new-license-guid-12345',
                ownerId: 1,
                localUrl: 'http://localhost:3000',
                testUrl: 'https://test.example.com',
                stagingUrl: 'https://staging.example.com',
                prodUrl: 'https://prod.example.com',
                sourceCodeUrl: 'https://github.com/user/repo',
                isActive: true,
                environment: 0,
                permitSuperUserAccess: false,
                permitCollectiveLogins: false,
                disableCustomUrls: false,
                customEmailConfirmationAction: null,
                customPasswordResetAction: null,
                useCustomSMTPServer: false,
                smtpServerSettings: null,
                timeFrame: 0,
                accessDuration: 1,
                displayInGallery: false,
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
              },
            ],
          },
          {
            status: 201,
            statusText: 'CREATED',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'New Test App',
      ownerId: 1,
      localUrl: 'http://localhost:3000',
      testUrl: 'https://test.example.com',
      stagingUrl: 'https://staging.example.com',
      prodUrl: 'https://prod.example.com',
      sourceCodeUrl: 'https://github.com/user/repo',
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 201: License was created.');
    expect(result.data.payload).toHaveLength(1);
    expect(result.data.payload[0].name).equals('New Test App');
    expect(result.data.payload[0].ownerId).equals(1);
  });

  it('should create a license with only required fields', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [
              {
                id: 3,
                name: 'Minimal App',
                license: 'minimal-license-guid',
                ownerId: 1,
                localUrl: '',
                testUrl: '',
                stagingUrl: '',
                prodUrl: '',
                sourceCodeUrl: '',
                isActive: true,
                environment: 0,
                permitSuperUserAccess: false,
                permitCollectiveLogins: false,
                disableCustomUrls: false,
                customEmailConfirmationAction: null,
                customPasswordResetAction: null,
                useCustomSMTPServer: false,
                smtpServerSettings: null,
                timeFrame: 0,
                accessDuration: 1,
                displayInGallery: false,
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
              },
            ],
          },
          {
            status: 201,
            statusText: 'CREATED',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Minimal App',
      ownerId: 1,
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.payload[0].name).equals('Minimal App');
    expect(result.data.payload[0].localUrl).equals('');
    expect(result.data.payload[0].testUrl).equals('');
    expect(result.data.payload[0].stagingUrl).equals('');
    expect(result.data.payload[0].prodUrl).equals('');
    expect(result.data.payload[0].sourceCodeUrl).equals('');
  });

  it('should create a license with partial optional fields', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [
              {
                id: 4,
                name: 'Partial App',
                license: 'partial-license-guid',
                ownerId: 1,
                localUrl: 'http://localhost:8080',
                testUrl: '',
                stagingUrl: '',
                prodUrl: 'https://myapp.com',
                sourceCodeUrl: '',
                isActive: true,
                environment: 0,
                permitSuperUserAccess: false,
                permitCollectiveLogins: false,
                disableCustomUrls: false,
                customEmailConfirmationAction: null,
                customPasswordResetAction: null,
                useCustomSMTPServer: false,
                smtpServerSettings: null,
                timeFrame: 0,
                accessDuration: 1,
                displayInGallery: false,
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString(),
              },
            ],
          },
          {
            status: 201,
            statusText: 'CREATED',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Partial App',
      ownerId: 1,
      localUrl: 'http://localhost:8080',
      prodUrl: 'https://myapp.com',
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.payload[0].localUrl).equals('http://localhost:8080');
    expect(result.data.payload[0].prodUrl).equals('https://myapp.com');
  });

  it('should include authorization token in request headers', async () => {
    // Arrange
    let capturedHeaders: Record<string, string> = {};

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', ({ request }) => {
        capturedHeaders = {
          authorization: request.headers.get('authorization') || '',
          accept: request.headers.get('accept') || '',
          'content-type': request.headers.get('content-type') || '',
        };

        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Auth Test App',
      ownerId: 1,
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(capturedHeaders.authorization).equals('Bearer test-token-123');
    expect(capturedHeaders.accept).equals('application/json');
    expect(capturedHeaders['content-type']).equals('application/json');
  });

  it('should include correct payload structure in request body', async () => {
    // Arrange
    let capturedBody: any = null;

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', async ({ request }) => {
        capturedBody = await request.json();

        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Payload Test App',
      ownerId: 5,
      localUrl: 'http://localhost:5000',
      testUrl: 'https://test.app.com',
      stagingUrl: 'https://staging.app.com',
      prodUrl: 'https://app.com',
      sourceCodeUrl: 'https://github.com/test/app',
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(capturedBody).not.toBeNull();
    expect(capturedBody.license).equals(process.env.VITE_APP_LICENSE);
    expect(capturedBody.requestorId).equals(1);
    expect(capturedBody.appId).equals(process.env.VITE_APP_ID);
    expect(capturedBody.paginator).toEqual({});
    expect(capturedBody.payload).toBeDefined();
    expect(capturedBody.payload.name).equals('Payload Test App');
    expect(capturedBody.payload.ownerId).equals(5);
    expect(capturedBody.payload.localUrl).equals('http://localhost:5000');
    expect(capturedBody.payload.testUrl).equals('https://test.app.com');
    expect(capturedBody.payload.stagingUrl).equals('https://staging.app.com');
    expect(capturedBody.payload.prodUrl).equals('https://app.com');
    expect(capturedBody.payload.sourceCodeUrl).equals('https://github.com/test/app');
  });

  it('should handle null/undefined optional fields with empty strings', async () => {
    // Arrange
    let capturedBody: any = null;

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', async ({ request }) => {
        capturedBody = await request.json();

        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Null Fields App',
      ownerId: 1,
      localUrl: undefined,
      testUrl: undefined,
      stagingUrl: undefined,
      prodUrl: undefined,
      sourceCodeUrl: undefined,
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(capturedBody.payload.localUrl).equals('');
    expect(capturedBody.payload.testUrl).equals('');
    expect(capturedBody.payload.stagingUrl).equals('');
    expect(capturedBody.payload.prodUrl).equals('');
    expect(capturedBody.payload.sourceCodeUrl).equals('');
  });

  it('should catch AxiosErrors thrown when running the createLicense method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: License was not created.',
            payload: [],
          },
          {
            status: 400,
            statusText: 'BAD REQUEST',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Error Test App',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest);

    // Assert
    expect(result).toBeDefined();
    const axiosError = result as AxiosError;
    expect(axiosError.response?.status).equals(400);
    const responseData = axiosError.response?.data as any;
    expect(responseData.isSuccess).toBe(false);
    expect(responseData.message).equals('Status Code 400: License was not created.');
  });

  it('should catch network errors when server is unreachable', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.error();
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Network Error App',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest);

    // Assert
    expect(result).toBeDefined();
    const error = result as AxiosError;
    expect(error.message).toBeDefined();
  });

  it('should handle 404 errors when endpoint is not found', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Endpoint not found.',
            payload: [],
          },
          {
            status: 404,
            statusText: 'NOT FOUND',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: '404 Test App',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest);

    // Assert
    const axiosError = result as AxiosError;
    expect(axiosError.response?.status).equals(404);
  });

  it('should handle 401 unauthorized errors', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 401: Unauthorized.',
            payload: [],
          },
          {
            status: 401,
            statusText: 'UNAUTHORIZED',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Unauthorized App',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest);

    // Assert
    const axiosError = result as AxiosError;
    expect(axiosError.response?.status).equals(401);
    const responseData = axiosError.response?.data as any;
    expect(responseData.message).equals('Status Code 401: Unauthorized.');
  });

  it('should handle 500 internal server errors', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 500: Internal server error.',
            payload: [],
          },
          {
            status: 500,
            statusText: 'INTERNAL SERVER ERROR',
            headers: {
              'content-type': 'application/json',
            },
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: '500 Error App',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest);

    // Assert
    const axiosError = result as AxiosError;
    expect(axiosError.response?.status).equals(500);
  });

  it('should throw error when testErrorHandling parameter is true', async () => {
    // Arrange
    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Test Error Handling',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest, true);

    // Assert
    expect(result).toBeDefined();
    const error = result as Error;
    expect(error.message).toContain('testErrorHandling is true');
    expect(error.message).toContain('testing error handling');
  });

  it('should not throw error when testErrorHandling parameter is false', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'No Error Test',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest, false);

    // Assert
    const axiosResponse = result as AxiosResponse;
    expect(axiosResponse.data.isSuccess).toBe(true);
  });

  it('should not throw error when testErrorHandling parameter is null', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Null Parameter Test',
      ownerId: 1,
    };

    // Act
    const result = await sut.createLicense(createRequest, null);

    // Assert
    const axiosResponse = result as AxiosResponse;
    expect(axiosResponse.data.isSuccess).toBe(true);
  });

  it('should log errors to console when NODE_ENV is development', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Error',
            payload: [],
          },
          {
            status: 500,
            statusText: 'ERROR',
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Console Log Test',
      ownerId: 1,
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).equals('error: ');

    consoleErrorSpy.mockRestore();
  });

  it('should not log errors to console when NODE_ENV is not development', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: false,
            isFromCache: false,
            message: 'Error',
            payload: [],
          },
          {
            status: 500,
            statusText: 'ERROR',
          }
        );
      })
    );

    testServer.listen();

    vi.stubEnv('NODE_ENV', 'production');

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'No Console Log Test',
      ownerId: 1,
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(consoleErrorSpy).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle empty string values in request payload', async () => {
    // Arrange
    let capturedBody: any = null;

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', async ({ request }) => {
        capturedBody = await request.json();

        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: '',
      ownerId: 0,
      localUrl: '',
      testUrl: '',
      stagingUrl: '',
      prodUrl: '',
      sourceCodeUrl: '',
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(capturedBody.payload.name).equals('');
    expect(capturedBody.payload.ownerId).equals(0);
    expect(capturedBody.payload.localUrl).equals('');
    expect(capturedBody.payload.testUrl).equals('');
    expect(capturedBody.payload.stagingUrl).equals('');
    expect(capturedBody.payload.prodUrl).equals('');
    expect(capturedBody.payload.sourceCodeUrl).equals('');
  });

  it('should handle special characters in app name', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [
              {
                id: 100,
                name: 'Test App !@#$%^&*()',
                license: 'special-chars-license',
                ownerId: 1,
                isActive: true,
              },
            ],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Test App !@#$%^&*()',
      ownerId: 1,
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.payload[0].name).equals('Test App !@#$%^&*()');
  });

  it('should handle very long URL strings', async () => {
    // Arrange
    const longUrl = 'https://example.com/' + 'a'.repeat(2000);

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Long URL App',
      ownerId: 1,
      prodUrl: longUrl,
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
  });

  it('should handle large ownerId values', async () => {
    // Arrange
    let capturedBody: any = null;

    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', async ({ request }) => {
        capturedBody = await request.json();

        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Large OwnerId App',
      ownerId: 999999999,
    };

    // Act
    await sut.createLicense(createRequest);

    // Assert
    expect(capturedBody.payload.ownerId).equals(999999999);
  });

  it('should handle Unicode characters in app name', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/licenses', () => {
        return HttpResponse.json(
          {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: License was created.',
            payload: [
              {
                id: 101,
                name: 'Test App',
                license: 'unicode-license',
                ownerId: 1,
                isActive: true,
              },
            ],
          },
          {
            status: 201,
            statusText: 'CREATED',
          }
        );
      })
    );

    testServer.listen();

    const sut = LicensePort;

    const createRequest: ICreateAppLicenseRequestData = {
      name: 'Test App',
      ownerId: 1,
    };

    // Act
    const result = (await sut.createLicense(createRequest)) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.payload[0].name).equals('Test App');
  });
});
