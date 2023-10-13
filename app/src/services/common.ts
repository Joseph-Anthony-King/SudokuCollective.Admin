import { AxiosError, AxiosResponse } from 'axios';
import { useAppStore } from '@/store/appStore/index'
import { useServiceFailStore } from '@/store/serviceFailStore';

export class StaticServiceMethods {
	static processFailedResponse(response: AxiosResponse): void {
    const appStore = useAppStore();
		const serviceFailStore = useServiceFailStore();
		serviceFailStore.updateIsSuccess(response.data.isSuccess);
		serviceFailStore.updateMessage(response.data.message);
		serviceFailStore.updateStatusCode(response.status);

		if (response.status === 401) {
			appStore.tokenHasExpired(response);
		}
    appStore.updateProcessingStatus(false);
	}

  static idCannotBeZero(id: number): AxiosError | null {
    if (id === 0) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          status: 500,
          data: {
            isSuccess: false,
            message: 'Id cannot be zero',
          }
        }} as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }
}
