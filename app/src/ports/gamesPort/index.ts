import axios, { AxiosError, type AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/gamesPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import type { ISudokuRequestData } from '@/interfaces/requests/iSudokuRequestData';

const controller = new AbortController();
const signal = controller.signal;

export class GamesPort {
  static async getCreateGameAsync(
    difficultyLevel: number,
    milliseconds: number | null = null,
  ): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: `${Endpoints.createEndpoint}${difficultyLevel}`,
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Keep-Alive': 'timeout=600, max=1000'
        },
        signal,
      };
      const { updateCancelApiRequestDelegate } = useGlobalStore();
      updateCancelApiRequestDelegate(this.cancelApiRequest, milliseconds);
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

  static cancelApiRequest(): void {
    controller.abort();
    location.reload();
  }
}
