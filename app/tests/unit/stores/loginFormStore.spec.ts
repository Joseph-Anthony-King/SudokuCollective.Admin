import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useLoginFormStore } from '@/stores/formStores/loginFormStore';

describe('the loginFormStore store', () => {
	let pinia: Pinia;
	beforeEach(() => {
		pinia = createPinia();
	});
  afterEach(() => {
    vi.restoreAllMocks();
  });
	it('should have the expected state properties', () => {
		// Arrange and Act
		const sut = useLoginFormStore(pinia);

		sut.userName = 'userName';
		sut.password = 'password';
		sut.email = 'email@example.com';

		// Assert
		expect(sut.dirty).toBeTypeOf('boolean');
		expect(sut.emailDirty).toBeTypeOf('boolean');
		expect(sut.userName).toBeTypeOf('string');
		expect(sut.password).toBeTypeOf('string');
		expect(sut.email).toBeTypeOf('string');
		expect(sut.invalidUserNames).toBeTypeOf('object');
		expect(sut.invalidUserNames.length).equals(0);
		expect(sut.invalidPasswords).toBeTypeOf('object');
		expect(sut.invalidPasswords.length).equals(0);
		expect(sut.invalidEmails).toBeTypeOf('object');
		expect(sut.invalidEmails.length).equals(0);
		expect(sut.loginFailed).toBeTypeOf('boolean');
	});
	it('should have the expected getters', () => {
		// Arrange and Act
		const sut = useLoginFormStore(pinia);

		sut.userName = 'userName';
		sut.password = 'password';
		sut.email = 'email@example.com';

		const dirty = sut.getDirty;
		const emailDirty = sut.getEmailDirty;
		const userName = sut.getUserName;
		const password = sut.getPassword;
		const email = sut.getEmail;
		const invalidUserNames = sut.getInvalidUserNames;
		const invalidPasswords = sut.getInvalidEmails;
		const invalidEmails = sut.getInvalidEmails;
		const loginFailed = sut.getLoginFailed;

		// Assert
		expect(dirty).toBeTypeOf('boolean');
		expect(emailDirty).toBeTypeOf('boolean');
		expect(userName).toBeTypeOf('string');
		expect(password).toBeTypeOf('string');
		expect(email).toBeTypeOf('string');
		expect(invalidUserNames).toBeTypeOf('object');
		expect(invalidUserNames.length).equals(0);
		expect(invalidPasswords).toBeTypeOf('object');
		expect(invalidPasswords.length).equals(0);
		expect(invalidEmails).toBeTypeOf('object');
		expect(invalidEmails.length).equals(0);
		expect(loginFailed).toBeTypeOf('boolean');
	});
	it('should set the userName and dirty property using the updateUserName mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
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
	it('should set the password and dirty property using the updatePassword mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
		const initialPasswordIsNull = sut.getPassword === null;
		const initialDirtyIsFalse = !sut.getDirty;

		// Act
		sut.updatePassword('userName');

		const finalPasswordIsString = typeof sut.getPassword === 'string';
		const finalDirtyIsTrue = sut.getDirty;

		// Assert
		expect(initialPasswordIsNull).toBeTruthy();
		expect(initialDirtyIsFalse).toBeTruthy();
		expect(finalPasswordIsString).toBeTruthy();
		expect(finalDirtyIsTrue).toBeTruthy();
	});
	it('should set the email and dirty property using the updateEmail mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
		const initialEmailIsNull = sut.getEmail === null;
		const initialEmailDirtyIsFalse = !sut.getEmailDirty;

		// Act
		sut.updateEmail('email@example.com');

		const finalEmailIsString = typeof sut.getEmail === 'string';
		const finalEmailDirtyIsTrue = sut.getEmailDirty;

		// Assert
		expect(initialEmailIsNull).toBeTruthy();
		expect(initialEmailDirtyIsFalse).toBeTruthy();
		expect(finalEmailIsString).toBeTruthy();
		expect(finalEmailDirtyIsTrue).toBeTruthy();
	});
	it('should set the invalidUserNames and dirty property using the updateInvalidUserNames mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
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
	it('should set the invalidPasswords and dirty property using the updatePasswords mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
		const initialInvalidPasswordsLengthIsZero = sut.getInvalidPasswords.length === 0;
		const initialDirtyIsFalse = !sut.getDirty;

		// Act
		sut.updateInvalidPasswords(['password1', 'password2']);

		const finalInvalidPasswordsLengthIsTwo = sut.getInvalidPasswords.length === 2;
		const finalDirtyIsTrue = sut.getDirty;

		// Assert
		expect(initialInvalidPasswordsLengthIsZero).toBeTruthy();
		expect(initialDirtyIsFalse).toBeTruthy();
		expect(finalInvalidPasswordsLengthIsTwo).toBeTruthy();
		expect(finalDirtyIsTrue).toBeTruthy();
	});
	it('should set the invalidEmails and dirty property using the updateEmails mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
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
	it('should set the loginFailed and dirty property using the updateLoginFailed mutation', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);
		const initialLoginFailedIsFalse = !sut.getLoginFailed;
		const initialDirtyIsFalse = !sut.getDirty;

		// Act
		sut.updateLoginFailed(true);

		const finalLoginFailedIsTrue = sut.getLoginFailed;
		const finalDirtyIsTrue = sut.getDirty;

		// Assert
		expect(initialLoginFailedIsFalse).toBeTruthy();
		expect(initialDirtyIsFalse).toBeTruthy();
		expect(finalLoginFailedIsTrue).toBeTruthy();
		expect(finalDirtyIsTrue).toBeTruthy();
	});
	it('should set the stores initial values using the initializeStore action', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);

		// Act
		sut.initializeStore();

		// Assert
		expect(sut.dirty).toBeFalsy();
		expect(sut.emailDirty).toBeFalsy();
		expect(sut.userName).toBeNull();
		expect(sut.password).toBeNull();
		expect(sut.email).toBeNull();
		expect(sut.invalidUserNames).toBeTypeOf('object');
		expect(sut.invalidUserNames.length).equals(0);
		expect(sut.invalidPasswords).toBeTypeOf('object');
		expect(sut.invalidPasswords.length).equals(0);
		expect(sut.invalidEmails).toBeTypeOf('object');
		expect(sut.invalidEmails.length).equals(0);
		expect(sut.loginFailed).toBeFalsy();
	});
	it('should set the stores email values using the initializeAssistance action', () => {
		// Arrange
		const sut = useLoginFormStore(pinia);

		// Act
		sut.initializeAssistance();

		// Assert
		expect(sut.email).toBeNull();
		expect(sut.emailDirty).toBeFalsy();
		expect(sut.invalidEmails).toBeTypeOf('object');
		expect(sut.invalidEmails.length).equals(0);
	});
});