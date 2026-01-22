export class Endpoints {
  static appsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps`;
  static getMyAppsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/getmyapps`;
  static getMyRegisteredAppsEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/getmyregisteredapps`;
  static getAppUsersEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/{id}/getappusers/`;
  static putAddUserEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/{id}/adduser`;
  static putRemoveUserEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/{id}/removeuser`;
  static putActivateAdminPrivilegesEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/{id}/activateadminprivileges`;
  static putDeactivateAdminPrivilegesEndpoint = `${process.env.VITE_APP_API_URL}api/v1/apps/{id}/deactivateadminprivileges`;
}
