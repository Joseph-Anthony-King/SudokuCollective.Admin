import { type AxiosResponse, AxiosError } from 'axios';
import { LoginPort } from '@/ports/loginPort';
import type { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { User } from '@/models/domain/user';
import { StaticServiceMethods } from '@/services/common';

export class LoginService {
  static async postLoginAsync(data: ILoginRequestData): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await LoginPort.postLoginAsync(data)) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

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
        );
        result.token = response.data.payload[0].token;
        result.tokenExpirationDate = response.data.payload[0].tokenExpirationDate;
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

  static async postConfirmUserNameAsync(email: string): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const stringIsNullOrEmpty = StaticServiceMethods.stringCannotBeEmptyOrNull(email);

      if (stringIsNullOrEmpty !== null) {
        throw stringIsNullOrEmpty;
      }

      const response = (await LoginPort.postConfirmUserNameAsync(email)) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.confirmedUserName = response.data.payload[0].userName;
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
