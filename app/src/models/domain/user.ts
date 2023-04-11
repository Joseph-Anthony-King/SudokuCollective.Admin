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
		this.id = id ? id : 0;
		this.userName = userName ? userName : null;
		this.firstName = firstName ? firstName : null;
		this.lastName = lastName ? lastName : null;
		this.nickName = nickName ? nickName : null;
		this.fullName = fullName ? fullName : null;
		this.email = email ? email : null;
		this.isEmailConfirmed = isEmailConfirmed ? isEmailConfirmed : false;
		this.receivedRequestToUpdateEmail = receivedRequestToUpdateEmail ? receivedRequestToUpdateEmail : false;
		this.receivedRequestToUpdatePassword = receivedRequestToUpdatePassword ? receivedRequestToUpdatePassword : false;
		this.isActive = isActive ? isActive : false;
		this.isSuperUser = isSuperUser ? isSuperUser : false;
		this.isAdmin = isAdmin ? isAdmin : false;
		this.dateCreated = dateCreated ? dateCreated : null;
		this.dateUpdated = dateUpdated ? dateUpdated : null;
		this.isLoggedIn = isLoggedIn ? isLoggedIn : false;
		this.isLoggingIn = false;
		this.isSignedUp = isSignedUp ? isSignedUp : false;
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
