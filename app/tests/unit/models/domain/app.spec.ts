import { describe, expect, expectTypeOf, it } from 'vitest';
import { App } from '@/models/domain/app';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { SmtpServerSettings } from '@/models/domain/smtpServerSettings';
import { User } from '@/models/domain/user';

describe('the app domain model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(App).toBeObject();
    expectTypeOf(App).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(App).instance.toHaveProperty('name').toBeString;
    expectTypeOf(App).instance.toHaveProperty('license').toBeString;
    expectTypeOf(App).instance.toHaveProperty('ownerId').toBeNumber;
    expectTypeOf(App).instance.toHaveProperty('localUrl').toBeString;
    expectTypeOf(App).instance.toHaveProperty('testUrl').toBeString;
    expectTypeOf(App).instance.toHaveProperty('stagingUrl').toBeString;
    expectTypeOf(App).instance.toHaveProperty('prodUrl').toBeString;
    expectTypeOf(App).instance.toHaveProperty('sourceCodeUrl').toBeString;
    expectTypeOf(App).instance.toHaveProperty('isActive').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('environment').toBeNull;
    expectTypeOf(App).instance.toHaveProperty('permitSuperUserAccess').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('permitCollectiveLogins').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('disableCustomUrls').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('customEmailConfirmationAction').toBeString;
    expectTypeOf(App).instance.toHaveProperty('customPasswordResetAction').toBeString;
    expectTypeOf(App).instance.toHaveProperty('useCustomSMTPServer').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('smtpServerSettings').toBeObject;
    expectTypeOf(App).instance.toHaveProperty('accessDuration').toBeNumber;
    expectTypeOf(App).instance.toHaveProperty('displayInGallery').toBeBoolean;
    expectTypeOf(App).instance.toHaveProperty('dateCreated').toBeObject;
    expectTypeOf(App).instance.toHaveProperty('dateUpdated').toBeObject;
    expectTypeOf(App).instance.toHaveProperty('users').toBeArray;
    expectTypeOf(App).instance.toHaveProperty('userCount').toBeNumber;
    expectTypeOf(App).instance.toHaveProperty('isEditing').toBeBoolean;
  });
  it('should have a default constructor', () => {
    const sut = new App();    

    expect(sut.id).toBeNull();
    expect(sut.name).toBeNull();
    expect(sut.license).toBeNull();
    expect(sut.ownerId).toBeNull();
    expect(sut.localUrl).toBeNull();
    expect(sut.testUrl).toBeNull();
    expect(sut.stagingUrl).toBeNull();
    expect(sut.prodUrl).toBeNull();
    expect(sut.sourceCodeUrl).toBeNull();
    expect(sut.isActive).toBeNull();
    expect(sut.environment).toBeNull();
    expect(sut.permitSuperUserAccess).toBeNull();
    expect(sut.permitCollectiveLogins).toBeNull();
    expect(sut.disableCustomUrls).toBeNull();
    expect(sut.customEmailConfirmationAction).toBeNull();
    expect(sut.customPasswordResetAction).toBeNull();
    expect(sut.useCustomSMTPServer).toBeNull();
    expect(sut.smtpServerSettings).toBeNull();
    expect(sut.userCount).toBeNull();
    expect(sut.accessDuration).toBeNull();
    expect(sut.displayInGallery).toBeNull();
    expect(sut.dateCreated).toBeNull();
    expect(sut.dateUpdated).toBeNull();
    expect(sut.isEditing).toBeTypeOf('boolean');
  });
  it('should be able to set the token timeframe to seconds', () => {
    const sut = new App(
      0,
      'name',
      'license',
      0,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.SECONDS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.SECONDS);
  });
  it('should be able to set the token timeframe to minutes', () => {
    const sut = new App(
      1,
      'name',
      'license',
      1,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.MINUTES,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.MINUTES);
  });
  it('should be able to set the token timeframe to hours', () => {
    const sut = new App(
      0,
      'name',
      'license',
      0,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.HOURS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.HOURS);
  });
  it('should be able to set the token timeframe to days', () => {
    const sut = new App(
      0,
      'name',
      'license',
      0,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.DAYS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.DAYS);
  });
  it('should be able to set the token timeframe to months', () => {
    const sut = new App(
      0,
      'name',
      'license',
      0,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.MONTHS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.MONTHS);
  });
  it('should be able to set the token timeframe to years', () => {
    const sut = new App(
      0,
      'name',
      'license',
      0,
      'localUrl',
      'testUrl',
      'stagingUrl',
      'prodUrl',
      'sourceCodeUrl',
      false,
      ReleaseEnvironment.TEST,
      false,
      false,
      false,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      false,
      new SmtpServerSettings(
        0,
        "smtpServer",
        0,
        "userName",
        "password",
        "fromEmail",
        0
      ),
      TimeFrame.YEARS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.YEARS);
  });
  it('should return a count of app users', () => {
    // Arrange and Act
    const sut = new App();

    sut.users = [ new User(), new User() ];

    // Assert
    expect(sut.userCount).equals(2);
  });
});
