import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { AppsService } from '@/services/appsService';
import { AppsPort } from '@/ports/appsPort/index';
import { LicensePort } from '@/ports/licensesPort/index';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { UpdateAppRequestData } from '@/models/requests/updateAppRequestData';
import { StaticServiceMethods } from '@/services/common';
import type { ICreateAppLicenseRequestData } from '@/interfaces/requests/iCreateAppLicenseRequestData';

describe('the appsService service', () => {
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });
  it('should get apps by running the getAppsAsync method', async () => {
    const apps = [{ id: 1, name: 'test-app' }];
    AppsPort.getAppsAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Status Code 200: Apps were found.',
        payload: apps,
      },
    } as AxiosResponse);

    const result = await AppsService.getAppsAsync();

    expect(result).toEqual({
      isSuccess: true,
      message: 'Status Code 200: Apps were found.',
      apps,
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
  it('should process an unsuccessful response from getAppsAsync', async () => {
    const response = {
      status: 400,
      data: {
        isSuccess: false,
        message: 'Apps could not be retrieved.',
      },
    } as AxiosResponse;
    AppsPort.getAppsAsync = vi.fn().mockResolvedValue(response);

    const result = await AppsService.getAppsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Apps could not be retrieved.',
    });
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });
  it('should log and process AxiosErrors from getAppsAsync in development', async () => {
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
    AppsPort.getAppsAsync = vi.fn().mockResolvedValue(error as AxiosError);

    const result = await AppsService.getAppsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Server error.',
    });
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });
  it('should return plain errors from getAppsAsync', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    const error = new Error('Network error.');
    AppsPort.getAppsAsync = vi.fn().mockResolvedValue(error as never);

    const result = await AppsService.getAppsAsync();

    expect(result).toEqual({
      isSuccess: false,
      message: 'Network error.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
  it('should create app license by running the postCreateAppLicenseAsync method', async () => {
    // Arrange
    LicensePort.createLicense = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: License was created.',
          payload: [
            {
              id: 5,
              name: 'new-test-app',
              license: 'abc123-def456-ghi789',
              ownerId: 1,
              localUrl: 'https://localhost:9000',
              testUrl: 'https://test.example.com',
              stagingUrl: 'https://staging.example.com',
              prodUrl: 'https://example.com',
              sourceCodeUrl: 'https://github.com/user/new-repo',
              isActive: true,
              environment: ReleaseEnvironment.LOCAL,
              permitSuperUserAccess: true,
              permitCollectiveLogins: false,
              disableCustomUrls: false,
              customEmailConfirmationAction: null,
              customPasswordResetAction: null,
              useCustomSMTPServer: false,
              smtpServerSettings: null,
              timeFrame: TimeFrame.DAYS,
              accessDuration: 7,
              displayInGallery: true,
              dateCreated: new Date().toISOString(),
              dateUpdated: new Date().toISOString(),
            },
          ],
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
      } as AxiosResponse;
    });

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'new-test-app',
      ownerId: 1,
      localUrl: 'https://localhost:9000',
      testUrl: 'https://test.example.com',
      stagingUrl: 'https://staging.example.com',
      prodUrl: 'https://example.com',
      sourceCodeUrl: 'https://github.com/user/new-repo',
    };

    // Act
    const result = await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 201: License was created.');
    expect(result.app).toBeDefined();
    expect(result.app?.name).equals('new-test-app');
    expect(result.app?.ownerId).equals(1);
  });
  it('should catch AxiosErrors thrown when running the postCreateAppLicenseAsync method', async () => {
    // Arrange
    LicensePort.createLicense = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: License was not created.',
            payload: [],
          },
          status: 400,
          statusText: 'BAD REQUEST',
        },
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'failed-app',
      ownerId: 1,
    };

    // Act
    const result = await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 400: License was not created.');
  });
  it('should catch any errors thrown when running the postCreateAppLicenseAsync method', async () => {
    // Arrange
    LicensePort.createLicense = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'error-app',
      ownerId: 1,
    };

    // Act
    const result = await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postCreateAppLicenseAsync method', async () => {
    // Arrange
    LicensePort.createLicense = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: false,
          isFromCache: false,
          message: 'Status Code 201: Erroneous result returned.',
          payload: [],
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'erroneous-app',
      ownerId: 1,
    };

    // Act
    const result = await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 201: Erroneous result returned.');
  });
  it('should handle postCreateAppLicenseAsync with minimal required fields', async () => {
    // Arrange
    LicensePort.createLicense = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: License was created.',
          payload: [
            {
              id: 10,
              name: 'minimal-app',
              license: 'minimal-license-guid',
              ownerId: 2,
              localUrl: '',
              testUrl: '',
              stagingUrl: '',
              prodUrl: '',
              sourceCodeUrl: '',
              isActive: true,
              environment: ReleaseEnvironment.LOCAL,
              permitSuperUserAccess: false,
              permitCollectiveLogins: false,
              disableCustomUrls: true,
              customEmailConfirmationAction: null,
              customPasswordResetAction: null,
              useCustomSMTPServer: false,
              smtpServerSettings: null,
              timeFrame: TimeFrame.DAYS,
              accessDuration: 1,
              displayInGallery: false,
              dateCreated: new Date().toISOString(),
              dateUpdated: new Date().toISOString(),
            },
          ],
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
      } as AxiosResponse;
    });

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'minimal-app',
      ownerId: 2,
    };

    // Act
    const result = await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.app).toBeDefined();
    expect(result.app?.name).equals('minimal-app');
    expect(result.app?.ownerId).equals(2);
  });
  it('should log errors to console in development mode when running postCreateAppLicenseAsync', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    LicensePort.createLicense = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 500: Internal server error.',
            payload: [],
          },
          status: 500,
          statusText: 'INTERNAL SERVER ERROR',
        },
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'console-test-app',
      ownerId: 1,
    };

    // Act
    await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).equals('error: ');

    consoleErrorSpy.mockRestore();
  });
  it('should call StaticServiceMethods.processFailedResponse when AxiosError occurs in postCreateAppLicenseAsync', async () => {
    // Arrange
    const processFailedResponseSpy = vi.spyOn(StaticServiceMethods, 'processFailedResponse');

    LicensePort.createLicense = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'licenses',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/',
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Not found.',
            payload: [],
          },
          status: 404,
          statusText: 'NOT FOUND',
        },
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data: ICreateAppLicenseRequestData = {
      name: 'not-found-app',
      ownerId: 1,
    };

    // Act
    await sut.postCreateAppLicenseAsync(data);

    // Assert
    expect(processFailedResponseSpy).toHaveBeenCalled();
  });
  it('should get an app by id using the getAppByIdAsync method', async () => {
    const app = {
      id: 42,
      name: 'test-app',
    };
    AppsPort.getAppByIdAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Status Code 200: App was found.',
        payload: [app],
      },
    } as AxiosResponse);

    const result = await AppsService.getAppByIdAsync(42);

    expect(AppsPort.getAppByIdAsync).toHaveBeenCalledWith(42);
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: App was found.');
    expect(result.app).toEqual(app);
  });
  it('should handle AxiosErrors from the getAppByIdAsync method', async () => {
    const response = {
      data: {
        isSuccess: false,
        message: 'Status Code 404: App was not found.',
        payload: [],
      },
      status: 404,
      statusText: 'NOT FOUND',
    };
    const error = { response } as AxiosError;
    const processFailedResponseSpy = vi.spyOn(StaticServiceMethods, 'processFailedResponse');
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    AppsPort.getAppByIdAsync = vi.fn().mockResolvedValue(error);

    try {
      const result = await AppsService.getAppByIdAsync(42);

      expect(result.isSuccess).toBe(false);
      expect(result.message).equals('Status Code 404: App was not found.');
      expect(processFailedResponseSpy).toHaveBeenCalledWith(response);
      expect(consoleErrorSpy).toHaveBeenCalled();
    } finally {
      if (originalNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = originalNodeEnv;
      }
    }
  });
  it('should handle Errors from the getAppByIdAsync method', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    AppsPort.getAppByIdAsync = vi.fn().mockResolvedValue(new Error('NETWORK ERR'));

    try {
      const result = await AppsService.getAppByIdAsync(42);

      expect(result.isSuccess).toBe(false);
      expect(result.message).equals('NETWORK ERR');
    } finally {
      if (originalNodeEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = originalNodeEnv;
      }
    }
  });
  it('should reject unsuccessful responses from the getAppByIdAsync method', async () => {
    AppsPort.getAppByIdAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: false,
        message: 'Status Code 200: App was not found.',
        payload: [],
      },
    } as AxiosResponse);

    const result = await AppsService.getAppByIdAsync(42);

    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: App was not found.');
    expect(result.app).toBeUndefined();
  });
  it('should update apps by running the putUpdateAppAsync method', async () => {
    // Arrange
    AppsPort.putUpdateAppAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: App was updated.',
          payload: [{
            id: 1,
            name: 'test-app',
            license: '7700a640-6816-477c-9085-95d2df94284b',
            ownerId: 1,
            localUrl: 'https://localhost:8080',
            testUrl: undefined,
            stagingUrl: undefined,
            prodUrl: undefined,
            sourceCodeUrl: 'https://github.com/test-user/test-app',
            isActive: true,
            environment: ReleaseEnvironment.LOCAL,
            permitSuperUserAccess: true,
            permitCollectiveLogins: false,
            disableCustomUrls: true,
            customEmailConfirmationAction: undefined,
            customPasswordResetAction: undefined,
            useCustomSMTPServer: false,
            smtpServerSettings: undefined,
            timeFrame: TimeFrame.DAYS,
            accessDuration: 1,
            displayInGallery: false,
            dateCreated: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
            dateUpdated: new Date().toISOString()
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    const data = new UpdateAppRequestData(
      1,
      'test-app',
      '7700a640-6816-477c-9085-95d2df94284b',
      1,
      'https://localhost:8080',
      null,
      null,
      null,
      'https://github.com/test-user/test-repo',
      true,
      ReleaseEnvironment.LOCAL,
      true,
      false,
      true,
      null,
      null,
      false,
      null,
      TimeFrame.DAYS,
      1
    )

    // Act
    const result = await sut.putUpdateAppAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: App was updated.');
    expect(result.app.name).equals('test-app');
  });
  it('should catch AxiosErrors thrown when running the putUpdateAppAsync method', async () => {
    // Arrange
    AppsPort.putUpdateAppAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: App was not updated.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data = new UpdateAppRequestData(
      1,
      'test-app',
      '7700a640-6816-477c-9085-95d2df94284b',
      1,
      'https://localhost:8080',
      null,
      null,
      null,
      'https://github.com/test-user/test-repo',
      true,
      ReleaseEnvironment.LOCAL,
      true,
      false,
      true,
      null,
      null,
      false,
      null,
      TimeFrame.DAYS,
      1
    );

    // Act
    const result = await sut.putUpdateAppAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: App was not updated.');
  });
  it('should catch any errors thrown when running the putUpdateAppAsync method', async () => {
    // Arrange
    AppsPort.putUpdateAppAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    const data = new UpdateAppRequestData(
      1,
      'test-app',
      '7700a640-6816-477c-9085-95d2df94284b',
      1,
      'https://localhost:8080',
      null,
      null,
      null,
      'https://github.com/test-user/test-repo',
      true,
      ReleaseEnvironment.LOCAL,
      true,
      false,
      true,
      null,
      null,
      false,
      null,
      TimeFrame.DAYS,
      1
    )

    // Act
    const result = await sut.putUpdateAppAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putUpdateAppAsync method', async () => {
    // Arrange
    AppsPort.putUpdateAppAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    const data = new UpdateAppRequestData(
      1,
      'test-app',
      '7700a640-6816-477c-9085-95d2df94284b',
      1,
      'https://localhost:8080',
      null,
      null,
      null,
      'https://github.com/test-user/test-repo',
      true,
      ReleaseEnvironment.LOCAL,
      true,
      false,
      true,
      null,
      null,
      false,
      null,
      TimeFrame.DAYS,
      1
    )

    // Act
    const result = await sut.putUpdateAppAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should get the apps where the user is the admin by running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyAppsAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Apps were found.',
          payload: [{
            id: 1,
            name: 'test-app',
            license: '7700a640-6816-477c-9085-95d2df94284b',
            ownerId: 1,
            localUrl: 'https://localhost:8080',
            testUrl: undefined,
            stagingUrl: undefined,
            prodUrl: undefined,
            sourceCodeUrl: 'https://github.com/test-user/test-app',
            isActive: true,
            environment: ReleaseEnvironment.LOCAL,
            permitSuperUserAccess: true,
            permitCollectiveLogins: false,
            disableCustomUrls: true,
            customEmailConfirmationAction: undefined,
            customPasswordResetAction: undefined,
            useCustomSMTPServer: false,
            smtpServerSettings: undefined,
            timeFrame: TimeFrame.DAYS,
            accessDuration: 1,
            displayInGallery: false,
            dateCreated: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
            dateUpdated: new Date().toISOString(),
            users: [
              {
                id: 1,
                userName: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                nickName: 'nickName',
                fullName: 'firstName lastName',
                email: 'email@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: true,
                isAdmin: true,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },{
                id: 2,
                userName: 'userName2',
                firstName: 'firstName2',
                lastName: 'lastName2',
                nickName: 'nickName2',
                fullName: 'firstName2 lastName2',
                email: 'email2@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              }
            ]
          }, {
            id: 2,
            name: 'test-app-2',
            license: '5a4a196a-897d-4f5a-b971-053503be6e2a',
            ownerId: 1,
            localUrl: 'https://localhost:8080',
            testUrl: undefined,
            stagingUrl: undefined,
            prodUrl: undefined,
            sourceCodeUrl: 'https://github.com/test-user/test-app-2',
            isActive: true,
            environment: ReleaseEnvironment.LOCAL,
            permitSuperUserAccess: true,
            permitCollectiveLogins: false,
            disableCustomUrls: true,
            customEmailConfirmationAction: undefined,
            customPasswordResetAction: undefined,
            useCustomSMTPServer: false,
            smtpServerSettings: undefined,
            timeFrame: TimeFrame.DAYS,
            accessDuration: 1,
            displayInGallery: false,
            dateCreated: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
            dateUpdated: undefined,
            users: [
              {
                id: 1,
                userName: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                nickName: 'nickName',
                fullName: 'firstName lastName',
                email: 'email@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: true,
                isAdmin: true,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },{
                id: 2,
                userName: 'userName2',
                firstName: 'firstName2',
                lastName: 'lastName2',
                nickName: 'nickName2',
                fullName: 'firstName2 lastName2',
                email: 'email2@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              }
            ]
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/getmyapps',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.getMyAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Apps were found.');
    expect(result.apps[0].name).equals('test-app');
    expect(result.apps[1].name).equals('test-app-2');
  });
  it('should catch AxiosErrors thrown when running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyAppsAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/getmyapps',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Apps were not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.getMyAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Apps were not found.');
  });
  it('should catch any errors thrown when running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyAppsAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.getMyAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');

  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyAppsAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/getmyapps',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.getMyAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should get the apps where the user is a registered user by running the getMyRegisteredAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyRegisteredAppsAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Apps were found.',
          payload: [ 
            {
              id: 3,
              name: 'test-app-3',
              license: '867e81cd-4dcb-48f1-a22e-cdbb45159d1e',
              ownerId: 2,
              localUrl: 'https://localhost:8080',
              testUrl: undefined,
              stagingUrl: undefined,
              prodUrl: undefined,
              sourceCodeUrl: 'https://github.com/test-user/test-app-3',
              isActive: true,
              environment: ReleaseEnvironment.LOCAL,
              permitSuperUserAccess: true,
              permitCollectiveLogins: false,
              disableCustomUrls: true,
              customEmailConfirmationAction: undefined,
              customPasswordResetAction: undefined,
              useCustomSMTPServer: false,
              smtpServerSettings: undefined,
              timeFrame: TimeFrame.DAYS,
              accessDuration: 1,
              displayInGallery: false,
              dateCreated: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
              dateUpdated: new Date().toISOString(),
              users: [
                {
                  id: 1,
                  userName: 'userName',
                  firstName: 'firstName',
                  lastName: 'lastName',
                  nickName: 'nickName',
                  fullName: 'firstName lastName',
                  email: 'email@example.com',
                  isEmailConfirmed: true,
                  receivedRequestToUpdateEmail: false,
                  receivedRequestToUpdatePassword: false,
                  isActive: true,
                  isSuperUser: true,
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },{
                  id: 2,
                  userName: 'userName2',
                  firstName: 'firstName2',
                  lastName: 'lastName2',
                  nickName: 'nickName2',
                  fullName: 'firstName2 lastName2',
                  email: 'email2@example.com',
                  isEmailConfirmed: true,
                  receivedRequestToUpdateEmail: false,
                  receivedRequestToUpdatePassword: false,
                  isActive: true,
                  isSuperUser: false,
                  isAdmin: true,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                }
              ]
            } 
          ] 
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/getmyregisteredapps',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Apps were found.');
    expect(result.apps[0].name).equals('test-app-3');
  });
  it('should catch AxiosErrors thrown when running the getMyRegisteredAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyRegisteredAppsAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/getmyregisteredapps',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Apps were not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Apps were not found.');
  });
  it('should catch any errors thrown when running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyRegisteredAppsAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the getMyAppsAsync method', async () => {
    // Arrange
    AppsPort.getMyRegisteredAppsAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/getmyregisteredapps',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should get app users by running the postAppUsersAsync method', async () => {
    // Arrange
    AppsPort.postAppUsersAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Users were found.',
          payload: [
            {
              id: 1,
              userName: 'userName',
              firstName: 'firstName',
              lastName: 'lastName',
              nickName: 'nickName',
              fullName: 'firstName lastName',
              email: 'email@example.com',
              isEmailConfirmed: true,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: false,
              isAdmin: true,
              dateCreated: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
              dateUpdated: new Date().toISOString()
            },
            {
              id: 2,
              userName: 'userName2',
              firstName: 'firstName2',
              lastName: 'lastName2',
              nickName: 'nickName2',
              fullName: 'firstName2 lastName2',
              email: 'email2@example.com',
              isEmailConfirmed: true,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: false,
              isAdmin: false,
              dateCreated: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
              dateUpdated: undefined
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1/GetAppUsers/true',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.postAppUsersAsync(1, true);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Users were found.');
    expect(result.users).toHaveLength(2);
  });
  it('should catch AxiosErrors thrown when running the postAppUsersAsync method', async () => {
    // Arrange
    AppsPort.postAppUsersAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1/GetAppUsers/false',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Users were not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.postAppUsersAsync(1, false);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Users were not found.');
  });
  it('should catch any errors thrown when running the postAppUsersAsync method', async () => {
    // Arrange
    AppsPort.postAppUsersAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.postAppUsersAsync(1, false);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postAppUsersAsync method', async () => {
    // Arrange
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    AppsPort.postAppUsersAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/1/GetAppUsers/true',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.postAppUsersAsync(1, true);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
    expect(consoleErrorSpy).toHaveBeenCalledWith('error: ', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });
  it('should set result properties after successful response when running the postAppUsersAsync method', async () => {
    // Arrange
    AppsPort.postAppUsersAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Users were found.',
          payload: [
            {
              id: 3,
              userName: 'userName3',
              firstName: 'firstName3',
              lastName: 'lastName3',
              nickName: 'nickName3',
              fullName: 'firstName3 lastName3',
              email: 'email3@example.com',
              isEmailConfirmed: true,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: false,
              isAdmin: false,
              dateCreated: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
              dateUpdated: undefined
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/2/GetAppUsers/false',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.postAppUsersAsync(2, false);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Users were found.');
    expect(result.users).toHaveLength(1);
    expect(result.users[0].userName).equals('userName3');
  });
  it('should add users to apps by running the putAddUserAsync method', async () => {
    // Arrange
    AppsPort.putAddUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was added to app.',
          payload: [{
            id: 1,
            userName: 'userName1',
            firstName: 'firstName1',
            lastName: 'lastName1',
            nickName: 'nickName1',
            fullName: 'firstName1 lastName1',
            email: 'email@example.com',
            isEmailConfirmed: true,
            receivedRequestToUpdateEmail: false,
            receivedRequestToUpdatePassword: false,
            isActive: true,
            isSuperUser: false,
            isAdmin: false,
            dateCreated: '2024-05-24T18:11:39.996131Z',
            dateUpdated: '0001-01-01T00:00:00',
            games: []
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.putAddUserAsync(1, 1);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was added to app.');
    expect(result.users).toHaveLength(1);
    expect(result.users[0].userName).equals('userName1');
  });
  it('should catch AxiosErrors thrown when running the putAddUserAsync method', async () => {
    // Arrange
    AppsPort.putAddUserAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not added to app.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putAddUserAsync(1, 1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not added to app.');
  });
  it('should catch any errors thrown when running the putAddUserAsync method', async () => {
    // Arrange
    AppsPort.putAddUserAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.putAddUserAsync(1, 1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should remove users from apps by running the putRemoveUserAsync method', async () => {
    // Arrange
    AppsPort.putRemoveUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was removed from app.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.putRemoveUserAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was removed from app.');
    expect(result.users).toHaveLength(0);
  });
  it('should catch AxiosErrors thrown when running the putRemoveUserAsync method', async () => {
    // Arrange
    AppsPort.putRemoveUserAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not removed from app.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putRemoveUserAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not removed from app.');
  });
  it('should catch any errors thrown when running the putRemoveUserAsync method', async () => {
    // Arrange
    AppsPort.putRemoveUserAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.putRemoveUserAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should activate admin privileges for a user by running the putActivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putActivateAdminPrivilegesAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Admin privileges were activated.',
          payload: [{
            id: 2,
            userName: 'userName2',
            firstName: 'firstName2',
            lastName: 'lastName2',
            nickName: 'nickName2',
            fullName: 'firstName2 lastName2',
            email: 'email2@example.com',
            isEmailConfirmed: true,
            receivedRequestToUpdateEmail: false,
            receivedRequestToUpdatePassword: false,
            isActive: true,
            isSuperUser: false,
            isAdmin: true,
            dateCreated: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
            dateUpdated: new Date().toISOString()
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1/activateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.putActivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Admin privileges were activated.');
    expect(result.user.userName).equals('userName2');
    expect(result.user.isAdmin).toBe(true);
  });
  it('should catch AxiosErrors thrown when running the putActivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putActivateAdminPrivilegesAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1/activateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Admin privileges were not activated.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putActivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Admin privileges were not activated.');
  });
  it('should catch any errors thrown when running the putActivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putActivateAdminPrivilegesAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.putActivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putActivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putActivateAdminPrivilegesAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/1/activateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putActivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should deactivate admin privileges for a user by running the putDeactivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putDeactivateAdminPrivilegesAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Admin privileges were deactivated.',
          payload: [{
            id: 2,
            userName: 'userName2',
            firstName: 'firstName2',
            lastName: 'lastName2',
            nickName: 'nickName2',
            fullName: 'firstName2 lastName2',
            email: 'email2@example.com',
            isEmailConfirmed: true,
            receivedRequestToUpdateEmail: false,
            receivedRequestToUpdatePassword: false,
            isActive: true,
            isSuperUser: false,
            isAdmin: false,
            dateCreated: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
            dateUpdated: new Date().toISOString()
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'apps/1/deactivateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = AppsService;

    // Act
    const result = await sut.putDeactivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Admin privileges were deactivated.');
    expect(result.user.userName).equals('userName2');
    expect(result.user.isAdmin).toBe(false);
  });
  it('should catch AxiosErrors thrown when running the putDeactivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putDeactivateAdminPrivilegesAsync = vi.fn().mockImplementation(async () => {
      return {
        config: {
          url: 'apps/1/deactivateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Admin privileges were not deactivated.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putDeactivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Admin privileges were not deactivated.');
  });
  it('should catch any errors thrown when running the putDeactivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putDeactivateAdminPrivilegesAsync = vi.fn().mockImplementation(async () => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'test');

    const sut = AppsService;

    // Act
    const result = await sut.putDeactivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putDeactivateAdminPrivilegesAsync method', async () => {
    // Arrange
    AppsPort.putDeactivateAdminPrivilegesAsync = vi.fn().mockImplementation(() => {
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
          url: 'apps/1/deactivateadminprivileges?userId=2',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = AppsService;

    // Act
    const result = await sut.putDeactivateAdminPrivilegesAsync(1, 2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should activate an app', async () => {
    const app = { id: 1, name: 'test-app', isActive: true };
    AppsPort.putActivateAppAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Status Code 200: App was activated.',
        payload: [app],
      },
    } as AxiosResponse);

    const result = await AppsService.putActivateAppAsync(1);

    expect(AppsPort.putActivateAppAsync).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      isSuccess: true,
      message: 'Status Code 200: App was activated.',
      app,
    });
  });
  it('should process AxiosErrors when activating an app', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = {
      data: {
        isSuccess: false,
        message: 'Status Code 404: App was not activated.',
      },
    };
    const error = { response } as AxiosError;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    AppsPort.putActivateAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.putActivateAppAsync(1);

    expect(result).toEqual({
      isSuccess: false,
      message: 'Status Code 404: App was not activated.',
    });
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });
  it('should return plain errors when activating an app', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    const error = new Error('Network error.');
    AppsPort.putActivateAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.putActivateAppAsync(1);

    expect(result).toEqual({
      isSuccess: false,
      message: 'Network error.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
  it('should deactivate an app', async () => {
    const app = { id: 1, name: 'test-app', isActive: false };
    AppsPort.putDeactivateAppAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Status Code 200: App was deactivated.',
        payload: [app],
      },
    } as AxiosResponse);

    const result = await AppsService.putDeactivateAppAsync(1);

    expect(AppsPort.putDeactivateAppAsync).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      isSuccess: true,
      message: 'Status Code 200: App was deactivated.',
      app,
    });
  });
  it('should process AxiosErrors when deactivating an app', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = {
      data: {
        isSuccess: false,
        message: 'Status Code 404: App was not deactivated.',
      },
    };
    const error = { response } as AxiosError;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    AppsPort.putDeactivateAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.putDeactivateAppAsync(1);

    expect(result).toEqual({
      isSuccess: false,
      message: 'Status Code 404: App was not deactivated.',
    });
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });
  it('should return plain errors when deactivating an app', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    const error = new Error('Network error.');
    AppsPort.putDeactivateAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.putDeactivateAppAsync(1);

    expect(result).toEqual({
      isSuccess: false,
      message: 'Network error.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
  it('should delete an app', async () => {
    AppsPort.deleteAppAsync = vi.fn().mockResolvedValue({
      data: {
        isSuccess: true,
        message: 'Status Code 200: App was deleted.',
      },
    } as AxiosResponse);

    const result = await AppsService.deleteAppAsync(1, 'license');

    expect(AppsPort.deleteAppAsync).toHaveBeenCalledWith(1, 'license');
    expect(result).toEqual({
      isSuccess: true,
      message: 'Status Code 200: App was deleted.',
    });
  });
  it('should process AxiosErrors when deleting an app', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const response = {
      data: {
        isSuccess: false,
        message: 'Status Code 404: App was not deleted.',
      },
    };
    const error = { response } as AxiosError;
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    AppsPort.deleteAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.deleteAppAsync(1, 'license');

    expect(result).toEqual({
      isSuccess: false,
      message: 'Status Code 404: App was not deleted.',
    });
    expect(consoleError).toHaveBeenCalledWith('error: ', error);
    expect(StaticServiceMethods.processFailedResponse).toHaveBeenCalledWith(response);
  });
  it('should return plain errors when deleting an app', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    const error = new Error('Network error.');
    AppsPort.deleteAppAsync = vi.fn().mockResolvedValue(error);

    const result = await AppsService.deleteAppAsync(1, 'license');

    expect(result).toEqual({
      isSuccess: false,
      message: 'Network error.',
    });
    expect(StaticServiceMethods.processFailedResponse).not.toHaveBeenCalled();
  });
});
