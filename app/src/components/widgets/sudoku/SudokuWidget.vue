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
          <div class='center' v-if='isGameStateSelected'>
            <v-card-title class='justify-center text-center'
              >Available Actions</v-card-title
            >
            <v-card-actions>
              <v-container>
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
              </v-container>
            </v-card-actions>
          </div>
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
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useServiceFailStore } from '@/store/serviceFailStore';
import { useSudokuStore } from '@/store/sudokuStore/index';
import { useValuesStore } from '@/store/valuesStore/index';
import MatrixWidget from '@/components/widgets/sudoku/MatrixWidget.vue';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { Difficulty } from '@/models/domain/difficulty';

/* initialize stores */
const serviceFailStore = useServiceFailStore();
const sudokuStore = useSudokuStore();
const valuesStore = useValuesStore();

/* difficulty properties and methods */
const difficulties: Ref<Difficulty[]> = ref(valuesStore.getDifficulties);
const selectedDifficulty: Ref<Difficulty | null> = ref(
  sudokuStore.getSelectedDifficulty
);
/* Game state properties and methods */
const gameStates: Ref<DropdownItem[]> = ref(valuesStore.getGameStates);
// eslint-disable-next-line
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
    result = sudokuStore.getGameState.value === GameState.PLAYGAME;
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
const execute = (): void => {
  if (
    selectedDifficulty.value !== null &&
    selectedGameState.value?.value === GameState.PLAYGAME
  ) {
    sudokuStore.createGameAsync();
  } else if (
    selectedGameState.value?.value === GameState.SOLVESUDOKU
  ) {
    sudokuStore.solvePuzzleAsync();
  } else {
    sudokuStore.generateSolutionAsync();
  }
};
const checkGame = (): void => {
  sudokuStore.checkGameAsync();
};
const resetGame = (): void => {
  const initialGame = sudokuStore.getInitialGame;
  const game = Array<Array<string>>(9);
  for (let i = 0; i < 9; i++) {
    game[i] = [];
    for (let j = 0; j < 9; j++) {
      game[i][j] = initialGame[i][j];
    }
  }
  sudokuStore.updateGame(game);
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
    sudokuStore.updateSelectedDifficulty(toRaw(selectedDifficulty.value));
  }
);
watch(
  () => sudokuStore.getServiceResult,
  () => {
    if (
      sudokuStore.getServiceResult !== null &&
      sudokuStore.getServiceMessage !== ''
    ) {
      toast(sudokuStore.getServiceMessage, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
    }
  }
);
watch(
  () => serviceFailStore.getIsSuccess,
  () => {
    const isSuccess = serviceFailStore.getIsSuccess;
    if (isSuccess !== null && !isSuccess) {
      const message: string = serviceFailStore.getMessage;
      toast(message, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
      serviceFailStore.initializeStore();
    }
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
