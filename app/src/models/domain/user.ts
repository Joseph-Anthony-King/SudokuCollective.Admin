import type { IUser } from '@/interfaces/domain/iUser';

export class User implements IUser {
  id: number | null;
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
  isObtainingAssistance: boolean;
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
    isSignedUp?: boolean,
  ) {
    id !== null && id !== undefined ? (this.id = id) : (this.id = null);
    userName ? (this.userName = userName) : (this.userName = null);
    firstName ? (this.firstName = firstName) : (this.firstName = null);
    lastName ? (this.lastName = lastName) : (this.lastName = null);
    nickName ? (this.nickName = nickName) : (this.nickName = null);
    fullName ? (this.fullName = fullName) : (this.fullName = null);
    email ? (this.email = email) : (this.email = null);
    isEmailConfirmed !== undefined
      ? (this.isEmailConfirmed = isEmailConfirmed)
      : (this.isEmailConfirmed = false);
    receivedRequestToUpdateEmail !== undefined
      ? (this.receivedRequestToUpdateEmail = receivedRequestToUpdateEmail)
      : (this.receivedRequestToUpdateEmail = false);
    receivedRequestToUpdatePassword !== undefined
      ? (this.receivedRequestToUpdatePassword = receivedRequestToUpdatePassword)
      : (this.receivedRequestToUpdatePassword = false);
    isActive !== undefined ? (this.isActive = isActive) : (this.isActive = false);
    isSuperUser !== undefined ? (this.isSuperUser = isSuperUser) : (this.isSuperUser = false);
    isAdmin !== undefined ? (this.isAdmin = isAdmin) : (this.isAdmin = false);
    dateCreated ? (this.dateCreated = dateCreated) : (this.dateCreated = null);
    dateUpdated ? (this.dateUpdated = dateUpdated) : (this.dateUpdated = null);
    isLoggedIn !== undefined ? (this.isLoggedIn = isLoggedIn) : (this.isLoggedIn = false);
    isSignedUp !== undefined ? (this.isSignedUp = isSignedUp) : (this.isSignedUp = false);

    this.isLoggingIn = false;
    this.isObtainingAssistance = false;
    this.isSigningUp = false;
    this.isEditing = false;
  }
}
