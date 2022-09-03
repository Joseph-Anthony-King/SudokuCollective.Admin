import axios from "axios";

const getIndexEndpoint = "api/index";

export class IndexService {
  // eslint-disable-next-line
  async getMissionStatement(): Promise<any> {
    try {
      const config = {
        method: "get",
        url: `${getIndexEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
      return axios(config);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
