import { Commit } from "vuex";
import { Methods } from "@/store/modules/sudokuModule/common";
import { MutationTypes } from "@/store/modules/sudokuModule/mutationTypes";
import { GamesService } from "@/services/gamesService";
import { IServicePayload } from "@/interfaces/infrastructure/iServicePayload";
import { ISudokuState } from "@/interfaces/store/iSudokuState";
import { GameState } from "@/enums/gameState";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";
import { Difficulty } from "@/models/domain/difficulty";

const sudokuModule = {
  namespaced: true,
  state: (): ISudokuState => ({
    game: null,
    initialGame: null,
    puzzle: null,
    solution: null,
    gameState: null,
    selectedDifficulty: null,
    serviceResult: null,
    serviceMessage: null,
    processing: false,
    isSolveDisabled: null
  }),
  getters: {
    getState: (state: ISudokuState): ISudokuState => {
      return state;
    },
    getGame: (state: ISudokuState): Array<Array<string>> | null => {
      return state.game;
    },
    getInitialGame: (state: ISudokuState): Array<Array<string>> | null => {
      return state.initialGame;
    },
    getPuzzle: (state: ISudokuState): Array<Array<string>> | null => {
      return state.puzzle;
    },
    getSolution: (state: ISudokuState): Array<Array<string>> | null => {
      return state.solution;
    },
    getGameState: (state: ISudokuState): DropdownItem | null => {
      return state.gameState;
    },
    getSelectedDifficulty: (state: ISudokuState): Difficulty | null => {
      return state.selectedDifficulty;
    },
    getServiceResult: (state: ISudokuState): boolean | null => {
      return state.serviceResult;
    },
    getServiceMessage: (state: ISudokuState): string | null => {
      return state.serviceMessage;
    },
    getProcessing: (state: ISudokuState): boolean => {
      return state.processing;
    },
    getIsSolvedDisabled: (state: ISudokuState): boolean | null => {
      return state.isSolveDisabled;
    }
  },
  mutations: {
    [MutationTypes.INITIALIZEPUZZLE](state: ISudokuState): void {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.INITIALIZEGAME](state: ISudokuState): void {
      state.game = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEGAME](state: ISudokuState, game: Array<Array<string>>): void {
      state.game = game;
    },
    [MutationTypes.INITIALIZEINITIALGAME](state: ISudokuState): void {
      state.initialGame = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEINITIALGAME](state: ISudokuState, game: Array<Array<string>>): void {
      state.initialGame = game;
    },
    [MutationTypes.INITIALIZEPUZZLE](state: ISudokuState): void {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEPUZZLE](state: ISudokuState, puzzle: Array<Array<string>>): void {
      state.puzzle = puzzle;
    },
    [MutationTypes.INITIALIZESOLUTION](state: ISudokuState): void {
      state.solution = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATESOLUTION](state: ISudokuState, solution: Array<Array<string>>): void {
      state.solution = solution;
    },
    [MutationTypes.UPDATESELECTEDDIFFICULTY](state: ISudokuState, difficulty: Difficulty): void {
      state.selectedDifficulty = difficulty;
    },
    [MutationTypes.UPDATEGAMESTATE](state: ISudokuState, gameState: DropdownItem): void {
      state.gameState = gameState;
    },
    [MutationTypes.UPDATESERVICERESULT](state: ISudokuState, serviceResult: boolean | null): void {
      state.serviceResult = serviceResult;
    },
    [MutationTypes.UPDATESERVICEMESSAGE](state: ISudokuState, serviceMessage: string | null): void {
      state.serviceMessage = serviceMessage;
    },
    [MutationTypes.UPDATEPROCESSING](state: ISudokuState): void {
      state.processing = !state.processing;
    },
    [MutationTypes.UPDATEISSOLVEDISABLED](state: ISudokuState, isDisabled: boolean): void {
      state.isSolveDisabled = isDisabled;
    }
  },
  actions: {
    initializeModule({ commit, state }: { commit: Commit, state: ISudokuState }): void {
      if (state.game === null && state.puzzle === null && state.solution === null) {
        commit(MutationTypes.INITIALIZEGAME);
        commit(MutationTypes.INITIALIZEINITIALGAME);
        commit(MutationTypes.UPDATEISSOLVEDISABLED, true);
        commit(MutationTypes.INITIALIZEPUZZLE);
        commit(MutationTypes.INITIALIZESOLUTION);
      }
    },
    initializeGame({ commit }: { commit: Commit }): void {
      commit(MutationTypes.INITIALIZEGAME);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updateGame({ commit }: { commit: Commit }, game: Array<Array<string>>): void {
      commit(MutationTypes.UPDATEGAME, game);
    },
    initializeInitialGame({ commit }: { commit: Commit }): void {
      commit(MutationTypes.INITIALIZEINITIALGAME);
    },
    updateInitialGame({ commit }: { commit: Commit }, game: Array<Array<string>>): void {
      commit(MutationTypes.UPDATEINITIALGAME, game);
    },
    initializePuzzle({ commit }: { commit: Commit }): void {
      commit(MutationTypes.UPDATEISSOLVEDISABLED, true);
      commit(MutationTypes.INITIALIZEPUZZLE, true);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updatePuzzle({ commit }: { commit: Commit }, puzzle: Array<Array<string>>): void {
      commit(MutationTypes.UPDATEISSOLVEDISABLED, false);
      commit(MutationTypes.UPDATEPUZZLE, puzzle);
    },
    initializeSolution({ commit }: { commit: Commit }): void {
      commit(MutationTypes.INITIALIZESOLUTION);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updateSolution({ commit }: { commit: Commit }, puzzle: Array<Array<string>>): void {
      commit(MutationTypes.UPDATESOLUTION, puzzle);
    },
    async createGameAsync({ commit, state }: { commit: Commit, state: ISudokuState }): Promise<void> {
      commit(MutationTypes.UPDATEPROCESSING);
      if (state.selectedDifficulty !== null) {
        const response: IServicePayload = await GamesService.createGameAsync(state.selectedDifficulty.difficultyLevel);
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
        commit(MutationTypes.UPDATEINITIALGAME, initialGame);
        commit(MutationTypes.UPDATEGAME, game);
        commit(MutationTypes.UPDATESERVICERESULT, null);
        commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      }
      commit(MutationTypes.UPDATEPROCESSING);
    },
    async checkGameAsync({commit, state }: { commit: Commit, state: ISudokuState }): Promise<void> {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.game !== null) {
        const response: IServicePayload = await GamesService.checkGameAsync(state.game);
        if (response.isSuccess) {
          const solvedGame = Array<Array<string>>(9);
          for (let i = 0; i < 9; i++) {
            solvedGame[i] = [];
            for (let j = 0; j < 9; j++) {
              solvedGame[i][j] = state.game[i][j];
            }
          }
          commit(MutationTypes.UPDATEINITIALGAME, solvedGame);
        }
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
        commit(MutationTypes.UPDATEPROCESSING);
      }
    },
    async solvePuzzleAsync({ commit, state }: { commit: Commit, state: ISudokuState }): Promise<void> {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.puzzle !== null) {
        const response: IServicePayload = await GamesService.solvePuzzleAsync(state.puzzle);
        commit(MutationTypes.UPDATEPUZZLE, response.puzzle);
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
      }
      commit(MutationTypes.UPDATEPROCESSING);
    },
    async generateSolutionAsync({ commit, state }: { commit: Commit, state: ISudokuState }): Promise<void> {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.puzzle !== null) {
        const response: IServicePayload = await GamesService.generateSolutionAsync();
        commit(MutationTypes.UPDATESOLUTION, response.solution);
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
      }
      commit(MutationTypes.UPDATEPROCESSING);
    },
    updateGameState({ commit }: { commit: Commit }, gameState: GameState): void {
      commit(MutationTypes.UPDATEGAMESTATE, gameState);
    },
    updateSelectedDifficulty({ commit }: { commit: Commit }, difficulty: Difficulty): void {
      commit(MutationTypes.UPDATESELECTEDDIFFICULTY, difficulty);
    },
  }
}

export default sudokuModule;
