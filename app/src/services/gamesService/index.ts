/* eslint-disable @typescript-eslint/no-explicit-any*/
import { type AxiosResponse, AxiosError } from 'axios';
import { GamesPort } from '@/ports/gamesPort';
import { SolutionsPort } from '@/ports/solutionsPort';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';
import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';
import { SudokuRequestData } from '@/models/requests/sudokuRequestData';
import { StaticServiceMethods } from '@/services/common';

export class GamesService {
  static async createGameAsync(difficultyLevel: number): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const idIsZero: AxiosError | null = StaticServiceMethods.numberCannotBeZero(difficultyLevel);

      if (idIsZero !== null) {
        throw idIsZero;
      }

      const response = (await GamesPort.getCreateGameAsync(difficultyLevel)) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

      if (response.data.isSuccess) {
        const game: Array<Array<string>> = Array<Array<string>>();
        for (let i = 0; i < 9; i++) {
          game[i] = [];
          for (let j = 0; j < 9; j++) {
            game[i][j] = '';
          }
        }
        let rowIndex = 0;
        response.data.payload[0].rows.forEach((row: Array<number>) => {
          let cellIndex = 0;
          row.forEach((integer) => {
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

  static async checkGameAsync(matrix: Array<Array<string>>): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const matrixNotValid: AxiosError | null = this.sudokuMatixIsNotValid(matrix);

      if (matrixNotValid !== null) {
        throw matrixNotValid;
      }

      const data: ISudokuRequestData = new SudokuRequestData();

      for (let i = 0; i < 9; i++) {
        if (i === 0) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.firstRow[j] = parseInt(matrix[i][j]);
            } else {
              data.firstRow[j] = 0;
            }
          }
        } else if (i === 1) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.secondRow[j] = parseInt(matrix[i][j]);
            } else {
              data.secondRow[j] = 0;
            }
          }
        } else if (i === 2) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.thirdRow[j] = parseInt(matrix[i][j]);
            } else {
              data.thirdRow[j] = 0;
            }
          }
        } else if (i === 3) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.fourthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.fourthRow[j] = 0;
            }
          }
        } else if (i === 4) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.fifthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.fifthRow[j] = 0;
            }
          }
        } else if (i === 5) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.sixthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.sixthRow[j] = 0;
            }
          }
        } else if (i === 6) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.seventhRow[j] = parseInt(matrix[i][j]);
            } else {
              data.seventhRow[j] = 0;
            }
          }
        } else if (i === 7) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.eighthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.eighthRow[j] = 0;
            }
          }
        } else if (i === 8) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.ninthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.ninthRow[j] = 0;
            }
          }
        }
      }

      const response = (await GamesPort.postCheckGameAsync(data)) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

      result.isSuccess = response.data.isSuccess;
      result.message = response.data.message.substring(17);
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

  static async solvePuzzleAsync(matrix: Array<Array<string>>): Promise<IServicePayload> {
    const result: IServicePayload = {};

    try {
      const matrixNotValid: AxiosError | null = this.sudokuMatixIsNotValid(matrix);

      if (matrixNotValid !== null) {
        throw matrixNotValid;
      }

      const data: ISudokuRequestData = new SudokuRequestData();

      for (let i = 0; i < 9; i++) {
        if (i === 0) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.firstRow[j] = parseInt(matrix[i][j]);
            } else {
              data.firstRow[j] = 0;
            }
          }
        } else if (i === 1) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.secondRow[j] = parseInt(matrix[i][j]);
            } else {
              data.secondRow[j] = 0;
            }
          }
        } else if (i === 2) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.thirdRow[j] = parseInt(matrix[i][j]);
            } else {
              data.thirdRow[j] = 0;
            }
          }
        } else if (i === 3) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.fourthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.fourthRow[j] = 0;
            }
          }
        } else if (i === 4) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.fifthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.fifthRow[j] = 0;
            }
          }
        } else if (i === 5) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.sixthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.sixthRow[j] = 0;
            }
          }
        } else if (i === 6) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.seventhRow[j] = parseInt(matrix[i][j]);
            } else {
              data.seventhRow[j] = 0;
            }
          }
        } else if (i === 7) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.eighthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.eighthRow[j] = 0;
            }
          }
        } else if (i === 8) {
          for (let j = 0; j < 9; j++) {
            if (matrix[i][j] !== '') {
              data.ninthRow[j] = parseInt(matrix[i][j]);
            } else {
              data.ninthRow[j] = 0;
            }
          }
        }
      }

      const response = (await SolutionsPort.postSolveAsync(data)) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

      result.isSuccess = response.data.isSuccess;
      result.message = response.data.message.substring(17);

      if (response.data.isSuccess) {
        const solvedPuzzle = Array<Array<string>>(9);
        for (let i = 0; i < 9; i++) {
          solvedPuzzle[i] = [];
          for (let j = 0; j < 9; j++) {
            solvedPuzzle[i][j] = response.data.payload[0].rows[i][j].toString();
          }
        }
        result.puzzle = solvedPuzzle;
      }
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
      const response = (await SolutionsPort.getGenerateAsync()) as AxiosResponse;

      if (response instanceof Error) {
        throw response as unknown as AxiosError;
      }

      result.isSuccess = response.data.isSuccess;
      result.message = response.data.message;

      if (response.data.isSuccess) {
        const solution = Array<Array<string>>(9);
        for (let i = 0; i < 9; i++) {
          solution[i] = [];
          for (let j = 0; j < 9; j++) {
            solution[i][j] = response.data.payload[0].rows[i][j].toString();
          }
        }
        result.solution = solution;
      }
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

  static sudokuMatixIsNotValid(matrix: Array<Array<string>>): AxiosError | null {
    if (matrix.length !== 9 || matrix.filter((row) => row.length !== 9).length > 0) {
      const axiosError = {
        config: {},
        request: {},
        response: {
          status: 500,
          data: {
            isSuccess: false,
            message: 'Sudoku matrix is not valid',
          },
        },
      } as AxiosError;
      return axiosError;
    } else {
      return null;
    }
  }
}
