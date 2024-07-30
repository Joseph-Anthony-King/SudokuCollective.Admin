import axios, { AxiosError, type AxiosResponse } from 'axios';
import type { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';
import { Endpoints } from '@/ports/signupPort/endpoints';

export class SignupPort {
  static async postAsync(
    data: ISignupRequestData,
    testErrorHandling: boolean | null = null
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
      const config = {
        method: 'post',
        url: Endpoints.signupEndpoint,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          nickName: data.nickName,
          email: data.email,
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

  static async putResendEmailConfirmationAsync(
    requestorId: number,
    testErrorHandling: boolean | null = null
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
      const config = {
        method: 'put',
        url: Endpoints.resendEmailConfirmationEndpoint,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          requestorId,
          appId: process.env.VITE_APP_ID as unknown as number,
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
