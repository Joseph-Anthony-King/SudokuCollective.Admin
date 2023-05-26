export default function () { 
	const confirmPasswordRules = (password: string | null) => {
		return [
			(v: string) => !!v || 'Password is required',
			(v: string) =>
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(
					v
				) ||
				'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,',
			(v: string) => v === password || 'Password and confirm password must match',
		];
	};

	const emailRules = (invalidEmails: string[], invalidMessage: string) => {
		return [
			(v: string) => !!v || 'Email is required',
			(v: string) =>
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
				'Email must be in a valid format',
			(v: string) => !invalidEmails.includes(v) || invalidMessage,
		];
	};

	const passwordRules = (invalidPasswords: string[] = new Array<string>()) => {
		return [
			(v: string) => !!v || 'Password is required',
			(v: string) =>
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(
					v
				) ||
				'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,',
			(v: string) => !invalidPasswords.includes(v) || 'Password is incorrect',
		];
	};

	const requiredRules = (value: string) => {
		return [
			(v: string) => !!v || `${value} is required`
		];
	};
	
	const userNameRules = (invalidUserNames: string[] = new Array<string>(), invalidMessage = '') => {
		return [
			(v: string) => !!v || 'User Name is required',
			(v: string) =>
				/^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) ||
				'User name must be at least 4 characters and can contain alphanumeric characters and special characters of [! @ # $ % ^ & * + = ? - _ . ,]',
			(v: string) =>
				!invalidUserNames.includes(v) || invalidMessage,
		];
	};
	
	return {
		confirmPasswordRules,
		emailRules,
		passwordRules,
		requiredRules,
		userNameRules
	}
}