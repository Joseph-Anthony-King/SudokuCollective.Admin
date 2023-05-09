import { AxiosResponse } from 'axios';
import { useServiceFailStore } from '@/store/serviceFailStore';

export class StaticServiceMethods {
	static processFailedResponse(response: AxiosResponse): void {
		const serviceFailStore = useServiceFailStore();
		serviceFailStore.updateIsSuccess(response.data.isSuccess);
		serviceFailStore.updateMessage(response.data.message);
		serviceFailStore.updateStatusCode(response.status);
	}
}
