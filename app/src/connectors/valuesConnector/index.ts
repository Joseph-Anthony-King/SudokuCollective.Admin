import axios from 'axios';
import { Endpoints } from '@/connectors/valuesConnector/endpoints';

export class ValuesConnector {
  // eslint-disable-next-line
  async getValuesAsync(): Promise<any> {
    try {
      const config = {
        method: 'post',
        url: Endpoints.getEndpoint,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          'page': 0,
          'itemsPerPage': 0,
          'sortBy': 0,
          'orderByDescending': true,
          'includeCompletedGames': true
        }
      }
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log(error);
      }
      return error;
    }
  }
}
