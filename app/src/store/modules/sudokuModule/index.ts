import { Commit } from 'vuex';
import { Methods } from "@/store/modules/sudokuModule/common";
import { MutationTypes } from "@/store/modules/sudokuModule/mutationTypes";
import { ISudokuState } from "@/interfaces/store/iSudokuState";
import { GameState } from '@/enums/gameState';
import { Difficulty } from "@/models/domain/difficulty";
import { GamesService } from '@/services/gamesService';
import { IServicePayload } from '@/interfaces/infrastructure/iServicePayload';

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
    processing: false
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
    getGameState: (state: ISudokuState): GameState | null => {
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
    }
  },
  mutations: {
    [MutationTypes.INITIALIZEPUZZLE](state: ISudokuState) {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.INITIALIZEGAME](state: ISudokuState) {
      state.game = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEGAME](state: ISudokuState, game: Array<Array<string>>) {
      state.game = game;
    },
    [MutationTypes.INITIALIZEINITIALGAME](state: ISudokuState) {
      state.initialGame = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEINITIALGAME](state: ISudokuState, game: Array<Array<string>>) {
      state.initialGame = game;
    },
    [MutationTypes.INITIALIZEPUZZLE](state: ISudokuState) {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEPUZZLE](state: ISudokuState, puzzle: Array<Array<string>>) {
      state.puzzle = puzzle;
    },
    [MutationTypes.INITIALIZESOLUTION](state: ISudokuState) {
      state.solution = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATESOLUTION](state: ISudokuState, solution: Array<Array<string>>) {
      state.solution = solution;
    },
    [MutationTypes.UPDATESELECTEDDIFFICULTY](state: ISudokuState, difficulty: Difficulty) {
      state.selectedDifficulty = difficulty;
    },
    [MutationTypes.UPDATEGAMESTATE](state: ISudokuState, gameState: GameState) {
      state.gameState = gameState;
    },
    [MutationTypes.UPDATESERVICERESULT](state: ISudokuState, serviceResult: boolean | null) {
      state.serviceResult = serviceResult;
    },
    [MutationTypes.UPDATESERVICEMESSAGE](state: ISudokuState, serviceMessage: string | null) {
      state.serviceMessage = serviceMessage;
    },
    [MutationTypes.UPDATEPROCESSING](state: ISudokuState) {
      console.log('update processing invoked: ', state.processing);
      state.processing = !state.processing;
      console.log('update processing completed: ', state.processing);
    }
  },
  actions: {
    initializeModule({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEGAME);
      commit(MutationTypes.INITIALIZEINITIALGAME);
      commit(MutationTypes.INITIALIZEPUZZLE);
      commit(MutationTypes.INITIALIZESOLUTION);
    },
    initializeGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEGAME);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updateGame({ commit }: { commit: Commit }, game: Array<Array<string>>) {
      commit(MutationTypes.UPDATEGAME, game);
    },
    initializeInitialGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEINITIALGAME);
    },
    updateInitialGame({ commit }: { commit: Commit }, game: Array<Array<string>>) {
      commit(MutationTypes.UPDATEINITIALGAME, game);
    },
    initializePuzzle({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEPUZZLE);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updatePuzzle({ commit }: { commit: Commit }, puzzle: Array<Array<string>>) {
      commit(MutationTypes.UPDATEPUZZLE, puzzle);
    },
    initializeSolution({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZESOLUTION);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
    },
    updateSolution({ commit }: { commit: Commit }, puzzle: Array<Array<string>>) {
      commit(MutationTypes.UPDATESOLUTION, puzzle);
    },
    async createGameAsync({ commit, state }: { commit: Commit, state: ISudokuState },  gamesService: GamesService) {
      commit(MutationTypes.UPDATEPROCESSING);
      if (state.selectedDifficulty !== null) {
        const response: IServicePayload = await gamesService.createGameAsync(state.selectedDifficulty.difficultyLevel);
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
    async checkGameAsync({commit, state }: { commit: Commit, state: ISudokuState }, gameService: GamesService) {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.game !== null) {
        const response: IServicePayload = await gameService.checkGameAsync(state.game);
        const solvedGame = Array<Array<string>>(9);
        for (let i = 0; i < 9; i++) {
          solvedGame[i] = [];
          for (let j = 0; j < 9; j++) {
            solvedGame[i][j] = state.game[i][j];
          }
        }
        commit(MutationTypes.UPDATEINITIALGAME, solvedGame);
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
        commit(MutationTypes.UPDATEPROCESSING);
      }
    },
    async solvePuzzleAsync({ commit, state }: { commit: Commit, state: ISudokuState },  gamesService: GamesService) {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.puzzle !== null) {
        const response: IServicePayload = await gamesService.solvePuzzleAsync(state.puzzle);
        commit(MutationTypes.UPDATEPUZZLE, response.puzzle);
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
      }
      commit(MutationTypes.UPDATEPROCESSING);
    },
    async generateSolutionAsync({ commit, state }: { commit: Commit, state: ISudokuState },  gamesService: GamesService) {
      commit(MutationTypes.UPDATEPROCESSING);
      commit(MutationTypes.UPDATESERVICERESULT, null);
      commit(MutationTypes.UPDATESERVICEMESSAGE, null);
      if (state.puzzle !== null) {
        const response: IServicePayload = await gamesService.generateSolutionAsync();
        commit(MutationTypes.UPDATESOLUTION, response.solution);
        commit(MutationTypes.UPDATESERVICEMESSAGE, response.message);
        commit(MutationTypes.UPDATESERVICERESULT, response.isSuccess);
      }
      commit(MutationTypes.UPDATEPROCESSING);
    },
    updateGameState({ commit }: { commit: Commit }, gameState: GameState) {
      commit(MutationTypes.UPDATEGAMESTATE, gameState);
    },
    updateSelectedDifficulty({ commit }: { commit: Commit }, difficulty: Difficulty) {
      commit(MutationTypes.UPDATESELECTEDDIFFICULTY, difficulty);
    },
   }
}

export default sudokuModule;
