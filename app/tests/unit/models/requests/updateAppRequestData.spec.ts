import { describe, expect, it } from 'vitest';
import { UpdateAppRequestData } from '@/models/requests/updateAppRequestData';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { SmtpServerSettings } from '@/models/domain/smtpServerSettings';

describe('the updateAppRequestData requests model', () => {
  it('should have the expected properties', () => {
    const sut = new UpdateAppRequestData(
      1,
      'Name',
      'license',
      1,
      'http:localhost:8080',
      'https://testurl.com',
      'https://stagingurl.com',
      'https://produrl.com',
      'https://github.com/example-user/example-repo',
      true,
      ReleaseEnvironment.LOCAL,
      true,
      false,
      false,
      'emailConfirmation',
      'passwordReset',
      false,
      new SmtpServerSettings(
        1,
        'smtpServer',
        443,
        'userName',
        'password',
        'john.doe@example.com',
        1
      ),
      TimeFrame.DAYS,
      30
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
    expect(sut.environment).equals(1);
    expect(sut.permitSuperUserAccess).toBeTypeOf('boolean');
    expect(sut.permitCollectiveLogins).toBeTypeOf('boolean');
    expect(sut.disableCustomUrls).toBeTypeOf('boolean');
    expect(sut.customEmailConfirmationAction).toBeTypeOf('string');
    expect(sut.customPasswordResetAction).toBeTypeOf('string');
    expect(sut.useCustomSMTPServer).toBeTypeOf('boolean');
    expect(sut.smtpServerSettings).toBeTypeOf('object');
    expect(sut.timeFrame).equals(4);
    expect(sut.accessDuration).toBeTypeOf('number');
  });
});
