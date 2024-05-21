export class Endpoints {
  static getEndpoint = `${process.env.VITE_APP_API_URL}api/v1/jobs/get?jobId=`;
  static pollEndpoint = `${process.env.VITE_APP_API_URL}api/v1/jobs/poll?jobId=`;
}
