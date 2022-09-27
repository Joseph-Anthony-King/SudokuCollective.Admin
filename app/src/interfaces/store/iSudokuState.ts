import { Difficulty } from "@/models/domain/difficulty";

export interface ISudokuState {
    puzzle: Array<Array<Number>>,
    game: Array<Array<Number>>,
    initialGame: Array<Array<Number>>,
    selectedDifficulty: Difficulty | null,
    playGame: boolean,
}
