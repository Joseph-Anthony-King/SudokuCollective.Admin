import { Ref, ref, ComputedRef, computed, toRaw } from "vue";
import { defineStore } from "pinia";
import { Methods } from "@/stores/sudokuStore/common";
import { GamesService } from "@/services/gamesService";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";
import { Difficulty } from "@/models/domain/difficulty";

export const useSudokuStore = defineStore("sudokuStore", () => {
  const initialGame: Ref<Array<Array<string>> | null> = ref(null);
  const game: Ref<Array<Array<string>> | null> = ref(null);
  const puzzle: Ref<Array<Array<string>> | null> = ref(null);
  const solution: Ref<Array<Array<string>> | null> = ref(null);
  const gameState: Ref<DropdownItem | null> = ref(null);
  const selectedDifficulty: Ref<Difficulty | null> = ref(null);
  const serviceResult: Ref<boolean | null> = ref(null);
  const serviceMessage: Ref<string | null> = ref(null);
  const processing: Ref<boolean> = ref(false);
  const isSolveDisabled: Ref<boolean | null> = ref(null);

  const getInitialGame: ComputedRef<Array<Array<string>>> = computed(() =>
    initialGame.value !== null
      ? toRaw(initialGame.value)
      : new Array<Array<string>>()
  );
  const getGame: ComputedRef<Array<Array<string>>> = computed(() =>
    game.value !== null ? toRaw(game.value) : new Array<Array<string>>()
  );
  const getPuzzle: ComputedRef<Array<Array<string>>> = computed(() =>
    puzzle.value !== null ? toRaw(puzzle.value) : new Array<Array<string>>()
  );
  const getSolution: ComputedRef<Array<Array<string>>> = computed(() =>
    solution.value !== null ? toRaw(solution.value) : new Array<Array<string>>()
  );
  const getGameState: ComputedRef<DropdownItem | null> = computed(() =>
    gameState.value ? toRaw(gameState.value) : null
  );
  const getSelectedDifficulty: ComputedRef<Difficulty | null> = computed(() =>
    selectedDifficulty.value ? toRaw(selectedDifficulty.value) : null
  );
  const getServiceResult: ComputedRef<boolean> = computed(() =>
    serviceResult.value !== null ? toRaw(serviceResult.value) : false
  );
  const getServiceMessage: ComputedRef<string> = computed(() =>
    serviceMessage.value ? toRaw(serviceMessage.value) : ""
  );
  const getProcessing: ComputedRef<boolean> = computed(() =>
    toRaw(processing.value)
  );
  const getIsSolvedDisabled: ComputedRef<boolean> = computed(() =>
    isSolveDisabled.value !== null ? toRaw(isSolveDisabled.value) : false
  );

  const initializeStore = (): void => {
    if (
      game.value === null &&
      puzzle.value === null &&
      solution.value === null
    ) {
      initializeInitialGame();
      initializeGame();
      initializePuzzle();
      initializeSolution();
      isSolveDisabled.value = true;
    }
  };
  const initializeInitialGame = (): void => {
    initialGame.value = Methods.InitializeMatix();
  };
  const initializeGame = (): void => {
    game.value = Methods.InitializeMatix();
  };
  const initializePuzzle = (): void => {
    puzzle.value = Methods.InitializeMatix();
  };
  const initializeSolution = (): void => {
    solution.value = Methods.InitializeMatix();
  };
  const updateInitialGame = (param: Array<Array<string>>): void => {
    initialGame.value = param;
  };
  const updateGame = (param: Array<Array<string>>): void => {
    game.value = param;
  };
  const updatePuzzle = (param: Array<Array<string>>): void => {
    isSolveDisabled.value = false;
    puzzle.value = param;
  };
  const updateSolution = (param: Array<Array<string>>): void => {
    solution.value = param;
  };
  const updateGameState = (param: DropdownItem | null): void => {
    gameState.value = param ? param : null;
  };
  const updateSelectedDifficulty = (param: Difficulty | null): void => {
    selectedDifficulty.value = param ? param : null;
  };
  const createGameAsync = async (): Promise<void> => {
    processing.value = !processing.value;
    if (selectedDifficulty.value !== null) {
      const response: IServicePayload = await GamesService.createGameAsync(
        selectedDifficulty.value.difficultyLevel
      );
      const game: Array<Array<string>> = Array<Array<string>>(9);
      for (let i = 0; i < 9; i++) {
        game[i] = [];
        for (let j = 0; j < 9; j++) {
          game[i][j] = response.game[i][j];
        }
      }
      const initialGame: Array<Array<string>> = Array<Array<string>>(9);
      for (let i = 0; i < 9; i++) {
        initialGame[i] = [];
        for (let j = 0; j < 9; j++) {
          initialGame[i][j] = response.game[i][j];
        }
      }
      updateInitialGame(initialGame);
      updateGame(game);
      serviceResult.value = null;
      serviceMessage.value = "";
    }
    processing.value = !processing.value;
  };
  const checkGameAsync = async (): Promise<void> => {
    processing.value = !processing.value;
    serviceResult.value = null;
    serviceMessage.value = "";
    if (game.value !== null) {
      const response: IServicePayload = await GamesService.checkGameAsync(
        game.value
      );
      if (response.isSuccess) {
        const solvedGame = Array<Array<string>>(9);
        for (let i = 0; i < 9; i++) {
          solvedGame[i] = [];
          for (let j = 0; j < 9; j++) {
            solvedGame[i][j] = game.value[i][j];
          }
        }
        updateInitialGame(solvedGame);
      }
      serviceResult.value = response.isSuccess;
      serviceMessage.value = response.message;
      processing.value = !processing.value;
    }
  };
  const solvePuzzleAsync = async (): Promise<void> => {
    processing.value = !processing.value;
    serviceResult.value = null;
    serviceMessage.value = "";
    if (puzzle.value !== null) {
      const response: IServicePayload = await GamesService.solvePuzzleAsync(
        puzzle.value
      );
      updatePuzzle(response.puzzle);
      serviceResult.value = response.isSuccess;
      serviceMessage.value = response.message;
    }
    processing.value = !processing.value;
  };
  const generateSolutionAsync = async (): Promise<void> => {
    processing.value = !processing.value;
    serviceResult.value = null;
    serviceMessage.value = "";
    const response: IServicePayload =
      await GamesService.generateSolutionAsync();
    updateSolution(response.solution);
    serviceResult.value = response.isSuccess;
    serviceMessage.value = response.message;
    processing.value = !processing.value;
  };

  return {
    initialGame,
    game,
    puzzle,
    solution,
    gameState,
    selectedDifficulty,
    serviceResult,
    serviceMessage,
    processing,
    isSolveDisabled,
    getInitialGame,
    getGame,
    getPuzzle,
    getSolution,
    getGameState,
    getSelectedDifficulty,
    getServiceResult,
    getServiceMessage,
    getProcessing,
    getIsSolvedDisabled,
    initializeStore,
    initializeInitialGame,
    initializeGame,
    initializePuzzle,
    initializeSolution,
    updateInitialGame,
    updateGame,
    updatePuzzle,
    updateSolution,
    updateGameState,
    updateSelectedDifficulty,
    createGameAsync,
    checkGameAsync,
    solvePuzzleAsync,
    generateSolutionAsync,
  };
});
