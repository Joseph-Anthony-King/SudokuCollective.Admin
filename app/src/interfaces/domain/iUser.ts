export interface IUser {
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
}
