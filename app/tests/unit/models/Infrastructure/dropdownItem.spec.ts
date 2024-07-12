import { describe, expect, it } from 'vitest';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';

describe('the dropdownItem infrastructure model', () => {
  it('should have the expected properties', () => {
    const sut = new DropdownItem(
      'label',
      1,
      []
    );

    expect(sut.label).toBeTypeOf('string');
    expect(sut.value).toBeTypeOf('number');
    expect(sut.appliesTo).toBeTypeOf('object');
  });
  it('should have a default constructor', () => {
    const sut = new DropdownItem();

    expect(sut.label).toBeTypeOf('string');
    expect(sut.value).toBeTypeOf('number');
    expect(sut.appliesTo).toBeTypeOf('object');
  })
});
