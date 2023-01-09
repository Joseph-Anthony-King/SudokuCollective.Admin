import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from "@/connectors/usersConnector/endpoints";
import { ILoginAssistanceRequestData } from "@/interfaces/requests/ilLoginAssistanceRequestData";

export class UsersConnector {
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
