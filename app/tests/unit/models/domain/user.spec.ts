import { describe, expect, expectTypeOf, it } from 'vitest';
import { User } from '@/models/domain/user';

describe('the user domain model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(User).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(User).instance.toHaveProperty('userName').toBeString;
    expectTypeOf(User).instance.toHaveProperty('firstName').toBeString;
    expectTypeOf(User).instance.toHaveProperty('lastName').toBeString;
    expectTypeOf(User).instance.toHaveProperty('nickName').toBeString;
    expectTypeOf(User).instance.toHaveProperty('fullName').toBeString;
    expectTypeOf(User).instance.toHaveProperty('email').toBeString;
    expectTypeOf(User).instance.toHaveProperty('isEmailConfirmed').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('receivedRequestToUpdateEmail').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('receivedRequestToUpdatePassword').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isActive').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isSuperUser').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isAdmin').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('dateCreated').toBeObject;
    expectTypeOf(User).instance.toHaveProperty('dateUpdated').toBeObject;
    expectTypeOf(User).instance.toHaveProperty('isLoggedIn').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isLoggingIn').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isSignedUp').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isSigningUp').toBeBoolean;
    expectTypeOf(User).instance.toHaveProperty('isEditing').toBeBoolean;
  });
  it('should have a default constructor', () => {
    const sut = new User();

    expect(sut.id).toBeNull();
    expect(sut.userName).toBeNull();
    expect(sut.firstName).toBeNull();
    expect(sut.lastName).toBeNull();
    expect(sut.nickName).toBeNull();
    expect(sut.fullName).toBeNull();
    expect(sut.email).toBeNull();
    expect(sut.isEmailConfirmed).toBeNull();
    expect(sut.receivedRequestToUpdateEmail).toBeNull();
    expect(sut.receivedRequestToUpdatePassword).toBeNull();
    expect(sut.isActive).toBeNull();
    expect(sut.isSuperUser).toBeNull();
    expect(sut.isAdmin).toBeNull();
    expect(sut.dateCreated).toBeNull();
    expect(sut.dateUpdated).toBeNull();
    expect(sut.isLoggedIn).toBeNull();
    expect(sut.isLoggingIn).toBeTypeOf('boolean');
    expect(sut.isSignedUp).toBeNull();
    expect(sut.isSigningUp).toBeTypeOf('boolean');
    expect(sut.isObtainingAssistance).toBeTypeOf('boolean');
    expect(sut.isEditing).toBeTypeOf('boolean');
  });
  it('should have a constructor which accepts parameters', () => {
    const sut = new User(
      1,
      'userName',
      'John',
      'Doe',
      'nickName',
      'John Doe',
      'john.doe@exmaple.com',
      true,
      false,
      false,
      true,
      false,
      true,
      new Date(),
      new Date(),
      true,
      true
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.userName).toBeTypeOf('string');
    expect(sut.firstName).toBeTypeOf('string');
    expect(sut.lastName).toBeTypeOf('string');
    expect(sut.nickName).toBeTypeOf('string');
    expect(sut.fullName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
    expect(sut.isEmailConfirmed).toBeTypeOf('boolean');
    expect(sut.receivedRequestToUpdateEmail).toBeTypeOf('boolean');
    expect(sut.receivedRequestToUpdatePassword).toBeTypeOf('boolean');
    expect(sut.isActive).toBeTypeOf('boolean');
    expect(sut.isSuperUser).toBeTypeOf('boolean');
    expect(sut.isAdmin).toBeTypeOf('boolean');
    expect(sut.dateCreated).toBeTypeOf('object');
    expect(sut.dateUpdated).toBeTypeOf('object');
    expect(sut.isLoggedIn).toBeTypeOf('boolean');
    expect(sut.isLoggingIn).toBeTypeOf('boolean');
    expect(sut.isSignedUp).toBeTypeOf('boolean');
    expect(sut.isSigningUp).toBeTypeOf('boolean');
    expect(sut.isEditing).toBeTypeOf('boolean');
  });
});
