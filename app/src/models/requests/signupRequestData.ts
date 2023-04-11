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
		this.userName = userName ? userName : "";
		this.firstName = firstName ? firstName : "";
		this.lastName = lastName ? lastName : "";
		this.nickName = nickName ? nickName : "";
		this.email = email ? email : "";
		this.password = password ? password : "";
	}
}
