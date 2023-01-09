import store from "@/store";
import { AxiosResponse } from "axios";

export class StaticServiceMethods {
	static processFailedResponse(response: AxiosResponse): void {
		store.dispatch("serviceFailModule/updateIsSuccess", response.data.isSuccess);
		store.dispatch("serviceFailModule/updateMessage", response.data.message);
		store.dispatch("serviceFailModule/updateStatusCode", response.status);
	}
}
