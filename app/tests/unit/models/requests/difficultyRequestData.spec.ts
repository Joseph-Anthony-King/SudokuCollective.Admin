import { describe, expect, expectTypeOf, it } from 'vitest';
import { DifficultyRequestData } from '@/models/requests/difficultyRequestData';

describe('the difficultyRequestData request model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(DifficultyRequestData).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(DifficultyRequestData).instance.toHaveProperty('name').toBeString;
    expectTypeOf(DifficultyRequestData).instance.toHaveProperty('displayName').toBeString;
    expectTypeOf(DifficultyRequestData).instance.toHaveProperty('difficultyLevel').toBeNumber;
  });

  it('should assign all constructor parameters to the expected properties', () => {
    const sut = new DifficultyRequestData(1, 'easy', 'Easy', 2);

    expect(sut.id).toBe(1);
    expect(sut.name).toBe('easy');
    expect(sut.displayName).toBe('Easy');
    expect(sut.difficultyLevel).toBe(2);
  });
});
