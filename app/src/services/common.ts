import { AxiosError } from 'axios';
import { useGlobalStore } from '@/stores/globalStore/index';
import { useServiceFailStore } from '@/stores/serviceFailStore';

export class StaticServiceMethods {
  static processFailedResponse(response: any): void {
    const globalStore = useGlobalStore();
    const serviceFailStore = useServiceFailStore();
    serviceFailStore.updateIsSuccess(response.data.isSuccess);
    serviceFailStore.updateServiceMessage(response.data.message);
    serviceFailStore.updateStatusCode(response.status);

    if (
      response.status === 401 ||
      (response.status === 403 &&
        response.data.message === 'Status Code 403: Invalid request on this authorization token.')
    ) {
      globalStore.tokenHasExpired(response);
    }
  }

  static numberCannotBeZero(id: number): AxiosError | null {
    if (id <= 0) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          data: {
            isSuccess: false,
            message: 'Number cannot be zero.',
          },
          status: 500,
          statusText: 'BAD REQUEST',
        },
      } as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }

  static stringCannotBeEmptyOrNull(str: string): AxiosError | null {
    if (str === '' || str === null) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          data: {
            isSuccess: false,
            message: 'String cannot be null or empty.',
          },
          status: 500,
          statusText: 'BAD REQUEST',
        },
      } as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }
}
