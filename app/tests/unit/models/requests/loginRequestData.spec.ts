import { describe, expect, it } from 'vitest';
import { LoginRequestData } from '@/models/requests/loginRequestData';

describe('the loginRequestData request model', () => {
  it('should have the expected properties', () => {
    const sut = new LoginRequestData(
      'userName',
      'password',
      true
    );

    expect(sut.userName).toBeTypeOf('string');
    expect(sut.password).toBeTypeOf('string');
    expect(sut.stayLoggedIn).toBeTypeOf('boolean');
  });
});
