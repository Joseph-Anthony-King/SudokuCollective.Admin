import { describe, expect, it } from 'vitest';
import { GameStates } from '@/utilities/dropdowns/gameStates';
import { GameState } from '@/enums/gameState';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

describe('GameStates dropdown utility', () => {
  it('should export an array of DropdownItem objects', () => {
    // Assert
    expect(Array.isArray(GameStates)).toBe(true);
    expect(GameStates.length).toBe(3);
    GameStates.forEach(item => {
      expect(item instanceof DropdownItem).toBe(true);
    });
  });

  it('should have the correct items for each game state', () => {
    // Assert
    expect(GameStates[0].label).toBe('Play Game');
    expect(GameStates[0].value).toBe(GameState.PLAYGAME);
    expect(GameStates[0].appliesTo).toEqual(['gameState']);

    expect(GameStates[1].label).toBe('Solve Sudoku Puzzle');
    expect(GameStates[1].value).toBe(GameState.SOLVESUDOKU);
    expect(GameStates[1].appliesTo).toEqual(['gameState']);

    expect(GameStates[2].label).toBe('Generate Sudoku Puzzle');
    expect(GameStates[2].value).toBe(GameState.GENERATESUDOKU);
    expect(GameStates[2].appliesTo).toEqual(['gameState']);
  });

  it('should have game states in the correct order', () => {
    // Assert
    expect(GameStates[0].value).toBe(GameState.PLAYGAME);
    expect(GameStates[1].value).toBe(GameState.SOLVESUDOKU);
    expect(GameStates[2].value).toBe(GameState.GENERATESUDOKU);
  });

  it('should have consistent appliesTo values', () => {
    // Assert
    const expectedAppliesTo = ['gameState'];
    GameStates.forEach(item => {
      expect(item.appliesTo).toEqual(expectedAppliesTo);
    });
  });

  it('should match the GameState enum values', () => {
    // Assert
    expect(GameStates[0].value).toBe(0); // PLAYGAME value
    expect(GameStates[1].value).toBe(1); // SOLVESUDOKU value
    expect(GameStates[2].value).toBe(2); // GENERATESUDOKU value
  });

  it('should contain all GameState enum values', () => {
    // Arrange
    const gameStateValues = Object.values(GameState).filter(
      value => typeof value === 'number'
    ) as number[];
    
    // Act
    const dropdownValues = GameStates.map(item => item.value);
    
    // Assert
    expect(dropdownValues.length).toBe(gameStateValues.length);
    gameStateValues.forEach(value => {
      expect(dropdownValues).toContain(value);
    });
  });
});
