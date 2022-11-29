import { IUser } from '@/interfaces/domain/iUser';

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
	}
	
	login(): void {
		this.isLoggedIn = true;
	}

	logout(): void {
		this.id = 0;
		this.userName = '';
		this.firstName = '';
		this.lastName = '';
		this.nickName = '';
		this.fullName = '';
		this.email = '';
		this.isEmailConfirmed = false;
		this.receivedRequestToUpdateEmail = false;
		this.receivedRequestToUpdatePassword = false;
		this.isActive = false;
		this.isSuperUser = false;
		this.isAdmin = false;
		this.dateCreated = new Date('0001-01-01T00:00:00Z');
		this.dateUpdated = new Date('0001-01-01T00:00:00Z');
		this.isLoggedIn = false;
	}

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
	): void {
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
	}
}
