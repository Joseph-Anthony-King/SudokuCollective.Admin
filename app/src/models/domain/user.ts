import { IUser } from "@/interfaces/domain/iUser";

export class User implements IUser {
  id: number;
  userName: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  nickName: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
  isEmailConfirmed: boolean;
  receivedRequestToUpdateEmail: boolean;
  receivedRequestToUpdatePassword: boolean;
  isActive: boolean;
  isSuperUser: boolean;
  isAdmin: boolean;
  dateCreated: Date | undefined;
  dateUpdated: Date | undefined;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  isSignedUp: boolean;
  isSigningUp: boolean;
  isEditing: boolean;

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
    isSignedUp?: boolean
  ) {
		id ? this.id = id : this.id = 0;
		userName ? this.userName = userName : this.userName = undefined;
		firstName ? this.firstName = firstName : this.firstName = undefined;
		lastName ? this.lastName = lastName : this.lastName = undefined;
		nickName ? this.nickName = nickName : this.nickName = undefined;
		fullName ? this.fullName = fullName : this.fullName = undefined;
		email ? this.email = email : this.email = undefined;
		isEmailConfirmed ? this.isEmailConfirmed = isEmailConfirmed : this.isEmailConfirmed = false;
		receivedRequestToUpdateEmail ? this.receivedRequestToUpdateEmail = receivedRequestToUpdateEmail : this.receivedRequestToUpdateEmail = false;
		receivedRequestToUpdatePassword ? this.receivedRequestToUpdatePassword = receivedRequestToUpdatePassword : this.receivedRequestToUpdatePassword = false;
		isActive ? this.isActive = isActive : this.isActive = false;
		isSuperUser ? this.isSuperUser = isSuperUser : this.isSuperUser = false;
		isAdmin ? this.isAdmin = isAdmin : this.isAdmin = false;
		dateCreated ? this.dateCreated = dateCreated : this.dateCreated = undefined;
		dateUpdated ? this.dateUpdated = dateUpdated : this.dateUpdated = undefined;
		isLoggedIn ? this.isLoggedIn = isLoggedIn : this.isLoggedIn = false;
		isSignedUp ? this.isSignedUp = isSignedUp : this.isSignedUp = false;

		this.isLoggingIn = false;
		this.isSigningUp = false;
		this.isEditing = false;
  }
}
