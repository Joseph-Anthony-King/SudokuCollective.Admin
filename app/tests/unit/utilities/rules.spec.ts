import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import rules from '@/utilities/rules';
import { RulesMessages } from '@/utilities/rules/rulesMessages';

// Mock Vue's computed function
vi.mock('vue', () => {
  return {
    computed: vi.fn((fn) => {
      const result = fn();
      return {
        value: result,
      };
    }),
    type: vi.fn(),
    ComputedRef: vi.fn(),
    ref: vi.fn((val) => {
      return {
        value: val,
      };
    }),
  };
});

describe('validation rules', () => {
  describe('emailRules', () => {
    it('should return validation functions for emails', () => {
      // Arrange
      const validationRules = rules();
      const invalidEmails = ['test@example.com', 'existing@example.com'];
      
      // Act
      const result = validationRules.emailRules(invalidEmails);
      
      // Assert
      expect(result).toHaveLength(3);
      expect(typeof result[0]).toBe('function');
      expect(typeof result[1]).toBe('function');
      expect(typeof result[2]).toBe('function');
    });

    it('should validate required field', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);
      
      // Act & Assert
      expect(emailRules[0]('')).toBe(RulesMessages.requiredMessage.replace('{{value}}', 'Email'));
      expect(emailRules[0]('test@example.com')).toBe(true);
    });

    it('should validate email format', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);
      
      // Act & Assert
      expect(emailRules[1]('test')).toBe(RulesMessages.emailInvalidMessage);
      expect(emailRules[1]('test@')).toBe(RulesMessages.emailInvalidMessage);
      expect(emailRules[1]('test@example')).toBe(RulesMessages.emailInvalidMessage);
      expect(emailRules[1]('test@example.com')).toBe(true);
    });

    it('should validate email uniqueness', () => {
      // Arrange
      const validationRules = rules();
      const invalidEmails = ['test@example.com', 'existing@example.com'];
      const emailRules = validationRules.emailRules(invalidEmails);
      
      // Act & Assert
      expect(emailRules[2]('test@example.com')).toBe(RulesMessages.emailNotUniqueMessage);
      expect(emailRules[2]('existing@example.com')).toBe(RulesMessages.emailNotUniqueMessage);
      expect(emailRules[2]('new@example.com')).toBe(true);
    });

    it('should use custom invalid email message when provided', () => {
      // Arrange
      const validationRules = rules();
      const invalidEmails = ['test@example.com'];
      const customMessage = 'This email is already taken';
      const emailRules = validationRules.emailRules(invalidEmails, customMessage);
      
      // Act & Assert
      expect(emailRules[2]('test@example.com')).toBe(customMessage);
      expect(emailRules[2]('new@example.com')).toBe(true);
    });
  });

  describe('passwordRules', () => {
    it('should return validation functions for passwords', () => {
      // Arrange
      const validationRules = rules();
      
      // Act
      const result = validationRules.passwordRules();
      
      // Assert
      expect(result).toHaveLength(3);
      expect(typeof result[0]).toBe('function');
      expect(typeof result[1]).toBe('function');
      expect(typeof result[2]).toBe('function');
    });

    it('should validate required field', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();
      
      // Act & Assert
      expect(passwordRules[0]('')).toBe(RulesMessages.requiredMessage.replace('{{value}}', 'Password'));
      expect(passwordRules[0]('Password123!')).toBe(true);
    });

    it('should validate password format', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();
      
      // Act & Assert
      expect(passwordRules[1]('pass')).toBe(RulesMessages.passwordRegexMessage);
      expect(passwordRules[1]('password')).toBe(RulesMessages.passwordRegexMessage);
      expect(passwordRules[1]('password123')).toBe(RulesMessages.passwordRegexMessage);
      expect(passwordRules[1]('Password123')).toBe(RulesMessages.passwordRegexMessage);
      expect(passwordRules[1]('Password123!')).toBe(true);
    });

    it('should validate against invalid passwords', () => {
      // Arrange
      const validationRules = rules();
      const invalidPasswords = ['Password123!', 'OldPassword1!'];
      const passwordRules = validationRules.passwordRules(invalidPasswords);
      
      // Act & Assert
      expect(passwordRules[2]('Password123!')).toBe(RulesMessages.passwordInvalidMessage);
      expect(passwordRules[2]('OldPassword1!')).toBe(RulesMessages.passwordInvalidMessage);
      expect(passwordRules[2]('NewPassword1!')).toBe(true);
    });
  });

  describe('confirmPasswordRules', () => {
    it('should return validation functions for confirm password', () => {
      // Arrange
      const validationRules = rules();
      
      // Act
      const result = validationRules.confirmPasswordRules('Password123!');
      
      // Assert
      expect(result).toHaveLength(3);
      expect(typeof result[0]).toBe('function');
      expect(typeof result[1]).toBe('function');
      expect(typeof result[2]).toBe('function');
    });

    it('should validate required field', () => {
      // Arrange
      const validationRules = rules();
      const confirmRules = validationRules.confirmPasswordRules('Password123!');
      
      // Act & Assert
      expect(confirmRules[0]('')).toBe(RulesMessages.requiredMessage.replace('{{value}}', 'Confirm Password'));
      expect(confirmRules[0]('Password123!')).toBe(true);
    });

    it('should validate password format', () => {
      // Arrange
      const validationRules = rules();
      const confirmRules = validationRules.confirmPasswordRules('Password123!');
      
      // Act & Assert
      expect(confirmRules[1]('pass')).toBe(RulesMessages.passwordRegexMessage);
      expect(confirmRules[1]('password123')).toBe(RulesMessages.passwordRegexMessage);
      expect(confirmRules[1]('Password123!')).toBe(true);
    });

    it('should validate password matching', () => {
      // Arrange
      const validationRules = rules();
      const confirmRules = validationRules.confirmPasswordRules('Password123!');
      
      // Act & Assert
      expect(confirmRules[2]('DifferentPassword1!')).toBe(RulesMessages.passwordMatchMesssage);
      expect(confirmRules[2]('Password123!')).toBe(true);
    });

    it('should handle null original password', () => {
      // Arrange
      const validationRules = rules();
      const confirmRules = validationRules.confirmPasswordRules(null);
      
      // Act & Assert
      expect(confirmRules[2]('Password123!')).toBe(RulesMessages.passwordMatchMesssage);
      expect(confirmRules[2]('')).toBe(RulesMessages.passwordMatchMesssage); // null !== ""
    });
  });

  describe('requiredRules', () => {
    it('should return validation function for required fields', () => {
      // Arrange
      const validationRules = rules();
      
      // Act
      const result = validationRules.requiredRules('Field Name');
      
      // Assert
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe('function');
    });

    it('should validate required field with custom field name', () => {
      // Arrange
      const validationRules = rules();
      const fieldNames = ['Name', 'Address', 'Phone Number', 'Custom Field'];
      
      // Act & Assert
      fieldNames.forEach(fieldName => {
        const requiredRule = validationRules.requiredRules(fieldName)[0];
        expect(requiredRule('')).toBe(RulesMessages.requiredMessage.replace('{{value}}', fieldName));
        expect(requiredRule('some value')).toBe(true);
      });
    });
  });

  describe('urlRules', () => {
    it('should return computed validation function for URLs', () => {
      // Arrange
      const validationRules = rules();
      
      // Act
      const result = validationRules.urlRules;
      
      // Assert
      expect(Array.isArray(result.value)).toBe(true);
      expect(result.value).toHaveLength(1);
      expect(typeof result.value[0]).toBe('function');
    });

    it('should validate URL format', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];
      
      // Act & Assert
      expect(urlValidator('')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('not-a-url')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('www.example.com')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http://localhost')).toBe(true);
      expect(urlValidator('http://example.com')).toBe(true);
      expect(urlValidator('https://example.com')).toBe(true);
      expect(urlValidator('https://example.com/path')).toBe(true);
      expect(urlValidator('ftp://example.com')).toBe(true);
    });
  });

  describe('userNameRules', () => {
    it('should return validation functions for usernames', () => {
      // Arrange
      const validationRules = rules();
      
      // Act
      const result = validationRules.userNameRules();
      
      // Assert
      expect(result).toHaveLength(3);
      expect(typeof result[0]).toBe('function');
      expect(typeof result[1]).toBe('function');
      expect(typeof result[2]).toBe('function');
    });

    it('should validate required field', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();
      
      // Act & Assert
      expect(usernameRules[0]('')).toBe(RulesMessages.requiredMessage.replace('{{value}}', 'User Name'));
      expect(usernameRules[0]('username')).toBe(true);
    });

    it('should validate username format', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();
      
      // Act & Assert
      expect(usernameRules[1]('us')).toBe(RulesMessages.userNameRegexMessage); // too short
      expect(usernameRules[1]('user@name')).toBe(true); // Valid with special chars
      expect(usernameRules[1]('user123')).toBe(true); // Valid with numbers
      expect(usernameRules[1]('user_name')).toBe(true); // Valid with underscore
      expect(usernameRules[1]('user.name')).toBe(true); // Valid with period
    });

    it('should validate username uniqueness', () => {
      // Arrange
      const validationRules = rules();
      const invalidUserNames = ['existing_user', 'taken_username'];
      const usernameRules = validationRules.userNameRules(invalidUserNames);
      
      // Act & Assert
      expect(usernameRules[2]('existing_user')).toBe(RulesMessages.userNameNotUniqueMessage);
      expect(usernameRules[2]('taken_username')).toBe(RulesMessages.userNameNotUniqueMessage);
      expect(usernameRules[2]('new_username')).toBe(true);
    });

    it('should use custom invalid username message when provided', () => {
      // Arrange
      const validationRules = rules();
      const invalidUserNames = ['existing_user'];
      const customMessage = 'This username is already registered';
      const usernameRules = validationRules.userNameRules(invalidUserNames, customMessage);
      
      // Act & Assert
      expect(usernameRules[2]('existing_user')).toBe(customMessage);
      expect(usernameRules[2]('new_user')).toBe(true);
    });
  });
});
