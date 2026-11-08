import { describe, expect, expectTypeOf, it } from 'vitest';
import { Role } from '@/models/domain/role';

describe('the role domain model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(Role).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(Role).instance.toHaveProperty('name').toBeString;
    expectTypeOf(Role).instance.toHaveProperty('roleLevel').toBeNumber;
  });

  it('should have a default constructor', () => {
    const sut = new Role();

    expect(sut.id).toBeNull();
    expect(sut.name).toBeNull();
    expect(sut.roleLevel).toBeNull();
  });

  it('should have a constructor which accepts parameters', () => {
    const sut = new Role(1, 'Administrator', 3);

    expect(sut.id).toBe(1);
    expect(sut.name).toBe('Administrator');
    expect(sut.roleLevel).toBe(3);
  });
});
