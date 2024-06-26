<template>
  <v-card-title class="justify-center text-center">Sudoku Collective</v-card-title>
  <div>
    <v-row
      v-for="(row, rowIndex) in matrix"
      :key="rowIndex"
      cols="12"
      class="ma-0 pa-0 justify-center">
      <v-text-field
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        variant="outlined"
        v-model="row[cellIndex]"
        @blur="validateEntry(rowIndex, cellIndex)"
        type="number"
        min="1"
        max="9"
        :bg-color="applyOddRegionStyling(rowIndex, cellIndex) ? 'primary' : 'white'"
        :class="applyTextColorStyling(rowIndex, cellIndex)"
        class="sudoku-cell ma-0 pa-0"
        :readonly="isReadOnly(rowIndex, cellIndex)"></v-text-field>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  /* eslint-disable no-unused-vars */
  import { ref, onBeforeMount, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useSudokuStore } from '@/stores/sudokuStore';
  import { obtainMatrix, applyOddRegion, applyTextColor } from '@/components/widgets/sudoku/common';
  import { DropdownItem } from '@/models/infrastructure/dropdownItem';
  import { GameState } from '@/enums/gameState';

  //#region Destructure Stores
  const sudokuStore = useSudokuStore();
  const { getGame, getPuzzle, getSolution, getInitialGame, getGameState } =
    storeToRefs(sudokuStore);
  const { updateGame, updatePuzzle } = sudokuStore;
  //#endregion

  //#region Properties
  const matrix = ref(Array<Array<string>>());
  let gameState: DropdownItem | null = getGameState.value;
  //#endregion

  //#region Action Handlers
  const applyOddRegionStyling = (rowIndex: number, cellIndex: number): boolean => {
    return applyOddRegion(rowIndex, cellIndex);
  };
  const applyTextColorStyling = (rowIndex: number, cellIndex: number): string => {
    return applyTextColor(rowIndex, cellIndex);
  };
  const validateEntry = (rowIndex: number, cellIndex: number): void => {
    var entry = parseInt(matrix.value[rowIndex][cellIndex]);

    if (entry < 1 || entry > 9) {
      matrix.value[rowIndex][cellIndex] = '';
    } else {
      matrix.value[rowIndex][cellIndex] = matrix.value[rowIndex][cellIndex].toString();
      const sudoku = Array<Array<string>>(9);
      for (let i = 0; i < 9; i++) {
        sudoku[i] = [];
        for (let j = 0; j < 9; j++) {
          sudoku[i][j] = matrix.value[i][j];
        }
      }
      if (gameState?.value === GameState.PLAYGAME) {
        updateGame(sudoku);
      } else if (gameState?.value === GameState.SOLVESUDOKU) {
        updatePuzzle(sudoku);
      }
    }
  };
  const isReadOnly = (rowIndex: number, cellIndex: number): boolean => {
    if (gameState !== null) {
      if (gameState?.value === GameState.PLAYGAME) {
        const initialGame = getInitialGame.value;
        if (initialGame[rowIndex][cellIndex] === '') {
          return false;
        } else {
          return true;
        }
      } else if (gameState?.value === GameState.SOLVESUDOKU) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  //#endregion

  //#region Watches
  watch(
    () => getGameState.value,
    (newValue, oldValue) => {
      gameState = newValue;
      matrix.value = obtainMatrix();
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getGame.value,
    (newValue, oldValue) => {
      if (gameState?.value === GameState.PLAYGAME) {
        const game = newValue;
        matrix.value = Array<Array<string>>(9);

        for (let i = 0; i < 9; i++) {
          matrix.value[i] = [];
          for (let j = 0; j < 9; j++) {
            matrix.value[i][j] = game[i][j];
          }
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getPuzzle.value,
    (newValue, oldValue) => {
      if (gameState?.value === GameState.SOLVESUDOKU) {
        const puzzle = newValue;
        matrix.value = Array<Array<string>>(9);

        for (let i = 0; i < 9; i++) {
          matrix.value[i] = [];
          for (let j = 0; j < 9; j++) {
            matrix.value[i][j] = puzzle[i][j];
          }
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getSolution.value,
    (newValue, oldValue) => {
      if (gameState?.value === GameState.GENERATESUDOKU) {
        const solution = newValue;
        matrix.value = Array<Array<string>>(9);

        for (let i = 0; i < 9; i++) {
          matrix.value[i] = [];
          for (let j = 0; j < 9; j++) {
            matrix.value[i][j] = solution[i][j];
          }
        }
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onBeforeMount(() => {
    matrix.value = obtainMatrix();
  });
  //#endregion
</script>

<style lang="scss" scoped>
  @media only screen and (max-width: 320px) {
    .v-text-field {
      max-width: 27px;
      max-height: 48px;
      font-weight: bold;
      :deep(input) {
        font-size: 12px;
      }
    }
  }
  @media only screen and (min-width: 321px) and (max-width: 329px) {
    .v-text-field {
      max-width: 28px;
      max-height: 54px;
      font-weight: bold;
      :deep(input) {
        font-size: 12px;
      }
    }
  }
  @media only screen and (min-width: 330px) and (max-width: 338px) {
    .v-text-field {
      max-width: 29px;
      max-height: 54px;
      font-weight: bold;
      :deep(input) {
        font-size: 12px;
      }
    }
  }
  @media only screen and (min-width: 339px) and (max-width: 347px) {
    .v-text-field {
      max-width: 30px;
      max-height: 54px;
      font-weight: bold;
      :deep(input) {
        font-size: 12px;
      }
    }
  }
  @media only screen and (min-width: 348px) and (max-width: 356px) {
    .v-text-field {
      max-width: 31px;
      max-height: 54px;
      font-weight: bold;
      :deep(input) {
        font-size: 12px;
      }
    }
  }
  @media only screen and (min-width: 357px) and (max-width: 411px) {
    .v-text-field {
      max-width: 32px;
      max-height: 54px;
      font-weight: bold;
      :deep(input) {
        font-size: 14px;
      }
    }
  }
  @media only screen and (min-width: 412px) and (max-width: 491px) {
    .v-text-field {
      max-width: 42px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 492px) and (max-width: 500px) {
    .v-text-field {
      max-width: 44px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 501px) and (max-width: 509px) {
    .v-text-field {
      max-width: 45px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 510px) and (max-width: 518px) {
    .v-text-field {
      max-width: 46px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 519px) and (max-width: 527px) {
    .v-text-field {
      max-width: 47px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 528px) and (max-width: 536px) {
    .v-text-field {
      max-width: 48px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 537px) and (max-width: 545px) {
    .v-text-field {
      max-width: 49px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 546px) and (max-width: 554px) {
    .v-text-field {
      max-width: 50px;
      max-height: 56px;
      font-weight: bold;
      :deep(input) {
        font-size: 16px;
      }
    }
  }
  @media only screen and (min-width: 555px) and (max-width: 563px) {
    .v-text-field {
      max-width: 51px;
      max-height: 58px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 564px) and (max-width: 572px) {
    .v-text-field {
      max-width: 52px;
      max-height: 58px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 573px) and (max-width: 581px) {
    .v-text-field {
      max-width: 53px;
      max-height: 58px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 582px) and (max-width: 590px) {
    .v-text-field {
      max-width: 54px;
      max-height: 58px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 591px) and (max-width: 599px) {
    .v-text-field {
      max-width: 55px;
      max-height: 58px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 600px) and (max-width: 608px) {
    .v-text-field {
      max-width: 56px;
      max-height: 63px;
      font-weight: bold;
      :deep(input) {
        font-size: 21px;
      }
    }
  }
  @media only screen and (min-width: 609px) and (max-width: 617px) {
    .v-text-field {
      max-width: 57px;
      max-height: 63px;
      font-weight: bold;
      :deep(input) {
        font-size: 21px;
      }
    }
  }
  @media only screen and (min-width: 618px) and (max-width: 642px) {
    .v-text-field {
      max-width: 58px;
      max-height: 63px;
      font-weight: bold;
      :deep(input) {
        font-size: 21px;
      }
    }
  }
  @media only screen and (min-width: 643px) and (max-width: 1920px) {
    .v-text-field {
      max-width: 59px;
      max-height: 59px;
      font-weight: bold;
      :deep(input) {
        font-size: 18px;
      }
    }
  }
  @media only screen and (min-width: 1921px) {
    .v-text-field {
      max-width: 68px;
      max-height: 68px;
      font-weight: bold;
      :deep(input) {
        font-size: 24px;
      }
    }
  }
  .v-row {
    flex-shrink: auto;
  }
  .sudoku-cell
    :deep(
      input[type='number']::-webkit-inner-spin-button,
      input[type='number']::-webkit-outer-spin-button
    ) {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  .sudoku-cell :deep(input) {
    text-align: center;
  }
  .text-white :deep(input) {
    color: white !important;
  }
  .text-black :deep(input) {
    color: black !important;
  }
  .text-red :deep(input) {
    color: red !important;
  }
  .text-yellow :deep(input) {
    color: yellow !important;
  }
</style>
