import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import { AxiosError, type AxiosResponse } from 'axios';
import { AppsPort } from '@/ports/appsPort/index';
import { Endpoints } from '@/ports/appsPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { App } from '@/models/domain/app';
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
  });
  it('should update a users app using the putUpdateAppAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/apps/1', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: App was updated.', 
          payload: [ new App(
            1,
            'test-app',
            '7700a640-6816-477c-9085-95d2df94284b',
            1,
            'https://localhost:8080',
            undefined,
            undefined,
            undefined,
            'https://github.com/test-user/test-repo',
            true,
            ReleaseEnvironment.LOCAL,
            true,
            false,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.DAYS,
            1,
            false,
            new Date(new Date().setDate(new Date().getDate() - 7)),
            new Date()
          ) ] 
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
  it('should catch any errors thrown by Axios in the putUpdateAppAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: App was not updated.', 
            payload: [ ] 
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
  it('should catch any errors thrown by the putUpdateAppAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/apps/1', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: App was not updated.', 
            payload: [ ] 
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
  it('should get apps where the user is an admin using the getMyAppsAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: Apps were found.', 
          payload: [ new App(), new App() ] 
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
  it('should catch any errors thrown by Axios in the getMyAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
            payload: [ ] 
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
  it('should catch any errors thrown by the getMyAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
            payload: [ ] 
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
  it('should get apps where the user is a registered user using the getMyRegisteredAppsAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: Apps were found.', 
          payload: [ new App(), new App() ] 
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
    expect(result.data.payload).toHaveLength(2);
  });
  it('should catch any errors thrown by the getMyRegisteredAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
            payload: [ ] 
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
  it('should catch any errors thrown by the getMyRegisteredAppsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/apps/getmyregisteredapps', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Apps were not found.', 
            payload: [ ] 
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
});