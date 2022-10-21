import store from "@/store";
import { toRaw } from "vue";
import { GameState } from "@/enums/gameState";

const oddRegionIndexes: Array<{ row: number, cell: number}> = [
	{ row: 0, cell: 0},
	{ row: 0, cell: 1},
	{ row: 0, cell: 2},
	{ row: 0, cell: 6},
	{ row: 0, cell: 7},
	{ row: 0, cell: 8},
	{ row: 1, cell: 0},
	{ row: 1, cell: 1},
	{ row: 1, cell: 2},
	{ row: 1, cell: 6},
	{ row: 1, cell: 7},
	{ row: 1, cell: 8},
	{ row: 2, cell: 0},
	{ row: 2, cell: 1},
	{ row: 2, cell: 2},
	{ row: 2, cell: 6},
	{ row: 2, cell: 7},
	{ row: 2, cell: 8},
	{ row: 3, cell: 3},
	{ row: 3, cell: 4},
	{ row: 3, cell: 5},
	{ row: 4, cell: 3},
	{ row: 4, cell: 4},
	{ row: 4, cell: 5},
	{ row: 5, cell: 3},
	{ row: 5, cell: 4},
	{ row: 5, cell: 5},
	{ row: 6, cell: 0},
	{ row: 6, cell: 1},
	{ row: 6, cell: 2},
	{ row: 6, cell: 6},
	{ row: 6, cell: 7},
	{ row: 6, cell: 8},
	{ row: 7, cell: 0},
	{ row: 7, cell: 1},
	{ row: 7, cell: 2},
	{ row: 7, cell: 6},
	{ row: 7, cell: 7},
	{ row: 7, cell: 8},
	{ row: 8, cell: 0},
	{ row: 8, cell: 1},
	{ row: 8, cell: 2},
	{ row: 8, cell: 6},
	{ row: 8, cell: 7},
	{ row: 8, cell: 8},
];

function applyOddRegion(rowIndex: number, cellIndex: number): boolean {
	let result = false;
	
	oddRegionIndexes.forEach((index) => {
		if (index.row === rowIndex && index.cell === cellIndex) {
			result = true;
		}
	});
	
	return result;
}

function applyTextColor(rowIndex: number, cellIndex: number): string {
	const gameState: GameState = toRaw(store.getters['sudokuModule/getGameState']);
	const initialGame: Array<Array<string>> = toRaw(store.getters['sudokuModule/getInitialGame']);
	const isOddRegion = applyOddRegion(rowIndex, cellIndex);
	
	if (gameState === GameState.PLAYGAME) {
		if (initialGame[rowIndex][cellIndex] === "") {
			if (isOddRegion) {
				return 'text-white';
			} else {
				return 'text-black';
			}
		} else {
			if (isOddRegion) {
				return 'text-yellow';
			} else {
				return 'text-red';
			}
		}
	} else {
		if (isOddRegion) {
			return 'text-white';
		} else {
			return 'text-black';
		}
	}
}

export {
	applyOddRegion,
	applyTextColor
}
