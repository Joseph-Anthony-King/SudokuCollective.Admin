import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { applyOddRegion, applyTextColor, obtainMatrix } from '@/components/widgets/sudoku/common';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { useSudokuStore } from '@/stores/sudokuStore';

const createMatrix = (prefix: string): string[][] =>
  Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, cell) => `${prefix}${row}${cell}`),
  );

describe('Sudoku widget common utilities', () => {
  let sudokuStore: ReturnType<typeof useSudokuStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    sudokuStore = useSudokuStore();
  });

  describe('obtainMatrix', () => {
    it('returns an empty 9x9 matrix when there is no game state', () => {
      const matrix = obtainMatrix();

      expect(matrix).toHaveLength(9);
      expect(matrix.every((row) => row.length === 9 && row.every((cell) => cell === ''))).toBe(
        true,
      );
    });

    it.each([
      ['game', GameState.PLAYGAME, 'getGame'],
      ['puzzle', GameState.SOLVESUDOKU, 'getPuzzle'],
      ['solution', GameState.GENERATESUDOKU, 'getSolution'],
    ] as const)('copies the current %s matrix', (_, state, matrixType) => {
      const source = createMatrix(matrixType);
      sudokuStore.updateGameState(new DropdownItem('State', state));

      if (matrixType === 'getGame') {
        sudokuStore.updateGame(source);
      } else if (matrixType === 'getPuzzle') {
        sudokuStore.updatePuzzle(source);
      } else {
        sudokuStore.updateSolution(source);
      }

      const matrix = obtainMatrix();

      expect(matrix).toEqual(source);
      expect(matrix).not.toBe(source);
      expect(matrix[0]).not.toBe(source[0]);
    });
  });

  describe('applyOddRegion', () => {
    it('identifies included odd-region cells and excludes other cells', () => {
      expect(applyOddRegion(0, 0)).toBe(true);
      expect(applyOddRegion(4, 4)).toBe(true);
      expect(applyOddRegion(8, 8)).toBe(true);
      expect(applyOddRegion(4, 0)).toBe(false);
      expect(applyOddRegion(8, 4)).toBe(false);
    });
  });

  describe('applyTextColor', () => {
    it('uses white for empty odd-region cells and black for empty even-region cells in a game', () => {
      sudokuStore.updateGameState(new DropdownItem('Play', GameState.PLAYGAME));
      sudokuStore.updateInitialGame(
        Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => '')),
      );

      expect(applyTextColor(0, 0)).toBe('text-white');
      expect(applyTextColor(4, 0)).toBe('text-black');
    });

    it('uses yellow for given odd-region cells and red for given even-region cells in a game', () => {
      const initialGame = createMatrix('1');
      sudokuStore.updateGameState(new DropdownItem('Play', GameState.PLAYGAME));
      sudokuStore.updateInitialGame(initialGame);

      expect(applyTextColor(0, 0)).toBe('text-yellow');
      expect(applyTextColor(4, 0)).toBe('text-red');
    });

    it('uses white and black outside play mode', () => {
      sudokuStore.updateGameState(new DropdownItem('Solve', GameState.SOLVESUDOKU));

      expect(applyTextColor(0, 0)).toBe('text-white');
      expect(applyTextColor(4, 0)).toBe('text-black');
    });
  });
});