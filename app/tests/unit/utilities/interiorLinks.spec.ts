import { describe, expect, it } from 'vitest';
import { InteriorLinks } from '@/utilities/links/interiorLinks';
import { MenuItem } from '@/models/infrastructure/menuItem';

describe('The InteriorLinks utility', () => {
  it('should export an array of MenuItem objects', () => {
    // Assert
    expect(Array.isArray(InteriorLinks)).toBe(true);
    expect(InteriorLinks.length).toBe(1);
    InteriorLinks.forEach(item => {
      expect(item instanceof MenuItem).toBe(true);
    });
  });

  it('should have correct Play Sudoku link', () => {
    // Assert
    const playSudokuLink = InteriorLinks[0];
    expect(playSudokuLink.url).toBe('/sudoku');
    expect(playSudokuLink.title).toBe('Play Sudoku');
    expect(playSudokuLink.tooltip).toBe('Play or solve sudoku puzzles');
    expect(playSudokuLink.mdiIcon).toBe('mdi-apps');
    expect(playSudokuLink.target).toBe('_self');
    expect(playSudokuLink.condition).toBe(true);
  });

  it('should have the link open in the same tab', () => {
    // Assert
    expect(InteriorLinks[0].target).toBe('_self');
  });

  it('should have the link condition set to true', () => {
    // Assert
    expect(InteriorLinks[0].condition).toBe(true);
  });

  it('should properly construct MenuItem instance', () => {
    // Arrange
    const expectedMenuItem = new MenuItem(
      '/sudoku',
      'Play Sudoku',
      'Play or solve sudoku puzzles',
      'mdi-apps',
      '_self',
      true
    );

    // Assert
    expect(InteriorLinks[0]).toEqual(expectedMenuItem);
  });
});
