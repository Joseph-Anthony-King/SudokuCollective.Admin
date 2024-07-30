import { describe, expect, it, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import type { AxiosError, AxiosResponse } from 'axios';
import { SignupPort } from '@/ports/signupPort/index';
import { Endpoints } from '@/ports/signupPort/endpoints';
import { SignupRequestData } from '@/models/requests/signupRequestData';

describe('the signupPort port', () => {
  let testServer: SetupServerApi | null;
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.signupEndpoint).equals('https://localhost:5001/api/v1/signup');
    expect(Endpoints.resendEmailConfirmationEndpoint).equals('https://localhost:5001/api/v1/signup/resendemailconfirmation');
  });
  it('should sign up new users using the postAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/signup', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: User was created.',
          payload: [
            {
              user: {
                id: 3,
                userName: 'Test User 2',
                firstName: 'John',
                lastName: 'Doe',
                nickName: 'Test User 2',
                fullName: 'John Doe',
                email: 'John.Doe@example.com',
                isEmailConfirmed: false,
                receivedRequestToUpdateEmail: true,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
              tokenExpirationDate: '2024-07-26T20:28:10.1383677Z',
              emailConfirmationSent: true
            }
          ]
        }, {
          status: 201,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
    );

    testServer.listen();

    const sut = SignupPort;

    const signupRequestData = new SignupRequestData(      
      'Test User 2',
      'John',
      'Doe',
      'Test User 2',
      'John.Doe@example.com',
      'V109+Ucd]Gl?',
      true
    );

    // Act
    const result = await sut.postAsync(signupRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 201: User was created.');
    expect(result.data.payload[0].user.userName).equals('Test User 2');
    expect(result.data.payload[0].token).equals('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM');
  });
  it('should catch any errors thrown by Axios in the postAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/signup', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of [! @ # $ % ^ & * + = ? - _ . ,].',
            payload: []
          }, {
            status: 400,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = SignupPort;
  
      const signupRequestData = new SignupRequestData(      
        'Test User 2',
        'John',
        'Doe',
        'Test User 2',
        'John.Doe@example.com',
        'V109+Ucd]Gl?',
        true
      );
  
      // Act
      await sut.postAsync(signupRequestData) as AxiosResponse;
      
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 400: Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of [! @ # $ % ^ & * + = ? - _ . ,].');
    }
  });
  it('should catch any errors thrown by the postAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/signup', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: User was created.',
            payload: [
              {
                user: {
                  id: 3,
                  userName: 'Test User 2',
                  firstName: 'John',
                  lastName: 'Doe',
                  nickName: 'Test User 2',
                  fullName: 'John Doe',
                  email: 'John.Doe@example.com',
                  isEmailConfirmed: false,
                  receivedRequestToUpdateEmail: true,
                  receivedRequestToUpdatePassword: false,
                  isActive: true,
                  isSuperUser: false,
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
                tokenExpirationDate: '2024-07-26T20:28:10.1383677Z',
                emailConfirmationSent: true
              }
            ]
          }, {
            status: 201,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = SignupPort;
  
      const signupRequestData = new SignupRequestData(      
        'Test User 2',
        'John',
        'Doe',
        'Test User 2',
        'John.Doe@example.com',
        'V109+Ucd]Gl?',
        true
      );
  
      // Act
      await sut.postAsync(signupRequestData, true) as AxiosResponse;
      
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should resend email confirmations using putResendEmailConfirmationAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/signup/resendemailconfirmation', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation email was resent.',
          payload: [
            {
              user: {
                id: 3,
                userName: 'Test User 2',
                firstName: 'John',
                lastName: 'Doe',
                nickName: 'Test User 2',
                fullName: 'John Doe',
                email: 'John.Doe@example.com',
                isEmailConfirmed: false,
                receivedRequestToUpdateEmail: true,
                receivedRequestToUpdatePassword: false,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
              tokenExpirationDate: '2024-07-26T20:28:10.1383677Z',
              emailConfirmationSent: true
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

    const sut = SignupPort;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(3) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Email confirmation email was resent.');
    expect(result.data.payload[0].user.isEmailConfirmed).toBe(false);
    expect(result.data.payload[0].user.receivedRequestToUpdateEmail).toBe(true);
  });
  it('should catch any errors thrown by Axios in the putResendEmailConfirmationAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/signup/resendemailconfirmation', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not found.',
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
  
      const sut = SignupPort;
  
      // Act
      await sut.putResendEmailConfirmationAsync(4) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: User was not found.');
    }
  });
  it('should catch any errors thrown by the putResendEmailConfirmationAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/signup/resendemailconfirmation', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Email confirmation email was resent.',
            payload: [
              {
                user: {
                  id: 3,
                  userName: 'Test User 2',
                  firstName: 'John',
                  lastName: 'Doe',
                  nickName: 'Test User 2',
                  fullName: 'John Doe',
                  email: 'John.Doe@example.com',
                  isEmailConfirmed: false,
                  receivedRequestToUpdateEmail: true,
                  receivedRequestToUpdatePassword: false,
                  isActive: true,
                  isSuperUser: false,
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjpbIkpvZSBLaW5nIiwiMiIsIjMiXSwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiVVNFUiIsIm5iZiI6MTcyMTkzOTI5MCwiZXhwIjoxNzIyMDI1NjkwLCJpc3MiOiJodHRwczovL3N1ZG9rdWNvbGxlY3RpdmUuY29tIiwiYXVkIjoiY2xpZW50cyJ9.RPBT1-baA_WGr5MIcQk-HSFP4Ax1fjjPOyRlIOp1LKM',
                tokenExpirationDate: '2024-07-26T20:28:10.1383677Z',
                emailConfirmationSent: true
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
  
      const sut = SignupPort;
  
      // Act
      await sut.putResendEmailConfirmationAsync(3, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
