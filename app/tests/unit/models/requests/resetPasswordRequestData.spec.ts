import { describe, expect, it } from 'vitest';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';

describe('the resetPasswordRequestData request model', () => {
  it('should have the expected properties', () => {
    const sut = new ResetPasswordRequestData(
      'token',
      'newPassword'
    );

    expect(sut.token).toBeTypeOf('string');
    expect(sut.newPassword).toBeTypeOf('string');
  });
});
