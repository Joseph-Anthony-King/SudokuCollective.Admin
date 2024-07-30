import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { AxiosError, AxiosResponse } from 'axios';
import { UsersPort } from '@/ports/usersPort/index';
import { Endpoints } from '@/ports/usersPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';

describe('the usersPort port', () => {
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
    expect(Endpoints.usersEndpoint).equals('https://localhost:5001/api/v1/users');
    expect(Endpoints.confirmEmailEndpoint).equals('https://localhost:5001/api/v1/users/confirmemail/{{token}}');
    expect(Endpoints.cancelEmailConfirmationRequestEndpoint).equals('https://localhost:5001/api/v1/users/cancelemailconfirmation');
    expect(Endpoints.resetPasswordEndpoint).equals('https://localhost:5001/api/v1/users/resetpassword/{{token}}');
    expect(Endpoints.requestPasswordResetEndpoint).equals('https://localhost:5001/api/v1/users/requestpasswordreset');
    expect(Endpoints.resendPasswordResetEndpoint).equals('https://localhost:5001/api/v1/users/resendpasswordreset');
    expect(Endpoints.cancelPasswordResetEndpoint).equals('https://localhost:5001/api/v1/users/cancelpasswordreset');
    expect(Endpoints.cancelAllEmailRequestsEndpoint).equals('https://localhost:5001/api/v1/users/cancelallemailrequests');
  });
  it('should get users using the getUserAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/users/1', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was found.',
          payload: [
            {
              user: {
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
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },
              token: '+nb96gt6vU6qE9cTgnqOkA==',
              tokenExpirationDate: '2024-07-31T15:01:48.2009318Z'
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

    const sut = UsersPort;

    // Act
    const result = await sut.getUserAsync(1) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User was found.');
    expect(result.data.payload[0].user.userName).equals('userName');
    expect(result.data.payload[0].token).equals('+nb96gt6vU6qE9cTgnqOkA==');
  });
  it('should catch any errors thrown by Axios in the getUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not found.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.getUserAsync(1) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: User was not found.');
    }
  });
  it('should catch any errors thrown by the getUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User was found.',
            payload: [
              {
                user: {
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
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },
                token: '+nb96gt6vU6qE9cTgnqOkA==',
                tokenExpirationDate: '2024-07-31T15:01:48.2009318Z'
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
  
      const sut = UsersPort;
  
      // Act
      await sut.getUserAsync(1, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should update users using the putUpdateUserAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/1', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was updated.',
          payload: [
            {
              user: {
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
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '2024-05-24T19:00:00.996131Z',
                games: []
              },
              token: '',
              tokenExpirationDate: ''
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

    const sut = UsersPort;

    const updateUserRequestData = new UpdateUserRequestData(
      'userName',
      'firstName',
      'lastName',
      'nickName',
      'email@example.com'
    );

    // Act
    const result = await sut.putUpdateUserAsync(updateUserRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User was updated.');
    expect(result.data.payload[0].user.userName).equals('userName');
  });
  it('should catch any errors thrown by Axios in the putUpdateUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not updated.',
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
  
      const sut = UsersPort;
  
      const updateUserRequestData = new UpdateUserRequestData(
        'userName',
        'firstName',
        'lastName',
        'nickName',
        'email@example.com'
      );
  
      // Act
      await sut.putUpdateUserAsync(updateUserRequestData) as AxiosResponse;      
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: User was not updated.');
      
    }
  });
  it('should catch any errors thrown by the putUpdateUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User was updated.',
            payload: [
              {
                user: {
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
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '2024-05-24T19:00:00.996131Z',
                  games: []
                },
                token: '+nb96gt6vU6qE9cTgnqOkA==',
                tokenExpirationDate: '2024-07-31T15:01:48.2009318Z'
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
  
      const sut = UsersPort;
  
      const updateUserRequestData = new UpdateUserRequestData(
        'userName',
        'firstName',
        'lastName',
        'nickName',
        'email@example.com'
      );
  
      // Act
      await sut.putUpdateUserAsync(updateUserRequestData, true) as AxiosResponse;      
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should delete users using the deleteUserAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.delete('https://localhost:5001/api/v1/users/1', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was deleted.',
          payload: [ ]
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

    const sut = UsersPort;

    const updateUserRequestData = new UpdateUserRequestData(
      'userName',
      'firstName',
      'lastName',
      'nickName',
      'email@example.com'
    );

    // Act
    const result = await sut.deleteUserAsync(1) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: User was deleted.');
  });
  it('should catch any errors thrown by Axios in the deleteUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.delete('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: User was not deleted.',
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
  
      const sut = UsersPort;
  
      const updateUserRequestData = new UpdateUserRequestData(
        'userName',
        'firstName',
        'lastName',
        'nickName',
        'email@example.com'
      );
  
      // Act
      await sut.deleteUserAsync(1) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: User was not deleted.');
    }
  });
  it('should catch any errors thrown by the deleteUserAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.delete('https://localhost:5001/api/v1/users/1', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User was deleted.',
            payload: [ ]
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
  
      const sut = UsersPort;
  
      const updateUserRequestData = new UpdateUserRequestData(
        'userName',
        'firstName',
        'lastName',
        'nickName',
        'email@example.com'
      );
  
      // Act
      await sut.deleteUserAsync(1, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should confirm the validity of emails by email confirmation tokens to the API via the getConfirmEmailAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.get('https://localhost:5001/api/v1/users/confirmemail/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email was confirmed.',
          payload: [
            {
              confirmationType: 1,
              userName: 'userName',
              email: 'email@example.com',
              appTitle: 'Test App',
              appUrl: 'https://localhost:8080',
              isUpdate: true,
              newEmailAddressConfirmed: false,
              confirmationEmailSuccessfullySent: true
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

    const sut = UsersPort;

    // Act
    const result = await sut.getConfirmEmailAsync('14bbe47c-89ce-44a4-894a-6e12bcef7e9f') as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Email was confirmed.');
    expect(result.data.payload[0].confirmationEmailSuccessfullySent).toBe(true);
  });
  it('should catch any errors thrown by Axios in the getConfirmEmailAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/users/confirmemail/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 404: Email was not confirmed.',
            payload: [
              {
                confirmationType: 1,
                userName: 'userName',
                email: 'email@example.com',
                appTitle: 'Test App',
                appUrl: 'https://localhost:8080',
                isUpdate: true,
                newEmailAddressConfirmed: false,
                confirmationEmailSuccessfullySent: false
              }
             ]
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
  
      const sut = UsersPort;
  
      // Act
      await sut.getConfirmEmailAsync('14bbe47c-89ce-44a4-894a-6e12bcef7e9f', true) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Email was not confirmed.');
      expect(result.data.payload[0].confirmationEmailSuccessfullySent).toBe(false);
    }
  });
  it('should catch any errors thrown by the getConfirmEmailAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/users/confirmemail/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Email was confirmed.',
            payload: [ ]
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
  
      const sut = UsersPort;
  
      // Act
      const result = await sut.getConfirmEmailAsync('14bbe47c-89ce-44a4-894a-6e12bcef7e9f') as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should cancel email confirmation requests for the signed in user using the putCancelEmailConfirmationRequestAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/cancelemailconfirmation', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation request was cancelled.',
          payload: [
            {
              user: {
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
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              },
              ConfirmationEmailSuccessfullySent: false,
              token: ''
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

    const sut = UsersPort;

    // Act
    const result = await sut.putCancelEmailConfirmationRequestAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Email confirmation request was cancelled.');
    expect(result.data.payload[0].user.isEmailConfirmed).toBe(true);
    expect(result.data.payload[0].user.receivedRequestToUpdateEmail).toBe(false);
  });
  it('should catch any errors thrown by Axios in the putCancelEmailConfirmationRequestAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelemailconfirmation', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Email confirmation request was not cancelled.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelEmailConfirmationRequestAsync() as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Email confirmation request was not cancelled.');
    }
  });
  it('should catch any errors thrown by the putCancelEmailConfirmationRequestAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelemailconfirmation', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Email confirmation request was cancelled.',
            payload: [
              {
                user: {
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
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                },
                ConfirmationEmailSuccessfullySent: false,
                token: ''
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelEmailConfirmationRequestAsync(true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should submit user request to update passwords using the postRequestPasswordResetAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/users/requestpasswordreset', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset request was processed, please check your email.',
          payload: [
            {
              user: {
                id: 1,
                userName: 'userName',
                firstName: 'firstName',
                lastName: 'lastName',
                nickName: 'nickName',
                fullName: 'firstName lastName',
                email: 'email@example.com',
                isEmailConfirmed: true,
                receivedRequestToUpdateEmail: false,
                receivedRequestToUpdatePassword: true,
                isActive: true,
                isSuperUser: false,
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              }
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

    const sut = UsersPort;

    // Act
    const result = await sut.postRequestPasswordResetAsync('email@example.com') as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Password reset request was processed, please check your email.');
    expect(result.data.payload[0].user.receivedRequestToUpdatePassword).toBe(true);
  });
  it('should catch any error thrown by Axios in the postRequestPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/users/requestpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Unable to process the password reset request.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.postRequestPasswordResetAsync('email@example.com') as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Unable to process the password reset request.');
    }
  });
  it('should catch any errors thrown by the postRequestPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/users/requestpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Password reset request was processed, please check your email.',
            payload: [
              {
                user: {
                  id: 1,
                  userName: 'userName',
                  firstName: 'firstName',
                  lastName: 'lastName',
                  nickName: 'nickName',
                  fullName: 'firstName lastName',
                  email: 'email@example.com',
                  isEmailConfirmed: true,
                  receivedRequestToUpdateEmail: false,
                  receivedRequestToUpdatePassword: true,
                  isActive: true,
                  isSuperUser: false,
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                }
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
  
      const sut = UsersPort;
  
      // Act
      await sut.postRequestPasswordResetAsync('email@example.com', true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should submit new passwords using the putResetPasswordAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/resetpassword/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password was reset.',
          payload: [
            {
              user: {
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
                isAdmin: false,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              }
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

    const sut = UsersPort;

    const resetPasswordRequestData = new ResetPasswordRequestData(
      '14bbe47c-89ce-44a4-894a-6e12bcef7e9f',
      'newPassword'
    );

    // Act
    const result = await sut.putResetPasswordAsync(resetPasswordRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Password was reset.');
    expect(result.data.payload[0].user.receivedRequestToUpdatePassword).toBe(false);
  });
  it('should catch any error thrown by Axios in the putResetPasswordAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/resetpassword/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password was not reset.',
            payload: [ ]
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
  
      const sut = UsersPort;
  
      const resetPasswordRequestData = new ResetPasswordRequestData(
        '14bbe47c-89ce-44a4-894a-6e12bcef7e9f',
        'newPassword'
      );
  
      // Act
      await sut.putResetPasswordAsync(resetPasswordRequestData) as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Password was not reset.');
    }
  });
  it('should catch any errors thrown by the putResetPasswordAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/resetpassword/14bbe47c-89ce-44a4-894a-6e12bcef7e9f', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Password was reset.',
            payload: [
              {
                user: {
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
                  isAdmin: false,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00',
                  games: []
                }
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
  
      const sut = UsersPort;
  
      const resetPasswordRequestData = new ResetPasswordRequestData(
        '14bbe47c-89ce-44a4-894a-6e12bcef7e9f',
        'newPassword'
      );
  
      // Act
      await sut.putResetPasswordAsync(resetPasswordRequestData, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should resubmit password reset requests using the putResendPasswordResetAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/resendpasswordreset', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset email was resent.',
          payload: [ ]
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

    const sut = UsersPort;

    // Act
    const result = await sut.putResendPasswordResetAsync(1) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Password reset email was resent.');
  });
  it('should catch any errors thrown by Axios in the putResendPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/resendpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password reset email was not resent.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putResendPasswordResetAsync(1) as AxiosResponse;
      
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Password reset email was not resent.');
    }
  });
  it('should catch any errors thrown by the putResendPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/resendpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Password reset email was resent.',
            payload: [ ]
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putResendPasswordResetAsync(1, true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should cancel password reset requests for the signed in user using the putCancelPasswordResetAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/cancelpasswordreset', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset request was cancelled.',
          payload: [ ]
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

    const sut = UsersPort;

    // Act
    const result = await sut.putCancelPasswordResetAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Password reset request was cancelled.');
  });
  it('should catch any errors thrown by Axios in the putCancelPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password reset request was not cancelled.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelPasswordResetAsync() as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Password reset request was not cancelled.');
    }
  });
  it('should catch any errors thrown by the putCancelPasswordResetAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelpasswordreset', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password reset request was not cancelled.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelPasswordResetAsync(true) as AxiosResponse;      
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should cancel all email confirmation and password reset requests using the putCancelAllEmailRequestsAsync method', async () => {
    //Arrange
    testServer = setupServer(
      http.put('https://localhost:5001/api/v1/users/cancelallemailrequests', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
          payload: [ ]
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

    const sut = UsersPort;

    // Act
    const result = await sut.putCancelAllEmailRequestsAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.');
  });
  it('should catch any errors thrown by Axios in the putCancelAllEmailRequestsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelallemailrequests', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Email confirmation request was not cancelled and Password reset request was not cancelled.',
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelAllEmailRequestsAsync() as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Email confirmation request was not cancelled and Password reset request was not cancelled.');
    }
  });
  it('should catch any errors thrown by the putCancelAllEmailRequestsAsync method', async () => {
    try {
      //Arrange
      testServer = setupServer(
        http.put('https://localhost:5001/api/v1/users/cancelallemailrequests', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
            payload: [ ]
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
  
      const sut = UsersPort;
  
      // Act
      await sut.putCancelAllEmailRequestsAsync(true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
