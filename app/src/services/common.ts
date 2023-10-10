import { AxiosResponse } from 'axios';
import { useAppStore } from '@/store/appStore/index'
import { useServiceFailStore } from '@/store/serviceFailStore';

export class StaticServiceMethods {
	static processFailedResponse(response: AxiosResponse): void {
		const serviceFailStore = useServiceFailStore();
		serviceFailStore.updateIsSuccess(response.data.isSuccess);
		serviceFailStore.updateMessage(response.data.message);
		serviceFailStore.updateStatusCode(response.status);

		if (response.status === 401) {
			const appStore = useAppStore();
			appStore.tokenHasExpired(response);
		}
	}
}
