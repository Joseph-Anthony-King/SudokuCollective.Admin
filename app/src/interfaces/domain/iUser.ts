export interface IUser {
	id: number;
	userName: string;
	firstName: string;
	lastName: string;
	nickName: string;
	fullName: string;
	email: string;
	isEmailConfirmed: boolean;
	receivedRequestToUpdateEmail: boolean;
	receivedRequestToUpdatePassword: boolean;
	isActive: boolean;
	isSuperUser: boolean;
	isAdmin: boolean;
	dateCreated: Date;
	dateUpdated: Date;
	isLoggedIn: boolean;

	login(): void;
	logout(): void;
	update(
		id?: number,
		userName?: string,
		firstName?: string,
		lastName?: string,
		nickName?: string,
		fullName?: string,
		email?: string,
		isEmailConfirmed?: boolean,
		receivedRequestToUpdateEmail?: boolean,
		receivedRequestToUpdatePassword?: boolean,
		isActive?: boolean,
		isSuperUser?: boolean,
		isAdmin?: boolean,
		dateCreated?: Date,
		dateUpdated?: Date
	): void;
}
