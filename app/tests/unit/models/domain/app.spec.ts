import { describe, expect, it } from 'vitest';
import { App } from '@/models/domain/app';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { SmtpServerSettings } from '@/models/domain/smtpServerSettings';

describe('the app domain model', () => {
  it('should have the expected properties', () => {
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
      true,
      ReleaseEnvironment.TEST,
      true,
      true,
      true,
      'customEmailConfirmationAction',
      'customPasswordResetAction',
      true,
      new SmtpServerSettings(
        1,
        "smtpServer",
        1,
        "userName",
        "password",
        "fromEmail",
        1
      ),
      1,
      0,
      30,
      true,
      new Date(),
      new Date(),
      []
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.name).toBeTypeOf('string');
    expect(sut.license).toBeTypeOf('string');
    expect(sut.ownerId).toBeTypeOf('number');
    expect(sut.localUrl).toBeTypeOf('string');
    expect(sut.testUrl).toBeTypeOf('string');
    expect(sut.stagingUrl).toBeTypeOf('string');
    expect(sut.prodUrl).toBeTypeOf('string');
    expect(sut.sourceCodeUrl).toBeTypeOf('string');
    expect(sut.isActive).toBeTypeOf('boolean');
    expect(sut.environment).equals(ReleaseEnvironment.TEST);
    expect(sut.permitSuperUserAccess).toBeTypeOf('boolean');
    expect(sut.permitCollectiveLogins).toBeTypeOf('boolean');
    expect(sut.disableCustomUrls).toBeTypeOf('boolean');
    expect(sut.customEmailConfirmationAction).toBeTypeOf('string');
    expect(sut.customPasswordResetAction).toBeTypeOf('string');
    expect(sut.useCustomSMTPServer).toBeTypeOf('boolean');
    expect(sut.smtpServerSettings?.id).toBeTypeOf('number');
    expect(sut.smtpServerSettings?.smtpServer).toBeTypeOf('string');
    expect(sut.smtpServerSettings?.port).toBeTypeOf('number');
    expect(sut.smtpServerSettings?.userName).toBeTypeOf('string');
    expect(sut.smtpServerSettings?.password).toBeTypeOf('string');
    expect(sut.smtpServerSettings?.fromEmail).toBeTypeOf('string');
    expect(sut.smtpServerSettings?.appId).toBeTypeOf('number');
    expect(sut.userCount).toBeTypeOf('number');
    expect(sut.accessDuration).toBeTypeOf('number');
    expect(sut.displayInGallery).toBeTypeOf('boolean');
    expect(sut.dateCreated?.toDateString()).toBeTypeOf('string');
    expect(sut.dateUpdated?.toDateString()).toBeTypeOf('string');
    expect(sut.users!.length).equals(0);
    expect(sut.isEditing).toBeTypeOf('boolean');
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
      0,
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
      0,
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
      0,
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
      0,
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
      0,
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
      0,
      TimeFrame.YEARS,
      30,
      false,
      new Date(),
      new Date(),
      []
    );
    expect(sut.timeFrame).equals(TimeFrame.YEARS);
  });
});
