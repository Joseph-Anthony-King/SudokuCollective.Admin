export interface IUser {
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
  isObtainingAssistance: boolean;
  isSignedUp: boolean;
  isSigningUp: boolean;
  isEditing: boolean;
}
