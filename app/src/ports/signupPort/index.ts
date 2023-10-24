import axios, { AxiosError, AxiosResponse } from "axios";
import { ISignupRequestData } from "@/interfaces/requests/iSignupRequestData";
import { Endpoints } from "@/ports/signupPort/endpoints";

export class SignupPort {
  static async postAsync(data: ISignupRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "post",
        url: Endpoints.signupEndpoint,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          nickName: data.nickName,
          email: data.email,
          password: data.password,
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

  static async putResendEmailConfirmationAsync(requestorId: number): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "put",
        url: Endpoints.resentEmailConfirmationEndpoint,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          requestorId,
          appId: process.env.VUE_APP_ID,
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
