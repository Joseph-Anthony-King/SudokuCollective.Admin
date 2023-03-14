import { Difficulty } from "@/models/domain/difficulty";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";
import { defineStore } from "pinia";
import { ComputedRef, Ref, computed, ref } from "vue";
import { Methods } from "@/store/sudokuStore/common";
import { GamesService } from "@/services/gamesService";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { MutationTypes } from "../modules/serviceFailModule/mutationTypes";

export const useSudokuStore = defineStore("sudokuStore", () => {
	const initialGame: Ref<Array<Array<string>> | null> = ref(null);
	const game: Ref<Array<Array<string>> | null> = ref(null);
	const puzzle: Ref<Array<Array<string>> | null> = ref(null);
	const solution: Ref<Array<Array<string>> | null> = ref(null);
	const gameState: Ref<DropdownItem | null> = ref(null);
	const selectedDifficulty: Ref<Difficulty | null> = ref(null);
	const serviceResult: Ref<boolean | null> = ref(null);
	const serviceMessage: Ref<string> = ref("");
	const processing: Ref<boolean> = ref(false);
	const isSolveDisabled: Ref<boolean | null> = ref(null);

	const getInitialGame: ComputedRef<Array<Array<string>>> = computed(() => 
		initialGame.value !== null ? initialGame.value : new Array<Array<string>>());
	const getGame: ComputedRef<Array<Array<string>>> = computed(() => 
		game.value !== null ? game.value : new Array<Array<string>>());
	const getPuzzle: ComputedRef<Array<Array<string>>> = computed(() => 
		puzzle.value !== null ? puzzle.value : new Array<Array<string>>());
	const getSolution: ComputedRef<Array<Array<string>>> = computed(() => 
		solution.value !== null ? solution.value : new Array<Array<string>>());
	const getGameState: ComputedRef<DropdownItem> = computed(() =>
		gameState.value !== null ? gameState.value : new DropdownItem());
	const getSelectedDifficulty: ComputedRef<Difficulty> = computed(() => 
		selectedDifficulty.value !== null ? selectedDifficulty.value : new Difficulty());
	const getServiceResult: ComputedRef<boolean> = computed(() => 
		serviceResult.value !== null ? serviceResult.value : false);
	const getServiceMessage: ComputedRef<string> = computed(() => serviceMessage.value);
	const getProcessing: ComputedRef<boolean> = computed(() => processing.value);
	const getIsSolvedDisabled: ComputedRef<boolean> = computed(() =>
		isSolveDisabled.value !== null ? isSolveDisabled.value : false);
	
	const initializeStore = (): void => {
		initializeInitialGame();
		initializeGame();
		initializePuzzle();
		initializeSolution();
		isSolveDisabled.value = true;
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
	const updateGameState = (param: DropdownItem): void => {
		gameState.value = param;
	};
	const updateSelectedDifficulty = (param: Difficulty): void => {
		selectedDifficulty.value = param;
	};
	const createGameAsync = async (): Promise<void> => {
		processing.value = !processing.value;
		if (selectedDifficulty.value !== null) {
			const response: IServicePayload = await GamesService.createGameAsync(selectedDifficulty.value.difficultyLevel);
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
			const response: IServicePayload = await GamesService.checkGameAsync(game.value);
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
			const response: IServicePayload = await GamesService.solvePuzzleAsync(puzzle.value);
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
		const response: IServicePayload = await GamesService.generateSolutionAsync();
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
		generateSolutionAsync
	}
}, { persist: true });