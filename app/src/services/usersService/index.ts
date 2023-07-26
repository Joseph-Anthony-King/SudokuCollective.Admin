import { UsersConnector } from '@/connectors/usersConnector';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';
import { AxiosError, AxiosResponse } from 'axios';
import { StaticServiceMethods } from '../common';
import { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';
import { useUserStore } from '@/store/userStore/index';
import { User } from '@/models/domain/user';

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
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
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

	static async putUpdateUserAsync(data: IUpdateUserRequestData): Promise<IServicePayload> {
		const result: IServicePayload = {};
		const userStore = useUserStore();
		
		try {
			const response = await UsersConnector.putUpdateUserAsync(data) as AxiosResponse;
			
			if (response.data.isSuccess) {
				result.isSuccess = response.data.isSuccess;
				result.message = response.data.message;
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
					true);
				userStore.updateUser(result.user);
			} else {
				result.isSuccess = response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(response);
			}	
		} catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
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