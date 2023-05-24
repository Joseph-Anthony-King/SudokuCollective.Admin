import { ISignupRequestData } from "@/interfaces/requests/iSignupRequestData";

export class SignupRequestData implements ISignupRequestData {
	userName: string;
	firstName: string;
	lastName: string;
	nickName: string;
	email: string;
	password: string;

	constructor(
		userName: string | null,
		firstName: string | null,
		lastName: string | null,
		nickName: string | null,
		email: string | null,
		password: string | null) {
		userName ? this.userName = userName : this.userName = "";
		firstName ? this.firstName = firstName : this.firstName = "";
		lastName ? this.lastName = lastName : this.lastName = "";
		nickName ? this.nickName = nickName : this.nickName = "";
		email ? this.email = email : this.email = "";
		password ? this.password = password : this.password = "";
	}
}
