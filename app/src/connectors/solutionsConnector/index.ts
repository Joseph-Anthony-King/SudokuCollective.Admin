import axios, { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from '@/connectors/solutionsConnector/endpoints';
import { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';

export class SolutionsConnector {
	// eslint-disable-next-line
	static async postSolveAsync(matrix: ISudokuRequestData): Promise<AxiosResponse | AxiosError> {
		try {
			const config = {
				method: 'post',
				url: Endpoints.solveEndpoint,
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
				},
				data: {
					firstRow: matrix.firstRow,
					secondRow: matrix.secondRow,
					thirdRow: matrix.thirdRow,
					fourthRow: matrix.fourthRow,
					fifthRow: matrix.fifthRow,
					sixthRow: matrix.sixthRow,
					seventhRow: matrix.seventhRow,
					eighthRow: matrix.eighthRow,
					ninthRow: matrix.ninthRow
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

	// eslint-disable-next-line
	static async getGenerateAsync(): Promise<AxiosResponse | AxiosError> {
		try {
			const config = {
				method: 'get',
				url: Endpoints.generateEndpoint,
				headers: {
					'accept': 'application/json',
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
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
