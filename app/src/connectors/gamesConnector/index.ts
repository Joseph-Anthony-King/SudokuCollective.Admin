import axios from 'axios';
import { Endpoints } from '@/connectors/gamesConnector/endpoints';
import { ISudokuRequestData } from '@/interfaces/infrastructure/iSudokuRequestData';

export class GamesConnector {
  // eslint-disable-next-line
  async getCreateGameAsync(difficultyLevel: number): Promise<any> {
    try {
      const config = {
        method: 'get',
        url: `${Endpoints.createEndpoint}${difficultyLevel}`,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
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
	async postCheckGameAsync(matrix: ISudokuRequestData): Promise<any> {
		try {
			const config = {
				method: 'post',
				url: Endpoints.checkEndpoint,
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
}
