import { AxiosError, type AxiosResponse } from 'axios';
import { SignupPort } from '@/ports/signupPort';
import { UsersPort } from '@/ports/usersPort';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import type { IResetPasswordRequestData } from '@/interfaces/requests/iResetPasswordRequestData';
import type { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';
import { User } from '@/models/domain/user';
import { ConfirmEmailResultData } from '@/models/results/confirmEmailResultData';
import { StaticServiceMethods } from '@/services/common';

export class UsersService {
  static async getUserAsync(id: number): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const idIsZero: AxiosError | null = StaticServiceMethods.numberCannotBeZero(id);

      if (idIsZero !== null) {
        throw idIsZero;
      }

      const response = (await UsersPort.getUserAsync(id)) as AxiosResponse;

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        result.user = new User(
          response.data.payload[0].id,
          response.data.payload[0].userName,
          response.data.payload[0].firstName,
          response.data.payload[0].lastName,
          response.data.payload[0].nickName,
          response.data.payload[0].fullName,
          response.data.payload[0].email,
          response.data.payload[0].isEmailConfirmed,
          response.data.payload[0].receivedRequestToUpdateEmail,
          response.data.payload[0].receivedRequestToUpdatePassword,
          response.data.payload[0].isActive,
          response.data.payload[0].isSuperUser,
          response.data.payload[0].isAdmin,
          response.data.payload[0].dateCreated,
          response.data.payload[0].dateUpdated,
          true,
        );
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

    try {
      const response = (await UsersPort.putUpdateUserAsync(data)) as AxiosResponse;

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
        );
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

  static async deleteUserAsync(id: number): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const idIsZero: AxiosError | null = StaticServiceMethods.numberCannotBeZero(id);

      if (idIsZero !== null) {
        throw idIsZero;
      }

      const response = (await UsersPort.deleteUserAsync(id)) as AxiosResponse;

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

  static async getConfirmEmailAsync(token: string): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await UsersPort.getConfirmEmailAsync(token)) as AxiosResponse;

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        result.data = new ConfirmEmailResultData(
          response.data.payload[0].confirmationType,
          response.data.payload[0].userName,
          response.data.payload[0].email,
        );
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

  static async putResendEmailConfirmationAsync(requestorId: number): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const idIsZero: AxiosError | null = StaticServiceMethods.numberCannotBeZero(requestorId);

      if (idIsZero !== null) {
        throw idIsZero;
      }

      const response = (await SignupPort.putResendEmailConfirmationAsync(
        requestorId,
      )) as AxiosResponse;

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

  static async putCancelResendEmailConfirmationAsync(): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await UsersPort.putCancelEmailConfirmationRequestAsync()) as AxiosResponse;

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
        );
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

  static async putResetPasswordAsync(data: IResetPasswordRequestData): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await UsersPort.putResetPasswordAsync(data)) as AxiosResponse;

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

  static async postRequestPasswordResetAsync(email: string): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const stringIsNullOrEmpty = StaticServiceMethods.stringCannotBeEmptyOrNull(email);

      if (stringIsNullOrEmpty !== null) {
        throw stringIsNullOrEmpty;
      }

      const response = (await UsersPort.postRequestPasswordResetAsync(email)) as AxiosResponse;

      if (response.data.isSuccess) {
        result.isSuccess = response.data.isSuccess;
        result.message = response.data.message;
        result.user = new User(
          response.data.payload[0].id,
          response.data.payload[0].userName,
          response.data.payload[0].firstName,
          response.data.payload[0].lastName,
          response.data.payload[0].nickName,
          response.data.payload[0].fullName,
          response.data.payload[0].email,
          response.data.payload[0].isEmailConfirmed,
          response.data.payload[0].receivedRequestToUpdateEmail,
          response.data.payload[0].receivedRequestToUpdatePassword,
          response.data.payload[0].isActive,
          response.data.payload[0].isSuperUser,
          response.data.payload[0].isAdmin,
          response.data.payload[0].dateCreated,
          response.data.payload[0].dateUpdated,
          true,
        );
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

  static async putResendPasswordResetAsync(userId: number): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const idIsZero: AxiosError | null = StaticServiceMethods.numberCannotBeZero(userId);

      if (idIsZero !== null) {
        throw idIsZero;
      }

      const response = (await UsersPort.putResendPasswordResetAsync(userId)) as AxiosResponse;

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

  static async putCancelPasswordResetAsync(): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await UsersPort.putCancelPasswordResetAsync()) as AxiosResponse;

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
        );
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

  static async putCancelAllEmailRequestsAsync(): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const response = (await UsersPort.putCancelAllEmailRequestsAsync()) as AxiosResponse;

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
        );
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
