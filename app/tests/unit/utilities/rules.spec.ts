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

describe('The validation rules', () => {
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
      expect(urlValidator('')).toBe(true); // Empty string is allowed
      expect(urlValidator('not-a-url')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('www.example.com')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http://localhost')).toBe(true);
      expect(urlValidator('http://example.com')).toBe(true);
      expect(urlValidator('https://example.com')).toBe(true);
      expect(urlValidator('https://example.com/')).toBe(true);
      expect(urlValidator('ftp://example.com')).toBe(true);
    });

    it('should validate URLs with ports', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('http://localhost:8080')).toBe(true);
      expect(urlValidator('https://example.com:443')).toBe(true);
      expect(urlValidator('http://192.168.1.1:3000')).toBe(true);
    });

    it('should validate URLs with query parameters', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('http://example.com?param=value')).toBe(true);
      expect(urlValidator('http://example.com#anchor')).toBe(true);
      expect(urlValidator('https://example.com?search=test&filter=active')).toBe(true);
      expect(urlValidator('https://example.com/api?key=value')).toBe(true);
      expect(urlValidator('https://example.com/path/to/resource?key=val')).toBe(RulesMessages.urlRegexMessage);
    });

    it('should validate single-level URL paths', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      // The regex (\/?)([a-zA-Z0-9\-.?,'\\+&%$#_]*)? allows ONE slash followed by path chars
      expect(urlValidator('http://example.com/path')).toBe(true);
      expect(urlValidator('http://example.com/api')).toBe(true);
      expect(urlValidator('https://example.com/page-name')).toBe(true);
      expect(urlValidator('https://example.com/path_underscore')).toBe(true);
      expect(urlValidator('https://example.com/page.html')).toBe(true);
    });

    it('should not validate multi-level URL paths', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      // Current regex (\/?) only allows ONE forward slash, so nested paths fail
      expect(urlValidator('https://example.com/level1/level2')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('https://example.com/level1/level2/level3')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http://api.example.com/v1/users/123')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http://example.com/path/to/file.html')).toBe(RulesMessages.urlRegexMessage);
    });

    it('should validate ftps protocol', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('ftps://example.com')).toBe(true);
      expect(urlValidator('ftps://ftp.example.com/files')).toBe(true); // Single-level path works
    });

    it('should validate URLs with hyphens in domain', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('https://my-site.example.com')).toBe(true);
      expect(urlValidator('http://my-domain.com')).toBe(true);
      expect(urlValidator('https://sub-domain.example.com')).toBe(true);
    });

    it('should validate URLs with trailing slash only', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      // Only trailing slash works, not paths
      expect(urlValidator('https://example.com/')).toBe(true);
      expect(urlValidator('http://localhost/')).toBe(true);
    });

    it('should invalidate malformed URLs', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('htp://example.com')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http:/example.com')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('http//example.com')).toBe(RulesMessages.urlRegexMessage);
      expect(urlValidator('://example.com')).toBe(RulesMessages.urlRegexMessage);
    });

    it('should handle URLs starting with numbers', () => {
      // Arrange
      const validationRules = rules();
      const urlValidator = validationRules.urlRules.value[0];

      // Act & Assert
      expect(urlValidator('http://123example.com')).toBe(true);
      expect(urlValidator('https://1-site.com')).toBe(true);
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
      expect(usernameRules[1]('us')).toBe(RulesMessages.userNameRegexMessage); // too short (only 2 chars + 1 from regex = 3 total, needs 4+)
      expect(usernameRules[1]('use')).toBe(RulesMessages.userNameRegexMessage); // exactly 3 chars total, needs 4+
      expect(usernameRules[1]('user')).toBe(true); // exactly 4 chars total
      expect(usernameRules[1]('user@name')).toBe(true); // Valid with @ special char
      expect(usernameRules[1]('user123')).toBe(true); // Valid with numbers
      expect(usernameRules[1]('user_name')).toBe(true); // Valid with underscore
      expect(usernameRules[1]('user.name')).toBe(true); // Valid with period
    });

    it('should validate username with all allowed special characters', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();

      // Act & Assert
      expect(usernameRules[1]('user!')).toBe(true);
      expect(usernameRules[1]('user@')).toBe(true);
      expect(usernameRules[1]('user#')).toBe(true);
      expect(usernameRules[1]('user$')).toBe(true);
      expect(usernameRules[1]('user%')).toBe(true);
      expect(usernameRules[1]('user^')).toBe(true);
      expect(usernameRules[1]('user&')).toBe(true);
      expect(usernameRules[1]('user*')).toBe(true);
      expect(usernameRules[1]('user+')).toBe(true);
      expect(usernameRules[1]('user=')).toBe(true);
      expect(usernameRules[1]('user<')).toBe(true);
      expect(usernameRules[1]('user>')).toBe(true);
      expect(usernameRules[1]('user?')).toBe(true);
      expect(usernameRules[1]('user-')).toBe(true);
      expect(usernameRules[1]('user_')).toBe(true);
      expect(usernameRules[1]('user.')).toBe(true);
      expect(usernameRules[1]('user,')).toBe(true);
    });

    it('should validate username starting with special characters', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();

      // Act & Assert
      expect(usernameRules[1]('!user')).toBe(true);
      expect(usernameRules[1]('@user')).toBe(true);
      expect(usernameRules[1]('#user')).toBe(true);
      expect(usernameRules[1]('_user')).toBe(true);
      expect(usernameRules[1]('.user')).toBe(true);
    });

    it('should validate username starting with numbers', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();

      // Act & Assert
      expect(usernameRules[1]('123user')).toBe(true);
      expect(usernameRules[1]('9user')).toBe(true);
    });

    it('should validate long usernames', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules();

      // Act & Assert
      expect(usernameRules[1]('verylongusername123456789')).toBe(true);
      expect(usernameRules[1]('a'.repeat(50))).toBe(true);
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

    it('should validate empty array of invalid usernames', () => {
      // Arrange
      const validationRules = rules();
      const usernameRules = validationRules.userNameRules([]);

      // Act & Assert
      expect(usernameRules[2]('any_username')).toBe(true);
    });

    it('should use default message when invalidMessage is explicitly undefined', () => {
      // Arrange
      const validationRules = rules();
      const invalidUserNames = ['taken'];
      const usernameRules = validationRules.userNameRules(invalidUserNames, undefined);

      // Act & Assert
      expect(usernameRules[2]('taken')).toBe(RulesMessages.userNameNotUniqueMessage);
    });
  });

  describe('edge cases and coverage completion', () => {
    it('should handle emailRules with empty invalid emails array', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);

      // Act & Assert
      expect(emailRules[2]('any@email.com')).toBe(true);
    });

    it('should handle emailRules with explicitly undefined invalidMessage', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules(['test@example.com'], undefined);

      // Act & Assert
      expect(emailRules[2]('test@example.com')).toBe(RulesMessages.emailNotUniqueMessage);
    });

    it('should validate email with multiple dots in domain', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);

      // Act & Assert
      expect(emailRules[1]('test@mail.example.com')).toBe(true);
      expect(emailRules[1]('user@subdomain.mail.example.com')).toBe(true);
    });

    it('should validate email with dots and hyphens in username', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);

      // Act & Assert
      expect(emailRules[1]('test.user@example.com')).toBe(true);
      expect(emailRules[1]('test-user@example.com')).toBe(true);
      expect(emailRules[1]('test_user@example.com')).toBe(true);
    });

    it('should invalidate email with invalid TLD length', () => {
      // Arrange
      const validationRules = rules();
      const emailRules = validationRules.emailRules([]);

      // Act & Assert
      expect(emailRules[1]('test@example.c')).toBe(RulesMessages.emailInvalidMessage);
      expect(emailRules[1]('test@example.abcd')).toBe(RulesMessages.emailInvalidMessage);
    });

    it('should validate password with minimum length (4 chars with special char)', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();

      // Act & Assert
      expect(passwordRules[1]('Aa1!')).toBe(true);
      expect(passwordRules[1]('A1!')).toBe(RulesMessages.passwordRegexMessage); // only 3 chars
    });

    it('should validate password at maximum length (21 chars)', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();

      // Act & Assert
      expect(passwordRules[1]('Aa1!234567890123456789'.substring(0, 21))).toBe(true); // exactly 21
      expect(passwordRules[1]('Aa1!2345678901234567890')).toBe(RulesMessages.passwordRegexMessage); // 22 chars
    });

    it('should validate password with all allowed special characters', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();

      // Act & Assert
      expect(passwordRules[1]('Aa1!')).toBe(true);
      expect(passwordRules[1]('Aa1@')).toBe(true);
      expect(passwordRules[1]('Aa1#')).toBe(true);
      expect(passwordRules[1]('Aa1$')).toBe(true);
      expect(passwordRules[1]('Aa1%')).toBe(true);
      expect(passwordRules[1]('Aa1^')).toBe(true);
      expect(passwordRules[1]('Aa1&')).toBe(true);
      expect(passwordRules[1]('Aa1*')).toBe(true);
      expect(passwordRules[1]('Aa1+')).toBe(true);
      expect(passwordRules[1]('Aa1=')).toBe(true);
      expect(passwordRules[1]('Aa1?')).toBe(true);
      expect(passwordRules[1]('Aa1-')).toBe(true);
      expect(passwordRules[1]('Aa1_')).toBe(true);
      expect(passwordRules[1]('Aa1.')).toBe(true);
      expect(passwordRules[1]('Aa1,')).toBe(true);
    });

    it('should handle passwordRules with default empty invalid passwords', () => {
      // Arrange
      const validationRules = rules();
      const passwordRules = validationRules.passwordRules();

      // Act & Assert
      expect(passwordRules[2]('AnyPassword1!')).toBe(true);
    });

    it('should handle confirmPasswordRules with empty string password', () => {
      // Arrange
      const validationRules = rules();
      const confirmRules = validationRules.confirmPasswordRules('');

      // Act & Assert
      expect(confirmRules[2]('')).toBe(true); // empty matches empty
      expect(confirmRules[2]('Password1!')).toBe(RulesMessages.passwordMatchMesssage);
    });

    it('should validate requiredRules with whitespace', () => {
      // Arrange
      const validationRules = rules();
      const requiredRule = validationRules.requiredRules('Test Field');

      // Act & Assert
      expect(requiredRule[0]('   ')).toBe(true); // whitespace is truthy with !!
      expect(requiredRule[0](' value ')).toBe(true);
    });

    it('should validate requiredRules with various truthy values', () => {
      // Arrange
      const validationRules = rules();
      const requiredRule = validationRules.requiredRules('Field');

      // Act & Assert
      expect(requiredRule[0]('0')).toBe(true); // string "0" is truthy
      expect(requiredRule[0]('false')).toBe(true); // string "false" is truthy
      expect(requiredRule[0]('text')).toBe(true);
    });
  });
});
