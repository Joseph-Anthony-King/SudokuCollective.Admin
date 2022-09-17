import axios from 'axios';

const getIndexEndpoint = `${process.env.VUE_APP_API_URL}api/index`;

export class IndexConnector {
  // eslint-disable-next-line
  async getMissionStatement(): Promise<any> {
    try {
      const config = {
        method: 'get',
        url: `${getIndexEndpoint}`,
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
