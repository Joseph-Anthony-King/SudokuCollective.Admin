import axios from "axios";

const getValuesEndpoint = "api/v1/values";

export class ValuesService {
  // eslint-disable-next-line
  async getValues(): Promise<any> {
    try {
      const config = {
        method: "post",
        url: `${getValuesEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          "page": 0,
          "itemsPerPage": 0,
          "sortBy": 0,
          "orderByDescending": true,
          "includeCompletedGames": true
        }
      }
      return axios(config);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
