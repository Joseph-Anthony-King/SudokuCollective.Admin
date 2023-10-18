import { RulesMessages } from '@/utilities/rules/rulesMessages';

export default function () { 
	const emailRules = (invalidEmails: string[], invalidMessage: string | undefined = undefined) => {
    if (invalidMessage === undefined) {
      invalidMessage = RulesMessages.emailNotUniqueMessage;
    }
		return [
			(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Email'),
			(v: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || RulesMessages.emailInvalidMessage,
			(v: string) => !invalidEmails.includes(v) || invalidMessage,
		];
	};

	const passwordRules = (invalidPasswords: string[] = new Array<string>()) => {
		return [
			(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Password'),
			(v: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(v) || RulesMessages.passwordRegexMessage,
			(v: string) => !invalidPasswords.includes(v) || RulesMessages.passwordInvalidMessage,
		];
	};

	const confirmPasswordRules = (password: string | undefined) => {
		return [
			(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'Confirm Password'),
			(v: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(v) || RulesMessages.passwordRegexMessage,
			(v: string) => v === password || RulesMessages.passwordMatchMesssage,
		];
	};

	const requiredRules = (value: string) => {
		return [
			(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', value),
		];
	};
	
	const userNameRules = (invalidUserNames: string[] = new Array<string>(), invalidMessage: string | undefined = undefined) => {
    if (invalidMessage === undefined) {
      invalidMessage = RulesMessages.userNameNotUniqueMessage;
    }
		return [
			(v: string) => !!v || RulesMessages.requiredMessage.replace('{{value}}', 'User Name'),
			(v: string) => /^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) || RulesMessages.userNameRegexMessage,
			(v: string) => !invalidUserNames.includes(v) || invalidMessage,
		];
	};
	
	return {
		confirmPasswordRules,
		emailRules,
		passwordRules,
		requiredRules,
		userNameRules,
	}
}