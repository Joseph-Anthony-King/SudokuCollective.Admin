import { describe, expect, it } from 'vitest';
import { ConfirmEmailResultData } from '@/models/results/confirmEmailResultData';
import { EmailConfirmationType } from '@/enums/emailConfirmationType';

describe('the confirmEmailResultData requests model', () => {
  it('should have the expected properties', () => {
    const sut = new ConfirmEmailResultData(
      1,
      'userName',
      'email@example.com'
    );

    expect(sut.confirmationType).equals(EmailConfirmationType.NEWPROFILECONFIRMED);
    expect(sut.userName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
  });
  it('should accept the value of new profile confirmed for the email confirmation type', () => {
    const sut = new ConfirmEmailResultData(
      1,
      'userName',
      'email@example.com'
    );

    expect(sut.confirmationType).equals(EmailConfirmationType.NEWPROFILECONFIRMED);
  });
  it('should accept the value of old email confirmed for the email confirmation type', () => {
    const sut = new ConfirmEmailResultData(
      2,
      'userName',
      'email@example.com'
    );

    expect(sut.confirmationType).equals(EmailConfirmationType.OLDEMAILCONFIRMED);
  });
  it('should accept the value of new email confirmed for the email confirmation type', () => {
    const sut = new ConfirmEmailResultData(
      3,
      'userName',
      'email@example.com'
    );

    expect(sut.confirmationType).equals(EmailConfirmationType.NEWEMAILCONFIRMED);
  });
});
