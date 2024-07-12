import { describe, expect, it } from 'vitest';
import { MenuItem } from '@/models/infrastructure/menuItem';

describe('the menuItem infrastructure model', () => {
  it('should have the expected properties', () => {
    const sut = new MenuItem(
      "http://localhost:8080",
      "Title",
      "Tooltip",
      "mdi-user",
      "_blank",
      false
    );

    expect(sut.url).toBeTypeOf('string');
    expect(sut.title).toBeTypeOf('string');
    expect(sut.tooltip).toBeTypeOf('string');
    expect(sut.mdiIcon).toBeTypeOf('string');
    expect(sut.target).toBeTypeOf('string');
    expect(sut.condition).toBeTypeOf('boolean');
  });
  it('should have a default constructor', () => {
    const sut = new MenuItem();

    expect(sut.url).toBeTypeOf('string');
    expect(sut.title).toBeTypeOf('string');
    expect(sut.tooltip).toBeTypeOf('string');
    expect(sut.mdiIcon).toBeTypeOf('string');
    expect(sut.target).toBeTypeOf('string');
    expect(sut.condition).toBeTypeOf('boolean');
  });
});