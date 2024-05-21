import axios from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import { Endpoints } from '@/ports/jobsPort/endpoints';

export class JobsPort {
  static async getJobAsync(jobId: string): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: `${Endpoints.getEndpoint}${jobId}`,
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

  static async pollJobAsync(jobId: string): Promise<AxiosResponse | AxiosError> {
    try {
      const config = {
        method: 'get',
        url: `${Endpoints.pollEndpoint}${jobId}`,
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
