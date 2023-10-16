<template>
  <v-container fluid>
    <v-card elevation='6' class='mx-auto'>
      <v-card-text>
        <v-container fluid>
          <div class='center'>
            <v-card-title>Game Modes</v-card-title>
            <v-select
              :items='gameStates'
              v-model='selectedGameState'
              item-title='label'
              item-value='value'
              label='Please make a selection'
              v-bind="{'return-object':true}"
              single-line
            ></v-select>
            <div v-if='isCurrentGameStatePlayGame'>
              <v-card-title class='justify-center'
                >Difficulty Level</v-card-title
              >
              <v-select
                :items='difficulties'
                v-model='selectedDifficulty'
                item-title='displayName'
                item-value='difficultyLevel'
                label='Please make a selection'
                v-bind="{'return-object':true}"
                single-line
              ></v-select>
            </div>
            <matrix-widget />
          </div>
          <available-actions v-if='isGameStateSelected'>
            <v-row dense>
              <v-col>
                <v-btn
                  class='button-full'
                  color='blue darken-1'
                  text
                  @click='execute'
                  :disabled='isExectuteButtonDisabed'
                >
                  {{ executeButtonText }}
                </v-btn>
              </v-col>
              <v-col v-if='isCurrentGameStatePlayGame'>
                <v-btn
                  class='button-full'
                  color='blue darken-1'
                  text
                  @click='checkGame'
                  :disabled='isExectuteButtonDisabed'
                >
                  Check Game
                </v-btn>
              </v-col>
              <v-col v-if='isCurrentGameStatePlayGame'>
                <v-btn
                  class='button-full'
                  color='blue darken-1'
                  text
                  @click='resetGame'
                  :disabled='isExectuteButtonDisabed'
                >
                  Reset Game
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  class='button-full'
                  color='blue darken-1'
                  text
                  @click='clear'
                >
                  {{ clearButtonText }}
                </v-btn>
              </v-col>
            </v-row>
          </available-actions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang='ts'>
import { 
  ref,
  Ref,
  computed,
  ComputedRef,
  toRaw,
  watch 
} from 'vue';
import { useAppStore } from '@/store/appStore/index';
import { useSudokuStore } from '@/store/sudokuStore/index';
import { useValuesStore } from '@/store/valuesStore/index';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import MatrixWidget from '@/components/widgets/sudoku/MatrixWidget.vue';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { Difficulty } from '@/models/domain/difficulty';
import commonUtilities from '@/utilities/common';

/* initialize stores */
const appStore = useAppStore();
const sudokuStore = useSudokuStore();
const valuesStore = useValuesStore();

const { displaySuccessfulToast, displayFailedToast } = commonUtilities();

/* difficulty properties and methods */
const difficulties: Ref<Difficulty[]> = ref(valuesStore.getDifficulties);
const selectedDifficulty: Ref<Difficulty | null> = ref(
  sudokuStore.getSelectedDifficulty
);
/* Game state properties and methods */
const gameStates: Ref<DropdownItem[]> = ref(valuesStore.getGameStates);
const selectedGameState: Ref<DropdownItem | null> = ref(
  sudokuStore.getGameState
);
const isGameStateSelected: ComputedRef<boolean> = computed(() => {
  {
    return sudokuStore.getGameState !== null;
  }
});
const isCurrentGameStatePlayGame: ComputedRef<boolean> = computed(() => {
  let result: boolean;
  if (sudokuStore.getGameState !== null) {
    result = sudokuStore.getGameState?.value === GameState.PLAYGAME;
  } else {
    result = false;
  }
  return result;
});
const isExectuteButtonDisabed: ComputedRef<boolean> = computed(() => {
  if (selectedGameState.value?.value === GameState.PLAYGAME) {
    if (selectedDifficulty?.value === null) {
      return true;
    } else {
      return false;
    }
  } else if (
    selectedGameState.value?.value === GameState.SOLVESUDOKU
  ) {
    return sudokuStore.getIsSolvedDisabled;
  } else {
    return false;
  }
});
const executeButtonText: ComputedRef<string> = computed(() => {
  if (selectedGameState.value?.value === GameState.PLAYGAME) {
    return 'Create Game';
  } else if (selectedGameState.value?.value === GameState.SOLVESUDOKU) {
    return 'Solve Sudoku';
  } else {
    return 'Generate Sudoku';
  }
});
const clearButtonText: ComputedRef<string> = computed(() => {
  if (
    selectedDifficulty.value !== null &&
    selectedGameState.value?.value === GameState.PLAYGAME
  ) {
    return 'Clear Game';
  } else {
    return 'Clear Sudoku';
  }
});
const execute = async (): Promise<void> => {
  appStore.updateProcessingStatus(true);
  if (
    selectedDifficulty.value !== null &&
    selectedGameState.value?.value === GameState.PLAYGAME
  ) {
    await sudokuStore.createGameAsync();
  } else if (
    selectedGameState.value?.value === GameState.SOLVESUDOKU
  ) {
    await sudokuStore.solvePuzzleAsync();
  } else {
    await sudokuStore.generateSolutionAsync();
  }
  appStore.updateProcessingStatus(false);
  displaySuccessfulToast('sudokuStore');
  displayFailedToast(undefined, undefined);
};
const checkGame = (): void => {
  appStore.updateProcessingStatus(true);
  sudokuStore.checkGameAsync();
  appStore.updateProcessingStatus(false);
  displaySuccessfulToast('sudokuStore');
  displayFailedToast(undefined, undefined);
};
const resetGame = (): void => {
  appStore.updateProcessingStatus(true);
  const initialGame = sudokuStore.getInitialGame;
  const game = Array<Array<string>>(9);
  for (let i = 0; i < 9; i++) {
    game[i] = [];
    for (let j = 0; j < 9; j++) {
      game[i][j] = initialGame[i][j];
    }
  }
  sudokuStore.updateGame(game);
  appStore.updateProcessingStatus(false);
  displaySuccessfulToast('sudokuStore');
  displayFailedToast(undefined, undefined);
};
const clear = (): void => {
  if (
    selectedGameState.value?.value === GameState.PLAYGAME
  ) {
    sudokuStore.initializeGame();
  } else if (
    selectedGameState.value?.value === GameState.SOLVESUDOKU
  ) {
    sudokuStore.initializePuzzle();
  } else {
    sudokuStore.initializeSolution();
  }
};
watch(
  () => valuesStore.getGameStates,
  () => {
    gameStates.value = toRaw(valuesStore.getGameStates);
  }
);
watch(
  () => selectedGameState?.value,
  () => {
    sudokuStore.updateGameState(toRaw(selectedGameState.value));
  }
);
watch(
  () => valuesStore.getDifficulties,
  () => {
    difficulties.value = toRaw(valuesStore.getDifficulties);
  }
);
watch(
  () => selectedDifficulty?.value,
  () => {
    sudokuStore.updateSelectedDifficulty(selectedDifficulty.value ? toRaw(selectedDifficulty.value) : null);
  }
);
</script>

<style lang='scss' scoped>
.v-card {
  @media (max-width: 600px) {
    padding: 0 0 0 0 !important;
    margin: 0 0 0 0 !important;
  }
}
.h1-margin {
  margin: 100px 0 100px 0;
}
</style>
