import { GamesConnector } from '@/connectors/gamesConnector';
import { SolutionsConnector } from '@/connectors/solutionsConnector';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';
import { SudokuRequestData } from '@/models/requests/sudokuRequestData';
import { AxiosResponse, AxiosError } from 'axios';
import { StaticServiceMethods } from '../common';

export class GamesService {
	static async createGameAsync(difficultyLevel: number): Promise<IServicePayload> {
    const result: IServicePayload = {};
		
		try {
			const response = await GamesConnector.getCreateGameAsync(difficultyLevel) as AxiosResponse;
			
			if (response.data.isSuccess) {
				const game: Array<Array<string>> = Array<Array<string>>();
				for (let i = 0; i < 9; i++) {
					game[i] = [];
					for(let j = 0; j < 9; j++) {
						game[i][j] = '';
					}
				}
				let rowIndex = 0;
				response.data.payload[0].rows.forEach((row: Array<number>) => {
					let cellIndex = 0;
					row.forEach(integer => {
						if (integer !== 0) {
							game[rowIndex][cellIndex] = integer.toString();
						}
						cellIndex++;
					});
					rowIndex++;
				});
				result.game = game;
			}
		} catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
			if (error instanceof AxiosError && error.response) {
				result.isSuccess = error.response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(error.response);
			} else {
				result.isSuccess = false;
			}
    }

		return result;
	}

	static async checkGameAsync(game: Array<Array<string>>): Promise<IServicePayload> {
    const result: IServicePayload = {};

		try {
			const data: ISudokuRequestData = new SudokuRequestData();

			for (let i = 0; i < 9; i++) {
				if (i === 0) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.firstRow[j] = parseInt(game[i][j]);
						} else {
							data.firstRow[j] = 0;
						}
					}
				} else if (i === 1) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.secondRow[j] = parseInt(game[i][j]);
						} else {
							data.secondRow[j] = 0;
						}
					}
				} else if (i === 2) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.thirdRow[j] = parseInt(game[i][j]);
						} else {
							data.thirdRow[j] = 0;
						}
					}
				} else if (i === 3) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.fourthRow[j] = parseInt(game[i][j]);
						} else {
							data.fourthRow[j] = 0;
						}
					}
				} else if (i === 4) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.fifthRow[j] = parseInt(game[i][j]);
						} else {
							data.fifthRow[j] = 0;
						}
					}
				} else if (i === 5) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.sixthRow[j] = parseInt(game[i][j]);
						} else {
							data.sixthRow[j] = 0;
						}
					}
				} else if (i === 6) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.seventhRow[j] = parseInt(game[i][j]);
						} else {
							data.seventhRow[j] = 0;
						}
					}
				} else if (i === 7) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.eighthRow[j] = parseInt(game[i][j]);
						} else {
							data.eighthRow[j] = 0;
						}
					}
				} else if (i === 8) {
					for (let j = 0; j < 9; j++) {
						if (game[i][j] !== '') {
							data.ninthRow[j] = parseInt(game[i][j]);
						} else {
							data.ninthRow[j] = 0;
						}
					}
				}
			}

			const response = await GamesConnector.postCheckGameAsync(data) as AxiosResponse;
			
			result.isSuccess = response.data.isSuccess;
			result.message = response.data.message.substring(17);

			// eslint-disable-next-line
		} catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
			if (error instanceof AxiosError && error.response) {
				result.isSuccess = error.response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(error.response);
			} else {
				result.isSuccess = false;
			}
		}

		return result;
	}

	static async solvePuzzleAsync(puzzle: Array<Array<string>>): Promise<IServicePayload> {
    const result: IServicePayload = {};

		try {
			const data: ISudokuRequestData = new SudokuRequestData();

			for (let i = 0; i < 9; i++) {
				if (i === 0) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.firstRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.firstRow[j] = 0;
						}
					}
				} else if (i === 1) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.secondRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.secondRow[j] = 0;
						}
					}
				} else if (i === 2) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.thirdRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.thirdRow[j] = 0;
						}
					}
				} else if (i === 3) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.fourthRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.fourthRow[j] = 0;
						}
					}
				} else if (i === 4) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.fifthRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.fifthRow[j] = 0;
						}
					}
				} else if (i === 5) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.sixthRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.sixthRow[j] = 0;
						}
					}
				} else if (i === 6) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.seventhRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.seventhRow[j] = 0;
						}
					}
				} else if (i === 7) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.eighthRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.eighthRow[j] = 0;
						}
					}
				} else if (i === 8) {
					for (let j = 0; j < 9; j++) {
						if (puzzle[i][j] !== '') {
							data.ninthRow[j] = parseInt(puzzle[i][j]);
						} else {
							data.ninthRow[j] = 0;
						}
					}
				}
			}

			const response = await SolutionsConnector.postSolveAsync(data) as AxiosResponse;

			result.isSuccess = response.data.isSuccess;
			result.message = response.data.message.substring(17);
			
			if (response.data.isSuccess) {
				const solvedPuzzle = Array<Array<string>>(9);
				for (let i = 0; i < 9; i++) {
					solvedPuzzle[i] = []
					for (let j = 0; j < 9; j++) {
						solvedPuzzle[i][j] = response.data.payload[0].rows[i][j].toString();
					}
				}
				result.puzzle = solvedPuzzle;
			}
			
			// eslint-disable-next-line
		} catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
			if (error instanceof AxiosError && error.response) {
				result.isSuccess = error.response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(error.response);
			} else {
				result.isSuccess = false;
			}
		}
		
		return result;
	}

	static async generateSolutionAsync(): Promise<IServicePayload> {
    const result: IServicePayload = {};

		try {

			const response = await SolutionsConnector.getGenerateAsync() as AxiosResponse;

			result.isSuccess = response.data.isSuccess;
			result.message = response.data.message;
			
			if (response.data.isSuccess) {
				const solution = Array<Array<string>>(9);
				for (let i = 0; i < 9; i++) {
					solution[i] = []
					for (let j = 0; j < 9; j++) {
						solution[i][j] = response.data.payload[0].rows[i][j].toString();
					}
				}
				result.solution = solution;
			}
			
			// eslint-disable-next-line
		} catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
			if (error instanceof AxiosError && error.response) {
				result.isSuccess = error.response.data.isSuccess;
				StaticServiceMethods.processFailedResponse(error.response);
			} else {
				result.isSuccess = false;
			}
		}
		
		return result;
	}
}
