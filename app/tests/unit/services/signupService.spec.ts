import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { SignupPort } from '@/ports/signupPort';
import { SignupService } from '@/services/signupService';
import { SignupRequestData } from '@/models/requests/signupRequestData';
import { StaticServiceMethods } from '@/services/common';

describe('the loginService service', () => {
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should sign up new users by running the postAsync method', async () => {
    const userName = 'userName3';
    const firstName = 'firstName3';
    const lastName = 'lastName3';
    const nickName = 'nickName3';
    const email = 'email3@example.com';
    const password = 'password3';
    const stayLoggedIn = true;

    SignupPort.postAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: User was created.',
          payload: [{
            user: {
              id: 3,
              userName: userName,
              firstName: firstName,
              lastName: lastName,
              nickName: nickName,
              fullName: `${firstName} ${lastName}`,
              email: email,
              isEmailConfirmed: false,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: false,
              isAdmin: true,
              dateCreated: '2024-08-27T20:56:42.8609588Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            token: 'fGevSi7pb0KZ0LuQlWN0og==',
            tokenExpirationDate: '2024-08-28T20:56:42.8609588Z'
          }]
        },
        status: 201,
        statusText: 'CREATED',
        headers: {},
        config: {
          url: 'signup',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = SignupService;

    const data = new SignupRequestData(
      userName,
      firstName,
      lastName,
      nickName,
      email,
      password,
      stayLoggedIn
    );

    // Act
    const result = await sut.postAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 201: User was created.');
    expect(result.user.userName).equals('userName3');
    expect(result.user.firstName).equals('firstName3');
    expect(result.user.lastName).equals('lastName3');
    expect(result.user.nickName).equals('nickName3');
    expect(result.user.email).equals('email3@example.com');
    expect(result.token).equals('fGevSi7pb0KZ0LuQlWN0og==');
    expect(result.tokenExpirationDate).equals('2024-08-28T20:56:42.8609588Z');
  });
  it('should catch AxiosErrors thrown when running the postAsync method', async () => {
    const userName = 'userName3';
    const firstName = 'firstName3';
    const lastName = 'lastName3';
    const nickName = 'nickName3';
    const email = 'email3@example.com';
    const password = 'password3';
    const stayLoggedIn = true;

    SignupPort.postAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'signup',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not created.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = SignupService;

    const data = new SignupRequestData(
      userName,
      firstName,
      lastName,
      nickName,
      email,
      password,
      stayLoggedIn
    );

    // Act
    const result = await sut.postAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not created.');
  });
  it('should catch any errors thrown when running the postAsync method', async () => {
    const userName = 'userName3';
    const firstName = 'firstName3';
    const lastName = 'lastName3';
    const nickName = 'nickName3';
    const email = 'email3@example.com';
    const password = 'password3';
    const stayLoggedIn = true;

    SignupPort.postAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = SignupService;

    const data = new SignupRequestData(
      userName,
      firstName,
      lastName,
      nickName,
      email,
      password,
      stayLoggedIn
    );

    // Act
    const result = await sut.postAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postAsync method', async () => {
    const userName = 'userName3';
    const firstName = 'firstName3';
    const lastName = 'lastName3';
    const nickName = 'nickName3';
    const email = 'email3@example.com';
    const password = 'password3';
    const stayLoggedIn = true;

    SignupPort.postAsync = vi.fn().mockImplementation(() => {
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
          url: 'signup',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = SignupService;

    const data = new SignupRequestData(
      userName,
      firstName,
      lastName,
      nickName,
      email,
      password,
      stayLoggedIn
    );

    // Act
    const result = await sut.postAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
});
