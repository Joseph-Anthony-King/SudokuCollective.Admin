export class Endpoints {
  static usersEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users`;
  static cancelEmailConfirmationRequestEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/cancelemailconfirmation`;
  static requestPasswordResetEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/requestpasswordreset`;
  static resendPasswordResetEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/resendpasswordreset`;
  static cancelPasswordResetEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/cancelpasswordreset`;
  static cancelAllEmailRequestsEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/cancelallemailrequests`;
}
