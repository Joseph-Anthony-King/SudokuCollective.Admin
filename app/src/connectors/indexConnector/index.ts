import axios from 'axios';
import { Endpoints } from '@/connectors/indexConnector/endpoints';

export class IndexConnector {
  // eslint-disable-next-line
  async getMissionStatementAsync(): Promise<any> {
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
        console.log(error);
      }
      return error;
    }
  }
}
