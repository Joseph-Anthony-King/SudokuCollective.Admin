import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/loginPort/endpoints';
import type { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';

export class LoginPort {
  static async postLoginAsync(
    data: ILoginRequestData,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
      const config = {
        method: 'post',
        url: `${Endpoints.loginEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          userName: data.userName,
          password: data.password,
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

  static async postConfirmUserNameAsync(
    email: string,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
      const config = {
        method: 'post',
        url: `${Endpoints.confirmUserNameEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          email: email,
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
