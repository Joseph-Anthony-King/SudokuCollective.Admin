import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { AxiosError, AxiosResponse } from 'axios';
import { SolutionsPort } from '@/ports/solutionsPort/index';
import { Endpoints } from '@/ports/solutionsPort/endpoints';
import { SudokuRequestData } from '@/models/requests/sudokuRequestData';

describe('the solutionsPort port', () => {
  let testingPinia: TestingPinia;
  let testServer: SetupServerApi | null;
  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    setActivePinia(testingPinia);
  });
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.solveEndpoint).equals('https://localhost:5001/api/v1/solutions/solve');
    expect(Endpoints.generateEndpoint).equals('https://localhost:5001/api/v1/solutions/generate');
  });
  it('should solve unfinished sudoku matrices by running the postSolveAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/solutions/solve', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 201: Sudoku solution was found.',
          payload: [
            {
              rows: [
                [ 9, 2, 1, 7, 5, 6, 3, 8, 4 ],
                [ 3, 4, 8, 2, 1, 9, 5, 7, 6 ],
                [ 5, 6, 7, 3, 4, 8, 2, 9, 1 ],
                [ 6, 7, 3, 1, 2, 4, 9, 5, 8 ],
                [ 2, 1, 5, 9, 8, 7, 4, 6, 3 ],
                [ 8, 9, 4, 6, 3, 5, 1, 2, 7 ],
                [ 7, 3, 2, 5, 6, 1, 8, 4, 9 ],
                [ 1, 8, 9, 4, 7, 2, 6, 3, 5 ],
                [ 4, 5, 6, 8, 9, 3, 7, 1, 2 ]
              ]
            }
          ]
        }, {
          status: 201,
          statusText: 'CREATED',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
    );

    testServer.listen();

    const sut = SolutionsPort;

    const sudokuRequestData = new SudokuRequestData (
      [ 0, 2, 0, 0, 0, 6, 0, 0, 4 ],
      [ 0, 4, 0, 2, 1, 0, 5, 0, 0 ],
      [ 0, 0, 0, 3, 0, 8, 2, 0, 0 ],
      [ 6, 0, 3, 1, 0, 0, 0, 0, 0 ],
      [ 0, 1, 0, 9, 8, 7, 0, 6, 0 ],
      [ 0, 0, 0, 0, 0, 5, 1, 0, 7 ],
      [ 0, 0, 2, 5, 0, 1, 0, 0, 0 ],
      [ 0, 0, 9, 0, 7, 2, 0, 3, 0 ],
      [ 4, 0, 0, 8, 0, 0, 0, 1, 0 ]);

    // Act
    const result = await sut.postSolveAsync(sudokuRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 201: Sudoku solution was found.');
    expect(result.data.payload[0].rows.length).equals(9);
  });
  it('should catch AxiosErrors thrown when running the postSolveAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/solutions/solve', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 400: First row is invalid.',
            payload: []
          }, {
            status: 400,
            statusText: 'BAD REQUEST',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = SolutionsPort;
  
      const sudokuRequestData = new SudokuRequestData (
        [ 0, 2, 0, 0, 0, 6, 0, 0, 4, 0 ],
        [ 0, 4, 0, 2, 1, 0, 5, 0, 0 ],
        [ 0, 0, 0, 3, 0, 8, 2, 0, 0 ],
        [ 6, 0, 3, 1, 0, 0, 0, 0, 0 ],
        [ 0, 1, 0, 9, 8, 7, 0, 6, 0 ],
        [ 0, 0, 0, 0, 0, 5, 1, 0, 7 ],
        [ 0, 0, 2, 5, 0, 1, 0, 0, 0 ],
        [ 0, 0, 9, 0, 7, 2, 0, 3, 0 ],
        [ 4, 0, 0, 8, 0, 0, 0, 1, 0 ]);
      
      // Act
      await sut.postSolveAsync(sudokuRequestData) as AxiosResponse;
      
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 400: First row is invalid.');
    }
  });
  it('should catch any errors thrown when running the postSolveAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/solutions/solve', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 201: Sudoku solution was found.',
            payload: [
              {
                rows: [
                  [ 9, 2, 1, 7, 5, 6, 3, 8, 4 ],
                  [ 3, 4, 8, 2, 1, 9, 5, 7, 6 ],
                  [ 5, 6, 7, 3, 4, 8, 2, 9, 1 ],
                  [ 6, 7, 3, 1, 2, 4, 9, 5, 8 ],
                  [ 2, 1, 5, 9, 8, 7, 4, 6, 3 ],
                  [ 8, 9, 4, 6, 3, 5, 1, 2, 7 ],
                  [ 7, 3, 2, 5, 6, 1, 8, 4, 9 ],
                  [ 1, 8, 9, 4, 7, 2, 6, 3, 5 ],
                  [ 4, 5, 6, 8, 9, 3, 7, 1, 2 ]
                ]
              }
            ]
          }, {
            status: 201,
            statusText: 'CREATED',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = SolutionsPort;
  
      const sudokuRequestData = new SudokuRequestData (
        [ 0, 2, 0, 0, 0, 6, 0, 0, 4 ],
        [ 0, 4, 0, 2, 1, 0, 5, 0, 0 ],
        [ 0, 0, 0, 3, 0, 8, 2, 0, 0 ],
        [ 6, 0, 3, 1, 0, 0, 0, 0, 0 ],
        [ 0, 1, 0, 9, 8, 7, 0, 6, 0 ],
        [ 0, 0, 0, 0, 0, 5, 1, 0, 7 ],
        [ 0, 0, 2, 5, 0, 1, 0, 0, 0 ],
        [ 0, 0, 9, 0, 7, 2, 0, 3, 0 ],
        [ 4, 0, 0, 8, 0, 0, 0, 1, 0 ]);
      
      // Act
      await sut.postSolveAsync(sudokuRequestData, true) as AxiosResponse;
      
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should generate completed sudoku matrices by running the getGenerateAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.get('https://localhost:5001/api/v1/solutions/generate', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Solution was generated.',
          payload: [
            {
              rows: [
                [ 9, 2, 1, 7, 5, 6, 3, 8, 4 ],
                [ 3, 4, 8, 2, 1, 9, 5, 7, 6 ],
                [ 5, 6, 7, 3, 4, 8, 2, 9, 1 ],
                [ 6, 7, 3, 1, 2, 4, 9, 5, 8 ],
                [ 2, 1, 5, 9, 8, 7, 4, 6, 3 ],
                [ 8, 9, 4, 6, 3, 5, 1, 2, 7 ],
                [ 7, 3, 2, 5, 6, 1, 8, 4, 9 ],
                [ 1, 8, 9, 4, 7, 2, 6, 3, 5 ],
                [ 4, 5, 6, 8, 9, 3, 7, 1, 2 ]
              ]
            }
          ]
        }, {
          status: 200,
          statusText: 'OK',
          headers: {
            'content-type': 'application/json'
          }
        })
      })
    );

    testServer.listen();

    const sut = SolutionsPort;

    // Act
    const result = await sut.getGenerateAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Solution was generated.');
    expect(result.data.payload[0].rows.length).equals(9);
  });
  it('should catch AxiosErrors thrown when running the getGenerateAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/solutions/generate', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Service not available.',
            payload: []
          }, {
            status: 404,
            statusText: 'NOT FOUND',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = SolutionsPort;
  
      // Act
      await sut.getGenerateAsync() as AxiosResponse;

    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Service not available.');
    }
  });
  it('should catch any errors thrown when running the getGenerateAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/solutions/generate', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Solution was generated.',
            payload: [
              {
                rows: [
                  [ 9, 2, 1, 7, 5, 6, 3, 8, 4 ],
                  [ 3, 4, 8, 2, 1, 9, 5, 7, 6 ],
                  [ 5, 6, 7, 3, 4, 8, 2, 9, 1 ],
                  [ 6, 7, 3, 1, 2, 4, 9, 5, 8 ],
                  [ 2, 1, 5, 9, 8, 7, 4, 6, 3 ],
                  [ 8, 9, 4, 6, 3, 5, 1, 2, 7 ],
                  [ 7, 3, 2, 5, 6, 1, 8, 4, 9 ],
                  [ 1, 8, 9, 4, 7, 2, 6, 3, 5 ],
                  [ 4, 5, 6, 8, 9, 3, 7, 1, 2 ]
                ]
              }
            ]
          }, {
            status: 200,
            statusText: 'OK',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();

      vi.stubEnv('NODE_ENV', 'development');
  
      const sut = SolutionsPort;
  
      // Act
      await sut.getGenerateAsync(true) as AxiosResponse;

    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
