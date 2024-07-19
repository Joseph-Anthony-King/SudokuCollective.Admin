import { describe, expect, expectTypeOf, it } from 'vitest';
import { SmtpServerSettings } from '@/models/domain/smtpServerSettings';

describe('the smtpServerSettings model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('smtpServer').toBeString;
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('port').toBeNumber;
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('userName').toBeString;
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('password').toBeString;
    expectTypeOf(SmtpServerSettings).instance.toHaveProperty('appId').toBeNumber;
  });
  it('should have a default constructor', () => {
    const sut = new SmtpServerSettings();

    expect(sut.id).toBeNull();
    expect(sut.smtpServer).toBeNull();
    expect(sut.port).toBeNull();
    expect(sut.userName).toBeNull();
    expect(sut.password).toBeNull();
    expect(sut.appId).toBeNull();
  });
  it('should have a constructor which accepts parameters', () => {
    const sut = new SmtpServerSettings(
      1,
      'Test Server',
      443,
      'Test User',
      'Password',
      'john.doe@example.com',
      1
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.smtpServer).toBeTypeOf('string');
    expect(sut.port).toBeTypeOf('number');
    expect(sut.userName).toBeTypeOf('string');
    expect(sut.password).toBeTypeOf('string');
    expect(sut.appId).toBeTypeOf('number');
  });
});
