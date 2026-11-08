import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from './endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import { IDifficultyRequestData } from '@/interfaces/requests/iDifficultyRequestData';

export class DifficultiesPort {
  static async getDifficultyAsync(
    difficultyId: number,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();

      const config = {
        method: 'get',
        url: `${Endpoints.difficultiesEndpoint}/${difficultyId}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
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

  static async getDifficultiesAsync(
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();

      const config = {
        method: 'get',
        url: `${Endpoints.difficultiesEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
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

  static async postDifficultyAsync(
    data: IDifficultyRequestData,
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
        url: `${Endpoints.difficultiesEndpoint}`,
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
            id: data.id,
            name: data.name,
            displayName: data.displayName,
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

  static async putDifficultyAsync(
    data: IDifficultyRequestData,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'put',
        url: `${Endpoints.difficultiesEndpoint}/${data.id}`,
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
            id: data.id,
            name: data.name,
            displayName: data.displayName,
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

  static async deleteDifficultyAsync(
    difficultyId: number,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();

      const config = {
        method: 'delete',
        url: `${Endpoints.difficultiesEndpoint}/${difficultyId}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
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
