import { describe, expect, it } from 'vitest';
import { GameState } from '@/enums/gameState';

describe('The gameState enum', () => {
  it('should have the following values', () => {
    expect(GameState.PLAYGAME).equals(0);
    expect(GameState.SOLVESUDOKU).equals(1);
    expect(GameState.GENERATESUDOKU).equals(2);
  });
});
