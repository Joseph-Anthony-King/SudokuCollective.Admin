import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useAppStore } from '@/stores/appStore';
import { AppsService } from '@/services/appsService';
import { App } from '@/models/domain/app';
import { UpdateAppRequestData } from '@/models/requests/updateAppRequestData';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';

describe('the appStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useAppStore(pinia);

    sut.selectedApp = new App();
    sut.selectedApp.localUrl = 'localUrl';
    sut.serviceMessage = 'service message';

    // Assert
    expect(sut.myApps).toBeTypeOf('object');
    expect(sut.myApps.length).equals(0);
    expect(sut.myRegisteredApps).toBeTypeOf('object');
    expect(sut.myRegisteredApps.length).equals(0);
    expect(sut.selectedApp).toBeTypeOf('object');
    expect(sut.selectedApp.localUrl).toBeTypeOf('string');
    expect(sut.serviceMessage).toBeTypeOf('string');
  });
  it('should return the users apps with the getMyApps getter', () => {
    // Arrange
    const licenseOne = '376ba25e-2b41-4d45-86f9-d6d781674b68';
    const licenseTwo = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const sut = useAppStore(pinia);
    sut.$state.myApps = [
      new App(
        1,
        'Test App 1',
        licenseOne,
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        licenseTwo,
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];

    // Act
    const myApps = sut.getMyApps;

    // Assert
    expect(myApps.length).equals(2);
    expect(myApps[0].license).equals(licenseOne);
    expect(myApps[1].license).equals(licenseTwo);
  });
  it('should return the users registered apps with the getMyRegisteredApps getter', () => {
    // Arrange
    const licenseOne = '376ba25e-2b41-4d45-86f9-d6d781674b68';
    const licenseTwo = 'a0e9fbe1-0646-4d76-9771-24091ead30b9';
    const sut = useAppStore(pinia);
    sut.$state.myRegisteredApps = [
      new App(
        1,
        'Test App 1',
        licenseOne,
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        licenseTwo,
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];

    // Act
    const myRegisteredApps = sut.getMyRegisteredApps;

    // Assert
    expect(myRegisteredApps.length).equals(2);
    expect(myRegisteredApps[0].license).equals(licenseOne);
    expect(myRegisteredApps[1].license).equals(licenseTwo);
  });
  it('should return the selected app with the getSelectedApp getter', () => {
    // Arrange
    const licenseOne = '376ba25e-2b41-4d45-86f9-d6d781674b68';
    const sut = useAppStore(pinia);
    sut.$state.selectedApp = new App(
      1,
      'Test App 1',
      licenseOne,
      1,
      'http://localhost:8001',
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      ReleaseEnvironment.LOCAL,
      true,
      true,
      true,
      undefined,
      undefined,
      false,
      undefined,
      TimeFrame.MONTHS,
      1,
      true,
      new Date(),
      undefined,
      undefined
    );

    // Act
    const selectedApp = sut.getSelectedApp;

    // Assert
    expect(selectedApp!.license).equals(licenseOne);
  });
  it('should update an app contained in myApps and the selected app if applicable using the updateApp mutation', () => {
    // Arrange
    const sut = useAppStore(pinia);
    sut.$state.myApps = [
      new App(
        1,
        'Test App 1',
        '376ba25e-2b41-4d45-86f9-d6d781674b68',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        'a0e9fbe1-0646-4d76-9771-24091ead30b9',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];
    sut.$state.selectedApp = sut.$state.myApps[1];
    const originalName = sut.$state.myApps[1].name;
    const app2 = new App(
      2,
      'Test App 2',
      'a0e9fbe1-0646-4d76-9771-24091ead30b9',
      1,
      'http://localhost:8001',
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      ReleaseEnvironment.LOCAL,
      true,
      true,
      true,
      undefined,
      undefined,
      false,
      undefined,
      TimeFrame.MONTHS,
      1,
      true,
      new Date(),
      undefined,
      undefined
    );
    app2.name = 'Test App 2, UPDATED!';

    // Act
    sut.updateApp(app2);

    // Assert
    expect(originalName).equals('Test App 2');
    expect(sut.getMyApps[1].name).equals('Test App 2, UPDATED!');
    expect(sut.getSelectedApp?.name).equals('Test App 2, UPDATED!');
  });
  it('should set the selectedApp using the setSelectedApp mutation', () => {
    // Arrange
    const sut = useAppStore(pinia);
    sut.$state.myApps = [
      new App(
        1,
        'Test App 1',
        '376ba25e-2b41-4d45-86f9-d6d781674b68',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        'a0e9fbe1-0646-4d76-9771-24091ead30b9',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];
    const intialSelectedAppIsNull = sut.$state.selectedApp === null ? true : false;

    // Act
    sut.setSelectedApp(sut.$state.myApps[0].id!);
    const updatedSelectedAppIsNotNull = sut.$state.selectedApp !== null ? true : false;

    // Assert
    expect(intialSelectedAppIsNull).toBe(true);
    expect(updatedSelectedAppIsNotNull).toBe(true);
  });
  it('should default the setSelectedApp id property to 0 which sets the selectedApp to null', () => {
    // Arrange
    const sut = useAppStore(pinia);
    sut.$state.myApps = [
      new App(
        1,
        'Test App 1',
        '376ba25e-2b41-4d45-86f9-d6d781674b68',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        'a0e9fbe1-0646-4d76-9771-24091ead30b9',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];
    sut.$state.selectedApp = sut.$state.myApps[0];
    const intialSelectedAppIsNotNull = sut.$state.selectedApp !== null ? true : false;

    // Act
    sut.setSelectedApp();
    const updatedSelectedAppIsNull = sut.$state.selectedApp === null ? true : false;

    // Assert
    expect(intialSelectedAppIsNotNull).toBe(true);
    expect(updatedSelectedAppIsNull).toBe(true);
  });
  it('should set the serviceMessage using the updateServiceMessage mutation', () => {
    // Arrange
    const sut = useAppStore(pinia);
    const initialServiceMessageNull = sut.$state.serviceMessage === null ? true : false;
    const serviceMessage = 'Updated the service message!';

    // Act
    sut.updateServiceMessage(serviceMessage);
    const updatedServiceMessageIsNotNull = sut.$state.serviceMessage !== null ? true : false;

    // Assert
    expect(initialServiceMessageNull).toBe(true);
    expect(updatedServiceMessageIsNotNull).toBe(true);
    expect(sut.$state.serviceMessage).equals(serviceMessage);
  });
  it('should set the stores initial state using the initializeStore action', () => {
    // Arrange
    const sut = useAppStore(pinia);

    // Act
    sut.initializeStore();

    // Assert
    expect(Array.isArray(sut.$state.myApps)).toBe(true);
    expect(sut.$state.myApps.length).equals(0);
    expect(Array.isArray(sut.$state.myRegisteredApps)).toBe(true);
    expect(sut.$state.myRegisteredApps.length).equals(0);
    expect(sut.$state.selectedApp).toBeNull();
    expect(sut.$state.serviceMessage).toBeNull();
  });
  it('should submit updated apps to the AppsService putUpdateAppAsync method and use the result to update the state', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const originalAppName = 'Test App 1';
    const updatedAppName = `${originalAppName} UPDATED!!!`;
    sut.$state.myApps = [
      new App(
        1,
        originalAppName,
        '376ba25e-2b41-4d45-86f9-d6d781674b68',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        'a0e9fbe1-0646-4d76-9771-24091ead30b9',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];
    sut.$state.selectedApp = sut.$state.myApps[0];

    const putUpdateAppAsyncSpy = vi.spyOn(AppsService, 'putUpdateAppAsync');

    putUpdateAppAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        app: new App(
            1,
            updatedAppName,
            '376ba25e-2b41-4d45-86f9-d6d781674b68',
            1,
            'http://localhost:8001',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            ReleaseEnvironment.LOCAL,
            true,
            true,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.MONTHS,
            1,
            true,
            new Date(),
            undefined,
            undefined
          ),
        message: 'Status Code 200: App was updated.'
      }
    });

    const originalMyAppsAppNameEqualsOriginalAppName = sut.$state.myApps[0].name === originalAppName ? true : false;
    const originalSelectedAppNameEqualsOriginalAppName = sut.$state.selectedApp.name === originalAppName ? true : false;

    const app = sut.$state.selectedApp;
    app.name = updatedAppName;

    const data = new UpdateAppRequestData(
      app.id, 
      app.name, 
      app.license, 
      app.ownerId, 
      app.localUrl, 
      app.testUrl, 
      app.stagingUrl, 
      app.prodUrl, 
      app.sourceCodeUrl, 
      app.isActive, 
      app.environment, 
      app.permitSuperUserAccess, 
      app.permitCollectiveLogins, 
      app.disableCustomUrls, 
      app.customEmailConfirmationAction, 
      app.customPasswordResetAction, 
      app.useCustomSMTPServer, 
      app.smtpServerSettings, 
      app.timeFrame, 
      app.accessDuration);

    // Act
    const result = await sut.putUpdateAppAsync(data);

    const updatedMyAppsAppNameEqualsUpdatedAppName = sut.$state.myApps[0].name === updatedAppName ? true : false;
    const updatedSelectedAppNameEqualsUpdatedAppName = sut.$state.selectedApp.name === updatedAppName ? true : false;

    // Assert
    expect(result).toBe(true);
    expect(originalMyAppsAppNameEqualsOriginalAppName).toBe(true);
    expect(originalSelectedAppNameEqualsOriginalAppName).toBe(true);
    expect(updatedMyAppsAppNameEqualsUpdatedAppName).toBe(true);
    expect(updatedSelectedAppNameEqualsUpdatedAppName).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 200: App was updated.');
  });
  it('should submit updated apps to the AppsService putUpdateAppAsync method and not use the result to update the state if the request fails', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const originalAppName = 'Test App 1';
    const updatedAppName = 'Test App 3';
    sut.$state.myApps = [
      new App(
        1,
        originalAppName,
        '376ba25e-2b41-4d45-86f9-d6d781674b68',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      ),
      new App(
        2,
        'Test App 2',
        'a0e9fbe1-0646-4d76-9771-24091ead30b9',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      )
    ];
    sut.$state.selectedApp = sut.$state.myApps[0];

    const putUpdateAppAsyncSpy = vi.spyOn(AppsService, 'putUpdateAppAsync');

    putUpdateAppAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: false,
        message: 'Status Code 404: App was not found.'
      }
    });

    const originalMyAppsAppNameEqualsOriginalAppName = sut.$state.myApps[0].name === originalAppName ? true : false;
    const originalSelectedAppNameEqualsOriginalAppName = sut.$state.selectedApp.name === originalAppName ? true : false;

    const app = new App(
        3,
        updatedAppName,
        '77bf86b2-8b81-4ddb-adb9-b76594bd4dad',
        1,
        'http://localhost:8001',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
        ReleaseEnvironment.LOCAL,
        true,
        true,
        true,
        undefined,
        undefined,
        false,
        undefined,
        TimeFrame.MONTHS,
        1,
        true,
        new Date(),
        undefined,
        undefined
      );

    const data = new UpdateAppRequestData(
      app.id, 
      app.name, 
      app.license, 
      app.ownerId, 
      app.localUrl, 
      app.testUrl, 
      app.stagingUrl, 
      app.prodUrl, 
      app.sourceCodeUrl, 
      app.isActive, 
      app.environment, 
      app.permitSuperUserAccess, 
      app.permitCollectiveLogins, 
      app.disableCustomUrls, 
      app.customEmailConfirmationAction, 
      app.customPasswordResetAction, 
      app.useCustomSMTPServer, 
      app.smtpServerSettings, 
      app.timeFrame, 
      app.accessDuration);

    // Act
    const result = await sut.putUpdateAppAsync(data);

    const updatedMyAppsAppNameEqualsOriginalAppName = sut.$state.myApps[0].name === originalAppName ? true : false;
    const updatedSelectedAppNameEqualsOriginalAppName = sut.$state.selectedApp.name === originalAppName ? true : false;

    // Assert
    expect(result).toBe(false);
    expect(originalMyAppsAppNameEqualsOriginalAppName).toBe(true);
    expect(originalSelectedAppNameEqualsOriginalAppName).toBe(true);
    expect(updatedMyAppsAppNameEqualsOriginalAppName).toBe(true);
    expect(updatedSelectedAppNameEqualsOriginalAppName).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 404: App was not found.');
  });
  it('should populate myApps using the results of the AppsService getMyAppsAsync method', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const initialMyAppsLengthIsZero = sut.$state.myApps.length === 0 ? true : false;
    const initialFirstAppIsUndefined = sut.$state.myApps[0] === undefined ? true : false;

    const getMyAppsAsyncSpy = vi.spyOn(AppsService, 'getMyAppsAsync');

    getMyAppsAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        apps: [
          new App(
            1,
            'Test App 1',
            '376ba25e-2b41-4d45-86f9-d6d781674b68',
            1,
            'http://localhost:8001',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            ReleaseEnvironment.LOCAL,
            true,
            true,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.MONTHS,
            1,
            true,
            new Date(),
            undefined,
            undefined
          ),
          new App(
            2,
            'Test App 2',
            'a0e9fbe1-0646-4d76-9771-24091ead30b9',
            1,
            'http://localhost:8001',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            ReleaseEnvironment.LOCAL,
            true,
            true,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.MONTHS,
            1,
            true,
            new Date(),
            undefined,
            undefined
          )
        ],
        message: 'Status Code 200: Apps were found.'
      }
    });

    // Act
    const result = await sut.getMyAppsAsync();

    const updatedMyAppsLengthIsTwo = sut.$state.myApps.length === 2 ? true : false;
    const updatedFirstAppIsNotUndefined = sut.$state.myApps[0] !== undefined ? true : false;

    // Assert
    expect(result).toBe(true);
    expect(initialMyAppsLengthIsZero).toBe(true);
    expect(initialFirstAppIsUndefined).toBe(true);
    expect(updatedMyAppsLengthIsTwo).toBe(true);
    expect(updatedFirstAppIsNotUndefined).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 200: Apps were found.');
  });
  it('should not populate myApps if the results of the AppsService getMyAppsAsync method is not successful', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const initialMyAppsLengthIsZero = sut.$state.myApps.length === 0 ? true : false;
    const initialFirstAppIsUndefined = sut.$state.myApps[0] === undefined ? true : false;

    const getMyAppsAsyncSpy = vi.spyOn(AppsService, 'getMyAppsAsync');

    getMyAppsAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: false,
        message: 'Status Code 404: Apps were not found.'
      }
    });

    // Act
    const result = await sut.getMyAppsAsync();

    const updatedMyAppsLengthIsZero = sut.$state.myApps.length === 0 ? true : false;
    const updatedFirstAppIsUndefined = sut.$state.myApps[0] === undefined ? true : false;

    // Assert
    expect(result).toBe(false);
    expect(initialMyAppsLengthIsZero).toBe(true);
    expect(initialFirstAppIsUndefined).toBe(true);
    expect(updatedMyAppsLengthIsZero).toBe(true);
    expect(updatedFirstAppIsUndefined).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 404: Apps were not found.');
  });
  it('should populate myRegisteredApps using the results of the AppsService getMyRegisteredAppsAsync method', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const initialMyRegisteredAppsLengthIsZero = sut.$state.myRegisteredApps.length === 0 ? true : false;
    const initialFirstRegisteredAppIsUndefined = sut.$state.myRegisteredApps[0] === undefined ? true : false;

    const getMyRegisteredAppsAsyncSpy = vi.spyOn(AppsService, 'getMyRegisteredAppsAsync');

    getMyRegisteredAppsAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        apps: [
          new App(
            1,
            'Test App 1',
            '376ba25e-2b41-4d45-86f9-d6d781674b68',
            1,
            'http://localhost:8001',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            ReleaseEnvironment.LOCAL,
            true,
            true,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.MONTHS,
            1,
            true,
            new Date(),
            undefined,
            undefined
          ),
          new App(
            2,
            'Test App 2',
            'a0e9fbe1-0646-4d76-9771-24091ead30b9',
            1,
            'http://localhost:8001',
            undefined,
            undefined,
            undefined,
            undefined,
            true,
            ReleaseEnvironment.LOCAL,
            true,
            true,
            true,
            undefined,
            undefined,
            false,
            undefined,
            TimeFrame.MONTHS,
            1,
            true,
            new Date(),
            undefined,
            undefined
          )
        ],
        message: 'Status Code 200: Apps were found.'
      }
    });

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    const updatedMyRegisteredAppsLengthIsTwo = sut.$state.myRegisteredApps.length === 2 ? true : false;
    const updatedFirstRegisteredAppIsNotUndefined = sut.$state.myRegisteredApps[0] !== undefined ? true : false;

    // Assert
    expect(result).toBe(true);
    expect(initialMyRegisteredAppsLengthIsZero).toBe(true);
    expect(initialFirstRegisteredAppIsUndefined).toBe(true);
    expect(updatedMyRegisteredAppsLengthIsTwo).toBe(true);
    expect(updatedFirstRegisteredAppIsNotUndefined).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 200: Apps were found.');
  });
  it('should not populate myRegisteredApps if the results of the AppsService getMyRegisteredAppsAsync method is not successful', async () => {
    // Arrange
    const sut = useAppStore(pinia);
    const initialMyRegisteredAppsLengthIsZero = sut.$state.myRegisteredApps.length === 0 ? true : false;
    const initialFirstRegisteredAppIsUndefined = sut.$state.myRegisteredApps[0] === undefined ? true : false;

    const getMyRegisteredAppsAsyncSpy = vi.spyOn(AppsService, 'getMyRegisteredAppsAsync');

    getMyRegisteredAppsAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: false,
        message: 'Status Code 404: Apps were not found.'
      }
    });

    // Act
    const result = await sut.getMyRegisteredAppsAsync();

    const updatedMyRegisteredAppsLengthIsZero = sut.$state.myRegisteredApps.length === 0 ? true : false;
    const updatedFirstRegisteredAppIsUndefined = sut.$state.myRegisteredApps[0] === undefined ? true : false;

    // Assert
    expect(result).toBe(false);
    expect(initialMyRegisteredAppsLengthIsZero).toBe(true);
    expect(initialFirstRegisteredAppIsUndefined).toBe(true);
    expect(updatedMyRegisteredAppsLengthIsZero).toBe(true);
    expect(updatedFirstRegisteredAppIsUndefined).toBe(true);
    expect(sut.$state.serviceMessage).equals('Status Code 404: Apps were not found.');
  });
});
