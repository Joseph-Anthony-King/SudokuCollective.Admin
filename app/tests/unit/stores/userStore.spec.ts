import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useDialogStore } from '@/stores/dialogStore';
import { LoginService } from '@/services/loginService';
import { SignupService } from '@/services/signupService';
import { UsersService } from '@/services/usersService';
import { User } from '@/models/domain/user';
import { SignupRequestData } from '@/models/requests/signupRequestData';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import type { IResetPasswordRequestData } from '@/interfaces/requests/iResetPasswordRequestData';
import type { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';
import type { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData'
import { EmailConfirmationType } from '@/enums/emailConfirmationType';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';

describe('the userStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
    vi.stubEnv('NODE_ENV', 'development');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useUserStore(pinia);

    sut.$state.confirmedUserName = 'confirmedUserName';
    sut.$state.serviceMessage = 'serviceMessage';

    // Assert
    expect(sut.user).toBeTypeOf('object');
    expect(sut.confirmedUserName).toBeTypeOf('string');
    expect(sut.serviceMessage).toBeTypeOf('string');
    expect(sut.userIsLoggingOut).toBeTypeOf('boolean');
  });
  it('should have the expected getters', () => {
    // Arrange and Act
    const sut = useUserStore(pinia);

    sut.$state.confirmedUserName = 'confirmedUserName';
    sut.$state.serviceMessage = 'serviceMessage';

    const user = sut.getUser;
    const userIsLoggedIn = sut.getUserIsLoggedIn;
    const userIsLoggingIn = sut.getUserIsLoggingIn;
    const userIsSignedUp = sut.getUserIsSignedUp;
    const userIsSigningUp = sut.getUserIsSigningUp;
    const confirmedUserName = sut.getConfirmedUserName;
    const serviceMessage = sut.getServiceMessage;
    const userIsLoggingOut = sut.getUserIsLoggingOut;

    // Assert
    expect(user).toBeTypeOf('object');
    expect(userIsLoggedIn).toBeTypeOf('boolean');
    expect(userIsLoggingIn).toBeTypeOf('boolean');
    expect(userIsSignedUp).toBeTypeOf('boolean');
    expect(userIsSigningUp).toBeTypeOf('boolean');
    expect(confirmedUserName).toBeTypeOf('string');
    expect(serviceMessage).toBeTypeOf('string');
    expect(userIsLoggingOut).toBeTypeOf('boolean');
  });
  it('should return an empty string for getConfirmedUserName if the confirmedUserName is null', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const confirmedUserNameIsNull = sut.$state.confirmedUserName === null;

    // Act
    const result = sut.getConfirmedUserName;

    // Assert
    expect(result).equals('');
    expect(confirmedUserNameIsNull).toBeTruthy();
  });
  it('should return an empty string for getServiceMessage if the serviceMessage is null', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const serviceMessageIsNull = sut.$state.serviceMessage === null;

    // Act
    const result = sut.getServiceMessage;

    // Assert
    expect(result).equals('');
    expect(serviceMessageIsNull).toBeTruthy();
  });
  it('should update the user property using the updateUser mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    
    const user = new User(
      1,
      'userName',
      'John',
      'Doe',
      'nickName',
      'John Doe',
      'john.doe@exmaple.com',
      true,
      false,
      false,
      true,
      false,
      true,
      new Date(),
      new Date(),
      true,
      true
    );

    // Act
    sut.updateUser(user);

    // Assert
    expect(sut.getUser.firstName).equals(user.firstName);
  });
  it('should update the user isLoggingIn property using the updateUserIsLoggingIn mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const initialStateIsFalse = sut.getUser.isLoggingIn === false;
    const truthy = true;

    // Act
    sut.updateUserIsLoggingIn(truthy);
    const finalStateIsTrue = sut.getUser.isLoggingIn === true;

    // Assert
    expect(initialStateIsFalse).toBeTruthy();
    expect(truthy).toBeTruthy();
    expect(finalStateIsTrue).toBeTruthy();
  });
  it('should update the user isSigningUp property using the updateUserIsSigningUp mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const initialStateIsFalse = sut.getUser.isSigningUp === false;
    const truthy = true;

    // Act
    sut.updateUserIsSigningUp(truthy);
    const finalStateIsTrue = sut.getUser.isSigningUp === true;

    // Assert
    expect(initialStateIsFalse).toBeTruthy();
    expect(truthy).toBeTruthy();
    expect(finalStateIsTrue).toBeTruthy();
  });
  it('should update the confirmedUserName using the updateConfirmedUserName mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const initialStateIsNull = sut.$state.confirmedUserName === null;
    const confirmedUserName = 'confirmedUserName';

    // Act
    sut.updateConfirmedUserName(confirmedUserName);
    const finalStateIsNotNull = sut.$state.confirmedUserName !== null;

    // Assert
    expect(initialStateIsNull).toBeTruthy();
    expect(finalStateIsNotNull).toBeTruthy();
    expect(sut.getConfirmedUserName).equals(confirmedUserName);
  });
  it('should update the serviceMessage using the updateServiceMessage mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const initialStateIsNull = sut.$state.serviceMessage === null;
    const serviceMessage = 'serviceMessage';

    // Act
    sut.updateServiceMessage(serviceMessage);
    const finalStateIsNotNull = sut.$state.serviceMessage !== null;

    // Assert
    expect(initialStateIsNull).toBeTruthy();
    expect(finalStateIsNotNull).toBeTruthy();
    expect(sut.getServiceMessage).equals(serviceMessage);
  });
  it('should update the user isLoggingIn property using the updateUserIsLoggingOut mutation', () => {
    // Arrange
    const sut = useUserStore(pinia);
    const initialStateIsFalse = sut.$state.userIsLoggingOut === false;
    const truthy = true;

    // Act
    sut.updateUserIsLoggingOut(truthy);
    const finalStateIsTrue = sut.$state.userIsLoggingOut === true;

    // Assert
    expect(initialStateIsFalse).toBeTruthy();
    expect(truthy).toBeTruthy();
    expect(finalStateIsTrue).toBeTruthy();
  });
  it('should reset the stores properties using the initializeStore method', () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      1,
      'userName',
      'John',
      'Doe',
      'nickName',
      'John Doe',
      'john.doe@exmaple.com',
      true,
      false,
      false,
      true,
      false,
      true,
      new Date(),
      new Date(),
      true,
      true
    );
    const userHasValues = sut.getUser.firstName === 'John' && sut.getUser.lastName === 'Doe';

    // Act
    sut.initializeStore();
    const userIsInitialized = sut.getUser.firstName === null && sut.getUser.lastName === null;

    // Assert
    expect(userHasValues).toBeTruthy();
    expect(userIsInitialized).toBeTruthy();
  });
  it('should sign up new users via the signupUserAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    const globalStore = useGlobalStore(pinia);
    globalStore.updateToken = vi.fn();
    globalStore.updateTokenExpirationDate = vi.fn();
    globalStore.updateStayLoggedIn = vi.fn();
    const dialogStore = useDialogStore(pinia);
    dialogStore.updateDialog = vi.fn();
    
    const postAsyncSpy = vi.spyOn(SignupService, 'postAsync');
    postAsyncSpy.mockImplementation(async (data: ISignupRequestData) => {
      const now = new Date();
      const expires = new Date(`${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}/${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}/${now.getFullYear()}`);
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 201: User was created.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true),
        token: 'fGevSi7pb0KZ0LuQlWN0og==',
        tokenExpirationDate: expires.toUTCString()
      }
    });

    const data = new SignupRequestData(
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'email3@example.com', 
      'password1', 
      true);

    // Act
    const result = await sut.signupUserAsync(data);

    // Assert
    expect(result).toBeTruthy();
  });
  it('should catch any errors thrown by the SignupService when running the signupUserAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    const globalStore = useGlobalStore(pinia);
    globalStore.updateToken = vi.fn();
    globalStore.updateTokenExpirationDate = vi.fn();
    globalStore.updateStayLoggedIn = vi.fn();
    const dialogStore = useDialogStore(pinia);
    dialogStore.updateDialog = vi.fn();
    
    const postAsyncSpy = vi.spyOn(SignupService, 'postAsync');
    postAsyncSpy.mockImplementation(async (data: ISignupRequestData) => {
      return new Error('Mock error thrown.');
    });

    const data = new SignupRequestData(
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'email3@example.com', 
      'password1', 
      true);

    // Act
    try {
      const result = await sut.signupUserAsync(data);
    } catch (error) {
      expect(error.message).equals('Mock error thrown.');
    }

  });
  it('should get users via the getUserAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);
    
    const getUserAsyncSpy = vi.spyOn(UsersService, 'getUserAsync');
    getUserAsyncSpy.mockImplementation(async (id: number) => {
      const now = new Date();
      const expires = new Date(`${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}/${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}/${now.getFullYear()}`);
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was found.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true),
        token: 'fGevSi7pb0KZ0LuQlWN0og==',
        tokenExpirationDate: expires.toUTCString()
      }
    });
    
    // Act
    const result = await sut.getUserAsync();

    // Assert
    expect(result).toBeTruthy();
  });
  it('should catch any errors thrown by the UsersService via the getUserAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);
    
      const getUserAsyncSpy = vi.spyOn(UsersService, 'getUserAsync');
      getUserAsyncSpy.mockImplementation(async (id: number) => {
        return new Error('Mock error thrown.');
      });
    
    try {
      // Act
      const result = await sut.getUserAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should throw an error if the user userId is invalid when running the getUserAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    
    const getUserAsyncSpy = vi.spyOn(UsersService, 'getUserAsync');
    getUserAsyncSpy.mockImplementation(async (id: number) => {
      const now = new Date();
      const expires = new Date(`${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}/${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}/${now.getFullYear()}`);
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was found.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true),
        token: 'fGevSi7pb0KZ0LuQlWN0og==',
        tokenExpirationDate: expires.toUTCString()
      }
    });
    
    try {
      // Act
      const result = await sut.getUserAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('User id is invalid.');
    }
  });
  it('should update users via the updateUserAsync method', async () => {
    // Arrange
    const createdDate = new Date();
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      createdDate, 
      null, 
      true, 
      true);
  
    const putUpdateUserAsyncSpy = vi.spyOn(UsersService, 'putUpdateUserAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (data: IUpdateUserRequestData) => {
      const now = new Date();
      const expires = new Date(`${now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : `${now.getMonth() + 1}`}/${now.getDate() < 10 ? `0${now.getDate()}` : `${now.getDate()}`}/${now.getFullYear()}`);
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was updated.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3-updated@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          createdDate, 
          new Date(), 
          true, 
          true)
      };
    });

    const data = new UpdateUserRequestData(
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'email3-updated@example.com');
    
    // Act
    const result = await sut.updateUserAsync(data);

    expect(result).toBeTruthy();
    expect(sut.getUser.email).equals('email3-updated@example.com');
  });
  it('should catch any errors thrown by the UsersService via the updateUserAsync method', async () => {
    // Arrange
    const createdDate = new Date();
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      createdDate, 
      null, 
      true, 
      true);
  
    const putUpdateUserAsyncSpy = vi.spyOn(UsersService, 'putUpdateUserAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (data: IUpdateUserRequestData) => {
      return new Error('Mock error thrown.');
    });

    const data = new UpdateUserRequestData(
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'email3-updated@example.com');
    
    try {    
      // Act
      const result = await sut.updateUserAsync(data);        
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should delete users via the deleteUserAsync method', async () => {
    // Arrange
    const createdDate = new Date();
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      createdDate, 
      null, 
      true, 
      true);
  
    const putUpdateUserAsyncSpy = vi.spyOn(UsersService, 'deleteUserAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (id: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was deleted.'
      };
    });

    // Act
    const result = await sut.deleteUserAsync();

    // Assert
    expect(result).toBeTruthy();
  });
  it('should catch any errors thrown by the UsersService via the deleteUserAsync method', async () => {
    // Arrange
    const createdDate = new Date();
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      createdDate, 
      null, 
      true, 
      true);
  
    const putUpdateUserAsyncSpy = vi.spyOn(UsersService, 'deleteUserAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (id: number) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.deleteUserAsync();      
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should throw an error if the user userId is invalid when running the deleteUserAsync method', async () => {
    // Arrange
    const createdDate = new Date();
    const sut = useUserStore(pinia);
  
    const putUpdateUserAsyncSpy = vi.spyOn(UsersService, 'deleteUserAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (id: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was deleted.'
      };
    });

    try {
      // Act
      const result = await sut.deleteUserAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('User id is invalid.');
    }
  });
  it('should confirm the userName by submitting the email via the confirmUserNameAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
  
    const putUpdateUserAsyncSpy = vi.spyOn(LoginService, 'postConfirmUserNameAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User name was confirmed.',
        confirmedUserName: 'userName3'
      };
    });

    // Act
    const result = await sut.confirmUserNameAsync('email3@example.com');
    const confirmedUserName = sut.getConfirmedUserName;

    // Assert
    expect(result).toBeTruthy();
    expect(confirmedUserName).equals('userName3');
  });
  it('should catch any errors thrown by the LoginService via the confirmUserNameAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
  
    const putUpdateUserAsyncSpy = vi.spyOn(LoginService, 'postConfirmUserNameAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (email: string) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.confirmUserNameAsync('email3@example.com');
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should throw an error if the email is null when running the confirmUserNameAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
  
    const putUpdateUserAsyncSpy = vi.spyOn(LoginService, 'postConfirmUserNameAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User name was confirmed.',
        confirmedUserName: 'userName3'
      };
    });
    const email = null;

    try {
      // Act
      const result = await sut.confirmUserNameAsync(email!);
    } catch (error) {
      // Assert
      expect(error.message).equals('Email is invalid.');
      expect(email).toBeNull();
    }
  });
  it('should throw an error if the email is an empty string when running the confirmUserNameAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
  
    const putUpdateUserAsyncSpy = vi.spyOn(LoginService, 'postConfirmUserNameAsync');
    putUpdateUserAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User name was confirmed.',
        confirmedUserName: 'userName3'
      };
    });
    const email = '';

    try {
      // Act
      const result = await sut.confirmUserNameAsync(email!);
    } catch (error) {
      // Assert
      expect(error.message).equals('Email is invalid.');
      expect(email).equals('');
    }
  });
  it('should confirm that the email confirmation token is valid via the confirmEmailConfirmationTokenAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);

    const getConfirmEmailAsyncSpy = vi.spyOn(UsersService, 'getConfirmEmailAsync');
    getConfirmEmailAsyncSpy.mockImplementation(async (token: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email was confirmed.',
        data: {
          confirmationType: EmailConfirmationType.NEWEMAILCONFIRMED,
          userName: 'userName3',
          email: 'email3@example.com'
        }
      };
    });

    // Act
    const result = sut.confirmEmailConfirmationTokenAsync('b6a44c55-65bf-4e8d-8dd6-356ff5ac5a43');

    // Assert
    expect(result).toBeTruthy();
  });
  it('should catch any errors thrown by the UsersService via the confirmEmailConfirmationTokenAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);

    const getConfirmEmailAsyncSpy = vi.spyOn(UsersService, 'getConfirmEmailAsync');
    getConfirmEmailAsyncSpy.mockImplementation(async (token: string) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.confirmEmailConfirmationTokenAsync('b6a44c55-65bf-4e8d-8dd6-356ff5ac5a43');
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should throw an error if the token is null when running the confirmEmailConfirmationTokenAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);

    const getConfirmEmailAsyncSpy = vi.spyOn(UsersService, 'getConfirmEmailAsync');
    getConfirmEmailAsyncSpy.mockImplementation(async (token: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email was confirmed.',
        data: {
          confirmationType: EmailConfirmationType.NEWEMAILCONFIRMED,
          userName: 'userName3',
          email: 'email3@example.com'
        }
      };
    });

    const token = null;

    try {
      // Act
      const result = await sut.confirmEmailConfirmationTokenAsync(token);
    } catch (error) {
      // Assert
      expect(error.message).equals('Token is invalid.');
      expect(token).toBeNull();
    }
  });
  it('should throw an error if the token is an empty string when running the confirmEmailConfirmationTokenAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);

    const getConfirmEmailAsyncSpy = vi.spyOn(UsersService, 'getConfirmEmailAsync');
    getConfirmEmailAsyncSpy.mockImplementation(async (token: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email was confirmed.',
        data: {
          confirmationType: EmailConfirmationType.NEWEMAILCONFIRMED,
          userName: 'userName3',
          email: 'email3@example.com'
        }
      };
    });

    const token = '';

    try {
      // Act
      const result = await sut.confirmEmailConfirmationTokenAsync(token);
    } catch (error) {
      // Assert
      expect(error.message).equals('Token is invalid.');
      expect(token).equals('');
    }
  });
  it('should resend email confirmation requests via the resendEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putResendEmailConfirmationAsync');
    putResendEmailConfirmationAsyncSpy.mockImplementation(async (requestorId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation email was resent.'
      };
    });

    // Act
    const result = await sut.resendEmailConfirmationRequestAsync();

    // Assert
    expect(result).toBeTruthy();
  });
  it('should throw an error if the user id is null when running the resendEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);

    const putResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putResendEmailConfirmationAsync');
    putResendEmailConfirmationAsyncSpy.mockImplementation(async (requestorId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendEmailConfirmationRequestAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('User id is invalid.');
      expect(sut.getUser.id).toBeNull();
    }
  });
  it('should throw an error if the user id is 0 when running the resendEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      0, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putResendEmailConfirmationAsync');
    putResendEmailConfirmationAsyncSpy.mockImplementation(async (requestorId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendEmailConfirmationRequestAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('User id is invalid.');
      expect(sut.getUser.id).equals(0);
    }
  });
  it('should throw an error if there are no outstanding email confirmation requests when running the resendEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putResendEmailConfirmationAsync');
    putResendEmailConfirmationAsyncSpy.mockImplementation(async (requestorId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendEmailConfirmationRequestAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding email confirmation requests.');
      expect(sut.getUser.receivedRequestToUpdateEmail).toBeFalsy();
    }
  });
  it('should catch any errors thrown by the UsersService via the resendEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putResendEmailConfirmationAsync');
    putResendEmailConfirmationAsyncSpy.mockImplementation(async (requestorId: number) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.resendEmailConfirmationRequestAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should cancel outstanding email confirmations via the cancelEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putCancelResendEmailConfirmationAsync');
    putCancelResendEmailConfirmationAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation request was cancelled.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    // Act
    const result = await sut.cancelEmailConfirmationRequestAsync();

    // Assert
    expect(result).toBeTruthy();
    expect(sut.getUser.isEmailConfirmed).toBeTruthy();
  });
  it('should throw an error is there are no outstanding email confirmation requests when running the cancelEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putCancelResendEmailConfirmationAsync');
    putCancelResendEmailConfirmationAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation request was cancelled.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.cancelEmailConfirmationRequestAsync();      
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding email confirmation requests.')
    }
  });
  it('should catch any errors thrown by the UsersService via the cancelEmailConfirmationRequestAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelResendEmailConfirmationAsyncSpy = vi.spyOn(UsersService, 'putCancelResendEmailConfirmationAsync');
    putCancelResendEmailConfirmationAsyncSpy.mockImplementation(async () => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.cancelEmailConfirmationRequestAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.')
    }
  });
  it('should submit password reset requests via the resetPasswordAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResetPasswordAsyncSpy = vi.spyOn(UsersService, 'putResetPasswordAsync');
    putResetPasswordAsyncSpy.mockImplementation(async (data: IResetPasswordRequestData) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password was reset.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });
    const data = new ResetPasswordRequestData('5b37e262-ca2b-4d65-a257-f11bd0776484', 'newPassword');

    // Act
    const result = await sut.resetPasswordAsync(data);

    // Assert
    expect(result).toBeTruthy();
  });
  it('should throw an error if there are no oustanding password reset requests via the resetPasswordAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResetPasswordAsyncSpy = vi.spyOn(UsersService, 'putResetPasswordAsync');
    putResetPasswordAsyncSpy.mockImplementation(async (data: IResetPasswordRequestData) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password was reset.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });
    const data = new ResetPasswordRequestData('5b37e262-ca2b-4d65-a257-f11bd0776484', 'newPassword');

    try {
      // Act
      const result = await sut.resetPasswordAsync(data);
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding password reset requests.')
    }
  });
  it('should catch any errors thrown when submitting password reset requests by the UsersService via the resetPasswordAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResetPasswordAsyncSpy = vi.spyOn(UsersService, 'putResetPasswordAsync');
    putResetPasswordAsyncSpy.mockImplementation(async (data: IResetPasswordRequestData) => {
      return new Error('Mock error thrown.');
    });
    const data = new ResetPasswordRequestData('5b37e262-ca2b-4d65-a257-f11bd0776484', 'newPassword');

    try {
      // Act
      const result = await sut.resetPasswordAsync(data);
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should submit emails in order to request password resets via the requestPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const postRequestPasswordResetAsyncSpy = vi.spyOn(UsersService, 'postRequestPasswordResetAsync');
    postRequestPasswordResetAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset request was processed, please check your email.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          true, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    // Act
    const result = await sut.requestPasswordResetAsync('email3@example.com');

    // Assert
    expect(result).toBeTruthy();
    expect(sut.getUser.receivedRequestToUpdatePassword).toBeTruthy();
  });
  it('should throw an error if the email is an empty string when running the requestPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const postRequestPasswordResetAsyncSpy = vi.spyOn(UsersService, 'postRequestPasswordResetAsync');
    postRequestPasswordResetAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset request was processed, please check your email.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          true, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.requestPasswordResetAsync('');
    } catch (error) {
      // Assert
      expect(error.message).equals('Email is invalid.')
    }
  });
  it('should throw an error if the email is not properly formatted when running the requestPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const postRequestPasswordResetAsyncSpy = vi.spyOn(UsersService, 'postRequestPasswordResetAsync');
    postRequestPasswordResetAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset request was processed, please check your email.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          true, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.requestPasswordResetAsync('email3@example');
    } catch (error) {
      // Assert
      expect(error.message).equals('Email is invalid.')
    }
  });
  it('should catch any errors thrown by the UsersService via the requestPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const postRequestPasswordResetAsyncSpy = vi.spyOn(UsersService, 'postRequestPasswordResetAsync');
    postRequestPasswordResetAsyncSpy.mockImplementation(async (email: string) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.requestPasswordResetAsync('email3@example.com');      
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.')
    }
  });
  it('should resend password reset confirmation emails via the resendPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putResendPasswordResetAsync');
    putResendPasswordResetAsyncSpy.mockImplementation(async (userId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.'
      };
    });

    // Act
    const result = await sut.resendPasswordResetAsync();

    // Assert
    expect(result).toBeTruthy();
  });
  it('should throw an error if there are no oustanding password reset requests when this request is submitted to the resendPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putResendPasswordResetAsync');
    putResendPasswordResetAsyncSpy.mockImplementation(async (userId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendPasswordResetAsync();
    } catch (error) {      
      // Assert
      expect(error.message).equals('There are no outstanding password reset requests.');
      expect(sut.getUser.receivedRequestToUpdatePassword).toBeFalsy();
    }
  });
  it('should throw an error if the user id is null when this request is submitted to the resendPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      null, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putResendPasswordResetAsync');
    putResendPasswordResetAsyncSpy.mockImplementation(async (userId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendPasswordResetAsync();
    } catch (error) {      
      // Assert
      expect(error.message).equals('User id is invalid.');
      expect(sut.getUser.id).toBeNull();
    }
  });
  it('should throw an error if the user id is 0 when this request is submitted to the resendPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      0, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putResendPasswordResetAsync');
    putResendPasswordResetAsyncSpy.mockImplementation(async (userId: number) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.'
      };
    });

    try {
      // Act
      const result = await sut.resendPasswordResetAsync();
    } catch (error) {      
      // Assert
      expect(error.message).equals('User id is invalid.');
      expect(sut.getUser.id).equals(0);
    }
  });
  it('should catch any errors thrown by the UsersService via the resendPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putResendPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putResendPasswordResetAsync');
    putResendPasswordResetAsyncSpy.mockImplementation(async (userId: number) => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.resendPasswordResetAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should cancel outstanding password reset request via the cancelPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelPasswordResetAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    // Act
    const result = await sut.cancelPasswordResetAsync();

    // Assert
    expect(result).toBeTruthy();
  });
  it('should throw an error if there are no outstanding password reset request when running the cancelPasswordResetAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelPasswordResetAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Password reset email was resent.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.cancelPasswordResetAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding password reset requests.');
    }
  });
  it('should catch any errors thrown by the UsersService via the cancelPasswordResetAsync method', async () => {    
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelPasswordResetAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.cancelPasswordResetAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
  it('should cancel all outstanding email confirmation and password reset requests via the cancelAllEmailRequestsAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelAllEmailRequestsAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    // Act
    const result = await sut.cancelAllEmailRequestsAsync();

    // Assert
    expect(result).toBeTruthy();
    expect(sut.getUser.receivedRequestToUpdateEmail).toBeFalsy();
    expect(sut.getUser.receivedRequestToUpdatePassword).toBeFalsy();
  });
  it('should throw an error if there are no outstanding email confirmation requests when running the cancelAllEmailRequestsAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      true, 
      false, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelAllEmailRequestsAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          true, 
          false, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.cancelAllEmailRequestsAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding email confirmation requests.');
      expect(sut.getUser.receivedRequestToUpdateEmail).toBeFalsy();      
    }
  });
  it('should throw an error if there are no outstanding password reset requests when running the cancelAllEmailRequestsAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      false, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelAllEmailRequestsAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: Email confirmation request was cancelled and Password reset request was cancelled.',
        user: new User(
          3, 
          'userName3', 
          'firstName3', 
          'lastName3', 
          'nickName3', 
          'firstName3 lastName3', 
          'email3@example.com', 
          false, 
          true, 
          false, 
          true, 
          false, 
          true, 
          new Date(), 
          null, 
          true, 
          true)
      };
    });

    try {
      // Act
      const result = await sut.cancelAllEmailRequestsAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('There are no outstanding password reset requests.');
      expect(sut.getUser.receivedRequestToUpdatePassword).toBeFalsy();      
    }
  });
  it('should catch any errors thrown by the UsersService via the cancelAllEmailRequestsAsync method', async () => {
    // Arrange
    const sut = useUserStore(pinia);
    sut.$state.user = new User(
      3, 
      'userName3', 
      'firstName3', 
      'lastName3', 
      'nickName3', 
      'firstName3 lastName3', 
      'email3@example.com', 
      false, 
      true, 
      true, 
      true, 
      false, 
      true, 
      new Date(), 
      null, 
      true, 
      true);

    const putCancelPasswordResetAsyncSpy = vi.spyOn(UsersService, 'putCancelAllEmailRequestsAsync');
    putCancelPasswordResetAsyncSpy.mockImplementation(async () => {
      return new Error('Mock error thrown.');
    });

    try {
      // Act
      const result = await sut.cancelAllEmailRequestsAsync();
    } catch (error) {
      // Assert
      expect(error.message).equals('Mock error thrown.');
    }
  });
});
