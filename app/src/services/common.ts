import { AxiosError } from 'axios';
import { useGlobalStore } from '@/stores/globalStore/index';
import { useServiceFailStore } from '@/stores/serviceFailStore';

export class StaticServiceMethods {
  static processFailedResponse(response: any): void {
    const globalStore = useGlobalStore();
    const serviceFailStore = useServiceFailStore();
    serviceFailStore.updateIsSuccess(response.data.isSuccess);
    serviceFailStore.setServiceMessage(response.data.message);
    serviceFailStore.updateStatusCode(response.status);

    if (
      response.status === 401 ||
      (response.status === 403 &&
        response.data.message === 'Status Code 403: Invalid request on this authorization token.')
    ) {
      globalStore.tokenHasExpired(response);
    }
  }

  static isNumberGreaterThanZero(id: number): boolean {
    if (id <= 0) {
      return false;
    } else {
      return true;
    }
  }

  static isStringNotEmptyOrNull(str: string): boolean {
    if (str === '' || str === null) {
      return false;
    } else {
      return true;
    }
  }
}
