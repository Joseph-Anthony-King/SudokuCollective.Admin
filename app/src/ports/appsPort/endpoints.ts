export class Endpoints {
  static appsEndpoint = `${process.env.VUE_APP_API_URL}api/v1/apps`;
  static getMyAppsEndpoint = `${process.env.VUE_APP_API_URL}api/v1/apps/getmyapps`;
  static getMyRegisteredAppsEndpoint = `${process.env.VUE_APP_API_URL}api/v1/apps/getmyregisteredapps`;
}
