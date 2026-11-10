import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from './endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';

export class AdminPort {
  static async getStatsAsync(
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
        url: `${Endpoints.adminEndpoint}`,
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
      return await axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
