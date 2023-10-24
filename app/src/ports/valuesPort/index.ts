import axios, { AxiosError, AxiosResponse } from "axios";
import { Endpoints } from "@/ports/valuesPort/endpoints";

export class ValuesPort {
  static async getValuesAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "post",
        url: Endpoints.getEndpoint,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          page: 0,
          itemsPerPage: 0,
          sortBy: 0,
          orderByDescending: true,
          includeCompletedGames: true,
        },
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("error: ", error);
      }
      return error as AxiosError;
    }
  }
}
