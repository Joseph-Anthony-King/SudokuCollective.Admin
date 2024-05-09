import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/solutionsPort/endpoints';
import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';
import { abortSignal } from '@/ports/common';

export class SolutionsPort {
  static async postSolveAsync(matrix: ISudokuRequestData): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'post',
        url: Endpoints.solveEndpoint,
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
        signal: abortSignal(30000),
      };
      return axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }

  static async getGenerateAsync(): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: Endpoints.generateEndpoint,
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
}
