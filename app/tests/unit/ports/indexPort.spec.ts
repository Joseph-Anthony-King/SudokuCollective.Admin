import { describe, expect, it, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import type { AxiosResponse } from 'axios';
import { IndexPort } from '@/ports/indexPort/index';
import { Endpoints } from '@/ports/indexPort/endpoints';

describe('the indexPort port', () => {
  let testServer: SetupServerApi | null;
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.getEndpoint).equals('https://localhost:5001/api/index');
  });
  it('should get the mission statement using the getMissionStatementAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.get('https://localhost:5001/api/index', () => {
        return HttpResponse.json({
          missionStatement: "Sudoku Collective is an open source <a href=\"https://restfulapi.net/\" title=\"What is REST\" target=\"_blank\">REST API</a> that is used to learn frontend client side technologies such as <a href=\"https://reactjs.org/\" title=\"ReactJS.org\" target=\"_blank\">React</a> or <a href=\"https://vuejs.org/\" title=\"VueJS.org\" target=\"_blank\">Vue.js</a>. With this API developers will create an app that allows players to play <a href=\"https://en.wikipedia.org/wiki/Sudoku\" title=\"Sudoku Wikipedia Page\" target=\"_blank\">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href=\"https://reactjs.org/\" title=\"ReactJS.org\" target=\"_blank\">React</a> and <a href=\"https://vuejs.org/\" title=\"VueJS.org\" target=\"_blank\">Vue.js</a>. The API is <a href=\"/swagger/index.html\" title=\"SudokuCollective API\" target=\"_self\">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!"
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

    const sut = IndexPort;

    // Act
    const result = await sut.getMissionStatementAsync() as AxiosResponse;

    // Assert
    expect(result.data.missionStatement).toBeTypeOf('string');
  });
  it('should catch any errors thrown by Axios in the getMissionStatementAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/index', () => {
          return HttpResponse.json({
            error: new Error('Mock service error')
          }, {
            status: 400,
            statusText: 'NOT FOUND',
            headers: {
              'content-type': 'application/json'
            }
          })
        })
      );
  
      testServer.listen();
  
      const sut = IndexPort;

      // Act
      await sut.getMissionStatementAsync() as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
  it('should catch any errors thrown by the getMissionStatementAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.get('https://localhost:5001/api/index', () => {
          return HttpResponse.json({
            missionStatement: "Sudoku Collective is an open source <a href=\"https://restfulapi.net/\" title=\"What is REST\" target=\"_blank\">REST API</a> that is used to learn frontend client side technologies such as <a href=\"https://reactjs.org/\" title=\"ReactJS.org\" target=\"_blank\">React</a> or <a href=\"https://vuejs.org/\" title=\"VueJS.org\" target=\"_blank\">Vue.js</a>. With this API developers will create an app that allows players to play <a href=\"https://en.wikipedia.org/wiki/Sudoku\" title=\"Sudoku Wikipedia Page\" target=\"_blank\">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href=\"https://reactjs.org/\" title=\"ReactJS.org\" target=\"_blank\">React</a> and <a href=\"https://vuejs.org/\" title=\"VueJS.org\" target=\"_blank\">Vue.js</a>. The API is <a href=\"/swagger/index.html\" title=\"SudokuCollective API\" target=\"_self\">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!"
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
  
      const sut = IndexPort;
      
      // Act
      await sut.getMissionStatementAsync(true) as AxiosResponse;   
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
