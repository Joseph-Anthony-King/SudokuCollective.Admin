import { IUser } from '@/interfaces/domain/iUser';

// state...
export class User implements IUser {
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
	isLoggingIn: boolean;
	
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
		isLoggedIn?: boolean
	) {
		this.id = id ? id : 0;
		this.userName = userName ? userName : '';
		this.firstName = firstName ? firstName : '';
		this.lastName = lastName ? lastName : '';
		this.nickName = nickName ? nickName : '';
		this.fullName = fullName ? fullName : '';
		this.email = email ? email : '';
		this.isEmailConfirmed = isEmailConfirmed ? isEmailConfirmed : false;
		this.receivedRequestToUpdateEmail = receivedRequestToUpdateEmail ? receivedRequestToUpdateEmail : false;
		this.receivedRequestToUpdatePassword = receivedRequestToUpdatePassword ? receivedRequestToUpdatePassword : false;
		this.isActive = isActive ? isActive : false;
		this.isSuperUser = isSuperUser ? isSuperUser : false;
		this.isAdmin = isAdmin ? isAdmin : false;
		this.dateCreated = dateCreated ? dateCreated : new Date('0001-01-01T00:00:00Z');
		this.dateUpdated = dateUpdated ? dateUpdated : new Date('0001-01-01T00:00:00Z');
		this.isLoggedIn = isLoggedIn ? isLoggedIn : false;
		this.isLoggingIn = false;
	}
}

// methods...
export class UserMethods {
	static logout(user: User): User {
		if (user !== null) {
			user.id = 0;
			user.userName = '';
			user.firstName = '';
			user.lastName = '';
			user.nickName = '';
			user.fullName = '';
			user.email = '';
			user.isEmailConfirmed = false;
			user.receivedRequestToUpdateEmail = false;
			user.receivedRequestToUpdatePassword = false;
			user.isActive = false;
			user.isSuperUser = false;
			user.isAdmin = false;
			user.dateCreated = new Date('0001-01-01T00:00:00Z');
			user.dateUpdated = new Date('0001-01-01T00:00:00Z');
			user.isLoggedIn = false;
		} else {
			user = new User();
		}

		return user;
	}
}
