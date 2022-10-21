<template>
	<v-card-title class="justify-center text-center">Sudoku Collective</v-card-title>
  <div>
    <v-row v-for="(row, rowIndex) in matrix" :key="rowIndex" cols="12" class="ma-0 pa-0 justify-center">
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
				:readonly="isReadOnly(rowIndex, cellIndex)"
				></v-text-field>
    </v-row>
	</div>
</template>

<script lang='ts'>
	import { defineComponent, onBeforeMount, ref, watch } from 'vue';
	import store from '@/store';
	import { applyOddRegion, applyTextColor } from '@/components/widgets/sudoku/common';
	import { GameState } from '@/enums/gameState';

	export default defineComponent({
		name: 'MatrixWidget',
		setup() {
			const matrix = ref(Array<Array<string>>());
			let gameState: GameState | null = store.getters['sudokuModule/getGameState'];

			function applyOddRegionStyling(rowIndex: number, cellIndex: number): boolean {
				return applyOddRegion(rowIndex, cellIndex);
			}

			function applyTextColorStyling(rowIndex: number, cellIndex: number): string {
				return applyTextColor(rowIndex, cellIndex);
			}

			function validateEntry(rowIndex: number, cellIndex: number) {      
				
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
					if (gameState === GameState.PLAYGAME) {
						store.dispatch('sudokuModule/updateGame', sudoku);
					} else if (gameState === GameState.SOLVESUDOKU) {
						store.dispatch('sudokuModule/updatePuzzle', sudoku);
					}
				}
			}

			function isReadOnly(rowIndex: number, cellIndex: number): boolean {
				if (gameState !== null) {
					if (gameState === GameState.PLAYGAME) {
						const initialGame = store.getters['sudokuModule/getInitialGame'];
						if (initialGame[rowIndex][cellIndex] === '') {
							return false;
						} else {
							return true;
						}
					} else if (gameState === GameState.SOLVESUDOKU) {
						return false;
					} else {
						return true;
					}
				} else {
					return true
				}
			}

			watch(
				() => store.getters['sudokuModule/getGameState'],
				function () {
					gameState = store.getters['sudokuModule/getGameState'];
					if (gameState === GameState.PLAYGAME) {
						const game = store.getters['sudokuModule/getGame'];
						matrix.value = Array<Array<string>>(9);

						for (let i = 0; i < 9; i++) {
							matrix.value[i] = [];
							for (let j = 0; j < 9; j++) {
								matrix.value[i][j] = game[i][j];
							}
						}
					} else if (gameState === GameState.SOLVESUDOKU) {
						const puzzle = store.getters['sudokuModule/getPuzzle'];
						matrix.value = Array<Array<string>>(9);

						for (let i = 0; i < 9; i++) {
							matrix.value[i] = [];
							for (let j = 0; j < 9; j++) {
								matrix.value[i][j] = puzzle[i][j];
							}
						}
					} else {
						const solution = store.getters['sudokuModule/getSolution'];
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

			watch(
				() => store.getters['sudokuModule/getGame'],
				function () {
					if (gameState === GameState.PLAYGAME) {
						const game = store.getters['sudokuModule/getGame'];
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
				() => store.getters['sudokuModule/getPuzzle'],
				function () {
					if (gameState === GameState.SOLVESUDOKU) {
						const puzzle = store.getters['sudokuModule/getPuzzle'];
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
				() => store.getters['sudokuModule/getSolution'],
				function () {
					if (gameState === GameState.GENERATESUDOKU) {
						const solution = store.getters['sudokuModule/getSolution'];
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
				for (let i = 0; i < 9; i++) {
					matrix.value[i] = [];
					for (let j = 0; j < 9; j++) {
						matrix.value[i][j] = '';
					}
				}
			});
			
			return {
				matrix,
				applyOddRegionStyling,
				applyTextColorStyling,
				validateEntry,
				isReadOnly
			}
		}
	});
</script>

<style lang='scss' scoped>
	/* Galaxy Fold... folded */
	@media only screen and (max-width: 318px) {
		.v-row {
			min-width: 110%;
		}
		.v-text-field {
			max-width: 5px;
			max-height: 10px;
			font-size: 2px;
		}
	}
	/* Galaxy Fold... folded */
	@media only screen and (max-width: 319px) {
		.v-text-field {
			max-width: 24px;
			max-height: 48px;
			font-weight: bold;
			:deep(input) {
				font-size: 16px;
			}
		}
	}
	/* Moto G4, Galaxy S5, iPhone 5/SE */
	@media only screen and (min-width: 320px) and (max-width: 373px) {
		.v-text-field {
			max-width: 28px;
			max-height: 48px;
			font-weight: bold;
			:deep(input) {
				font-size: 16px;
			}
		}
	}
	/* iPhone 6/7/8, iPhone X, iPhone 12 */
	@media only screen and (min-width: 374px) and (max-width: 411px) {
		.v-text-field {
			max-width: 38px;
			max-height: 54px;
			font-weight: bold;
			:deep(input) {
				font-size: 16px;
			}
		}
	}
	/* Pixel 2, Pixel 2 XL, Galaxy Note 10+ */
	@media only screen and (min-width: 412px) and (max-width: 481px) {
		.v-text-field {
			max-width: 48px;
			max-height: 54px;
			font-weight: bold;
			:deep(input) {
				font-size: 18px;
			}
		}
	}
	/* iPhone 6/7/8 Plus, Surface Duo - Folded */
	@media only screen and (min-width: 482px) and (max-width: 518px) {
		.v-text-field {
			max-width: 42px;
			max-height: 54px;
			font-weight: bold;
			:deep(input) {
				font-size: 18px;
			}
		}
	}
	/* iPhone 6/7/8 Plus, Surface Duo - Folded */
	@media only screen and (min-width: 519px) and (max-width: 642px) {
		.v-text-field {
			max-width: 47px;
			max-height: 54px;
			font-weight: bold;
			:deep(input) {
				font-size: 21px;
			}
		}
	}
	/* desktop */
	@media only screen and (min-width: 643px) and (max-width: 1920px) {
		.v-text-field {
			max-width: 58px;
			max-height: 58px;
			font-weight: bold;
			:deep(input) {
				font-size: 24px;
			}
		}
	}
	/* desktop */
	@media only screen and (min-width: 1921px) {
		.v-text-field {
			max-width: 66px;
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
	.sudoku-cell :deep(input[type=number]::-webkit-inner-spin-button, 
		input[type=number]::-webkit-outer-spin-button) { 
			-webkit-appearance: none;
			appearance: none;
			margin: 0; 
	}
	.sudoku-cell :deep(input){
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
