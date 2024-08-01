import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import { setActivePinia } from 'pinia';
import { createTestingPinia, type TestingPinia } from '@pinia/testing';
import type { AxiosError, AxiosResponse } from 'axios';
import { GamesPort } from '@/ports/gamesPort/index';
import { Endpoints } from '@/ports/gamesPort/endpoints';
import { useGlobalStore } from '@/stores/globalStore';
import { SudokuRequestData } from '@/models/requests/sudokuRequestData';

describe('the gamesPort port', () => {
  let testingPinia: TestingPinia;
  let testServer: SetupServerApi | null;
  beforeEach(() => {
    testingPinia = createTestingPinia({
      createSpy: vi.fn(),
    });
    const globalStore = useGlobalStore(testingPinia);
    globalStore.updateCancelApiRequestDelegate = vi.fn();
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
    expect(Endpoints.createEndpoint).equals('https://localhost:5001/api/v1/games/createannonymous?difficultyLevel=');
    expect(Endpoints.checkEndpoint).equals('https://localhost:5001/api/v1/games/checkannonymous');
  });
  it('should create annonymous games using the getCreateGameAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.get('https://localhost:5001/api/v1/games/createannonymous?difficultyLevel=3', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: Game was created.', 
          payload: [
            { 
              rows: [
                [ 0, 1, 0, 0, 0, 5, 0, 0, 3 ],
                [ 0, 4, 0, 3, 1, 0, 2, 0, 0 ],
                [ 0, 0, 0, 9, 0, 6, 4, 0, 0 ],
                [ 9, 0, 7, 1, 0, 0, 0, 0, 0 ],
                [ 0, 5, 0, 7, 9, 8, 0, 6, 0 ],
                [ 0, 0, 0, 0, 0, 3, 9, 0, 1 ],
                [ 0, 0, 2, 5, 0, 9, 0, 0, 0 ],
                [ 0, 0, 8, 0, 4, 1, 0, 5, 0 ],
                [ 4, 0, 0, 8, 0, 0, 0, 3, 0 ]
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

    const sut = GamesPort;

    // Act
    const result = await sut.getCreateGameAsync(3) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Game was created.');
    expect(result.data.payload[0].rows.length).equals(9);
  });
  it('should catch any errors thrown by Axios in the getCreateGameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/games/createannonymous?difficultyLevel=3', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Game was not created.', 
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
  
      const sut = GamesPort;
  
      // Act
      await sut.getCreateGameAsync(3) as AxiosResponse;
      
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Game was not created.');
    }
  });
  it('should catch any errors thrown by the getCreateGameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/v1/games/createannonymous?difficultyLevel=3', () => {
          return HttpResponse.json({
            isSuccess: true, 
            isFromCache: false, 
            message: 'Status Code 200: Game was created.', 
            payload: [
              { 
                rows: [
                  [ 0, 1, 0, 0, 0, 5, 0, 0, 3 ],
                  [ 0, 4, 0, 3, 1, 0, 2, 0, 0 ],
                  [ 0, 0, 0, 9, 0, 6, 4, 0, 0 ],
                  [ 9, 0, 7, 1, 0, 0, 0, 0, 0 ],
                  [ 0, 5, 0, 7, 9, 8, 0, 6, 0 ],
                  [ 0, 0, 0, 0, 0, 3, 9, 0, 1 ],
                  [ 0, 0, 2, 5, 0, 9, 0, 0, 0 ],
                  [ 0, 0, 8, 0, 4, 1, 0, 5, 0 ],
                  [ 4, 0, 0, 8, 0, 0, 0, 3, 0 ]
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
  
      const sut = GamesPort;
  
      // Act
      await sut.getCreateGameAsync(3, true) as AxiosResponse;
      
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should check annonymous games using the postCheckGameAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/games/checkannonymous', () => {
        return HttpResponse.json({
          isSuccess: true, 
          isFromCache: false, 
          message: 'Status Code 200: Game was solved.', 
          payload: []
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

    const sut = GamesPort;

    const sudokuRequestData = new SudokuRequestData (
      [ 5, 1, 7, 3, 2, 9, 4, 8, 6 ],
      [ 3, 4, 2, 6, 8, 1, 5, 9, 7 ],
      [ 8, 6, 9, 5, 7, 4, 1, 3, 2 ],
      [ 2, 3, 1, 9, 6, 5, 7, 4, 8 ],
      [ 9, 7, 4, 1, 3, 8, 2, 6, 5 ],
      [ 6, 8, 5, 7, 4, 2, 3, 1, 9 ],
      [ 1, 9, 3, 2, 5, 6, 8, 7, 4 ],
      [ 4, 5, 6, 8, 1, 7, 9, 2, 3 ],
      [ 7, 2, 8, 4, 9, 3, 6, 5, 1 ]);

    // Act
    const result = await sut.postCheckGameAsync(sudokuRequestData) as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Game was solved.');
  });
  it('should catch any errors thrown by Axios in the postCheckGameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/games/checkannonymous', () => {
          return HttpResponse.json({
            isSuccess: false, 
            isFromCache: false, 
            message: 'Status Code 404: Game was not solved.', 
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
  
      const sut = GamesPort;
  
      const sudokuRequestData = new SudokuRequestData (
        [ 5, 1, 7, 3, 2, 9, 4, 8, 6 ],
        [ 3, 4, 2, 6, 8, 1, 5, 9, 7 ],
        [ 8, 6, 9, 5, 7, 4, 1, 3, 2 ],
        [ 2, 3, 1, 9, 6, 5, 7, 4, 8 ],
        [ 9, 7, 4, 1, 3, 8, 2, 6, 5 ],
        [ 6, 8, 5, 7, 4, 2, 3, 1, 9 ],
        [ 1, 9, 3, 2, 5, 6, 8, 7, 4 ],
        [ 4, 5, 6, 8, 1, 7, 9, 2, 3 ],
        [ 7, 2, 8, 4, 9, 3, 6, 5, 1 ]);
  
      // Act
      await sut.postCheckGameAsync(sudokuRequestData) as AxiosResponse;

    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Game was not solved.');
    }
  });
  it('should catch any errors thrown by the postCheckGameAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/games/checkannonymous', () => {
          return HttpResponse.json({
            isSuccess: true, 
            isFromCache: false, 
            message: 'Status Code 200: Game was solved.', 
            payload: []
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
  
      const sut = GamesPort;
  
      const sudokuRequestData = new SudokuRequestData (
        [ 5, 1, 7, 3, 2, 9, 4, 8, 6 ],
        [ 3, 4, 2, 6, 8, 1, 5, 9, 7 ],
        [ 8, 6, 9, 5, 7, 4, 1, 3, 2 ],
        [ 2, 3, 1, 9, 6, 5, 7, 4, 8 ],
        [ 9, 7, 4, 1, 3, 8, 2, 6, 5 ],
        [ 6, 8, 5, 7, 4, 2, 3, 1, 9 ],
        [ 1, 9, 3, 2, 5, 6, 8, 7, 4 ],
        [ 4, 5, 6, 8, 1, 7, 9, 2, 3 ],
        [ 7, 2, 8, 4, 9, 3, 6, 5, 1 ]);
  
      // Act
      await sut.postCheckGameAsync(sudokuRequestData, true) as AxiosResponse;
   
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
