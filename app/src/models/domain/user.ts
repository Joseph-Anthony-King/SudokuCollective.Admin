import { IUser } from '@/interfaces/domain/iUser';

export class User implements IUser {
	id: number;
	userName: string | null;
	firstName: string | null;
	lastName: string | null;
	nickName: string | null;
	fullName: string | null;
	email: string | null;
	isEmailConfirmed: boolean;
	receivedRequestToUpdateEmail: boolean;
	receivedRequestToUpdatePassword: boolean;
	isActive: boolean;
	isSuperUser: boolean;
	isAdmin: boolean;
	dateCreated: Date | null;
	dateUpdated: Date | null;
	isLoggedIn: boolean;
	isLoggingIn: boolean;
	isSignedUp: boolean;
	isSigningUp: boolean;
	
	constructor(
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
		dateUpdated?: Date,
		isLoggedIn?: boolean,
		isSignedUp?: boolean,
	) {
		id ? this.id = id : this.id = 0;
		userName ? this.userName = userName : this.userName = null;
		firstName ? this.firstName = firstName : this.firstName = null;
		lastName ? this.lastName = lastName : this.lastName = null;
		nickName ? this.nickName = nickName : this.nickName = null;
		fullName ? this.fullName = fullName : this.fullName = null;
		email ? this.email = email : this.email = null;
		isEmailConfirmed ? this.isEmailConfirmed = isEmailConfirmed : this.isEmailConfirmed = false;
		receivedRequestToUpdateEmail ? this.receivedRequestToUpdateEmail = receivedRequestToUpdateEmail : this.receivedRequestToUpdateEmail = false;
		receivedRequestToUpdatePassword ? this.receivedRequestToUpdatePassword = receivedRequestToUpdatePassword : this.receivedRequestToUpdatePassword = false;
		isActive ? this.isActive = isActive : this.isActive = false;
		isSuperUser ? this.isSuperUser = isSuperUser : this.isSuperUser = false;
		isAdmin ? this.isAdmin = isAdmin : this.isAdmin = false;
		dateCreated ? this.dateCreated = dateCreated : this.dateCreated = null;
		dateUpdated ? this.dateUpdated = dateUpdated : this.dateUpdated = null;
		isLoggedIn ? this.isLoggedIn = isLoggedIn : this.isLoggedIn = false;
		isSignedUp ? this.isSignedUp = isSignedUp : this.isSignedUp = false;

		this.isLoggingIn = false;
		this.isSigningUp = false;
	}
}

export class UserMethods {
	static logout(user: User): User {
		if (user !== null) {
			user.isLoggedIn = false;
			user.isLoggingIn = false;
			user.isSignedUp = false;
			user.isSigningUp = false;
			user.isEmailConfirmed = false;
			user.receivedRequestToUpdateEmail = false;
			user.receivedRequestToUpdatePassword = false;
			user.isActive = false;
			user.isSuperUser = false;
			user.isAdmin = false;
			user.dateCreated = null;
			user.dateUpdated = null;
			user.id = 0;
			user.firstName = null;
			user.lastName = null;
			user.nickName = null;
			user.fullName = null;
			user.email = null;
			user.userName = null;
		} else {
			user = new User();
		}

		return user;
	}
}
