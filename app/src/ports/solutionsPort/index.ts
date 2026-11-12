import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/solutionsPort/endpoints';
import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';
import { abortSignal } from '@/ports/common';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';

export class SolutionsPort {
  static async postSolveAsync(
    matrix: ISudokuRequestData,
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
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
      return await axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }

  static async getGenerateAsync(
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }
      const config = {
        method: 'get',
        url: Endpoints.generateEndpoint,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      };
      return await axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }

  static async postAddSolutionsAsync(
    testErrorHandling: boolean | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      if (testErrorHandling) {
        throw new Error(`testErrorHandling is ${testErrorHandling}, testing error handling...`);
      }

      const globalStore = useGlobalStore();
      const userStore = useUserStore();

      const config = {
        method: 'post',
        url: `${Endpoints.addSolutionsEndpoint}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${globalStore.getToken}`,
        },
        data: {
          license: process.env.VITE_APP_LICENSE,
          requestorId: userStore.getUser.id as number,
          appId: process.env.VITE_APP_ID as unknown as number,
          paginator: {},
          payload: {
            limit: 100,
          },
        },
      };
      return await axios(config);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('error: ', error);
      }
      return error as AxiosError;
    }
  }
}
