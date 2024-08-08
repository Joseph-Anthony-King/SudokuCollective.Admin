import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import type { AxiosError, AxiosResponse } from 'axios';
import { LoginPort } from '@/ports/loginPort/index';
import { Endpoints } from '@/ports/loginPort/endpoints';
import { LoginRequestData } from '@/models/requests/loginRequestData';

describe('the loginPort port', () => {
  let testServer: SetupServerApi | null;
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.loginEndpoint).equals('https://localhost:5001/api/v1/login');
    expect(Endpoints.confirmUserNameEndpoint).equals('https://localhost:5001/api/v1/login/confirmusername');
  });
  it('should login users with when they submit valid credentials by running the postLoginAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/login', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was found.',
          payload: [
            {
              user: {
                id: 2,
                userName: 'Test User 2',
                firstName: 'John',
                lastName: 'Doe',
                nickName: 'Test User 2',
                fullName: 'John Doe',
                email: 'John.Doe@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
              tokenExpirationDate: '2024-07-26T20:28:10.1383677Z'
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

    const sut = LoginPort;

    const loginRequestData = new LoginRequestData('Test User 2', 'testPassword', true);

    // Act
    const result = await sut.postLoginAsync(loginRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User was found.');
    expect(result.data.payload[0].user.userName).equals('Test User 2');
    expect(result.data.payload[0].token).equals('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM');
  });
  it('should catch AxiosErrors thrown when running the postLoginAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/login', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of [! @ # $ % ^ & * + = ? - _ . ,].',
            payload: []
          }, {
            status: 400,
            statusText: 'BAD REQUEST',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = LoginPort;
  
      const loginRequestData = new LoginRequestData('Test User 2', 'testPassword', true);
  
      // Act
      await sut.postLoginAsync(loginRequestData) as AxiosResponse;

    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 400: Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of [! @ # $ % ^ & * + = ? - _ . ,].');
    }
  });
  it('should catch any errors thrown when running the postLoginAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/login', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User was found.',
            payload: [
              {
                user: {
                  id: 2,
                  userName: 'Test User 2',
                  firstName: 'John',
                  lastName: 'Doe',
                  nickName: 'Test User 2',
                  fullName: 'John Doe',
                  email: 'John.Doe@example.com',
                  isEmailConfirmed: true,
                  receivedRequestToUpdateEmail: false,
                  receivedRequestToUpdatePassword: false,
                  isActive: true,
                  isSuperUser: false,
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
                tokenExpirationDate: '2024-07-26T20:28:10.1383677Z'
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
  
      const sut = LoginPort;
  
      const loginRequestData = new LoginRequestData('Test User 2', 'testPassword', true);
  
      // Act
      await sut.postLoginAsync(loginRequestData, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should confirm the validity of user names by running the postConfirmUserNameAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/login/confirmusername', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User name was confirmed.',
          payload: [
            {
              userName: 'Test User 2'
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

    const sut = LoginPort;

    // Act
    const result = await sut.postConfirmUserNameAsync('John.Doe@example.com') as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User name was confirmed.');
    expect(result.data.payload[0].userName).equals('Test User 2');
  });
  it('should catch AxiosErrors thrown when running the postConfirmUserNameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/login/confirmusername', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: No user is using this email.',
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
  
      const sut = LoginPort;
  
      // Act
      await sut.postConfirmUserNameAsync('John.Doe@example.com') as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: No user is using this email.');
    }
  });
  it('should catch any errors thrown when running the postConfirmUserNameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/login/confirmusername', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User name was confirmed.',
            payload: [
              {
                userName: 'Test User 2'
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
  
      const sut = LoginPort;
  
      // Act
      await sut.postConfirmUserNameAsync('John.Doe@example.com', true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
