import { AxiosError, AxiosResponse } from "axios";
import { useAppStore } from "@/store/appStore/index";
import { useServiceFailStore } from "@/store/serviceFailStore";

export class StaticServiceMethods {
  static processFailedResponse(response: AxiosResponse): void {
    const appStore = useAppStore();
    const serviceFailStore = useServiceFailStore();
    serviceFailStore.updateIsSuccess(response.data.isSuccess);
    serviceFailStore.updateServiceMessage(response.data.message);
    serviceFailStore.updateStatusCode(response.status);

    if (response.status === 401 || (response.status === 403 && response.data.message === "Status Code 403: Invalid request on this authorization token")) {
      appStore.tokenHasExpired(response);
    }
  }

  static numberCannotBeZero(id: number): AxiosError | null {
    if (id === 0) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          status: 500,
          data: {
            isSuccess: false,
            message: "Number cannot be zero",
          },
        },
      } as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }

  static stringCannotBeEmptyOrNull(str: string): AxiosError | null {
    if (str === "" || str === null) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          status: 500,
          data: {
            isSuccess: false,
            message: "String cannot be null or empty",
          },
        },
      } as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }
}
