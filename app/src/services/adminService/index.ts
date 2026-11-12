import { AxiosError, AxiosResponse } from 'axios';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { StaticServiceMethods } from '@/services/common';
import { AdminPort } from '@/ports/adminPort';
import { IAdminSummary } from '@/interfaces/infrastructure/iAdminSummary';

export class AdminService {
  static getStatsAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await AdminPort.getStatsAsync()) as AxiosResponse;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.adminSummary = response.data.payload[0] as IAdminSummary;
      } else {
        throw new Error(response.data.message);
      }

      result.isSuccess = response.data.isSuccess;
      result.message = response.data.message;
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
  };

  static postFlushCacheAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await AdminPort.postFlushCacheAsync()) as AxiosResponse;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        // No specific payload expected for flush cache
      } else {
        throw new Error(response.data.message);
      }

      result.isSuccess = response.data.isSuccess;
      result.message = response.data.message;
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
  };
}
