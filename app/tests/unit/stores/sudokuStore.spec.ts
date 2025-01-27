import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, type Pinia } from 'pinia';
import { useSudokuStore } from '@/stores/sudokuStore';
import { Methods } from '@/stores/sudokuStore/common';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { Difficulty } from '@/models/domain/difficulty';
import { GamesService } from '@/services/gamesService';
import type { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';

describe('the sudokuStore store', () => {
  let pinia: Pinia;
  beforeEach(() => {
    pinia = createPinia();
    vi.stubEnv('NODE_ENV', 'development');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should have the expected state properties', () => {
    // Arrange and Act
    const sut = useSudokuStore(pinia);
    
    sut.initialGame = Methods.InitializeMatix();
    sut.game = Methods.InitializeMatix();
    sut.puzzle = Methods.InitializeMatix();
    sut.solution = Methods.InitializeMatix();
    sut.gameState = new DropdownItem('Play Game', 1);
    sut.selectedDifficulty = new Difficulty(
      1,
      'Test Difficulty',
      'Easy',
      1
    );
    sut.serviceResult = false;
    sut.serviceMessage = 'Service message';
    sut.isSolveDisabled = false;

    // Assert
    expect(sut.initialGame).toBeTypeOf('object');
    expect(sut.game).toBeTypeOf('object');
    expect(sut.puzzle).toBeTypeOf('object');
    expect(sut.solution).toBeTypeOf('object');
    expect(sut.gameState).toBeTypeOf('object');
    expect(sut.selectedDifficulty).toBeTypeOf('object');
    expect(sut.serviceResult).toBeTypeOf('boolean');
    expect(sut.serviceMessage).toBeTypeOf('string');
    expect(sut.processing).toBeTypeOf('boolean');
    expect(sut.isSolveDisabled).toBeTypeOf('boolean');
  });
  it('should have the expected getters', () => {
    // Arrange and Act
    const sut = useSudokuStore(pinia);
    
    sut.initialGame = Methods.InitializeMatix();
    sut.game = Methods.InitializeMatix();
    sut.puzzle = Methods.InitializeMatix();
    sut.solution = Methods.InitializeMatix();
    sut.gameState = new DropdownItem('Play Game', 1);
    sut.selectedDifficulty = new Difficulty(
      1,
      'Test Difficulty',
      'Easy',
      1
    );
    sut.serviceResult = false;
    sut.serviceMessage = 'Service message';
    sut.isSolveDisabled = false;

    const initialGame = sut.getInitialGame;
    const game = sut.getGame;
    const puzzle = sut.getPuzzle;
    const solution = sut.getSolution;
    const gameState = sut.getGameState;
    const selectedDifficulty = sut.getSelectedDifficulty;
    const serviceResult = sut.getServiceResult;
    const serviceMessage = sut.getServiceMessage;
    const processing = sut.getProcessing;
    const isGameCurrent = sut.getIsGameCurrent;
    const isSolveDisabled = sut.getIsSolvedDisabled;
    const puzzleIsReady = sut.getPuzzleIsReady;

    // Assert
    expect(initialGame).toBeTypeOf('object');
    expect(game).toBeTypeOf('object');
    expect(puzzle).toBeTypeOf('object');
    expect(solution).toBeTypeOf('object');
    expect(gameState).toBeTypeOf('object');
    expect(selectedDifficulty).toBeTypeOf('object');
    expect(serviceResult).toBeTypeOf('boolean');
    expect(serviceMessage).toBeTypeOf('string');
    expect(processing).toBeTypeOf('boolean');
    expect(isGameCurrent).toBeTypeOf('boolean');
    expect(isSolveDisabled).toBeTypeOf('boolean');
    expect(puzzleIsReady).toBeTypeOf('boolean');
  });
  it('should return default values for the getters', () => {
    // Arrange and Act
    const sut = useSudokuStore(pinia);
    
    const initialGame = sut.getInitialGame;
    const game = sut.getGame;
    const puzzle = sut.getPuzzle;
    const solution = sut.getSolution;
    const gameState = sut.getGameState;
    const selectedDifficulty = sut.getSelectedDifficulty;
    const serviceResult = sut.getServiceResult;
    const serviceMessage = sut.getServiceMessage;
    const processing = sut.getProcessing;
    const isGameCurrent = sut.getIsGameCurrent;
    const isSolveDisabled = sut.getIsSolvedDisabled;
    const puzzleIsReady = sut.getPuzzleIsReady;

    // Assert
    expect(initialGame).toBeTypeOf('object');
    expect(game).toBeTypeOf('object');
    expect(puzzle).toBeTypeOf('object');
    expect(solution).toBeTypeOf('object');
    expect(gameState).toBeNull();
    expect(selectedDifficulty).toBeNull();
    expect(serviceResult).toBeTypeOf('boolean');
    expect(serviceMessage).toBeTypeOf('string');
    expect(processing).toBeTypeOf('boolean');
    expect(isGameCurrent).toBeTypeOf('boolean');
    expect(isSolveDisabled).toBeTypeOf('boolean');
    expect(puzzleIsReady).toBeTypeOf('boolean');
  });
  it('should return true with the getIsGameCurrent getter if any game cell is not an empty string', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    sut.game = Methods.InitializeMatix();
    sut.game[0][0] = '9';

    // Act
    const isGameCurrent = sut.getIsGameCurrent;

    // Assert
    expect(isGameCurrent).toBeTruthy();
  });
  it('should return true with the getPuzzleIsReady getter is at least 13 values in the puzzle are known', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    sut.puzzle = Methods.InitializeMatix();
    const knowns = [ '9', '1', '3', '5', '8', '2', '4', '7', '6', '8', '4', '6', '9' ];
    sut.puzzle[0][0] = knowns[0];
    sut.puzzle[0][1] = knowns[1];
    sut.puzzle[0][2] = knowns[2];
    sut.puzzle[0][3] = knowns[3];
    sut.puzzle[0][4] = knowns[4];
    sut.puzzle[0][5] = knowns[5];
    sut.puzzle[0][6] = knowns[6];
    sut.puzzle[0][7] = knowns[7];
    sut.puzzle[0][8] = knowns[8];
    sut.puzzle[1][0] = knowns[9];
    sut.puzzle[1][1] = knowns[10];
    sut.puzzle[1][2] = knowns[11];
    sut.puzzle[1][3] = knowns[12];

    // Act
    const puzzleIsReady = sut.getPuzzleIsReady;

    // Assert
    expect(knowns.length).equals(13);
    expect(puzzleIsReady).toBeTruthy();
  });
  it('should return false with the getPuzzleIsReady getter if more than 13 values in the puzzle are known', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    sut.puzzle = Methods.InitializeMatix();
    const knowns = [ '9', '1', '3', '5', '8', '2', '4', '7', '6', '8', '4', '6', '9', '3' ];
    sut.puzzle[0][0] = knowns[0];
    sut.puzzle[0][1] = knowns[1];
    sut.puzzle[0][2] = knowns[2];
    sut.puzzle[0][3] = knowns[3];
    sut.puzzle[0][4] = knowns[4];
    sut.puzzle[0][5] = knowns[5];
    sut.puzzle[0][6] = knowns[6];
    sut.puzzle[0][7] = knowns[7];
    sut.puzzle[0][8] = knowns[8];
    sut.puzzle[1][0] = knowns[9];
    sut.puzzle[1][1] = knowns[10];
    sut.puzzle[1][2] = knowns[11];
    sut.puzzle[1][3] = knowns[12];
    sut.puzzle[1][4] = knowns[13];

    // Act
    const puzzleIsReady = sut.getPuzzleIsReady;

    // Assert
    expect(knowns.length).equals(14);
    expect(puzzleIsReady).toBeFalsy();
  });
  it('should update the initialGame property using the updateInitialGame mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getInitialGame.length === 0;

    // Act
    sut.updateInitialGame(Methods.InitializeMatix())
    const finalState = sut.getInitialGame.length === 9;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should update the game property using the updateGame mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getGame.length === 0;

    // Act
    sut.updateGame(Methods.InitializeMatix())
    const finalState = sut.getGame.length === 9;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should update the puzzle property using the updatePuzzle mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getPuzzle.length === 0;

    // Act
    sut.updatePuzzle(Methods.InitializeMatix())
    const finalState = sut.getPuzzle.length === 9;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should update the solution property using the updateSolution mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getSolution.length === 0;

    // Act
    sut.updateSolution(Methods.InitializeMatix())
    const finalState = sut.getSolution.length === 9;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should update the gameState property using the updateGameState mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getGameState === null;

    // Act
    sut.updateGameState(new DropdownItem('Play Game', 1));
    const finalState = sut.getGameState !== null;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should update the selectedDifficulty property using the updateSelectedDifficulty mutation', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getSelectedDifficulty === null;

    // Act
    sut.updateSelectedDifficulty(
      new Difficulty(
        1,
        'Test Difficulty',
        'Easy',
        1
      )
    );
    const finalState = sut.getSelectedDifficulty !== null;

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should initialize the initialGame property using the initializeInitialGame method', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getInitialGame.length === 0;

    // Act
    sut.initializeInitialGame();

    let finalState = true;

    if (sut.getInitialGame.length !== 9) {
      finalState = false;
    }

    sut.getInitialGame.forEach((row) => {
      if (row.length !== 9) {
        finalState = false;
      }
    });

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should initialize the game property using the initializeGame method', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getGame.length === 0;

    // Act
    sut.initializeGame();

    let finalState = true;

    if (sut.getGame.length !== 9) {
      finalState = false;
    }

    sut.getGame.forEach((row) => {
      if (row.length !== 9) {
        finalState = false;
      }
    });

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should initialize the puzzle property using the initializePuzzle method', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getPuzzle.length === 0;

    // Act
    sut.initializePuzzle();

    let finalState = true;

    if (sut.getPuzzle.length !== 9) {
      finalState = false;
    }

    sut.getPuzzle.forEach((row) => {
      if (row.length !== 9) {
        finalState = false;
      }
    });

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should initialize the solution property using the initializeSolution method', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialState = sut.getSolution.length === 0;

    // Act
    sut.initializeSolution();

    let finalState = true;

    if (sut.getSolution.length !== 9) {
      finalState = false;
    }

    sut.getSolution.forEach((row) => {
      if (row.length !== 9) {
        finalState = false;
      }
    });

    // Assert
    expect(initialState).toBeTruthy();
    expect(finalState).toBeTruthy();
  });
  it('should initialize the initialGame, game, puzzle, and solution properties using the initializeStore method', () => {
    // Arrange
    const sut = useSudokuStore(pinia);
    const initialInitialGameState = sut.getInitialGame.length === 0;
    const initialGameState = sut.getGame.length === 0;
    const initialPuzzleState = sut.getPuzzle.length === 0;
    const initialSolutionState = sut.getSolution.length === 0;

    // Act
    sut.initializeStore();

    let finalInitialGameState = true;

    if (sut.getInitialGame.length !== 9) {
      finalInitialGameState = false;
    }

    sut.getInitialGame.forEach((row) => {
      if (row.length !== 9) {
        finalInitialGameState = false;
      }
    });

    let finalGameState = true;

    if (sut.getGame.length !== 9) {
      finalGameState = false;
    }

    sut.getGame.forEach((row) => {
      if (row.length !== 9) {
        finalGameState = false;
      }
    });

    let finalPuzzleState = true;

    if (sut.getPuzzle.length !== 9) {
      finalPuzzleState = false;
    }

    sut.getPuzzle.forEach((row) => {
      if (row.length !== 9) {
        finalPuzzleState = false;
      }
    });

    let finalSolutionState = true;

    if (sut.getSolution.length !== 9) {
      finalSolutionState = false;
    }

    sut.getSolution.forEach((row) => {
      if (row.length !== 9) {
        finalSolutionState = false;
      }
    });

    // Assert
    expect(initialInitialGameState).toBeTruthy();
    expect(initialGameState).toBeTruthy();
    expect(initialPuzzleState).toBeTruthy();
    expect(initialSolutionState).toBeTruthy();
    expect(finalInitialGameState).toBeTruthy();
    expect(finalGameState).toBeTruthy();
    expect(finalPuzzleState).toBeTruthy();
    expect(finalSolutionState).toBeTruthy();
    expect(sut.getIsSolvedDisabled).toBeTruthy();
  });
  it('should create games by submitting the difficulty level to the GamesService using the createGameAsync method', async () => {
    // Arrange
    const createGameAsyncSpy = vi.spyOn(GamesService, 'createGameAsync');
    createGameAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        game: [
          [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
          [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
          [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
          [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
          [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
          [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
          [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
          [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
          [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
        ],
        message: 'Status Code 200: Game was created.'
      }
    });

    const sut = useSudokuStore(pinia);
    sut.updateSelectedDifficulty(
      new Difficulty(
        1,
        'Test Difficulty',
        'Easy',
        1
      )
    );
    const initialInitialGameState = sut.getInitialGame.length === 0;
    const initialGameState = sut.getGame.length === 0;

    // Act
    await sut.createGameAsync();

    let finalInitialGameState = true;

    if (sut.getInitialGame.length !== 9) {
      finalInitialGameState = false;
    }

    sut.getInitialGame.forEach((row) => {
      if (row.length !== 9) {
        finalInitialGameState = false;
      }
    });

    let finalGameState = true;

    if (sut.getGame.length !== 9) {
      finalGameState = false;
    }

    sut.getGame.forEach((row) => {
      if (row.length !== 9) {
        finalGameState = false;
      }
    });

    // Assert
    expect(initialInitialGameState).toBeTruthy();
    expect(initialGameState).toBeTruthy();
    expect(finalInitialGameState).toBeTruthy();
    expect(finalGameState).toBeTruthy();
  });
  it('should throw an error if the selectedDifficulty is invalid when running the createGameAsync method', async () => {
    // Arrange
    const createGameAsyncSpy = vi.spyOn(GamesService, 'createGameAsync');
    createGameAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        game: [
          [ '0', '1', '0', '0', '0', '5', '0', '0', '3' ],
          [ '0', '4', '0', '3', '1', '0', '2', '0', '0' ],
          [ '0', '0', '0', '9', '0', '6', '4', '0', '0' ],
          [ '9', '0', '7', '1', '0', '0', '0', '0', '0' ],
          [ '0', '5', '0', '7', '9', '8', '0', '6', '0' ],
          [ '0', '0', '0', '0', '0', '3', '9', '0', '1' ],
          [ '0', '0', '2', '5', '0', '9', '0', '0', '0' ],
          [ '0', '0', '8', '0', '4', '1', '0', '5', '0' ],
          [ '4', '0', '0', '8', '0', '0', '0', '3', '0' ]
        ],
        message: 'Status Code 200: Game was created.'
      }
    });
    const sut = useSudokuStore(pinia);
    let errorMessage = '';

    try {
      await sut.createGameAsync();
    } catch (error) {
      errorMessage = (<Error>error).message;
    }
    expect(errorMessage).equals('Selected difficulty is invalid.');
  });
  it('should submit games to the GameService via the checkGameAsync method to confirm if the game is solved', async () => {
    // Arrange
    const checkGameAsyncSpy = vi.spyOn(GamesService, 'checkGameAsync');
    checkGameAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        game: [
          [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
          [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
          [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
          [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
          [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
          [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
          [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
          [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
          [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
        ],
        message: 'Status Code 200: Game was solved.'
      }
    });
    const sut = useSudokuStore(pinia);
    sut.$state.initialGame = [
      [ '0', '8', '0', '4', '0', '0', '0', '7', '0' ],
      [ '2', '0', '0', '5', '0', '0', '9', '0', '0' ],
      [ '0', '0', '9', '0', '6', '0', '0', '0', '0' ],
      [ '6', '0', '0', '0', '0', '0', '0', '3', '0' ],
      [ '0', '0', '3', '0', '0', '5', '7', '0', '0' ],
      [ '7', '0', '0', '2', '0', '0', '0', '0', '4' ],
      [ '0', '0', '4', '0', '0', '7', '0', '0', '9' ],
      [ '0', '0', '0', '8', '4', '9', '0', '0', '0' ],
      [ '8', '0', '7', '0', '0', '6', '0', '0', '3' ]
    ];
    sut.$state.game = [
      [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
      [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
      [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
      [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
      [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
      [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
      [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
      [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
      [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
    ];

    // Act
    await sut.checkGameAsync();

    // Assert
    expect(sut.getServiceResult).toBeTruthy();
    expect(sut.getServiceMessage).equals('Status Code 200: Game was solved.');
  });
  it('should throw an error if the game is invalid when running the checkGameAsync method', async () => {
    // Arrange
    const checkGameAsyncSpy = vi.spyOn(GamesService, 'checkGameAsync');
    checkGameAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        game: [
          [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
          [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
          [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
          [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
          [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
          [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
          [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
          [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
          [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
        ],
        message: 'Status Code 200: Game was solved.'
      }
    });
    const sut = useSudokuStore(pinia);
    let errorMessage = '';

    try {
      await sut.checkGameAsync();
    } catch (error) {
      errorMessage = (<Error>error).message;
    }
    expect(errorMessage).equals('Game is invalid.');
  });
  it('should submit puzzles to the GameService via the solvePuzzleAsync method to solve puzzles', async () => {
    // Arrange
    const solvePuzzleAsyncSpy = vi.spyOn(GamesService, 'solvePuzzleAsync');
    solvePuzzleAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        puzzle: [
          [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
          [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
          [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
          [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
          [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
          [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
          [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
          [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
          [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
        ],
        message: 'Status Code 201: Sudoku solution was found.'
      }
    });
    const sut = useSudokuStore(pinia);
    sut.$state.puzzle = [
      [ '', '', '', '4', '', '', '3', '', '6' ],
      [ '2', '7', '', '5', '', '8', '', '', '' ],
      [ '', '3', '9', '', '', '', '5', '2', '' ],
      [ '6', '', '2', '9', '', '', '', '3', '5' ],
      [ '', '4', '3', '', '', '5', '7', '', '' ],
      [ '', '5', '', '2', '', '', '', '', '' ],
      [ '', '', '', '', '5', '7', '', '8', '' ],
      [ '', '', '', '', '', '', '', '6', '' ],
      [ '8', '9', '7', '', '', '', '4', '5', '3' ]
    ];

    // Act
    await sut.solvePuzzleAsync();

    // Assert
    expect(sut.getServiceResult).toBeTruthy();
    expect(sut.getServiceMessage).equals('Status Code 201: Sudoku solution was found.');
  });
  it('should throw an error if the puzzle is invalid when running the solvePuzzleAsync method', async () => {
    // Arrange
    const solvePuzzleAsyncSpy = vi.spyOn(GamesService, 'solvePuzzleAsync');
    solvePuzzleAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        puzzle: [
          [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
          [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
          [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
          [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
          [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
          [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
          [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
          [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
          [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
        ],
        message: 'Status Code 201: Sudoku solution was found.'
      }
    });
    const sut = useSudokuStore(pinia);
    let errorMessage = '';

    try {
      await sut.solvePuzzleAsync();
    } catch (error) {
      errorMessage = (<Error>error).message;
    }
    expect(errorMessage).equals('Puzzle is invalid.');
  });
  it('should generate solutions by submitting requests to the GameService generateSolutionAsync method', async () => {
    // Arrange
    const generateSolutionAsyncSpy = vi.spyOn(GamesService, 'generateSolutionAsync');
    generateSolutionAsyncSpy.mockImplementation(async () => {
      return <IServicePayload>{
        isSuccess: true,
        solution: [
          [ '5', '8', '1', '4', '9', '2', '3', '7', '6' ],
          [ '2', '7', '6', '5', '3', '8', '9', '4', '1' ],
          [ '4', '3', '9', '7', '6', '1', '5', '2', '8' ],
          [ '6', '1', '2', '9', '7', '4', '8', '3', '5' ],
          [ '9', '4', '3', '6', '8', '5', '7', '1', '2' ],
          [ '7', '5', '8', '2', '1', '3', '6', '9', '4' ],
          [ '1', '6', '4', '3', '5', '7', '2', '8', '9' ],
          [ '3', '2', '5', '8', '4', '9', '1', '6', '7' ],
          [ '8', '9', '7', '1', '2', '6', '4', '5', '3' ]
        ],
        message: 'Status Code 200: Solution was generated.'
      }
    });
    const sut = useSudokuStore(pinia);

    // Act
    await sut.generateSolutionAsync();
    let solutionIsValid = true;

    if (sut.getSolution.length !== 9) {
      solutionIsValid = false;
    }

    sut.getSolution.forEach(row => {
      if (row.length !== 9) {
        solutionIsValid = false;
      }
    });

    // Assert
    expect(sut.getServiceResult).toBeTruthy();
    expect(sut.getServiceMessage).equals('Status Code 200: Solution was generated.');
    expect(solutionIsValid).toBeTruthy();
  });
});
