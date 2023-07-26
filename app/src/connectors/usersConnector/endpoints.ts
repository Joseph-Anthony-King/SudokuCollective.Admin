export class Endpoints {
  static requestPasswordResetEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users/requestpasswordreset`;
  static updateUserEndpoint = `${process.env.VUE_APP_API_URL}api/v1/users`;
}
