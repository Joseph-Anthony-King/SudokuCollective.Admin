import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { AppsService } from '@/services/appsService';
import { AppsPort } from '@/ports/appsPort/index';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { UpdateAppRequestData } from '@/models/requests/updateAppRequestData';
import { StaticServiceMethods } from '@/services/common';

describe('the appsService service', () => {
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.restoreAllMocks();
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

    vi.stubEnv('NODE_ENV', 'development');

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

    vi.stubEnv('NODE_ENV', 'development');

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

    vi.stubEnv('NODE_ENV', 'development');

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
});
