import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from "@/connectors/usersConnector/endpoints";
import { ILoginAssistanceRequestData } from "@/interfaces/requests/ilLoginAssistanceRequestData";
import { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';
import { useAppStore} from '@/store/appStore';
import { useUserStore } from '@/store/userStore/index'

export class UsersConnector {
  static async getUserAsync(id: number): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: 'post',
        url: `${Endpoints.usersEndpoint}/${id}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${appStore.getToken}`,
				},
				data: {
					'license': process.env.VUE_APP_LICENSE,
          'requestorId': userStore.getUser.id,
          'appId': process.env.VUE_APP_ID,
          'paginator': {},
          'payload': { }
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

  static async putUpdateUserAsync(data: IUpdateUserRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: 'put',
        url: `${Endpoints.usersEndpoint}/${userStore.getUser.id}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${appStore.getToken}`,
				},
				data: {
					'license': process.env.VUE_APP_LICENSE,
          'requestorId': userStore.getUser.id,
          'appId': process.env.VUE_APP_ID,
          'paginator': {},
          'payload': {
            'userName': data.userName,
            'firstName': data.firstName,
            'lastName': data.lastName,
            'nickName': data.nickName,
            'email': data.email
          }
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

  static async deleteUserAsync(id: number): Promise<AxiosResponse | AxiosError> {
    try {
      const appStore = useAppStore();
      const userStore = useUserStore();

      const config = {
        method: 'delete',
        url: `${Endpoints.usersEndpoint}/${id}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${appStore.getToken}`,
				},
				data: {
					'license': process.env.VUE_APP_LICENSE,
          'requestorId': userStore.getUser.id,
          'appId': process.env.VUE_APP_ID,
          'paginator': {},
          'payload': { }
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

	static async postRequestPasswordResetAsync(data: ILoginAssistanceRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'post',
        url: `${Endpoints.requestPasswordResetEndpoint}`,
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
