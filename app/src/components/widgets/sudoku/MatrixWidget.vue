<template>
  <v-card-title class='justify-center text-center'
    >Sudoku Collective</v-card-title
  >
  <div>
    <v-row
      v-for='(row, rowIndex) in matrix'
      :key='rowIndex'
      cols='12'
      class='ma-0 pa-0 justify-center'
    >
      <v-text-field
        v-for='(cell, cellIndex) in row'
        :key='cellIndex'
        variant='outlined'
        v-model='row[cellIndex]'
        @blur='validateEntry(rowIndex, cellIndex)'
        type='number'
        min='1'
        max='9'
        :bg-color="
          applyOddRegionStyling(rowIndex, cellIndex) ? 'primary' : 'white'
        "
        :class='applyTextColorStyling(rowIndex, cellIndex)'
        class='sudoku-cell ma-0 pa-0'
        :readonly='isReadOnly(rowIndex, cellIndex)'
      ></v-text-field>
    </v-row>
  </div>
</template>

<script setup lang='ts'>
import { 
  ref, 
  onBeforeMount, 
  toRaw, 
  watch 
} from 'vue';
import { useSudokuStore } from '@/store/sudokuStore/index';
import {
  obtainMatrix,
  applyOddRegion,
  applyTextColor,
} from '@/components/widgets/sudoku/common';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

const sudokuStore = useSudokuStore();
const matrix = ref(Array<Array<string>>());
let gameState: DropdownItem | null = sudokuStore.getGameState;

const applyOddRegionStyling = (
  rowIndex: number,
  cellIndex: number
): boolean => {
  return applyOddRegion(rowIndex, cellIndex);
};

const applyTextColorStyling = (
  rowIndex: number,
  cellIndex: number
): string => {
  return applyTextColor(rowIndex, cellIndex);
};

const validateEntry = (rowIndex: number, cellIndex: number): void => {
  var entry = parseInt(matrix.value[rowIndex][cellIndex]);

  if (entry < 1 || entry > 9) {
    matrix.value[rowIndex][cellIndex] = '';
  } else {
    matrix.value[rowIndex][cellIndex] =
      matrix.value[rowIndex][cellIndex].toString();
    const sudoku = Array<Array<string>>(9);
    for (let i = 0; i < 9; i++) {
      sudoku[i] = [];
      for (let j = 0; j < 9; j++) {
        sudoku[i][j] = matrix.value[i][j];
      }
    }
    if (gameState?.value === GameState.PLAYGAME) {
      sudokuStore.updateGame(sudoku);
    } else if (gameState?.value === GameState.SOLVESUDOKU) {
      sudokuStore.updatePuzzle(sudoku);
    }
  }
};

const isReadOnly = (rowIndex: number, cellIndex: number): boolean => {
  if (gameState !== null) {
    if (gameState.value === GameState.PLAYGAME) {
      const initialGame = sudokuStore.getInitialGame;
      if (initialGame[rowIndex][cellIndex] === '') {
        return false;
      } else {
        return true;
      }
    } else if (gameState.value === GameState.SOLVESUDOKU) {
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

watch(
  () => sudokuStore.getGameState,
  () => {
    gameState = toRaw(sudokuStore.getGameState);
    matrix.value = obtainMatrix();
  }
);

watch(
  () => sudokuStore.getGame,
  () => {
    if (gameState?.value === GameState.PLAYGAME) {
      const game = sudokuStore.getGame;
      matrix.value = Array<Array<string>>(9);

      for (let i = 0; i < 9; i++) {
        matrix.value[i] = [];
        for (let j = 0; j < 9; j++) {
          matrix.value[i][j] = game[i][j];
        }
      }
    }
  }
);

watch(
  () => sudokuStore.getPuzzle,
  () => {
    if (gameState?.value === GameState.SOLVESUDOKU) {
      const puzzle = sudokuStore.getPuzzle;
      matrix.value = Array<Array<string>>(9);

      for (let i = 0; i < 9; i++) {
        matrix.value[i] = [];
        for (let j = 0; j < 9; j++) {
          matrix.value[i][j] = puzzle[i][j];
        }
      }
    }
  }
);

watch(
  () => sudokuStore.getSolution,
  () => {
    if (gameState?.value === GameState.GENERATESUDOKU) {
      const solution = sudokuStore.getSolution;
      matrix.value = Array<Array<string>>(9);

      for (let i = 0; i < 9; i++) {
        matrix.value[i] = [];
        for (let j = 0; j < 9; j++) {
          matrix.value[i][j] = solution[i][j];
        }
      }
    }
  }
);

onBeforeMount(() => {
  matrix.value = obtainMatrix();
});
</script>

<style lang='scss' scoped>
@media only screen and (max-width: 306px) {
  .v-text-field {
    max-width: 26px;
    max-height: 48px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 307px) and (max-width: 319px) {
  .v-text-field {
    max-width: 27px;
    max-height: 48px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 320px) and (max-width: 324px) {
  .v-text-field {
    max-width: 28px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 325px) and (max-width: 333px) {
  .v-text-field {
    max-width: 29px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 334px) and (max-width: 342px) {
  .v-text-field {
    max-width: 30px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 343px) and (max-width: 351px) {
  .v-text-field {
    max-width: 31px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 352px) and (max-width: 360px) {
  .v-text-field {
    max-width: 32px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 12px;
    }
  }
}
@media only screen and (min-width: 361px) and (max-width: 373px) {
  .v-text-field {
    max-width: 40px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 14px;
    }
  }
}
@media only screen and (min-width: 374px) and (max-width: 411px) {
  .v-text-field {
    max-width: 41px;
    max-height: 54px;
    font-weight: bold;
    :deep(input) {
      font-size: 14px;
    }
  }
}
@media only screen and (min-width: 412px) and (max-width: 482px) {
  .v-text-field {
    max-width: 42px;
    max-height: 56px;
    font-weight: bold;
    :deep(input) {
      font-size: 14px;
    }
  }
}
@media only screen and (min-width: 483px) and (max-width: 491px) {
  .v-text-field {
    max-width: 43px;
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
    max-width: 58px;
    max-height: 58px;
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
  :deep(input[type='number']::-webkit-inner-spin-button, input[type='number']::-webkit-outer-spin-button) {
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
