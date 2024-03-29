import axios, { AxiosError, AxiosResponse } from "axios";
import { Endpoints } from "./endpoints";
import { useGlobalStore } from "@/store/globalStore";
import { useUserStore } from "@/store/userStore";

export class AppsPort {
  static async getMyAppsAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const globalStore = useGlobalStore();
      const userStore = useUserStore();
      
      const config = {
        method: "post",
        url: `${Endpoints.getMyAppsEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VUE_APP_ID as unknown as number,
          paginator: {},
          payload: {},
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
  
  static async getMyRegisteredAppsAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const globalStore = useGlobalStore();
      const userStore = useUserStore();
      
      const config = {
        method: "post",
        url: `${Endpoints.getMyRegisteredAppsEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VUE_APP_ID as unknown as number,
          paginator: {},
          payload: {},
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
