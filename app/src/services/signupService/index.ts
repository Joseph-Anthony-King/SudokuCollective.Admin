import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { ISignupRequestData } from "@/interfaces/requests/iSignupRequestData";
import { AxiosError, AxiosResponse } from "axios";
import { StaticServiceMethods } from "@/services/common";
import { SignupConnector } from "@/connectors/signupConnector";
import { User } from "@/models/domain/user";

export class SignupService {

	static async postAsync(data: ISignupRequestData): Promise<IServicePayload> {
		const result: IServicePayload = {};

		try {
			const response = await SignupConnector.postAsync(data) as AxiosResponse;
			
			if (response.data.isSuccess) {
				result.isSuccess = response.data.isSuccess;
				result.user = new User(
					response.data.payload[0].user.id,
					response.data.payload[0].user.userName,
					response.data.payload[0].user.firstName,
					response.data.payload[0].user.lastName,
					response.data.payload[0].user.nickName,
					response.data.payload[0].user.fullName,
					response.data.payload[0].user.email,
					response.data.payload[0].user.isEmailConfirmed,
					response.data.payload[0].user.receivedRequestToUpdateEmail,
					response.data.payload[0].user.receivedRequestToUpdatePassword,
					response.data.payload[0].user.isActive,
					response.data.payload[0].user.isSuperUser,
					response.data.payload[0].user.isAdmin,
					response.data.payload[0].user.dateCreated,
					response.data.payload[0].user.dateUpdated,
					true,
					true);
				result.token = response.data.payload[0].token;
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
