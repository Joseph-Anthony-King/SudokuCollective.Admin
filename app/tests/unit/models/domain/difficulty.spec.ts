import { describe, expect, expectTypeOf, it } from 'vitest';
import { Difficulty } from '@/models/domain/difficulty';

describe('the difficulty domain model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(Difficulty).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(Difficulty).instance.toHaveProperty('name').toBeString;
    expectTypeOf(Difficulty).instance.toHaveProperty('displayName').toBeString;
    expectTypeOf(Difficulty).instance.toHaveProperty('difficultyLevel').toBeNumber;
  });
  it('should have a default constructor', () => {
    const sut = new Difficulty();

    expect(sut.id).toBeNull();
    expect(sut.name).toBeNull();
    expect(sut.displayName).toBeNull();
    expect(sut.difficultyLevel).toBeNull();
  });
  it('should have a constructor which accepts parameters', () => {
    const sut = new Difficulty(
      1,
      'Test Difficulty',
      'Easy',
      1
    );

    expect(sut.id).toBeTypeOf('number');
    expect(sut.name).toBeTypeOf('string');
    expect(sut.displayName).toBeTypeOf('string');
    expect(sut.difficultyLevel).toBeTypeOf('number');
  });
});
