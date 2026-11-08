import { AxiosError } from 'axios';
import { DifficultiesPort } from '@/ports/difficultiesPort';
import { IDifficulty } from '@/interfaces/domain/iDifficulty';
import { IDifficultyRequestData } from '@/interfaces/requests/iDifficultyRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { StaticServiceMethods } from '../common';

export class DifficultiesService {
  static getDifficultyAsync = async (difficultyId: number): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await DifficultiesPort.getDifficultyAsync(difficultyId)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.difficulty = response.data.payload[0] as IDifficulty;
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

  static getDifficultiesAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await DifficultiesPort.getDifficultiesAsync()) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.difficulties = response.data.payload as IDifficulty[];
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

  static postDifficultyAsync = async (data: IDifficultyRequestData): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await DifficultiesPort.postDifficultyAsync(data)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.difficulty = response.data.payload[0] as IDifficulty;
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

  static putDifficultyAsync = async (data: IDifficultyRequestData): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await DifficultiesPort.putDifficultyAsync(data)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.difficulty = response.data.payload[0] as IDifficulty;
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

  static deleteDifficultyAsync = async (difficultyId: number): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await DifficultiesPort.deleteDifficultyAsync(difficultyId)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (!response.data.isSuccess) {
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
