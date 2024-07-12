import { describe, expect, it } from 'vitest';
import { SignupRequestData } from '@/models/requests/signupRequestData';

describe('the signupRequestData request model', () => {
  it('should have the expected properties', () => {
    const sut = new SignupRequestData(
      'userName',
      'firstName',
      'lastName',
      'nickName',
      'john.doe@example.com',
      'password',
      true
    );

    expect(sut.userName).toBeTypeOf('string');
    expect(sut.firstName).toBeTypeOf('string');
    expect(sut.lastName).toBeTypeOf('string');
    expect(sut.nickName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
    expect(sut.password).toBeTypeOf('string');
    expect(sut.stayLoggedIn).toBeTypeOf('boolean');
  });
});
