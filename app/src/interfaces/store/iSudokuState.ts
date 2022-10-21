import { GameState } from "@/enums/gameState";
import { Difficulty } from "@/models/domain/difficulty";

export interface ISudokuState {
    game: Array<Array<string>> | null,
    initialGame: Array<Array<string>> | null,
    puzzle: Array<Array<string>> | null,
    solution: Array<Array<string>> | null,
    gameState: GameState | null,
    selectedDifficulty: Difficulty | null,
    serviceResult: boolean | null,
    serviceMessage: string | null,
    processing: boolean,
    isSolveDisabled: boolean | null,
}
