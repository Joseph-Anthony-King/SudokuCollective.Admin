import { Commit } from 'vuex';
import { ISudokuState } from "@/interfaces/store/iSudokuState";
import { Difficulty } from "@/models/domain/difficulty";
import { Methods } from "@/store/modules/sudokuModule/common";
import { MutationTypes } from "@/store/modules/sudokuModule/mutationTypes";

const sudokuModule = {
  namespaced: true,
  state: (): ISudokuState => ({
    puzzle: Array<Array<number>>(),
    game: Array<Array<number>>(),
    initialGame: Array<Array<number>>(),
    selectedDifficulty: null,
    playGame: true
  }),
  getters: {
    getState: (state: ISudokuState) => {
      return state;
    },
    getPuzzle: (state: ISudokuState) => {
      return state.puzzle;
    },
    getGame: (state: ISudokuState) => {
      return state.game;
    },
    getInitialGame: (state: ISudokuState) => {
      return state.initialGame;
    },
    getSelectedDifficulty: (state: ISudokuState) => {
      return state.selectedDifficulty;
    },
    getPlayGame: (state: ISudokuState) => {
      return state.playGame;
    },
  },
  mutations: {
    [MutationTypes.INITIALIZEPUZZLE](state: ISudokuState) {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEPUZZLE](state: ISudokuState, puzzle: Array<Array<number>>) {
      state.puzzle = puzzle;
    },
    [MutationTypes.REMOVEPUZZLE](state: ISudokuState) {
      state.puzzle = Methods.InitializeMatix();
    },
    [MutationTypes.INITIALIZEGAME](state: ISudokuState) {
      state.game = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEGAME](state: ISudokuState, game: Array<Array<number>>) {
      state.game = game;
    },
    [MutationTypes.REMOVEGAME](state: ISudokuState) {
      state.game = Methods.InitializeMatix();
    },
    [MutationTypes.INITIALIZEINITIALGAME](state: ISudokuState) {
      state.initialGame = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATEINITIALGAME](state: ISudokuState, game: Array<Array<number>>) {
      state.initialGame = game;
    },
    [MutationTypes.REMOVEINITIALGAME](state: ISudokuState) {
      state.initialGame = Methods.InitializeMatix();
    },
    [MutationTypes.UPDATESELECTEDDIFFICULTY](state: ISudokuState, difficulty: Difficulty) {
      state.selectedDifficulty = difficulty;
    },
    [MutationTypes.REMOVESELECTEDDIFFICULTY](state: ISudokuState) {
      state.selectedDifficulty = null;
    },
    [MutationTypes.UPDATEPLAYGAME](state: ISudokuState, playGame: boolean) {
      state.playGame = playGame;
    },
   },
  actions: {
    initializeModule({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEPUZZLE);
      commit(MutationTypes.INITIALIZEGAME);
      commit(MutationTypes.INITIALIZEINITIALGAME);
    },
    initializePuzzle({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEPUZZLE);
    },
    updatePuzzle({ commit }: { commit: Commit }, puzzle: Array<Array<number>>) {
      commit(MutationTypes.UPDATEPUZZLE, puzzle);
    },
    removePuzzle({ commit }: { commit: Commit }) {
      commit(MutationTypes.REMOVEPUZZLE);
    },
    initializeGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEGAME);
    },
    updateGame({ commit }: { commit: Commit }, game: Array<Array<number>>) {
      commit(MutationTypes.UPDATEGAME, game);
    },
    removeGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.REMOVEGAME);
    },
    initializeInitialGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.INITIALIZEINITIALGAME);
    },
    updateInitialGame({ commit }: { commit: Commit }, game: Array<Array<number>>) {
      commit(MutationTypes.UPDATEINITIALGAME, game);
    },
    removeInitialGame({ commit }: { commit: Commit }) {
      commit(MutationTypes.REMOVEINITIALGAME);
    },
    updateSelectedDifficulty({ commit }: { commit: Commit }, difficulty: Difficulty) {
      commit(MutationTypes.UPDATESELECTEDDIFFICULTY, difficulty);
    },
    removeSelectedDifficulty({ commit }: { commit: Commit }) {
      commit(MutationTypes.REMOVESELECTEDDIFFICULTY);
    },
    updatePlayGame({ commit }: { commit: Commit }, playGame: boolean) {
      commit(MutationTypes.UPDATEPLAYGAME, playGame);
    },
   }
}

export default sudokuModule;
