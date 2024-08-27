import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AxiosError, AxiosResponse } from 'axios';
import { IndexPort } from '@/ports/indexPort';
import { ValuesPort } from '@/ports/valuesPort';
import { ValuesService } from '@/services/valuesService';
import { StaticServiceMethods } from '@/services/common';

describe('the valuesService service', () => {
  beforeEach(() => {
    StaticServiceMethods.processFailedResponse = vi.fn();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should obtain values from the index and values api endpoints by running the getValuesAsync method', async () => {
    // Arrange
    IndexPort.getMissionStatementAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          missionStatement: 'Sudoku Collective is an open source <a href="https://restfulapi.net/" title="What is REST" target="_blank">REST API</a> that is used to learn frontend client side technologies such as <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> or <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. With this API developers will create an app that allows players to play <a href="https://en.wikipedia.org/wiki/Sudoku" title="Sudoku Wikipedia Page" target="_blank">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> and <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. The API is <a href="/swagger/index.html" title="SudokuCollective API" target="_self">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'index',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    ValuesPort.getValuesAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Values were retrieved.',
          payload: [{
            difficulties: [
              {
                id: 3,
                name: 'Easy',
                displayName: 'Steady Sloth',
                difficultyLevel: 2
              },
              {
                id: 4,
                name: 'Medium',
                displayName: 'Leaping Lemur',
                difficultyLevel: 3
              },
              {
                id: 5,
                name: 'Hard',
                displayName: 'Mighty Mountain Lion',
                difficultyLevel: 4
              },
              {
                id: 6,
                name: 'Evil',
                displayName: 'Sneaky Shark',
                difficultyLevel: 5
              }
            ],
            releaseEnvironments: [
              {
                label: 'Local',
                value: 1,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Test',
                value: 2,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Staging',
                value: 3,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Production',
                value: 4,
                appliesTo: [
                  'releaseEnvironment'
                ]
              }
            ],
            sortValues: [
              {
                label: 'Id',
                value: 1,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Username',
                value: 2,
                appliesTo: [
                  'gallery',
                  'users'
                ]
              },
              {
                label: 'First Name',
                value: 3,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Last Name',
                value: 4,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Full Name',
                value: 5,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Nick Name',
                value: 6,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Game Count',
                value: 7,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'App Count',
                value: 8,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Name',
                value: 9,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Date Created',
                value: 10,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Date Updated',
                value: 11,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Difficulty Level',
                value: 12,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'User Count',
                value: 13,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Score',
                value: 14,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'Url',
                value: 15,
                appliesTo: [
                  'gallery'
                ]
              }
            ],
            timeFrames: [
              {
                label: 'Seconds',
                value: 1,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Minutes',
                value: 2,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Hours',
                value: 3,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Days',
                value: 4,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Months',
                value: 5,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Years',
                value: 6,
                appliesTo: [
                  'authToken'
                ]
              }
            ],
            gallery: [{
              id: 1,
              name: 'TestApp',
              url: 'https://testapp-example.com',
              sourceCodeUrl: 'https://github.com/test-user/testapp-example',
              createdBy: 'test-user',
              userCount: 0,
              dateCreated: '2024-08-27T20:56:42.8609588Z',
              dateUpdated: '0001-01-01T00:00:00',
            }]
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'values',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('VITE_APP_API_URL', 'http://localhost:5173/');

    const sut = ValuesService;
    
    // Act
    const result = await sut.getValuesAsync();

    // Assert
    expect(result.missionStatement).equals('Sudoku Collective is an open source <a href="https://restfulapi.net/" title="What is REST" target="_blank">REST API</a> that is used to learn frontend client side technologies such as <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> or <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. With this API developers will create an app that allows players to play <a href="https://en.wikipedia.org/wiki/Sudoku" title="Sudoku Wikipedia Page" target="_blank">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> and <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. The API is <a href="http://localhost:5173/swagger/index.html" title="SudokuCollective API" target="_self">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!');
    expect(result.difficulties.length).equals(4);
    expect(result.releaseEnvironments.length).equals(4);
    expect(result.sortValues.length).equals(15);
    expect(result.timeFrames.length).equals(6);
    expect(result.gallery.length).equals(1);
  });
  it('should catch AxiosErrors thrown by the IndexPort when running the the getValuesAsync method', async () => {
    // Arrange
    IndexPort.getMissionStatementAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'index',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'mission statement not found',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });
    ValuesPort.getValuesAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Values were retrieved.',
          payload: [{
            difficulties: [
              {
                id: 3,
                name: 'Easy',
                displayName: 'Steady Sloth',
                difficultyLevel: 2
              },
              {
                id: 4,
                name: 'Medium',
                displayName: 'Leaping Lemur',
                difficultyLevel: 3
              },
              {
                id: 5,
                name: 'Hard',
                displayName: 'Mighty Mountain Lion',
                difficultyLevel: 4
              },
              {
                id: 6,
                name: 'Evil',
                displayName: 'Sneaky Shark',
                difficultyLevel: 5
              }
            ],
            releaseEnvironments: [
              {
                label: 'Local',
                value: 1,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Test',
                value: 2,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Staging',
                value: 3,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Production',
                value: 4,
                appliesTo: [
                  'releaseEnvironment'
                ]
              }
            ],
            sortValues: [
              {
                label: 'Id',
                value: 1,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Username',
                value: 2,
                appliesTo: [
                  'gallery',
                  'users'
                ]
              },
              {
                label: 'First Name',
                value: 3,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Last Name',
                value: 4,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Full Name',
                value: 5,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Nick Name',
                value: 6,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Game Count',
                value: 7,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'App Count',
                value: 8,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Name',
                value: 9,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Date Created',
                value: 10,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Date Updated',
                value: 11,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Difficulty Level',
                value: 12,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'User Count',
                value: 13,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Score',
                value: 14,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'Url',
                value: 15,
                appliesTo: [
                  'gallery'
                ]
              }
            ],
            timeFrames: [
              {
                label: 'Seconds',
                value: 1,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Minutes',
                value: 2,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Hours',
                value: 3,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Days',
                value: 4,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Months',
                value: 5,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Years',
                value: 6,
                appliesTo: [
                  'authToken'
                ]
              }
            ],
            gallery: [{
              id: 1,
              name: 'TestApp',
              url: 'https://testapp-example.com',
              sourceCodeUrl: 'https://github.com/test-user/testapp-example',
              createdBy: 'test-user',
              userCount: 0,
              dateCreated: '2024-08-27T20:56:42.8609588Z',
              dateUpdated: '0001-01-01T00:00:00',
            }]
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'values',
          method: 'POST',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('VITE_APP_API_URL', 'http://localhost:5173/');

    vi.stubEnv('NODE_ENV', 'development');

    const sut = ValuesService;
    
    // Act
    const result = await sut.getValuesAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('mission statement not found');
  });
  it('should catch any errors thrown by the IndexPort when running the the getValuesAsync method', async () => {
    // Arrange
    IndexPort.getMissionStatementAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });
    ValuesPort.getValuesAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Values were retrieved.',
          payload: [{
            difficulties: [
              {
                id: 3,
                name: 'Easy',
                displayName: 'Steady Sloth',
                difficultyLevel: 2
              },
              {
                id: 4,
                name: 'Medium',
                displayName: 'Leaping Lemur',
                difficultyLevel: 3
              },
              {
                id: 5,
                name: 'Hard',
                displayName: 'Mighty Mountain Lion',
                difficultyLevel: 4
              },
              {
                id: 6,
                name: 'Evil',
                displayName: 'Sneaky Shark',
                difficultyLevel: 5
              }
            ],
            releaseEnvironments: [
              {
                label: 'Local',
                value: 1,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Test',
                value: 2,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Staging',
                value: 3,
                appliesTo: [
                  'releaseEnvironment'
                ]
              },
              {
                label: 'Production',
                value: 4,
                appliesTo: [
                  'releaseEnvironment'
                ]
              }
            ],
            sortValues: [
              {
                label: 'Id',
                value: 1,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Username',
                value: 2,
                appliesTo: [
                  'gallery',
                  'users'
                ]
              },
              {
                label: 'First Name',
                value: 3,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Last Name',
                value: 4,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Full Name',
                value: 5,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Nick Name',
                value: 6,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Game Count',
                value: 7,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'App Count',
                value: 8,
                appliesTo: [
                  'users'
                ]
              },
              {
                label: 'Name',
                value: 9,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Date Created',
                value: 10,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Date Updated',
                value: 11,
                appliesTo: [
                  'apps',
                  'gallery',
                  'users',
                  'games'
                ]
              },
              {
                label: 'Difficulty Level',
                value: 12,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'User Count',
                value: 13,
                appliesTo: [
                  'apps',
                  'gallery'
                ]
              },
              {
                label: 'Score',
                value: 14,
                appliesTo: [
                  'games'
                ]
              },
              {
                label: 'Url',
                value: 15,
                appliesTo: [
                  'gallery'
                ]
              }
            ],
            timeFrames: [
              {
                label: 'Seconds',
                value: 1,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Minutes',
                value: 2,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Hours',
                value: 3,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Days',
                value: 4,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Months',
                value: 5,
                appliesTo: [
                  'authToken'
                ]
              },
              {
                label: 'Years',
                value: 6,
                appliesTo: [
                  'authToken'
                ]
              }
            ],
            gallery: [{
              id: 1,
              name: 'TestApp',
              url: 'https://testapp-example.com',
              sourceCodeUrl: 'https://github.com/test-user/testapp-example',
              createdBy: 'test-user',
              userCount: 0,
              dateCreated: '2024-08-27T20:56:42.8609588Z',
              dateUpdated: '0001-01-01T00:00:00',
            }]
          }]
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'values',
          method: 'POST',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });

    vi.stubEnv('VITE_APP_API_URL', 'http://localhost:5173/');

    vi.stubEnv('NODE_ENV', 'development');

    const sut = ValuesService;
    
    // Act
    const result = await sut.getValuesAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
  it('should catch AxiosErrors thrown by the ValuesPort when running the the getValuesAsync method', async () => {
    // Arrange
    IndexPort.getMissionStatementAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          missionStatement: 'Sudoku Collective is an open source <a href="https://restfulapi.net/" title="What is REST" target="_blank">REST API</a> that is used to learn frontend client side technologies such as <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> or <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. With this API developers will create an app that allows players to play <a href="https://en.wikipedia.org/wiki/Sudoku" title="Sudoku Wikipedia Page" target="_blank">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> and <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. The API is <a href="/swagger/index.html" title="SudokuCollective API" target="_self">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'index',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    ValuesPort.getValuesAsync = vi.fn().mockImplementation(() => {
      return {
        config: {
          url: 'values',
          method: 'post',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {},
        response: {
          data: {
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 200: Values were not retrieved.',
            payload: []
          },
          status: 404,
          statusText: 'NOT FOUND',
        }
      } as AxiosError;
    });

    vi.stubEnv('VITE_APP_API_URL', 'http://localhost:5173/');

    vi.stubEnv('NODE_ENV', 'development');

    const sut = ValuesService;
    
    // Act
    const result = await sut.getValuesAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('Status Code 200: Values were not retrieved.');
  });
  it('should catch any errors thrown by the ValuesPort when running the the getValuesAsync method', async () => {
    // Arrange
    IndexPort.getMissionStatementAsync = vi.fn().mockImplementation(() => {
      return {
        data: {
          missionStatement: 'Sudoku Collective is an open source <a href="https://restfulapi.net/" title="What is REST" target="_blank">REST API</a> that is used to learn frontend client side technologies such as <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> or <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. With this API developers will create an app that allows players to play <a href="https://en.wikipedia.org/wiki/Sudoku" title="Sudoku Wikipedia Page" target="_blank">sudoku</a> puzzles and compare their performance against other players. The benefit of using this tool is that once the developer creates their first app they will obtain an understanding of how the API works which will put them in a better position to compare and understand various frontend technologies like <a href="https://reactjs.org/" title="ReactJS.org" target="_blank">React</a> and <a href="https://vuejs.org/" title="VueJS.org" target="_blank">Vue.js</a>. The API is <a href="/swagger/index.html" title="SudokuCollective API" target="_self">fully documented</a> so developers can integrate their client apps with the API. The goals are to learn, develop and have fun!'
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          url: 'index',
          method: 'get',
          baseURL: 'https://localhost:5001/api/v1/'
        },
        request: {}
      } as AxiosResponse;
    });
    ValuesPort.getValuesAsync = vi.fn().mockImplementation(() => {
      return new Error('NETWORK ERR');
    });

    vi.stubEnv('VITE_APP_API_URL', 'http://localhost:5173/');

    vi.stubEnv('NODE_ENV', 'development');

    const sut = ValuesService;
    
    // Act
    const result = await sut.getValuesAsync();

    // Assert
    expect(result.isSuccess).toBe(false);
    expect(result.message).equals('NETWORK ERR');
  });
});
