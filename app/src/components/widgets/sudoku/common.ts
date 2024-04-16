import { GameState } from "@/enums/gameState";
import { DropdownItem } from "@/models/infrastructure/dropdownItem";
import { useSudokuStore } from "@/stores/sudokuStore";

const oddRegionIndexes: Array<{ row: number; cell: number }> = [
  { row: 0, cell: 0 },
  { row: 0, cell: 1 },
  { row: 0, cell: 2 },
  { row: 0, cell: 6 },
  { row: 0, cell: 7 },
  { row: 0, cell: 8 },
  { row: 1, cell: 0 },
  { row: 1, cell: 1 },
  { row: 1, cell: 2 },
  { row: 1, cell: 6 },
  { row: 1, cell: 7 },
  { row: 1, cell: 8 },
  { row: 2, cell: 0 },
  { row: 2, cell: 1 },
  { row: 2, cell: 2 },
  { row: 2, cell: 6 },
  { row: 2, cell: 7 },
  { row: 2, cell: 8 },
  { row: 3, cell: 3 },
  { row: 3, cell: 4 },
  { row: 3, cell: 5 },
  { row: 4, cell: 3 },
  { row: 4, cell: 4 },
  { row: 4, cell: 5 },
  { row: 5, cell: 3 },
  { row: 5, cell: 4 },
  { row: 5, cell: 5 },
  { row: 6, cell: 0 },
  { row: 6, cell: 1 },
  { row: 6, cell: 2 },
  { row: 6, cell: 6 },
  { row: 6, cell: 7 },
  { row: 6, cell: 8 },
  { row: 7, cell: 0 },
  { row: 7, cell: 1 },
  { row: 7, cell: 2 },
  { row: 7, cell: 6 },
  { row: 7, cell: 7 },
  { row: 7, cell: 8 },
  { row: 8, cell: 0 },
  { row: 8, cell: 1 },
  { row: 8, cell: 2 },
  { row: 8, cell: 6 },
  { row: 8, cell: 7 },
  { row: 8, cell: 8 },
];
const initializeMatix = (): Array<Array<string>> => {
  const matrix = Array<Array<string>>(9);
  for (let i = 0; i < 9; i++) {
    matrix[i] = [];
    for (let j = 0; j < 9; j++) {
      matrix[i][j] = "";
    }
  }
  return matrix;
};
const obtainMatrix = (): Array<Array<string>> => {
  const sudokuStore = useSudokuStore();
  let result = initializeMatix();
  const gameState = sudokuStore.getGameState;
  if (gameState !== null && gameState?.value === GameState.PLAYGAME) {
    const game = sudokuStore.getGame;
    result = Array<Array<string>>(9);

    for (let i = 0; i < 9; i++) {
      result[i] = [];
      for (let j = 0; j < 9; j++) {
        result[i][j] = game[i][j];
      }
    }
  } else if (gameState !== null && gameState?.value === GameState.SOLVESUDOKU) {
    const puzzle = sudokuStore.getPuzzle;
    result = Array<Array<string>>(9);

    for (let i = 0; i < 9; i++) {
      result[i] = [];
      for (let j = 0; j < 9; j++) {
        result[i][j] = puzzle[i][j];
      }
    }
  } else if (
    gameState !== null &&
    gameState?.value === GameState.GENERATESUDOKU
  ) {
    const solution = sudokuStore.getSolution;
    result = Array<Array<string>>(9);

    for (let i = 0; i < 9; i++) {
      result[i] = [];
      for (let j = 0; j < 9; j++) {
        result[i][j] = solution[i][j];
      }
    }
  }
  return result;
};
const applyOddRegion = (rowIndex: number, cellIndex: number): boolean => {
  let result = false;

  oddRegionIndexes.forEach((index) => {
    if (index.row === rowIndex && index.cell === cellIndex) {
      result = true;
    }
  });

  return result;
};
const applyTextColor = (rowIndex: number, cellIndex: number): string => {
  const sudokuStore = useSudokuStore();

  const gameState: DropdownItem | null = sudokuStore.getGameState;
  const initialGame: Array<Array<string>> = sudokuStore.getInitialGame;
  const isOddRegion = applyOddRegion(rowIndex, cellIndex);

  if (gameState?.value === GameState.PLAYGAME) {
    if (initialGame[rowIndex][cellIndex] === "") {
      if (isOddRegion) {
        return "text-white";
      } else {
        return "text-black";
      }
    } else {
      if (isOddRegion) {
        return "text-yellow";
      } else {
        return "text-red";
      }
    }
  } else {
    if (isOddRegion) {
      return "text-white";
    } else {
      return "text-black";
    }
  }
};

export { obtainMatrix, applyOddRegion, applyTextColor };
