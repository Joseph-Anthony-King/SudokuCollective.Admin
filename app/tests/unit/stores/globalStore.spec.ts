import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import type { AxiosResponse } from 'axios';
import { useGlobalStore } from '@/stores/globalStore';
import router from '@/router';
import { useAppStore } from '@/stores/appStore';
import { useDialogStore } from '@/stores/dialogStore';
import { useUserStore } from '@/stores/userStore';
import { LoginService } from '@/services/loginService';
import { User } from '@/models/domain/user';
import { LoginRequestData } from '@/models/requests/loginRequestData';
import type { IUser } from '@/interfaces/domain/iUser';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import commonUtitlities from '@/utilities/common';

describe('the globalStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
      pinia = createPinia();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected properties', () => {
    // Arrange and Act
    const sut = useGlobalStore(pinia);

    sut.license = 'license';
    sut.token = 'token';
    sut.tokenExpirationDate = new Date();
    sut.redirectUrl = 'redirectUrl';
    sut.serviceMessage = 'serviceMessage';
    sut.cancelApiRequestDelegate = (): void => {
      console.debug('cancelApiRequestDelegate mock implementation...');
    }
    sut.cancelApiRequestDelayInMilliseconds = 1;

    expect(sut.license).toBeTypeOf('string');
    expect(sut.token).toBeTypeOf('string');
    expect(sut.tokenExpirationDate).toBeTypeOf('object');
    expect(sut.redirectUrl).toBeTypeOf('string');
    expect(sut.serviceMessage).toBeTypeOf('string');
    expect(sut.processingStatus).toBeTypeOf('boolean');
    expect(sut.navDrawerStatus).toBeTypeOf('boolean');
    expect(sut.stayLoggedIn).toBeTypeOf('boolean');
    expect(sut.redirectToSignUp).toBeTypeOf('boolean');
    expect(sut.cancelApiRequestDelegate).toBeTypeOf('function');
    expect(sut.cancelApiRequestDelayInMilliseconds).toBeTypeOf('number');
  });
  it('should return the license value with the getLicense getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const license = '376ba25e-2b41-4d45-86f9-d6d781674b68';
    sut.$state.license = license;
    
    // Act
    const result = sut.getLicense;
    
    // Assert
    expect(result).equals('376ba25e-2b41-4d45-86f9-d6d781674b68');
    expect(license).equals('376ba25e-2b41-4d45-86f9-d6d781674b68');
    expect(result).equals(license);
  });
  it('should return an empty string with the getLicense getter if the license is undefined', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    sut.$state.license = undefined;
    const licenseIsUndefined = sut.$state.license === undefined;

    // Act
    const result = sut.getLicense;

    // Assert
    expect(result).equals('');
    expect(licenseIsUndefined).toBeTruthy();
  });
  it('should return the token value with the getToken getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    sut.$state.token = token;

    // Act
    const result = sut.getToken;

    // Assert
    expect(result).equals('a0e9fbe1-0646-4d76-9771-24091ead30b9');
    expect(token).equals('a0e9fbe1-0646-4d76-9771-24091ead30b9');
    expect(result).equals(token);
  });
  it('should return an empty string with the getToken getter if the token is null', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const tokenIsNull = sut.$state.token === null;

    // Act
    const result = sut.getToken;

    // Assert
    expect(result).equals('');
    expect(tokenIsNull).toBeTruthy();
  });
  it('should return the tokenExpirationDate value with the getTokenExpirationDate getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const date = new Date();
    sut.$state.tokenExpirationDate = date;

    // Act
    const result = sut.getTokenExpirationDate;

    // Assert
    expect(result?.toDateString()).equals(date.toDateString());
  });
  it('should return the redirectUrl value with the getRedirectUrl getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const redirectUrl = 'http://localhost/redirectUrl';
    sut.$state.redirectUrl = redirectUrl;

    // Act
    const result = sut.getRedirectUrl;

    // Assert
    expect(result).equals('http://localhost/redirectUrl');
    expect(redirectUrl).equals('http://localhost/redirectUrl');
    expect(result).equals(redirectUrl);
  });
  it('shuold return an empty string with the getRedirectUrl getter if the redirectUrl is null', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const redirectUrlIsNull = sut.$state.redirectUrl === null;

    // Act
    const result = sut.getRedirectUrl;

    // Assert
    expect(result).equals('');
    expect(redirectUrlIsNull).toBeTruthy();
  });
  it('should return the serviceMessage value with the getServiceMessage getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const serviceMessage = 'Test service message...';
    sut.$state.serviceMessage = serviceMessage;

    // Act
    const result = sut.getServiceMessage;

    // Assert
    expect(result).equals('Test service message...');
    expect(serviceMessage).equals('Test service message...');
    expect(result).equals(serviceMessage);
  });
  it('should return an empty string with the getServiceMessage getter if the serviceMessage is null', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const serviceMessageIsNull = sut.$state.serviceMessage === null;

    // Act
    const result = sut.getServiceMessage;

    // Assert
    expect(result).equals('');
    expect(serviceMessageIsNull).toBeTruthy();
  });
  it('should return the processingStatus value with the getProcessingStatus getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialProcessingStatus = sut.$state.processingStatus;

    // Act
    const result = sut.getProcessingStatus;

    // Assert
    expect(result).toBeFalsy();
    expect(initialProcessingStatus).toBeFalsy();
    expect(result).equals(initialProcessingStatus);
  });
  it('should return the navDrawerStatus value with the getNavDrawerStatus getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialNavDrawerStatus = sut.getNavDrawerStatus;

    // Act
    const result = sut.getNavDrawerStatus;

    // Assert
    expect(result).toBeFalsy();
    expect(initialNavDrawerStatus).toBeFalsy();
    expect(result).equals(initialNavDrawerStatus);
  });
  it('should return the stayLoggedIn value with the getStayLoggedIn getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialStayLoggedIn = sut.$state.stayLoggedIn;

    // Act
    const result = sut.getStayedLoggedIn;

    // Assert
    expect(result).toBeTruthy();
    expect(initialStayLoggedIn).toBeTruthy();
    expect(result).equals(initialStayLoggedIn);
  });
  it('should return the redirectToSignUp value with the getRedirectToSignUp getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialRedirectToSignUp = sut.$state.redirectToSignUp;

    // Act
    const result = sut.getRedirectToSignUp;

    // Assert
    expect(result).toBeFalsy();
    expect(initialRedirectToSignUp).toBeFalsy();
    expect(result).equals(initialRedirectToSignUp);
  });
  it('should return false if the cancelApiRequestDelegate is null with the getCancelApiRequestDelegateIsNotNull getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const cancelApiRequestDelegateIsNullIsTrue = sut.$state.cancelApiRequestDelegate !== null;

    // Act
    const result = sut.getCancelApiRequestDelegateIsNotNull;

    expect(result).toBeFalsy();
    expect(cancelApiRequestDelegateIsNullIsTrue).toBeFalsy();
    expect(result).equals(cancelApiRequestDelegateIsNullIsTrue);
  });
  it('should return true if the cancelApiRequestDelegate is not null with the getCancelApiRequestDelegateIsNotNull getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    sut.$state.cancelApiRequestDelegate = (): void => {
      console.debug('cancelApiRequestDelegate mock implementation...');
    }
    const cancelApiRequestDelegateIsNotNullIsTrue = sut.$state.cancelApiRequestDelegate !== null;

    // Act
    const result = sut.getCancelApiRequestDelegateIsNotNull;

    // Assert
    expect(result).toBeTruthy();
    expect(cancelApiRequestDelegateIsNotNullIsTrue).toBeTruthy();
    expect(result).equals(cancelApiRequestDelegateIsNotNullIsTrue);
  });
  it('should return the cancelApiRequestDelayInMilliseconds value with the getCancelApiRequestDelayInMilliseconds getter', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const delay = 1000;
    sut.$state.cancelApiRequestDelayInMilliseconds = delay;

    // Act
    const result = sut.getCancelApiRequestDelayInMilliseconds;

    // Assert
    expect(result).equals(1000);
    expect(delay).equals(1000);
    expect(result).equals(delay);
  });
  it('should update the token value with the updateToken mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialToken = sut.$state.token;
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';

    // Act
    sut.updateToken(token);

    // Assert
    expect(sut.$state.token).equals(token);
    expect(initialToken).toBeNull();
    expect(sut.$state.token).not.equals(initialToken);
  });
  it('should update the tokenExpirationDate value with the updateTokenExpirationDate mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialTokenExpirationDate = sut.$state.tokenExpirationDate;
    const expirationDate = new Date();

    // Act
    sut.updateTokenExpirationDate(expirationDate);

    // Assert
    expect(sut.$state.tokenExpirationDate?.toDateString()).equals(expirationDate.toDateString());
    expect(initialTokenExpirationDate).toBeNull();
  });
  it('should update the redirectUrl value with the updateRedirectUrl mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialRedirectUrl = sut.$state.redirectUrl;
    const redirectUrl = 'http://localhost/redirectUrl';

    // Act
    sut.updateRedirectUrl(redirectUrl);

    // Assert
    expect(sut.$state.redirectUrl).equals('http://localhost/redirectUrl');
    expect(initialRedirectUrl).toBeNull();
    expect(sut.$state.redirectUrl).not.equals(initialRedirectUrl);
  });
  it('should update the serviceMessage value with the updateServiceMessage mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialServiceMessage = sut.$state.serviceMessage;
    const serviceMessage = 'Test service message...';

    // Act
    sut.updateServiceMessage(serviceMessage);

    // Assert
    expect(sut.$state.serviceMessage).equals('Test service message...');
    expect(initialServiceMessage).toBeNull();
    expect(sut.$state.serviceMessage).not.equals(initialServiceMessage);
  });
  it('should update the processingStatus value wtih the updateProcessingStatus mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialProcessingStatus = sut.$state.processingStatus;
    const initialProcessingStatusIsFalse = initialProcessingStatus === false;

    // Act
    sut.updateProcessingStatus(true);

    expect(sut.$state.processingStatus).toBeTruthy();
    expect(initialProcessingStatus).toBeFalsy();
    expect(initialProcessingStatusIsFalse).toBeTruthy();
    expect(sut.$state.processingStatus).not.equals(initialProcessingStatus);
  });
  it('should update the NavDrawerStatus value with the updateNavDrawerStatus mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialNavDrawerStatus = sut.$state.navDrawerStatus;
    const initialNavDrawerStatusIsFalse = initialNavDrawerStatus === false;

    // Act
    sut.updateNavDrawerStatus(true);

    // Assert
    expect(sut.$state.navDrawerStatus).toBeTruthy();
    expect(initialNavDrawerStatus).toBeFalsy();
    expect(initialNavDrawerStatusIsFalse).toBeTruthy();
    expect(sut.$state.navDrawerStatus).not.equals(initialNavDrawerStatus);
  });
  it('should update the stayLoggedIn value with the updateStayLoggedIn mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialStayLoggedIn = sut.$state.stayLoggedIn;
    const initialStayLoggedInIsTrue = initialStayLoggedIn === true;

    // Act
    sut.updateStayLoggedIn(false);

    // Assert
    expect(sut.$state.stayLoggedIn).toBeFalsy();
    expect(initialStayLoggedIn).toBeTruthy();
    expect(initialStayLoggedInIsTrue).toBeTruthy();
    expect(sut.$state.stayLoggedIn).not.toBeTruthy();
  });
  it('should update the redirectToSignUp value with the updateRedirectToSignUp mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialRedirectToSignUp = sut.$state.redirectToSignUp;
    const initialRedirectToSignUpIsFalse = initialRedirectToSignUp === false;

    // Act
    sut.updateRedirectToSignUp(true);

    // Assert
    expect(sut.$state.redirectToSignUp).toBeTruthy();
    expect(initialRedirectToSignUp).toBeFalsy();
    expect(initialRedirectToSignUpIsFalse).toBeTruthy();
    expect(sut.$state.redirectToSignUp).not.equals(initialRedirectToSignUp);
  });
  it('should update the cancelApiRequestDelegate and the cancelApiRequestDelegateDelayInMilliseconds with the updateCanceApiRequestDelegate mutation', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const initialCancelApiRequestDelegate = sut.$state.cancelApiRequestDelegate;
    const initialCancelApiRequestDelegateIsNull = initialCancelApiRequestDelegate === null;
    const initialCancelApiRequestDelegateDelay = sut.$state.cancelApiRequestDelayInMilliseconds;
    const initialCancelApiRequestDelegateDelayIsNull= initialCancelApiRequestDelegateDelay === null;

    const delegate = (): void => {
      console.debug('cancelApiRequestDelegate mock implementation...');
    }
    const delay = 1000;

    // Act
    sut.updateCancelApiRequestDelegate(delegate, delay);

    // Assert
    expect(sut.$state.cancelApiRequestDelegate).equals(delegate);
    expect(initialCancelApiRequestDelegate).toBeNull();
    expect(initialCancelApiRequestDelegateIsNull).toBeTruthy();
    expect(sut.$state.cancelApiRequestDelegate).not.equals(initialCancelApiRequestDelegate);
    expect(sut.$state.cancelApiRequestDelayInMilliseconds).equals(delay);
    expect(initialCancelApiRequestDelegateDelay).toBeNull();
    expect(initialCancelApiRequestDelegateDelayIsNull).toBeTruthy();
    expect(sut.$state.cancelApiRequestDelayInMilliseconds).not.equals(initialCancelApiRequestDelegateDelay);
  });
  it('should initialize the store state using the initializeStore action', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9'
    const expirationDate = new Date();
    const redirectUrl = 'http://localhost/redirectUrl';
    const serviceMessage = 'Test service message...';
    const processingStatus = true;
    const navDrawerStatus = true;
    const stayLoggedIn = false;
    const redirectToSignUp = true;
    const delegate = (): void => {
      console.debug('cancelApiRequestDelegate mock implementation...');
    }
    const delay = 1000;

    sut.$state.token = token;
    sut.$state.tokenExpirationDate = expirationDate;
    sut.$state.redirectUrl = redirectUrl;
    sut.$state.serviceMessage = serviceMessage;
    sut.$state.processingStatus = processingStatus;
    sut.$state.navDrawerStatus = navDrawerStatus;
    sut.$state.stayLoggedIn = stayLoggedIn;
    sut.$state.redirectToSignUp = redirectToSignUp;
    sut.$state.cancelApiRequestDelegate = delegate;
    sut.$state.cancelApiRequestDelayInMilliseconds = delay;

    const initialToken = sut.$state.token;
    const initialTokenExpirationDate = sut.$state.tokenExpirationDate;
    const initialRedirectUrl = sut.$state.redirectUrl;
    const initialServiceMessage = sut.$state.serviceMessage;
    const initialProcessingStatus = sut.$state.processingStatus;
    const initialNavDrawerStatus = sut.$state.navDrawerStatus;
    const initialStayLoggedIn = sut.$state.stayLoggedIn;
    const initialRedirectToSignUp = sut.$state.redirectToSignUp;
    const initialCancelApiRequestDelegate = sut.$state.cancelApiRequestDelegate;
    const initialCancelApiRequestDelegateDelay = sut.$state.cancelApiRequestDelayInMilliseconds;

    // Act
    sut.initializeStore();

    const finalToken = sut.$state.token;
    const finalTokenExpirationDate = sut.$state.tokenExpirationDate;
    const finalRedirectUrl = sut.$state.redirectUrl;
    const finalServiceMessage = sut.$state.serviceMessage;
    const finalProcessingStatus = sut.$state.processingStatus;
    const finalNavDrawerStatus = sut.$state.navDrawerStatus;
    const finalStayLoggedIn = sut.$state.stayLoggedIn;
    const finalRedirectToSignUp = sut.$state.redirectToSignUp;
    const finalCancelApiRequestDelegate = sut.$state.cancelApiRequestDelegate;
    const finalCancelApiRequestDelegateDelay = sut.$state.cancelApiRequestDelayInMilliseconds;

    // Assert
    expect(initialToken).equals(token);
    expect(finalToken).toBeNull();
    expect(finalToken).not.equals(token);
    expect(finalToken).not.equals(initialToken);
    expect(initialTokenExpirationDate.toDateString()).equals(expirationDate.toDateString());
    expect(finalTokenExpirationDate).toBeNull();
    expect(initialRedirectUrl).equals(redirectUrl);
    expect(finalRedirectUrl).toBeNull();
    expect(finalRedirectUrl).not.equals(redirectUrl);
    expect(finalRedirectUrl).not.equals(initialRedirectUrl);
    expect(initialServiceMessage).equals(serviceMessage);
    expect(finalServiceMessage).toBeNull();
    expect(finalServiceMessage).not.equals(serviceMessage);
    expect(finalServiceMessage).not.equals(initialServiceMessage);
    expect(initialProcessingStatus).equals(processingStatus);
    expect(finalProcessingStatus).not.equals(processingStatus);
    expect(finalProcessingStatus).toBeFalsy();
    expect(initialProcessingStatus).toBeTruthy();
    expect(finalProcessingStatus).not.equals(initialProcessingStatus);
    expect(initialNavDrawerStatus).equals(navDrawerStatus);
    expect(finalNavDrawerStatus).not.equals(navDrawerStatus);
    expect(finalNavDrawerStatus).toBeFalsy();
    expect(initialNavDrawerStatus).toBeTruthy();
    expect(finalNavDrawerStatus).not.equals(initialNavDrawerStatus);
    expect(initialStayLoggedIn).equals(stayLoggedIn);
    expect(finalStayLoggedIn).not.equals(stayLoggedIn);
    expect(finalStayLoggedIn).toBeTruthy();
    expect(initialStayLoggedIn).toBeFalsy();
    expect(finalStayLoggedIn).not.equals(initialStayLoggedIn);
    expect(initialRedirectToSignUp).equals(redirectToSignUp);
    expect(finalRedirectToSignUp).not.equals(redirectToSignUp);
    expect(finalRedirectToSignUp).toBeFalsy();
    expect(initialRedirectToSignUp).toBeTruthy();
    expect(finalRedirectToSignUp).not.equals(initialRedirectToSignUp);
    expect(initialCancelApiRequestDelegate).toBeTypeOf('function');
    expect(finalCancelApiRequestDelegate).toBeNull();
    expect(initialCancelApiRequestDelegate).equals(delegate);
    expect(finalCancelApiRequestDelegate).not.equals(delegate);
    expect(finalCancelApiRequestDelegate).not.equals(initialCancelApiRequestDelegate);
    expect(initialCancelApiRequestDelegateDelay).toBeTypeOf('number');
    expect(finalCancelApiRequestDelegateDelay).toBeNull();
    expect(initialCancelApiRequestDelegateDelay).equals(delay);
    expect(finalCancelApiRequestDelegateDelay).not.equals(delay);
    expect(finalCancelApiRequestDelegateDelay).not.equals(initialCancelApiRequestDelegateDelay);
  });
  it('should login a user using the loginAsync action', async () => {
    // Arrange
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const expirationDate = new Date();

    const postLoginAsyncSpy = vi.spyOn(LoginService, 'postLoginAsync');
    postLoginAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User was found',
        user: new User(
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
        ),
        token: token,
        tokenExpirationDate: expirationDate
      }
    });

    const sut = useGlobalStore(pinia);
    sut.$state.redirectUrl = 'http://localhost/redirectUrl';

    const userStore = useUserStore(pinia);
    userStore.updateUser = vi.fn().mockImplementation((user: IUser) => {
      console.debug(`mock implementation of updateUser accepted user with userName ${user.userName}`);
    });

    const appStore = useAppStore(pinia);
    appStore.getMyAppsAsync = vi.fn().mockImplementation(async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = true;
          if (success) {
            resolve("getMyAppsAsync was successful");
          } else {
            reject('getMyAppsAsync failed');
          }
        }, 1000);
      });
    });
    appStore.getMyRegisteredAppsAsync = vi.fn().mockImplementation(async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const success = true;
          if (success) {
            resolve("getMyRegisteredAppsAsync was successful");
          } else {
            reject('getMyRegisteredAppsAsync failed');
          }
        }, 1000);
      });
    });

    const dialogStore = useDialogStore(pinia);
    dialogStore.initializeStore = vi.fn;
    
    const data = new LoginRequestData('userName', 'password', true);

    // Act
    await sut.loginAsync(data);

    // Assert
    expect(sut.getToken).equals(token);
    expect(sut.getTokenExpirationDate?.toDateString()).equals(expirationDate.toDateString());
    expect(sut.getStayedLoggedIn).toBeTruthy();
  });
  it('should logout a user using the logout action', () => {
    // Arrange
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const expirationDate = new Date();

    const sut = useGlobalStore(pinia);

    sut.$state.token = token;
    sut.$state.tokenExpirationDate = expirationDate;

    commonUtitlities().clearStores = vi.fn().mockImplementation(() => {
      sut.$state.token = null;
      sut.$state.tokenExpirationDate = null;
    });

    const initialToken = sut.getToken;
    const initialTokenExpirationDate = sut.getTokenExpirationDate;

    // Act
    sut.logout();

    const finalToken = sut.getToken;
    const finalTokenExpirationDate = sut.getTokenExpirationDate;

    // Assert
    expect(initialToken).equals(token);
    expect(finalToken).equals('');
    expect(finalToken).not.equals(initialToken);
    expect(initialTokenExpirationDate?.toDateString()).equals(expirationDate.toDateString());
    expect(finalTokenExpirationDate).toBeNull();
  });
  it('should confirm the UserName using the confirmUserNameAsync action', async () => {
    // Arrange
    const postConfirmUserNameAsyncSpy = vi.spyOn(LoginService, 'postConfirmUserNameAsync');
    postConfirmUserNameAsyncSpy.mockImplementation(async (email: string) => {
      return <IServicePayload>{
        isSuccess: true,
        message: 'Status Code 200: User name was confirmed',
        confirmedUserName: 'userName'
      }
    });

    const sut = useGlobalStore(pinia);

    const userStore = useUserStore(pinia);
    userStore.updateConfirmedUserName = vi.fn().mockImplementation((userName: string) => {
      console.debug(`mock implementation of updateConfirmedUserName with userName ${userName}`);
    });

    // Act
    await sut.confirmUserNameAsync('john.doe@exmaple.com');

    // Assert
    expect(postConfirmUserNameAsyncSpy).toHaveBeenCalled();
  });
  it('should return false if the token has not expired by using the isTokenExpired action', () => {
    // Arrange
    const expirationDate = new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate(),
      new Date().getHours() + 24,
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    );
    const tokenNotExpired = expirationDate > new Date();

    router.currentRoute.value.path = 'http://localhost/fakeRoute';

    const sut = useGlobalStore(pinia);
    sut.tokenExpirationDate = expirationDate;

    const userStore = useUserStore(pinia);
    userStore.updateUser = vi.fn().mockImplementation((user: IUser) => {
      console.debug(`mock implementation of updateUser accepted user with userName ${user.userName}`);
    });

    // Act
    const result = sut.isTokenExpired();

    // Assert
    expect(result).toBeFalsy();
    expect(tokenNotExpired).toBeTruthy();
  });
  it('should return true if the token has expired by using the isTokenExpired action', () => {
    // Arrange
    const expirationDate = new Date(
      new Date().getFullYear(), 
      new Date().getMonth(), 
      new Date().getDate(),
      new Date().getHours() - 24,
      new Date().getMinutes(),
      new Date().getSeconds(),
      new Date().getMilliseconds()
    );
    const tokenExpired = expirationDate < new Date();

    router.currentRoute.value.path = 'http://localhost/fakeRoute';

    const sut = useGlobalStore(pinia);
    sut.tokenExpirationDate = expirationDate;

    const userStore = useUserStore(pinia);
    userStore.updateUser = vi.fn().mockImplementation((user: IUser) => {
      console.debug(`mock implementation of updateUser accepted user with userName ${user.userName}`);
    });

    // Act
    const result = sut.isTokenExpired();

    // Assert
    expect(result).toBeTruthy();
    expect(tokenExpired).toBeTruthy();
  });
  it('should redirect the user to login if the axios response is status code unauthorized 401 by using the tokenHasExpired action', () => {
    // Arrange
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const expirationDate = new Date();
    const testRoute = 'http://localhost/fakeRoute';
    const status = 401

    const sut = useGlobalStore(pinia);
    sut.$state.token = token;
    sut.$state.tokenExpirationDate = expirationDate;

    const userStore = useUserStore(pinia);
    userStore.updateUser = vi.fn().mockImplementation((user: IUser) => {
      console.debug(`mock implementation of updateUser accepted user with a new user`);
    });
    
    commonUtitlities().clearStores = vi.fn().mockImplementation(() => {
      sut.$state.token = null;
      sut.$state.tokenExpirationDate = null;
    });
    router.currentRoute.value.path = testRoute;

    const initialToken = sut.getToken;
    const initialTokenExpirationDate = sut.getTokenExpirationDate;

    const data = {
        status: status,
        statusText: 'Unauthorized',
        headers: {},
        config: {
          url: 'users/1',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        data: {
          isSuccess: false,
          message: 'Status Code 401: The authorization token has expired, please sign in again.',
          payload: []
        },
        request: {}
      } as AxiosResponse;


    // Act
    sut.tokenHasExpired(data);

    const finalToken = sut.getToken;
    const finalTokenExpirationDate = sut.getTokenExpirationDate;

    // Assert
    expect(status).equals(401);
    expect(initialToken).equals(token);
    expect(finalToken).equals('')
    expect(finalToken).not.equals(initialToken);
    expect(initialTokenExpirationDate?.toDateString()).equals(expirationDate.toDateString());
    expect(finalTokenExpirationDate).toBeNull();
  });
  it('should redirect the user to login if the axios response is status code forbidden 403 by using the tokenHasExpired action', () => {
    // Arrange
    const token = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const expirationDate = new Date();
    const testRoute = 'http://localhost/fakeRoute';
    const status = 403

    const sut = useGlobalStore(pinia);
    sut.$state.token = token;
    sut.$state.tokenExpirationDate = expirationDate;

    const userStore = useUserStore(pinia);
    userStore.updateUser = vi.fn().mockImplementation((user: IUser) => {
      console.debug(`mock implementation of updateUser accepted user with a new user`);
    });
    
    commonUtitlities().clearStores = vi.fn().mockImplementation(() => {
      sut.$state.token = null;
      sut.$state.tokenExpirationDate = null;
    });
    router.currentRoute.value.path = testRoute;

    const initialToken = sut.getToken;
    const initialTokenExpirationDate = sut.getTokenExpirationDate;

    const data = {
        status: status,
        statusText: 'Forbidden',
        headers: {},
        config: {
          url: 'users/1',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        data: {
          isSuccess: false,
          message: 'Status Code 403: Invalid request on this authorization token',
          payload: []
        },
        request: {}
      } as AxiosResponse;


    // Act
    sut.tokenHasExpired(data);

    const finalToken = sut.getToken;
    const finalTokenExpirationDate = sut.getTokenExpirationDate;

    // Assert
    expect(status).equals(403);
    expect(initialToken).equals(token);
    expect(finalToken).equals('')
    expect(finalToken).not.equals(initialToken);
    expect(initialTokenExpirationDate?.toDateString()).equals(expirationDate.toDateString());
    expect(finalTokenExpirationDate).toBeNull();
  });
  it('should invoke the cancelApiRequestDelegate by using the cancelApiRequest action if the delegate is not null', () => {
    // Arrange
    const sut = useGlobalStore(pinia);
    const debugMessage = 'The cancelApiRequestDelegate has been invoked...'
    const delegate = (): void => {
      console.debug(debugMessage);
    }
    sut.$state.cancelApiRequestDelegate = delegate;
    const delegateIsNotNull = sut.$state.cancelApiRequestDelegate !== null;
    vi.spyOn(console, 'debug').mockImplementation(() => {});

    // Act
    sut.cancelApiRequest(new Event('Test event...'));

    // Assert
    expect(delegateIsNotNull).toBeTruthy();
    expect(console.debug).toHaveBeenLastCalledWith(debugMessage);
  });
});
