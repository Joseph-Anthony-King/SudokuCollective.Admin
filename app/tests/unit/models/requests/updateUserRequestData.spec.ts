import { describe, expect, it } from 'vitest';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';

describe('the updateUserRequestData requests model', () => {
  it('should have the expected properties', () => {
    const sut = new UpdateUserRequestData(
      'userName',
      'firstName',
      'lastName',
      'nickName',
      'email@example.com'
    );

    expect(sut.userName).toBeTypeOf('string');
    expect(sut.firstName).toBeTypeOf('string');
    expect(sut.lastName).toBeTypeOf('string');
    expect(sut.nickName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
  });
});
