<template>
  <v-container fluid>
    <v-card elevation="6" class="mx-auto">
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
              return-object
              single-line
            ></v-select>
            <div v-if="isCurrentGameStatePlayGame">
              <v-card-title class="justify-center"
                >Difficulty Level</v-card-title
              >
              <v-select
                :items="difficulties"
                v-model="selectedDifficulty"
                item-title="displayName"
                item-value="difficultyLevel"
                label="Please make a selection"
                return-object
                single-line
              ></v-select>
            </div>
            <matrix-widget />
          </div>
          <div class="center" v-if="isGameStateSelected">
            <v-card-title class="justify-center text-center"
              >Available Actions</v-card-title
            >
            <v-card-actions>
              <v-container>
                <v-row dense>
                  <v-col>
                    <v-btn
                      class="button-full"
                      color="blue darken-1"
                      text
                      @click="execute"
                      :disabled="isExectuteButtonDisabed"
                    >
                      {{ executeButtonText }}
                    </v-btn>
                  </v-col>
                  <v-col v-if="isCurrentGameStatePlayGame">
                    <v-btn
                      class="button-full"
                      color="blue darken-1"
                      text
                      @click="checkGame"
                      :disabled="isExectuteButtonDisabed"
                    >
                      Check Game
                    </v-btn>
                  </v-col>
                  <v-col v-if="isCurrentGameStatePlayGame">
                    <v-btn
                      class="button-full"
                      color="blue darken-1"
                      text
                      @click="resetGame"
                      :disabled="isExectuteButtonDisabed"
                    >
                      Reset Game
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      class="button-full"
                      color="blue darken-1"
                      text
                      @click="clear"
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

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { computed, ComputedRef, Ref, toRaw } from "@vue/reactivity";
import store from "@/store";
import MatrixWidget from "@/components/widgets/sudoku/MatrixWidget.vue";
import { GameState } from "@/enums/gameState";
import { Difficulty } from "@/models/domain/difficulty";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";

export default defineComponent({
  name: "SudokuWidget",
  components: { MatrixWidget },
  setup() {
    /* difficulty properties and methods */
    const difficulties: Difficulty[] | undefined = ref(
      store.getters["valuesModule/getDifficulties"]
    );
    const selectedDifficulty: Ref<Difficulty> | undefined = ref(
      store.getters["sudokuModule/getSelectedDifficulty"]
    );
    /* Game state properties and methods */
    const gameStates: GameState[] | undefined = ref(
      store.getters["valuesModule/getGameStates"]
    );
    // eslint-disable-next-line
    const selectedGameState: Ref<DropdownItem> | undefined = ref(
      store.getters["sudokuModule/getGameState"]
    );
    const isGameStateSelected: ComputedRef<boolean> = computed(() => {
      {
        return store.getters["sudokuModule/getGameState"] !== null;
      }
    });
    const isCurrentGameStatePlayGame: ComputedRef<boolean> = computed(() => {
      let result: boolean;
      if (store.getters["sudokuModule/getGameState"] !== null) {
        result =
          store.getters["sudokuModule/getGameState"].value ===
          GameState.PLAYGAME;
      } else {
        result = false;
      }
      return result;
    });
    const isExectuteButtonDisabed: ComputedRef<boolean> = computed(() => {
      if (selectedGameState?.value.value === GameState.PLAYGAME) {
        if (selectedDifficulty?.value === null) {
          return true;
        } else {
          return false;
        }
      } else if (selectedGameState?.value.value === GameState.SOLVESUDOKU) {
        return store.getters["sudokuModule/getIsSolvedDisabled"];
      } else {
        return false;
      }
    });
    const executeButtonText: ComputedRef<string> = computed(() => {
      if (selectedGameState?.value.value === GameState.PLAYGAME) {
        return "Create Game";
      } else if (selectedGameState?.value.value === GameState.SOLVESUDOKU) {
        return "Solve Sudoku";
      } else {
        return "Generate Sudoku";
      }
    });
    const clearButtonText: ComputedRef<string> = computed(() => {
      if (selectedGameState?.value.value === GameState.PLAYGAME) {
        return "Clear Game";
      } else {
        return "Clear Sudoku";
      }
    });
    const execute = (): void => {
      if (selectedGameState?.value.value === GameState.PLAYGAME) {
        store.dispatch("sudokuModule/createGameAsync");
      } else if (selectedGameState?.value.value === GameState.SOLVESUDOKU) {
        store.dispatch("sudokuModule/solvePuzzleAsync");
      } else {
        store.dispatch("sudokuModule/generateSolutionAsync");
      }
    };
    const checkGame = (): void => {
      store.dispatch("sudokuModule/checkGameAsync");
    };
    const resetGame = (): void => {
      const initialGame = store.getters["sudokuModule/getInitialGame"];
      const game = Array<Array<string>>(9);
      for (let i = 0; i < 9; i++) {
        game[i] = [];
        for (let j = 0; j < 9; j++) {
          game[i][j] = initialGame[i][j];
        }
      }
      store.dispatch("sudokuModule/updateGame", game);
    };
    const clear = (): void => {
      if (selectedGameState?.value.value === GameState.PLAYGAME) {
        store.dispatch("sudokuModule/initializeGame");
      } else if (selectedGameState?.value.value === GameState.SOLVESUDOKU) {
        store.dispatch("sudokuModule/initializePuzzle");
      } else {
        store.dispatch("sudokuModule/initializeSolution");
      }
    };
    watch(
      () => selectedGameState?.value,
      function () {
        store.dispatch(
          "sudokuModule/updateGameState",
          toRaw(selectedGameState?.value)
        );
      }
    );
    watch(
      () => selectedDifficulty?.value,
      function () {
        store.dispatch(
          "sudokuModule/updateSelectedDifficulty",
          toRaw(selectedDifficulty?.value)
        );
      }
    );
    watch(
      () => store.getters["sudokuModule/getServiceResult"],
      function () {
        if (store.getters["sudokuModule/getServiceResult"] !== null) {
          alert(store.getters["sudokuModule/getServiceMessage"]);
        }
      }
    );
    return {
      gameStates,
      selectedGameState,
      isGameStateSelected,
      isCurrentGameStatePlayGame,
      isExectuteButtonDisabed,
      executeButtonText,
      clearButtonText,
      execute,
      checkGame,
      resetGame,
      clear,
      difficulties,
      selectedDifficulty,
    };
  },
});
</script>

<style lang="scss" scoped>
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
