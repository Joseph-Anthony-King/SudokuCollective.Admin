import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { AxiosError, type AxiosResponse } from 'axios';
import { AppsPort } from '@/ports/appsPort/index';
import { Endpoints } from '@/ports/appsPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { UpdateAppRequestData } from '@/models/requests/updateAppRequestData';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';

describe('the appsPort port', () => {
  let testingPinia: TestingPinia;
  let testServer: SetupServerApi | null;
  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    const globalStore = useGlobalStore(testingPinia);
    globalStore.$state.token = 'Nc98/MSakUuG1WErOvQsWg==';
    const userStore = useUserStore(testingPinia);
    const year = (new Date()).getFullYear();
    userStore.$state.user = new User(
      1, 
      'userName',
      'firstName',
      'lastName',
      'nickName',
      'firstName lastName',
      'email@example.com',
      true,
      false,
      false,
      true,
      false,
      true,
      new Date(`06/06/${year}`),
      new Date(`07/15/${year}`),
      true,
      true);
    setActivePinia(testingPinia);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.appsEndpoint).equals('https://localhost:5001/api/v1/apps');
    expect(Endpoints.getMyAppsEndpoint).equals('https://localhost:5001/api/v1/apps/getmyapps');
    expect(Endpoints.getMyRegisteredAppsEndpoint).equals('https://localhost:5001/api/v1/apps/getmyregisteredapps');
    expect(Endpoints.getAppUsersEndpoint).equals('https://localhost:5001/api/v1/apps/{id}/getappusers/');
    expect(Endpoints.putAddUserEndpoint).equals('https://localhost:5001/api/v1/apps/{id}/adduser');
    expect(Endpoints.putRemoveUserEndpoint).equals('https://localhost:5001/api/v1/apps/{id}/removeuser');
  });
  it('should update a users app by running the putUpdateAppAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/apps/1', () => {
        return HttpResponse.json({
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
            sourceCodeUrl: 'https://github.com/test-user/test-repo',
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

    const sut = AppsPort;

    const updateAppRequest = new UpdateAppRequestData(
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
    const result = await sut.putUpdateAppAsync(updateAppRequest) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: App was updated.');
  });
  it('should catch AxiosErrors thrown when running the putUpdateAppAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: App was not updated.', 
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

      vi.stubEnv('NODE_ENV', 'development');

      const sut = AppsPort;

      const updateAppRequest = new UpdateAppRequestData(
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
      await sut.putUpdateAppAsync(updateAppRequest) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: App was not updated.');
    }
  });
  it('should catch any errors thrown when running the putUpdateAppAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: App was not updated.', 
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

      vi.stubEnv('NODE_ENV', 'development');

      const sut = AppsPort;

      const updateAppRequest = new UpdateAppRequestData(
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
      await sut.putUpdateAppAsync(updateAppRequest, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should get apps where the user is an admin by running the getMyAppsAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
        return HttpResponse.json({
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
            dateUpdated: new Date().toISOString()
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
            dateUpdated: undefined
          }] 
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

    const sut = AppsPort;

    // Act
    const result = await sut.getMyAppsAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Apps were found.');
    expect(result.data.payload).toHaveLength(2);
  });
  it('should catch AxiosErrors thrown when running the getMyAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.getMyAppsAsync() as AxiosResponse;
  
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Apps were not found.');
      expect(result.payload).toHaveLength(0);
    }
  });
  it('should catch any errors thrown when running the getMyAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.getMyAppsAsync(true) as AxiosResponse;
  
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should get apps where the user is a registered user by running the getMyRegisteredAppsAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
        return HttpResponse.json({
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
              dateUpdated: new Date().toISOString()
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

    const sut = AppsPort;

    // Act
    const result = await sut.getMyRegisteredAppsAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Apps were found.');
    expect(result.data.payload).toHaveLength(1);
  });
  it('should catch any errors thrown when running the getMyRegisteredAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.getMyRegisteredAppsAsync() as AxiosResponse;
  
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Apps were not found.');
      expect(result.payload).toHaveLength(0);
    }
  });
  it('should catch any errors thrown when running the getMyRegisteredAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.getMyRegisteredAppsAsync(true) as AxiosResponse;
  
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should get app users by running the postAppUsersAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/apps/1/GetAppUsers/true', () => {
        return HttpResponse.json({
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

    const sut = AppsPort;

    // Act
    const result = await sut.postAppUsersAsync(1, true) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Users were found.');
    expect(result.data.payload).toHaveLength(2);
  });
  it('should catch AxiosErrors thrown when running the postAppUsersAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/1/GetAppUsers/false', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Users were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.postAppUsersAsync(1, false) as AxiosResponse;
  
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Users were not found.');
      expect(result.payload).toHaveLength(0);
    }
  });
  it('should catch any errors thrown when running the postAppUsersAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/1/GetAppUsers/false', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Users were not found.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.postAppUsersAsync(1, false, true) as AxiosResponse;
  
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should add a user to an app by running the putAddUserAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/apps/1/adduser', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: User was added to app.', 
          payload: [{
            id: 1,
            name: 'test-app',
            license: '7700a640-6816-477c-9085-95d2df94284b',
            ownerId: 1,
            localUrl: 'https://localhost:8080',
            testUrl: undefined,
            stagingUrl: undefined,
            prodUrl: undefined,
            sourceCodeUrl: 'https://github.com/test-user/test-repo',
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
                isSuperUser: false,
                isAdmin: true,
                dateCreated: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
                dateUpdated: new Date().toISOString()
              }
            ]
          }] 
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

    const sut = AppsPort;

    // Act
    const result = await sut.putAddUserAsync(1, 2) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User was added to app.');
  });
  it('should catch AxiosErrors thrown when running the putAddUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1/adduser', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: User was not added to app.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.putAddUserAsync(1, 2) as AxiosResponse;
  
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: User was not added to app.');
      expect(result.payload).toHaveLength(0);
    }
  });
  it('should catch any errors thrown when running the putAddUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1/adduser', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: User was not added to app.', 
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

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = AppsPort;
  
      // Act
      await sut.putAddUserAsync(1, 2, true) as AxiosResponse;
  
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
