import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from '@/connectors/loginConnector/endpoints';
import { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';
import { ILoginAssistanceRequestData } from '@/interfaces/requests/ilLoginAssistanceRequestData';

export class LoginConnector {
	static async postLoginAsync(data: ILoginRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'post',
        url: `${Endpoints.loginEndpoint}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
				},
				data: {
					'license': process.env.VUE_APP_LICENSE,
					'userName': data.userName,
					'password': data.password
				}
      }
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
	}

  static async postConfirmUserNameAsync(data: ILoginAssistanceRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'post',
        url: `${Endpoints.confirmUserNameEndpoint}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
				},
				data: {
					'license': process.env.VUE_APP_LICENSE,
					'email': data.email,
				}
      }
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
