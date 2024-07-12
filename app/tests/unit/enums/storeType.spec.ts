import { describe, expect, it } from 'vitest';
import { StoreType } from '@/enums/storeTypes';

describe('The storeTypes enum', () => {
  it('should have the following values', () => {
    expect(StoreType.GLOBALSTORE).equals(0);
    expect(StoreType.USERSTORE).equals(1);
    expect(StoreType.SUDOKUSTORE).equals(2);
  });
});
