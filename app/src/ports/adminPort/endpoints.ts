export class Endpoints {
  static adminEndpoint = `${process.env.VITE_APP_API_URL}api/v1/admin`;
  static adminFlushEndpoint = `${process.env.VITE_APP_API_URL}api/v1/admin/flushcache`;
}
