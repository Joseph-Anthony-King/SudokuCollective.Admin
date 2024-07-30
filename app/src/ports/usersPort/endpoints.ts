export class Endpoints {
  static usersEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users`;
  static confirmEmailEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/confirmemail/{{token}}`;
  static cancelEmailConfirmationRequestEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/cancelemailconfirmation`;
  static requestPasswordResetEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/requestpasswordreset`;
  static resetPasswordEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/resetpassword/{{token}}`;
  static resendPasswordResetEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/resendpasswordreset`;
  static cancelPasswordResetEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/cancelpasswordreset`;
  static cancelAllEmailRequestsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/users/cancelallemailrequests`;
}
