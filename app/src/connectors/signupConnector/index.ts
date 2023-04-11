import { ISignupRequestData } from "@/interfaces/requests/iSignupRequestData";
import { Endpoints } from "@/connectors/signupConnector/endpoints";
import axios, { AxiosError, AxiosResponse } from "axios";

export class SignupConnector {
	static async postAsync(data: ISignupRequestData): Promise<AxiosResponse | AxiosError> {
		try {
			const config = {
				method: 'post',
				url: Endpoints.signupEndpoint,
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				data: {
					license: process.env.VUE_APP_LICENSE,
					userName: data.userName,
					firstName: data.firstName,
					lastName: data.lastName,
					nickName: data.nickName,
					email: data.email,
					password: data.password,
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
