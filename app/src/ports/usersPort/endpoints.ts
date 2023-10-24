export class Endpoints {
  static usersEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users`;
  static requestPasswordResetEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/requestpasswordreset`;
  static cancelEmailConfirmationRequestEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/cancelemailconfirmation`;
}
