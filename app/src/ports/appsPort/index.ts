import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from './endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import type { IUpdateAppRequestData } from '@/interfaces/requests/iUpdateAppRequestData';

export class AppsPort {
  static async putUpdateAppAsync(data: IUpdateAppRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'put',
        url: `${Endpoints.appsEndpoint}/${data.id}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VITE_APP_ID as unknown as number,
          paginator: {},
          payload: {
            name: data.name,
            license: data.license,
            ownerId: data.ownerId,
            localUrl: data.localUrl,
            testUrl: data.testUrl,
            stagingUrl: data.stagingUrl,
            prodUrl: data.prodUrl,
            sourceCodeUrl: data.sourceCodeUrl,
            isActive: data.isActive,
            environment: data.environment,
            permitSuperUserAccess: data.permitSuperUserAccess,
            permitCollectiveLogins: data.permitCollectiveLogins,
            disableCustomUrls: data.disableCustomUrls,
            customEmailConfirmationAction: data.customEmailConfirmationAction,
            customPasswordResetAction: data.customPasswordResetAction,
            useCustomSMTPServer: data.useCustomSMTPServer,
            smtpServerSettings: data.smtpServerSettings,
            timeFrame: data.timeFrame,
            accessDuration: data.accessDuration,
          },
        },
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }

  static async getMyAppsAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'post',
        url: `${Endpoints.getMyAppsEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VITE_APP_ID as unknown as number,
          paginator: {},
          payload: {},
        },
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }

  static async getMyRegisteredAppsAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'post',
        url: `${Endpoints.getMyRegisteredAppsEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VITE_APP_ID as unknown as number,
          paginator: {},
          payload: {},
        },
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
