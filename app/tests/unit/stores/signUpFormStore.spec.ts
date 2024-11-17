import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, type Pinia } from "pinia";
import { useSignUpFormStore } from "@/stores/formStores/signUpFormStore";

describe('the signUpFormStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useSignUpFormStore(pinia);

    sut.userName = 'userName';
    sut.firstName = 'firstName';
    sut.lastName = 'lastName';
    sut.nickName = 'nickName';
    sut.email = 'email@example.com';
    sut.password = 'password';
    sut.confirmPassword = 'confirmPassword';
    sut.passwordToken = 'passwordToken';

    // Assert
    expect(sut.dirty).toBeTypeOf('boolean');
    expect(sut.userName).toBeTypeOf('string');
    expect(sut.firstName).toBeTypeOf('string');
    expect(sut.lastName).toBeTypeOf('string');
    expect(sut.nickName).toBeTypeOf('string');
    expect(sut.email).toBeTypeOf('string');
    expect(sut.password).toBeTypeOf('string');
    expect(sut.confirmPassword).toBeTypeOf('string');
    expect(sut.passwordToken).toBeTypeOf('string');
    expect(sut.openPasswordResetForm).toBeTypeOf('boolean');
    expect(sut.invalidUserNames).toBeTypeOf('object');
    expect(sut.invalidUserNames.length).equals(0);
    expect(sut.invalidEmails).toBeTypeOf('object');
    expect(sut.invalidEmails.length).equals(0);
  });
  it('should have the expected getters', () => {
    // Arrange and Act
    const sut = useSignUpFormStore(pinia);

    sut.userName = 'userName';
    sut.firstName = 'firstName';
    sut.lastName = 'lastName';
    sut.nickName = 'nickName';
    sut.email = 'email@example.com';
    sut.password = 'password';
    sut.confirmPassword = 'confirmPassword';
    sut.passwordToken = 'passwordToken';

    const dirty = sut.getDirty;
    const userName = sut.getUserName;
    const firstName = sut.getFirstName;
    const lastName = sut.getLastName;
    const nickName = sut.getNickName;
    const email = sut.getEmail;
    const password = sut.getPassword;
    const confirmPassword = sut.getConfirmPassword;
    const passwordToken = sut.getPasswordToken;
    const openPasswordResetForm = sut.getOpenPasswordResetForm;
    const invalidUserNames = sut.getInvalidUserNames;
    const invalidEmails = sut.getInvalidEmails;

    // Assert
    expect(dirty).toBeTypeOf('boolean');
    expect(userName).toBeTypeOf('string');
    expect(firstName).toBeTypeOf('string');
    expect(lastName).toBeTypeOf('string');
    expect(nickName).toBeTypeOf('string');
    expect(email).toBeTypeOf('string');
    expect(password).toBeTypeOf('string');
    expect(confirmPassword).toBeTypeOf('string');
    expect(passwordToken).toBeTypeOf('string');
    expect(openPasswordResetForm).toBeTypeOf('boolean');
    expect(invalidUserNames).toBeTypeOf('object');
    expect(invalidUserNames.length).equals(0);
    expect(invalidEmails).toBeTypeOf('object');
    expect(invalidEmails.length).equals(0);
  });
  it('should set the userName and dirty property using the updateUserName mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialUserNameIsNull = sut.getUserName === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateUserName('userName');

    const finalUserNameIsString = typeof sut.getUserName === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialUserNameIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalUserNameIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the firstName and dirty property using the updateFirstName mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialFirstNameIsNull = sut.getFirstName === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateFirstName('firstName');

    const finalFirstNameIsString = typeof sut.getFirstName === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialFirstNameIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalFirstNameIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the lastName and dirty property using the updateLastName mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialLastNameIsNull = sut.getLastName === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateLastName('lastName');

    const finalLastNameIsString = typeof sut.getLastName === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialLastNameIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalLastNameIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the nickName and dirty property using the updateNickName mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialNickNameIsNull = sut.getNickName === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateNickName('nickName');

    const finalNickNameIsString = typeof sut.getNickName === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialNickNameIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalNickNameIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the email and dirty property using the updateEmail mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialEmailIsNull = sut.getEmail === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateEmail('email@example.com');

    const finalEmailIsString = typeof sut.getEmail === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialEmailIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalEmailIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the password and dirty property using the updatePassword mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialPasswordIsNull = sut.getPassword === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updatePassword('password');

    const finalPasswordIsString = typeof sut.getPassword === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialPasswordIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalPasswordIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the confirmPassword and dirty property using the updateConfirmPassword mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialConfirmPasswordIsNull = sut.getConfirmPassword === null;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updateConfirmPassword('confirmPassword');

    const finalConfirmPasswordIsString = typeof sut.getConfirmPassword === 'string';
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialConfirmPasswordIsNull).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalConfirmPasswordIsString).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the passwordToken, openPasswordResetForm and dirty property using the updatePasswordToken mutation', () => {
    // Arrange
    const sut = useSignUpFormStore(pinia);
    const initialPasswordTokenIsNull = sut.getPasswordToken === null;
    const initialOpenPasswordResetFormIsFalse = !sut.getOpenPasswordResetForm;
    const initialDirtyIsFalse = !sut.getDirty;

    // Act
    sut.updatePasswordToken('passwordToken');

    const finalConfirmPasswordIsString = typeof sut.getPasswordToken === 'string';
    const finalOpenPasswordResetFormIsTrue = sut.getOpenPasswordResetForm;
    const finalDirtyIsTrue = sut.getDirty;

    // Assert
    expect(initialPasswordTokenIsNull).toBeTruthy();
    expect(initialOpenPasswordResetFormIsFalse).toBeTruthy();
    expect(initialDirtyIsFalse).toBeTruthy();
    expect(finalConfirmPasswordIsString).toBeTruthy();
    expect(finalOpenPasswordResetFormIsTrue).toBeTruthy();
    expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the invalidUserNames and dirty property using the updateInvalidUserNames mutation', () => {
		// Arrange
		const sut = useSignUpFormStore(pinia);
		const initialInvalidUserNamesLengthIsZero = sut.getInvalidUserNames.length === 0;
		const initialDirtyIsFalse = !sut.getDirty;

		// Act
		sut.updateInvalidUserNames(['userName1', 'userName2']);

		const finalInvalidUserNamesLengthIsTwo = sut.getInvalidUserNames.length === 2;
		const finalDirtyIsTrue = sut.getDirty;

		// Assert
		expect(initialInvalidUserNamesLengthIsZero).toBeTruthy();
		expect(initialDirtyIsFalse).toBeTruthy();
		expect(finalInvalidUserNamesLengthIsTwo).toBeTruthy();
		expect(finalDirtyIsTrue).toBeTruthy();
  });
  it('should set the invalidEmails and dirty property using the updateInvalidEmails mutation', () => {
		// Arrange
		const sut = useSignUpFormStore(pinia);
		const initialInvalidEmailsLengthIsZero = sut.getInvalidEmails.length === 0;
		const initialDirtyIsFalse = !sut.getDirty;

		// Act
		sut.updateInvalidEmails(['email1@example.com', 'email2@example.com']);

		const finalInvalidEmailsLengthIsTwo = sut.getInvalidEmails.length === 2;
		const finalDirtyIsTrue = sut.getDirty;

		// Assert
		expect(initialInvalidEmailsLengthIsZero).toBeTruthy();
		expect(initialDirtyIsFalse).toBeTruthy();
		expect(finalInvalidEmailsLengthIsTwo).toBeTruthy();
		expect(finalDirtyIsTrue).toBeTruthy();
  });
	it('should set the stores initial values using the initializeStore action', () => {
		// Arrange
		const sut = useSignUpFormStore(pinia);

		// Act
		sut.initializeStore();

		// Assert
		expect(sut.dirty).toBeFalsy();
		expect(sut.userName).toBeNull();
		expect(sut.firstName).toBeNull();
		expect(sut.lastName).toBeNull();
		expect(sut.nickName).toBeNull();
		expect(sut.email).toBeNull();
		expect(sut.password).toBeNull();
		expect(sut.confirmPassword).toBeNull();
		expect(sut.passwordToken).toBeNull();
		expect(sut.openPasswordResetForm).toBeFalsy();
		expect(sut.invalidUserNames).toBeTypeOf('object');
		expect(sut.invalidUserNames.length).equals(0);
		expect(sut.invalidEmails).toBeTypeOf('object');
		expect(sut.invalidEmails.length).equals(0);
	});
});