
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { LoginService } from '@/services/loginService';
import { LoginPort } from '@/ports/loginPort';
import { LoginRequestData } from '@/models/requests/loginRequestData';
import { StaticServiceMethods } from '@/services/common';

describe('the loginService service', () => {
  let isStringNotEmptyOrNullSpy: MockInstance<[email: string], boolean>;
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should login users by running the postLoginAsync method', async () => {
    // Arrange
    const userName = 'userName';

    LoginPort.postLoginAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was found.',
          payload: [{
            user: {
              id: 1,
              userName: userName,
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
            },
            token: 'fGevSi7pb0KZ0LuQlWN0og==',
            tokenExpirationDate: 'fGevSi7pb0KZ0LuQlWN0og=='
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'login',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = LoginService;

    const data = new LoginRequestData(userName, 'password', true);

    // Act
    const result = await sut.postLoginAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was found.');
    expect(result.token).equals('fGevSi7pb0KZ0LuQlWN0og==');
    expect(result.tokenExpirationDate).equals('fGevSi7pb0KZ0LuQlWN0og==');
  });
  it('should catch AxiosErrors thrown when running the postLoginAsync method', async () => {
    // Arrange
    LoginPort.postLoginAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'login',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LoginService;

    const data = new LoginRequestData('userName', 'password', true);

    // Act
    const result = await sut.postLoginAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not found.');
  });
  it('should catch any errors thrown when running the postLoginAsync method', async () => {
    // Arrange
    LoginPort.postLoginAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LoginService;

    const data = new LoginRequestData('userName', 'password', true);

    // Act
    const result = await sut.postLoginAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postLoginAsync method', async () => {
    // Arrange
    LoginPort.postLoginAsync = vi.fn().mockImplementation(() => {
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
          url: 'login',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LoginService;

    const data = new LoginRequestData('userName', 'password', true);

    // Act
    const result = await sut.postLoginAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should confirm user names using the user email by running the postConfirmUserNameAsync method', async () => {
    // Arrange
    LoginPort.postConfirmUserNameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User name was confirmed.',
          payload: [{
            userName: 'userName',
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'login/confirmusername',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    const sut = LoginService;

    // Act
    const result = await sut.postConfirmUserNameAsync('email@example.com');

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User name was confirmed.');
  });
  it('should return false if the user email is empty or null when running the postConfirmUserNameAsync method', async () => {
    // Arrange
    LoginPort.postConfirmUserNameAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User name was confirmed.',
          payload: [{
            userName: 'userName',
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'login/confirmusername',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => false);

    const sut = LoginService;

    // Act
    const result = await sut.postConfirmUserNameAsync('');

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('String cannot be null or empty.');
  });
  it('should catch AxiosErrors thrown when running the postConfirmUserNameAsync method', async () => {
    // Arrange
    LoginPort.postConfirmUserNameAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'login/confirmusername',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: No user is using this email.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LoginService;

    // Act
    const result = await sut.postConfirmUserNameAsync('email@example.com');

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: No user is using this email.');
  });
  it('should catch any errors thrown when running the postConfirmUserNameAsync method', async () => {
    // Arrange
    LoginPort.postConfirmUserNameAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = LoginService;

    // Act
    const result = await sut.postConfirmUserNameAsync('email@example.com');

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postConfirmUserNameAsync method', async () => {
    // Arrange
    LoginPort.postConfirmUserNameAsync = vi.fn().mockImplementation(() => {
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
          url: 'login/confirmusername',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    const sut = LoginService;

    // Act
    const result = await sut.postConfirmUserNameAsync('email@example.com');

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
});
