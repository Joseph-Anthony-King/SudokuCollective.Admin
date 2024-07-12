import { describe, expect, it } from 'vitest';
import { SudokuRequestData } from '@/models/requests/sudokuRequestData';

describe('the sudokuRequestData requests model', () => {
  it('should have the expected properties', () => {
    const sut = new SudokuRequestData();

    expect(sut.firstRow).toBeTypeOf('object');
    expect(sut.secondRow).toBeTypeOf('object');
    expect(sut.thirdRow).toBeTypeOf('object');
    expect(sut.fourthRow).toBeTypeOf('object');
    expect(sut.fifthRow).toBeTypeOf('object');
    expect(sut.sixthRow).toBeTypeOf('object');
    expect(sut.seventhRow).toBeTypeOf('object');
    expect(sut.eighthRow).toBeTypeOf('object');
    expect(sut.ninthRow).toBeTypeOf('object');
  });
});
