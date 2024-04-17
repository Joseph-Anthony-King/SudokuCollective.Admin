export class Endpoints {
  static signupEndpoint = `${process.env.VITE_APP_API_URL}api/v1/signup`;
  static resendEmailConfirmationEndpoint = `${process.env.VITE_APP_API_URL}api/v1/signup/resendemailconfirmation`;
}
