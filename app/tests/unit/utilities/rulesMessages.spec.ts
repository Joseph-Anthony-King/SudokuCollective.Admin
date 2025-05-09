import { describe, expect, it } from 'vitest';
import { RulesMessages } from '@/utilities/rules/rulesMessages';

describe('The RulesMessages', () => {
  it('should have all required message properties defined', () => {
    // Check if all expected properties exist
    expect(RulesMessages).toHaveProperty('emailInvalidMessage');
    expect(RulesMessages).toHaveProperty('emailNotUniqueMessage');
    expect(RulesMessages).toHaveProperty('passwordInvalidMessage');
    expect(RulesMessages).toHaveProperty('passwordMatchMesssage');
    expect(RulesMessages).toHaveProperty('passwordRegexMessage');
    expect(RulesMessages).toHaveProperty('requiredMessage');
    expect(RulesMessages).toHaveProperty('urlRegexMessage');
    expect(RulesMessages).toHaveProperty('userNameNotUniqueMessage');
    expect(RulesMessages).toHaveProperty('userNameRegexMessage');
  });

  it('should have the correct email validation messages', () => {
    expect(RulesMessages.emailInvalidMessage).toBe('Email must be in a valid format');
    expect(RulesMessages.emailNotUniqueMessage).toBe('Email is not unique');
  });

  it('should have the correct password validation messages', () => {
    expect(RulesMessages.passwordInvalidMessage).toBe('Password is incorrect');
    expect(RulesMessages.passwordMatchMesssage).toBe('Password and confirm password must match');
    expect(RulesMessages.passwordRegexMessage).toBe(
      'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,'
    );
  });

  it('should have the correct required field message', () => {
    expect(RulesMessages.requiredMessage).toBe('{{value}} is required');
  });

  it('should have the correct URL validation message', () => {
    expect(RulesMessages.urlRegexMessage).toBe('Url is not valid');
  });

  it('should have the correct username validation messages', () => {
    expect(RulesMessages.userNameNotUniqueMessage).toBe('User Name is not unique');
    expect(RulesMessages.userNameRegexMessage).toBe(
      'User Name must be at least 4 characters and can contain alphanumeric characters and special characters of [! @ # $ % ^ & * + = ? - _ . ,]'
    );
  });

  it('should correctly replace template placeholder in required message', () => {
    const fieldName = 'Test Field';
    const message = RulesMessages.requiredMessage.replace('{{value}}', fieldName);
    expect(message).toBe('Test Field is required');
  });
});
