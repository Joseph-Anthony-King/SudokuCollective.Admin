import axios, { AxiosError, AxiosResponse } from "axios";
import { Endpoints } from "@/ports/usersPort/endpoints";
import { IUpdateUserRequestData } from "@/interfaces/requests/iUpdateUserRequestData";
import { IResetPasswordRequestData } from "@/interfaces/requests/iResetPasswordRequestData";
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore/index";

export class UsersPort {
  static async getUserAsync(id: number): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "post",
        url: `${Endpoints.usersEndpoint}/${id}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
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

  static async putUpdateUserAsync(data: IUpdateUserRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "put",
        url: `${Endpoints.usersEndpoint}/${userStore.getUser.id}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VUE_APP_ID as unknown as number,
          paginator: {},
          payload: {
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            nickName: data.nickName,
            email: data.email,
          },
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

  static async deleteUserAsync(id: number): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "delete",
        url: `${Endpoints.usersEndpoint}/${id}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
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

  static async getConfirmEmailAsync(token: string): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "get",
        url: `${Endpoints.confirmEmailEndpoint.replace("{{token}}", token)}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
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

  static async putCancelEmailConfirmationRequestAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "put",
        url: `${Endpoints.cancelEmailConfirmationRequestEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
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

  static async putResetPasswordAsync(data: IResetPasswordRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "put",
        url: `${Endpoints.resetPasswordEndpoint.replace("{{token}}", data.token)}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          newPassword: data.newPassword
        }
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("error: ", error);
      }
      return error as AxiosError;
    }
  }

  static async postRequestPasswordResetAsync(email: string): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "post",
        url: `${Endpoints.requestPasswordResetEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          license: process.env.VUE_APP_LICENSE,
          email: email,
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

  static async putResendPasswordResetAsync(userId: number): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: "put",
        url: `${Endpoints.resendPasswordResetEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          userId,
          appId: process.env.VUE_APP_ID as unknown as number,
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

  static async putCancelPasswordResetAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "put",
        url: `${Endpoints.cancelPasswordResetEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
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

  static async putCancelAllEmailRequestsAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: "put",
        url: `${Endpoints.cancelAllEmailRequestsEndpoint}`,
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Authorization": `Bearer ${appStore.getToken}`,
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
