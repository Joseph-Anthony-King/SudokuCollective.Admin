/* eslint-disable @typescript-eslint/no-explicit-any */
import { RulesMessages } from '@/utilities/rules/rulesMessages';
import { type ComputedRef, computed } from 'vue';

export default function () {
  const emailRules = (
    invalidEmails: string[],
    invalidMessage: string | undefined = undefined,
  ): any => {
    if (invalidMessage === undefined) {
      invalidMessage = RulesMessages.emailNotUniqueMessage;
    }
    return [
      (v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Email'),
      (v: string) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || RulesMessages.emailInvalidMessage,
      (v: string) => !invalidEmails.includes(v) || invalidMessage,
    ];
  };
  const passwordRules = (
    invalidPasswords: string[] = new Array<string>(),
  ): ((v: string) => string | true)[] => {
    return [
      (v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Password'),
      (v: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(v) ||
        RulesMessages.passwordRegexMessage,
      (v: string) => !invalidPasswords.includes(v) || RulesMessages.passwordInvalidMessage,
    ];
  };
  const confirmPasswordRules = (password: string | null): ((v: string) => string | true)[] => {
    return [
      (v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Confirm Password'),
      (v: string) =>
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(v) ||
        RulesMessages.passwordRegexMessage,
      (v: string) => v === password || RulesMessages.passwordMatchMesssage,
    ];
  };
  const requiredRules = (value: string): ((v: string) => string | true)[] => {
    return [(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', value)];
  };
  const urlRules: ComputedRef<((v: string) => string | true)[]> = computed(() => {
    return [
      (v: string) =>
        /^(ht|f)tp(s?):\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)([a-zA-Z0-9\-.?,'/\\+&%$#_]*)?$/.test(
          v,
        ) || RulesMessages.urlRegexMessage,
    ];
  });
  const userNameRules = (
    invalidUserNames: string[] = new Array<string>(),
    invalidMessage: string | undefined = undefined,
  ): any => {
    if (invalidMessage === undefined) {
      invalidMessage = RulesMessages.userNameNotUniqueMessage;
    }
    return [
      (v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'User Name'),
      (v: string) =>
        /^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) || RulesMessages.userNameRegexMessage,
      (v: string) => !invalidUserNames.includes(v) || invalidMessage,
    ];
  };

  return {
    confirmPasswordRules,
    emailRules,
    passwordRules,
    requiredRules,
    urlRules,
    userNameRules,
  };
}
