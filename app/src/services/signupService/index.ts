import { AxiosError, type AxiosResponse } from 'axios';
import { SignupPort } from '@/ports/signupPort';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import type { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';
import { User } from '@/models/domain/user';
import { StaticServiceMethods } from '@/services/common';

export class SignupService {
  static async postAsync(data: ISignupRequestData): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await SignupPort.postAsync(data)) as AxiosResponse;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

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
          true,
          true,
        );
        result.token = response.data.payload[0].token;
        result.tokenExpirationDate = response.data.payload[0].tokenExpirationDate;
      } else {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        StaticServiceMethods.processFailedResponse(response);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      if ((<AxiosError>(<unknown>error)).response !== undefined) {
        result.isSuccess = (<any>(<AxiosError>(<unknown>error)).response!.data).isSuccess;
        result.message = (<any>(<AxiosError>(<unknown>error)).response!.data).message;
        StaticServiceMethods.processFailedResponse((<AxiosError>(<unknown>error)).response);
      } else {
        result.isSuccess = false;
        result.message = (<Error>error).message;
      }
    }

    return result;
  }
}
