export class Endpoints {
  static loginEndpoint = `${process.env.VITE_APP_API_URL}api/v1/login`;
  static confirmUserNameEndpoint = `${process.env.VITE_APP_API_URL}api/v1/login/confirmusername`;
}
