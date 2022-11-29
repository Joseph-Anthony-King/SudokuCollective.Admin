import axios from 'axios';
import { Endpoints } from '@/connectors/solutionsConnector/endpoints';
import { ISudokuRequestData } from '@/interfaces/infrastructure/iSudokuRequestData';

export class SolutionsConnector {
	// eslint-disable-next-line
	static async postSolveAsync(matrix: ISudokuRequestData): Promise<any> {
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
				console.log(error);
			}
			return error;
		}
	}

	// eslint-disable-next-line
	static async getGenerateAsync(): Promise<any> {
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
				console.log(error);
			}
			return error;
		}
	}
}
