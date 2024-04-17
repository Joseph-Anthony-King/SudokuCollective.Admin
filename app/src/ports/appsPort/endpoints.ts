export class Endpoints {
  static appsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps`;
  static getMyAppsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/getmyapps`;
  static getMyRegisteredAppsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/getmyregisteredapps`;
}
