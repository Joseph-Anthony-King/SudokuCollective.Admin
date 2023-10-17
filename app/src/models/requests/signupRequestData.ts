import { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';

export class SignupRequestData implements ISignupRequestData {
	userName: string;
	firstName: string;
	lastName: string;
	nickName: string;
	email: string;
	password: string;
  stayLoggedIn: boolean;

	constructor(
		userName: string | undefined,
		firstName: string | undefined,
		lastName: string | undefined,
		nickName: string | undefined,
		email: string | undefined,
		password: string | undefined,
    stayLoggedIn: boolean) {
		userName ? this.userName = userName : this.userName = '';
		firstName ? this.firstName = firstName : this.firstName = '';
		lastName ? this.lastName = lastName : this.lastName = '';
		nickName ? this.nickName = nickName : this.nickName = '';
		email ? this.email = email : this.email = '';
		password ? this.password = password : this.password = '';
    this.stayLoggedIn = stayLoggedIn;
	}
}
