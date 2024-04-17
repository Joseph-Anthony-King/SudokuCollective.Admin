import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/gamesPort/endpoints';
import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';

export class GamesPort {
  static async getCreateGameAsync(difficultyLevel: number): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: `${Endpoints.createEndpoint}${difficultyLevel}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
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
  static async postCheckGameAsync(matrix: ISudokuRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'post',
        url: Endpoints.checkEndpoint,
        headers: {
          accept: 'application/json',
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
          ninthRow: matrix.ninthRow,
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
