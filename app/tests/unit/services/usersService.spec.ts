import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { UsersService } from '@/services/usersService';
import { SignupPort } from '@/ports/signupPort';
import { UsersPort } from '@/ports/usersPort';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';
import { StaticServiceMethods } from '@/services/common';

describe('the usersService serivce', () => {
  let isNumberGreaterThanZeroSpy: MockInstance<[id: number], boolean>;
  let isStringNotEmptyOrNullSpy: MockInstance<[email: string], boolean>;
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should get users by their user id by running the getUserAsync method', async () => {
    // Arrange
    UsersPort.getUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was found.',
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/1',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.getUserAsync(1);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was found.');
    expect(result.user.userName).equals('userName');
  });
  it('should return false if the user id is less than or equal to zero when running the getUserAsync method', async () => {
      // Arrange
      UsersPort.getUserAsync = vi.fn().mockImplementation(() => {
        return {
          data: {
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: User was found.',
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
                isSuperUser: true,
                isAdmin: true,
                dateCreated: '2024-05-24T18:11:39.996131Z',
                dateUpdated: '0001-01-01T00:00:00',
                games: []
              }
            ]
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            url: 'users/1',
            method: 'post',
            baseURL: 'https://localhost:5001/api/v1/'
          },
          request: {}
        } as AxiosResponse;
      });
  
      isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');
  
      isNumberGreaterThanZeroSpy.mockImplementation(() => false);

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = UsersService;
  
      // Act
      const result = await sut.getUserAsync(0);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.message).equals('Number cannot be zero.');
  });
  it('should catch AxiosErrors thrown when running the getUserAsync method', async () => {
       // Arrange
       UsersPort.getUserAsync = vi.fn().mockImplementation(() => {
        return {
          config: {
            url: 'users/3',
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
  
      isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');
  
      isNumberGreaterThanZeroSpy.mockImplementation(() => true);

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = UsersService;

      // Act
      const result = await sut.getUserAsync(3);
  
      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.message).equals('Status Code 404: User was not found.');
  });
  it('should catch any errors thrown when running the getUserAsync method', async () => {
    // Arrange
    UsersPort.getUserAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.getUserAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the getUserAsync method', async () => {
    // Arrange
    UsersPort.getUserAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/1',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.getUserAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should update users by running the putUpdateUserAsync method', async () => {
    // Arrange
    const newNickName = 'nickName1';

    UsersPort.putUpdateUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was updated.',
          payload: [{
            user: {
              id: 1,
              userName: 'userName',
              firstName: 'firstName',
              lastName: 'lastName',
              nickName: newNickName,
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
            confirmationEmailSuccessfullySent: null,
            token: 'HGkB6+0aWE2tsP67/f4U3A=='
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    const data = new UpdateUserRequestData(
      'userName', 
      'firstName', 
      'lastName', 
      newNickName, 
      'email@example.com');

    // Act
    const result = await sut.putUpdateUserAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was updated.');
    expect(newNickName).equals('nickName1');
    expect(result.user.nickName).equals(newNickName);
  });
  it('should catch AxiosErrors thrown when running the putUpdateUserAsync method', async () => {
    // Arrange
    const newNickName = 'nickName1';

    UsersPort.putUpdateUserAsync = vi.fn().mockImplementation(() => {
     return {
       config: {
         url: 'users/3',
         method: 'put',
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

    const sut = UsersService;

    const data = new UpdateUserRequestData(
      'userName', 
      'firstName', 
      'lastName', 
      newNickName, 
      'email@example.com');

    // Act
    const result = await sut.putUpdateUserAsync(data);
  
    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not found.');
  });
  it('should catch any errors thrown when running the putUpdateUserAsync method', async () => {
    // Arrange
    const newNickName = 'nickName1';

    UsersPort.putUpdateUserAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });
    
    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    const data = new UpdateUserRequestData(
      'userName', 
      'firstName', 
      'lastName', 
      newNickName, 
      'email@example.com');

    // Act
    const result = await sut.putUpdateUserAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putUpdateUserAsync method', async () => {
    // Arrange
    const newNickName = 'nickName1';

    UsersPort.putUpdateUserAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/1',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    
    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    const data = new UpdateUserRequestData(
      'userName', 
      'firstName', 
      'lastName', 
      newNickName, 
      'email@example.com');

    // Act
    const result = await sut.putUpdateUserAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should delete users by their user id by running the deleteUserAsync method', async () => {
    // Arrange
    UsersPort.deleteUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was deleted.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/2',
          method: 'delete',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.deleteUserAsync(2);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: User was deleted.');
  });
  it('should return false if the user id is less than or equal to zero when running the deleteUserAsync method', async () => {
    // Arrange
    UsersPort.deleteUserAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: User was deleted.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/2',
          method: 'delete',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => false);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.deleteUserAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Number cannot be zero.');
  });
  it('should catch AxiosErrors thrown when running the deleteUserAsync method', async () => {
    // Arrange
    UsersPort.deleteUserAsync = vi.fn().mockImplementation(() => {
     return {
       config: {
         url: 'users/3',
         method: 'delete',
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

   isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

   isNumberGreaterThanZeroSpy.mockImplementation(() => true);

   vi.stubEnv('NODE_ENV', 'development');

   const sut = UsersService;

   // Act
   const result = await sut.deleteUserAsync(3);

   // Assert
   expect(result.isSuccess).toBe(false);
   expect(result.message).equals('Status Code 404: User was not found.');
  });
  it('should catch any errors thrown when running the deleteUserAsync method', async () => {
    // Arrange
    UsersPort.deleteUserAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.deleteUserAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the deleteUserAsync method', async () => {
    // Arrange
    UsersPort.deleteUserAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/2',
          method: 'delete',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.deleteUserAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should confirm user emails using email confirmation tokens by running the getConfirmEmailAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.getConfirmEmailAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email was confirmed.',
          payload: [
            {
              confirmationType: 1,
              userName: 'userName3',
              email: 'email3@example.com'
            }
          ]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: `users/confirmemail/${token}`,
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.getConfirmEmailAsync(token);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Email was confirmed.');
    expect(result.data.email).equals('email3@example.com');
  });
  it('should catch AxiosErrors thrown when running the getConfirmEmailAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.getConfirmEmailAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: `users/confirmemail/${token}`,
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Email confirmation token was not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.getConfirmEmailAsync(token);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Email confirmation token was not found.');
  });
  it('should catch any errors thrown when running the getConfirmEmailAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.getConfirmEmailAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.getConfirmEmailAsync(token);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the getConfirmEmailAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.getConfirmEmailAsync = vi.fn().mockImplementation(() => {
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
          url: `users/confirmemail/${token}`,
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.getConfirmEmailAsync(token);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should resend email confirmations using the requestorId by running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    SignupPort.putResendEmailConfirmationAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation email was resent.',
          payload: [{
            user: {
              id: 2,
              userName: 'userName2',
              firstName: 'firstName2',
              lastName: 'lastName2',
              nickName: 'nickName2',
              fullName: 'firstName2 lastName2',
              email: 'email2@example.com',
              isEmailConfirmed: false,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: true,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'signup/resendemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(2);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Email confirmation email was resent.');
  });
  it('should return false if the requestor id is less than or equal to zero when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    SignupPort.putResendEmailConfirmationAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation email was resent.',
          payload: [{
            user: {
              id: 2,
              userName: 'userName2',
              firstName: 'firstName2',
              lastName: 'lastName2',
              nickName: 'nickName2',
              fullName: 'firstName2 lastName2',
              email: 'email2@example.com',
              isEmailConfirmed: false,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: false,
              isActive: true,
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: true,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'signup/resendemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => false);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(0);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Number cannot be zero.');
  });
  it('should catch AxiosErrors thrown when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    SignupPort.putResendEmailConfirmationAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'signup/resendemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Email confirmation email was not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Email confirmation email was not found.');

  });
  it('should catch any errors thrown when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    SignupPort.putResendEmailConfirmationAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    SignupPort.putResendEmailConfirmationAsync = vi.fn().mockImplementation(() => {
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
          url: 'signup/resendemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendEmailConfirmationAsync(2);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should cancel outstanding email confirmations by running the putCancelResendEmailConfirmationAsync method', async () => {
    // Arrange
    UsersPort.putCancelEmailConfirmationRequestAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation request was cancelled.',
          payload: [{
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: null,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/cancelemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelResendEmailConfirmationAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Email confirmation request was cancelled.');
    expect(result.user.isEmailConfirmed).toBe(true);
  });
  it('should catch AxiosErrors thrown when running the putCancelResendEmailConfirmationAsync method', async () => {
    // Arrange
    UsersPort.putCancelEmailConfirmationRequestAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'users/cancelemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Email confirmation email was not found.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelResendEmailConfirmationAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Email confirmation email was not found.');
  });
  it('should catch any errors thrown when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    UsersPort.putCancelEmailConfirmationRequestAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelResendEmailConfirmationAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putResendEmailConfirmationAsync method', async () => {
    // Arrange
    UsersPort.putCancelEmailConfirmationRequestAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/cancelemailconfirmation',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelResendEmailConfirmationAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should reset user passwords by running the putResetPasswordAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.putResetPasswordAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password was reset.',
          payload: [{
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: null,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: `users/resetpassword/${token}`,
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    const data = new ResetPasswordRequestData(
      token, 
      'newPassword');

    // Act
    const result = await sut.putResetPasswordAsync(data);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Password was reset.');
  });
  it('should catch AxiosErrors thrown when running the putResetPasswordAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.putResetPasswordAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: `users/resetpassword/${token}`,
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password was not reset.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    const data = new ResetPasswordRequestData(
      token, 
      'newPassword');

    // Act
    const result = await sut.putResetPasswordAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Password was not reset.');
  });
  it('should catch any errors thrown when running the putResetPasswordAsync method', async () => {    
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.putResetPasswordAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    const sut = UsersService;

    const data = new ResetPasswordRequestData(
      token, 
      'newPassword');

    // Act
    const result = await sut.putResetPasswordAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putResetPasswordAsync method', async () => {
    // Arrange
    const token = '2b9d0926-fd1c-46e5-8c1a-16ecbda7ec05';

    UsersPort.putResetPasswordAsync = vi.fn().mockImplementation(() => {
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
          url: `users/resetpassword/${token}`,
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    const data = new ResetPasswordRequestData(
      token, 
      'newPassword');

    // Act
    const result = await sut.putResetPasswordAsync(data);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should submit requests for password resets by running the postRequestPasswordResetAsync method', async () => {
    // Arrange
    const email = 'email@example.com';

    UsersPort.postRequestPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset request was processed, please check your email.',
          payload: [{
              id: 1,
              userName: 'userName',
              firstName: 'firstName',
              lastName: 'lastName',
              nickName: 'nickName',
              fullName: 'firstName lastName',
              email: email,
              isEmailConfirmed: true,
              receivedRequestToUpdateEmail: false,
              receivedRequestToUpdatePassword: true,
              isActive: true,
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/requestpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.postRequestPasswordResetAsync(email);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Password reset request was processed, please check your email.');
    expect(result.user.email).equals('email@example.com');
    expect(result.user.receivedRequestToUpdatePassword).toBe(true);
  });
  it('should return false if the user email is empty or null when running the postRequestPasswordResetAsync method', async () => {
    // Arrange
    const email = '';

    UsersPort.postRequestPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset request was processed, please check your email.',
          payload: [{
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/requestpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => false);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.postRequestPasswordResetAsync(email);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('String cannot be null or empty.');
    expect(email).equals('');
  });
  it('should catch AxiosErrors thrown when running the postRequestPasswordResetAsync method', async () => {
    // Arrange
    const email = 'email@example.com';

    UsersPort.postRequestPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'users/requestpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Unable to process the password reset request.',
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

    const sut = UsersService;

    // Act
    const result = await sut.postRequestPasswordResetAsync(email);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Unable to process the password reset request.');
  });
  it('should catch any errors thrown when running the postRequestPasswordResetAsync method', async () => {
    // Arrange
    const email = 'email@example.com';

    UsersPort.postRequestPasswordResetAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.postRequestPasswordResetAsync(email);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the postRequestPasswordResetAsync method', async () => {
    // Arrange
    const email = 'email@example.com';

    UsersPort.postRequestPasswordResetAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/requestpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
  
    isStringNotEmptyOrNullSpy = vi.spyOn(StaticServiceMethods, 'isStringNotEmptyOrNull');

    isStringNotEmptyOrNullSpy.mockImplementation(() => true);

    vi.stubEnv('NODE_ENV', 'development');

    const sut = UsersService;

    // Act
    const result = await sut.postRequestPasswordResetAsync(email);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should submit requests to resend password reset requests by running the putResendPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putResendPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset email was resent.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/resendpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendPasswordResetAsync(1);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Password reset email was resent.');
  });
  it('should return false if the user id is less than or equal to zero when running the putResendPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putResendPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset email was resent.',
          payload: []
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/resendpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => false);

    const sut = UsersService;

    // Act
    const result = await sut.putResendPasswordResetAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Number cannot be zero.');
  });
  it('should catch AxiosErrors thrown when running the putResendPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putResendPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'users/resendpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password reset email was not resent.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendPasswordResetAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Password reset email was not resent.');
  });
  it('should catch any errors thrown when running the putResendPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putResendPasswordResetAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendPasswordResetAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putResendPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putResendPasswordResetAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/resendpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    isNumberGreaterThanZeroSpy = vi.spyOn(StaticServiceMethods, 'isNumberGreaterThanZero');

    isNumberGreaterThanZeroSpy.mockImplementation(() => true);

    const sut = UsersService;

    // Act
    const result = await sut.putResendPasswordResetAsync(1);

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should cancel outstanding password reset requests by running the putCancelPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putCancelPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Password reset email was resent.',
          payload: [{
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: null,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/cancelpasswordreset',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelPasswordResetAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Password reset email was resent.');
    expect(result.user.receivedRequestToUpdatePassword).toBe(false);
  });
  it('should catch AxiosErrors thrown when running the putCancelPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putCancelPasswordResetAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'users/cancelpasswordreset',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Password reset request was not cancelled.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelPasswordResetAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: Password reset request was not cancelled.');
  });
  it('should catch any errors thrown when running the putCancelPasswordResetAsync method', async () => {    
    // Arrange
    UsersPort.putCancelPasswordResetAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelPasswordResetAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putCancelPasswordResetAsync method', async () => {
    // Arrange
    UsersPort.putCancelPasswordResetAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/cancelpasswordreset',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelPasswordResetAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
  it('should cancel outstanding password reset and email confirmation requests by running the putCancelAllEmailRequestsAsync method', async () => {
    // Arrange
    UsersPort.putCancelAllEmailRequestsAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
          payload: [{
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
              isSuperUser: true,
              isAdmin: true,
              dateCreated: '2024-05-24T18:11:39.996131Z',
              dateUpdated: '0001-01-01T00:00:00',
              games: []
            },
            confirmationEmailSuccessfullySent: null,
            token: ''
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'users/cancelallemailrequests',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelAllEmailRequestsAsync();

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.message).equals('Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.');
    expect(result.user.receivedRequestToUpdateEmail).toBe(false);
    expect(result.user.receivedRequestToUpdatePassword).toBe(false);
  });
  it('should catch AxiosErrors thrown when running the putCancelAllEmailRequestsAsync method', async () => {
    // Arrange
    UsersPort.putCancelAllEmailRequestsAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'users/cancelallemailrequests',
          method: 'put',
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

    const sut = UsersService;

    // Act
    const result = await sut.putCancelAllEmailRequestsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 404: User was not found.');
  });
  it('should catch any errors thrown when running the putCancelAllEmailRequestsAsync method', async () => {
    // Arrange
    UsersPort.putCancelAllEmailRequestsAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelAllEmailRequestsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should return false if an erroneous 200 is returned with an isSuccess of false when running the putCancelAllEmailRequestsAsync method', async () => {    
    // Arrange
    UsersPort.putCancelAllEmailRequestsAsync = vi.fn().mockImplementation(() => {
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
          url: 'users/cancelallemailrequests',
          method: 'put',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    const sut = UsersService;

    // Act
    const result = await sut.putCancelAllEmailRequestsAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Erroneous result returned.');
  });
});
