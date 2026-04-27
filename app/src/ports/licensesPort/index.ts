// index.ts for Licenses API integration
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from './endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { ICreateAppLicenseRequestData } from '../../interfaces/requests/iCreateAppLicenseRequestData';

export class LicensePort {
  static async createLicense(
    data: ICreateAppLicenseRequestData,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'post',
        url: Endpoints.createLicenseEndpoint,
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
            name: data.name ?? '',
            ownerId: data.ownerId ?? 0,
            localUrl: data.localUrl ?? '',
            testUrl: data.testUrl ?? '',
            stagingUrl: data.stagingUrl ?? '',
            prodUrl: data.prodUrl ?? '',
            sourceCodeUrl: data.sourceCodeUrl ?? '',
          },
        },
      };
      return await axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
