import { UsersConnector } from "@/connectors/usersConnector";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { ILoginAssistanceRequestData } from "@/interfaces/requests/ilLoginAssistanceRequestData";
import { AxiosError, AxiosResponse } from "axios";
import { StaticServiceMethods } from "../common";

export class UsersService {

	static async postRequestPasswordResetAsync(data: ILoginAssistanceRequestData): Promise<IServicePayload> {
		const result: IServicePayload = {};
		
		try {
			const response = await UsersConnector.postRequestPasswordResetAsync(data) as AxiosResponse;
			
			if (response.data.isSuccess) {
				result.isSuccess = response.data.isSuccess;
				result.message = response.data.message;
			} else {
				result.isSuccess = response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(response);
			}	
		} catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("error: ", error);
			}
			if (error instanceof AxiosError && error.response) {
				result.isSuccess = error.response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(error.response);
			} else {
				result.isSuccess = false;
			}
		}

    return result;
	}
}