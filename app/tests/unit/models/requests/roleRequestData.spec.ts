import { describe, expect, expectTypeOf, it } from 'vitest';
import { RoleRequestData } from '@/models/requests/roleRequestData';

describe('the roleRequestData request model', () => {
  it('should have the expected properties', () => {
    expectTypeOf(RoleRequestData).instance.toHaveProperty('id').toBeNumber;
    expectTypeOf(RoleRequestData).instance.toHaveProperty('name').toBeString;
    expectTypeOf(RoleRequestData).instance.toHaveProperty('roleLevel').toBeNumber;
  });

  it('should assign all constructor parameters to the expected properties', () => {
    const sut = new RoleRequestData(1, 'administrator', 3);

    expect(sut.id).toBe(1);
    expect(sut.name).toBe('administrator');
    expect(sut.roleLevel).toBe(3);
  });
});
