import { AxiosError } from 'axios';
import { RolesPort } from '@/ports/rolesPort';
import { IRole } from '@/interfaces/domain/iRole';
import { IRoleRequestData } from '@/interfaces/requests/iRoleRequestData';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { StaticServiceMethods } from '../common';

export class RolesService {
  static getRoleAsync = async (roleId: number): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await RolesPort.getRoleAsync(roleId)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.role = response.data.payload[0] as IRole;
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

  static getRolesAsync = async (): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await RolesPort.getRolesAsync()) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.roles = response.data.payload as IRole[];
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

  static postRoleAsync = async (data: IRoleRequestData): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await RolesPort.postRoleAsync(data)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.role = response.data.payload[0] as IRole;
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

  static putRoleAsync = async (data: IRoleRequestData): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await RolesPort.putRoleAsync(data)) as any;

      if ((<AxiosError>(<unknown>response)).response !== undefined || response instanceof Error) {
        throw response;
      }

      if (response.data.isSuccess) {
        result.role = response.data.payload[0] as IRole;
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

  static deleteRoleAsync = async (roleId: number): Promise<IServicePayload> => {
    const result: IServicePayload = {};

    try {
      const response = (await RolesPort.deleteRoleAsync(roleId)) as any;

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
