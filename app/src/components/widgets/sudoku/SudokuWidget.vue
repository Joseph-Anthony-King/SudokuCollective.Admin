<template>
  <v-container fluid>
    <v-card
      elevation="6"
      class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <div class="center">
            <v-card-title>Game Modes</v-card-title>
            <v-select
              :items="gameStates"
              v-model="selectedGameState"
              item-title="label"
              item-value="value"
              label="Please make a selection"
              v-bind="{ 'return-object': true }"
              single-line></v-select>
            <div v-if="isCurrentGameStatePlayGame">
              <v-card-title class="justify-center">Difficulty Level</v-card-title>
              <v-select
                :items="difficulties"
                v-model="selectedDifficulty"
                item-title="displayName"
                item-value="difficultyLevel"
                label="Please make a selection"
                v-bind="{ 'return-object': true }"
                single-line></v-select>
            </div>
            <matrix-widget />
          </div>
          <AvailableActions v-if="isGameStateSelected">
            <v-row dense>
              <v-col
                cols="12"
                :md="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6"
                :lg="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6"
                :xl="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6">
                <v-btn
                  class="button-full"
                  color="blue darken-1"
                  variant="text"
                  @click="executeHandlerAsync($event)"
                  :disabled="isExectuteButtonDisabed">
                  {{ executeButtonText }}
                </v-btn>
              </v-col>
              <v-col
                v-if="isCurrentGameStatePlayGame"
                cols="12"
                md="3"
                lg="3"
                xl="3">
                <v-btn
                  class="button-full"
                  color="blue darken-1"
                  variant="text"
                  @click="checkGameHandlerAsync($event)"
                  :disabled="isExectuteButtonDisabed || isCurrentGameInPlay">
                  Check Game
                </v-btn>
              </v-col>
              <v-col
                v-if="isCurrentGameStatePlayGame"
                cols="12"
                md="3"
                lg="3"
                xl="3">
                <v-btn
                  class="button-full"
                  color="blue darken-1"
                  variant="text"
                  @click="resetGameHandlerAsync($event)"
                  :disabled="isExectuteButtonDisabed || isCurrentGameInPlay">
                  Reset Game
                </v-btn>
              </v-col>
              <v-col
                v-if="isCurrentGameStateSolveSudoku"
                cols="12"
                md="4"
                lg="4"
                xl="4">
                <v-btn
                  class="button-full"
                  color="blue darken-1"
                  variant="text"
                  @click="getCurrentGameHandler($event)"
                  :disabled="isCurrentGameInPlay">
                  Current Game
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                :md="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6"
                :lg="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6"
                :xl="isCurrentGameStatePlayGame ? 3 : isCurrentGameStateSolveSudoku ? 4 : 6">
                <v-btn
                  class="button-full"
                  color="blue darken-1"
                  variant="text"
                  @click="clearHandler">
                  {{ clearButtonText }}
                </v-btn>
              </v-col>
            </v-row>
          </AvailableActions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  /* eslint-disable no-unused-vars */
  import {
    type ComputedRef,
    computed,
    type Ref,
    ref,
    toRaw,
    watch,
    onMounted,
    onUnmounted,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useSudokuStore } from '@/stores/sudokuStore';
  import { useValueStore } from '@/stores/valueStore';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import MatrixWidget from '@/components/widgets/sudoku/MatrixWidget.vue';
  import { DialogType } from '@/enums/dialogType';
  import { StoreType } from '@/enums/storeTypes';
  import { DropdownItem } from '@/models/infrastructure/dropdownItem';
  import { Difficulty } from '@/models/domain/difficulty';
  import commonUtilities from '@/utilities/common';

  const { displaySuccessfulToast, displayFailedToastAsync, updateAppProcessingAsync } =
    commonUtilities();

  //#region Destructure Stores
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#region SudokuStore
  const sudokuStore = useSudokuStore();
  const {
    getGame,
    getGameState,
    getSelectedDifficulty,
    getInitialGame,
    getIsGameCurrent,
    getIsSolvedDisabled,
    getPuzzleIsReady,
  } = storeToRefs(sudokuStore);
  const {
    createGameAsync,
    generateSolutionAsync,
    initializeGame,
    initializePuzzle,
    initializeSolution,
    checkGameAsync,
    updateGame,
    updateGameState,
    updatePuzzle,
    updateSelectedDifficulty,
    solvePuzzleAsync,
  } = sudokuStore;
  //#endregion
  const valueStore = useValueStore();
  const { getDifficulties, getGameStates } = storeToRefs(valueStore);
  //#endregion

  //#region Properties
  const difficulties: Ref<Difficulty[]> = ref(getDifficulties.value);
  const selectedDifficulty: Ref<Difficulty | null> = ref(getSelectedDifficulty.value);
  const gameStates: Ref<DropdownItem[]> = ref(getGameStates.value);
  const selectedGameState: Ref<DropdownItem | null> = ref(getGameState.value);
  //#endregion

  //#region Computed Properties
  const isGameStateSelected: ComputedRef<boolean> = computed(() => {
    {
      return selectedGameState.value !== null;
    }
  });
  // GameState.PLAYGAME = 0
  const isCurrentGameStatePlayGame: ComputedRef<boolean> = computed(() => {
    let result: boolean;
    if (selectedGameState.value !== null) {
      result = selectedGameState.value.value === 0;
    } else {
      result = false;
    }
    return result;
  });
  // GameState.SOLVESUDOKU = 1
  const isCurrentGameStateSolveSudoku: ComputedRef<boolean> = computed(() => {
    let result: boolean;
    if (selectedGameState.value !== null) {
      result = selectedGameState.value.value === 1;
    } else {
      result = false;
    }
    return result;
  });
  // GameState.PLAYGAME = 0 and GameState.SOLVESUDOKU = 1
  const isExectuteButtonDisabed: ComputedRef<boolean> = computed(() => {
    if (selectedGameState.value?.value === 0) {
      if (selectedDifficulty?.value === null) {
        return true;
      } else {
        return false;
      }
    } else if (selectedGameState.value?.value === 1) {
      return getIsSolvedDisabled.value || getPuzzleIsReady.value;
    } else {
      return false;
    }
  });
  const isCurrentGameInPlay: ComputedRef<boolean> = computed(() => !getIsGameCurrent.value);
  // GameState.PLAYGAME = 0 and GameState.SOLVESUDOKU = 1
  const executeButtonText: ComputedRef<string> = computed(() => {
    if (selectedGameState.value?.value === 0) {
      return 'Create Game';
    } else if (selectedGameState.value?.value === 1) {
      return 'Solve Sudoku';
    } else {
      return 'Generate Sudoku';
    }
  });
  // GameState.PLAYGAME = 0 and GameState.SOLVESUDOKU = 1
  const clearButtonText: ComputedRef<string> = computed(() => {
    if (selectedDifficulty.value !== null && selectedGameState.value?.value === 0) {
      return 'Clear Game';
    } else {
      return 'Clear Sudoku';
    }
  });
  //#endregion

  //#region Action Handlers
  // GameState.PLAYGAME = 0 and GameState.SOLVESUDOKU = 1
  const executeHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    if (selectedDifficulty.value !== null && selectedGameState.value?.value === 0) {
      if (
        selectedDifficulty.value.difficultyLevel === 4 ||
        selectedDifficulty.value.difficultyLevel === 5
      ) {
        updateDialog(
          'Confirm Mighty Mountain Lion / <br/>Sneaky Shark',
          'Games with a <b>Mighty Mountain Lion</b> or <b>Sneaky Shark</b> difficulty level can average between 30 seconds to 1 minute to generate.  You will have the option to cancel this request after 10 seconds. <br /><br />Are you sure you want to continue?',
          DialogType.CONFIRM,
          async () => {
            await updateAppProcessingAsync(async () => {
              await createGameAsync();
              displaySuccessfulToast(StoreType.SUDOKUSTORE);
              await displayFailedToastAsync(undefined, undefined);
            });
          },
        );
      } else {
        await updateAppProcessingAsync(async () => {
          await createGameAsync();
          displaySuccessfulToast(StoreType.SUDOKUSTORE);
          await displayFailedToastAsync(undefined, undefined);
        });
      }
    } else if (selectedGameState.value?.value === 1) {
      await updateAppProcessingAsync(async () => {
        await solvePuzzleAsync();
        displaySuccessfulToast(StoreType.SUDOKUSTORE);
        await displayFailedToastAsync(undefined, undefined);
      });
    } else {
      await updateAppProcessingAsync(async () => {
        await generateSolutionAsync();
        displaySuccessfulToast(StoreType.SUDOKUSTORE);
        await displayFailedToastAsync(undefined, undefined);
      });
    }
  };
  const checkGameHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(async () => {
      await checkGameAsync();
      displaySuccessfulToast(StoreType.SUDOKUSTORE);
      await displayFailedToastAsync(undefined, undefined);
    });
  };
  const resetGameHandlerAsync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    await updateAppProcessingAsync(async () => {
      const initialGame = getInitialGame.value;
      const game = Array<Array<string>>(9);
      for (let i = 0; i < 9; i++) {
        game[i] = [];
        for (let j = 0; j < 9; j++) {
          game[i][j] = initialGame[i][j];
        }
      }
      updateGame(game);
      displaySuccessfulToast(StoreType.SUDOKUSTORE);
      await displayFailedToastAsync(undefined, undefined);
    });
  };
  const getCurrentGameHandler = (event: Event | null = null): void => {
    updatePuzzle(getGame.value);
  };
  // GameState.PLAYGAME = 0 and GameState.SOLVESUDOKU = 1
  const clearHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    if (selectedGameState.value?.value === 0) {
      initializeGame();
    } else if (selectedGameState.value?.value === 1) {
      initializePuzzle();
    } else {
      initializeSolution();
    }
  };
  //#endregion

  //#region Watchers
  watch(
    () => getGameStates.value,
    (newValue, oldValue) => {
      gameStates.value = newValue;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => selectedGameState?.value,
    (newValue, oldValue) => {
      updateGameState(toRaw(newValue));
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getDifficulties.value,
    (newValue, oldValue) => {
      difficulties.value = newValue;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => selectedDifficulty.value,
    (newValue, oldValue) => {
      updateSelectedDifficulty(newValue ? toRaw(newValue) : null);
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onMounted(() => {
    document.addEventListener(
      'keyup',
      async (event) => {
        if (event.key === 'Enter' && selectedGameState.value?.value !== undefined) {
          if (selectedGameState.value?.value === 0) {
            await checkGameHandlerAsync(event);
          } else if (selectedGameState.value?.value === 1) {
            await executeHandlerAsync(event);
          } else {
            await executeHandlerAsync(event);
          }
        }
      },
      { once: true },
    );
  });
  onUnmounted(() => {
    document.removeEventListener('keyup', () => {});
  });
  //#endregion
</script>

<style lang="scss" scoped>
  .v-card {
    @media (max-width: 600px) {
      padding: 0 0 0 0 !important;
      margin: 0 0 0 0 !important;
    }

    width: 100%;
  }

  .h1-margin {
    margin: 100px 0 100px 0;
  }
</style>
