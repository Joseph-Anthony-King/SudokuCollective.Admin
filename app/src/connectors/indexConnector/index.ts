import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from '@/connectors/indexConnector/endpoints';

export class IndexConnector {
  static async getMissionStatementAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: Endpoints.getEndpoint,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
