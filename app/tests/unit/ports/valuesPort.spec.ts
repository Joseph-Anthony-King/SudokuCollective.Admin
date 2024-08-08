import { afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer, type SetupServerApi } from 'msw/node';
import type { AxiosError, AxiosResponse } from 'axios';
import { ValuesPort } from '@/ports/valuesPort/index';
import { Endpoints } from '@/ports/valuesPort/endpoints';

describe('the valuesPort port', () => {
  let testServer: SetupServerApi | null;
  afterEach(() => {
    vi.restoreAllMocks();
    testServer?.close();
    testServer = null;
  });
  it('should have the expected endpoints', () => {
    // Arrange, Act, and Assert
    expect(process.env.VITE_APP_API_URL).equals('https://localhost:5001/');
    expect(Endpoints.getEndpoint).equals('https://localhost:5001/api/v1/values');
  });
  it('should obtain dropdown values by running the getValuesAsync method', async () => {
    // Arrange
    testServer = setupServer(
      http.post('https://localhost:5001/api/v1/values', () => {
        return HttpResponse.json({
          isSuccess: true,
          isFromCache: false,
          message: 'Status Code 200: Values were retrieved.',
          payload: [
            {
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
              gallery: [
                {
                  id: 1,
                  name: 'Sudoku Collective Admin Console',
                  url: 'https://Admin.SudokuCollective.com',
                  createdBy: 'SuperUser',
                  userCount: 0,
                  dateCreated: '2024-05-24T18:11:39.996131Z',
                  dateUpdated: '0001-01-01T00:00:00'
                }
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

    const sut = ValuesPort;

    // Act
    const result = await sut.getValuesAsync() as AxiosResponse;

    // Assert
    expect(result.data.isSuccess).toBe(true);
    expect(result.data.isFromCache).toBe(false);
    expect(result.data.message).equals('Status Code 200: Values were retrieved.');
    expect(result.data.payload[0].difficulties.length).equals(4);
    expect(result.data.payload[0].releaseEnvironments.length).equals(4);
    expect(result.data.payload[0].sortValues.length).equals(15);
    expect(result.data.payload[0].timeFrames.length).equals(6);
    expect(result.data.payload[0].gallery.length).equals(1);
  });
  it('should catch any AxiosErrors thrown when running the getValuesAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/values', () => {
          return HttpResponse.json({
            isSuccess: false,
            isFromCache: false,
            message: 'Status Code 404: Service unavailable.',
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
  
      const sut = ValuesPort;
  
      // Act
      const result = await sut.getValuesAsync() as AxiosResponse;
    } catch (error) {
      // Assert
      const result = (error as AxiosError).response?.data as any

      expect(result.isSuccess).toBe(false);
      expect(result.isFromCache).toBe(false);
      expect(result.message).equals('Status Code 404: Service unavailable.');
    }
  });
  it('should catch any errors thrown when running the getValuesAsync method', async () => {
    try {
      // Arrange
      testServer = setupServer(
        http.post('https://localhost:5001/api/v1/values', () => {
          return HttpResponse.json({
            isSuccess: true,
            isFromCache: false,
            message: 'Status Code 200: Values were retrieved.',
            payload: [
              {
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
                gallery: [
                  {
                    id: 1,
                    name: 'Sudoku Collective Admin Console',
                    url: 'https://Admin.SudokuCollective.com',
                    createdBy: 'SuperUser',
                    userCount: 0,
                    dateCreated: '2024-05-24T18:11:39.996131Z',
                    dateUpdated: '0001-01-01T00:00:00'
                  }
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
  
      const sut = ValuesPort;
  
      // Act
      await sut.getValuesAsync(true) as AxiosResponse;
    } catch (error) {
      // Assert
      expect(error).not.toBeNull;
    }
  });
});
