import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

export const GameStates: Array<DropdownItem> = [
	new DropdownItem('Play Game', GameState.PLAYGAME, ['gameState']),
	new DropdownItem('Solve Sudoku Puzzle', GameState.SOLVESUDOKU, ['gameState']),
	new DropdownItem('Generate Sudoku Puzzle', GameState.GENERATESUDOKU, ['gameState']),
];
