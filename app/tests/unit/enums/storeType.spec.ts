import { describe, expect, it } from 'vitest';
import { StoreType } from '@/enums/storeTypes';

describe('The storeTypes enum', () => {
  it('should have the following values', () => {
    expect(StoreType.APPSTORE).equals(0);
    expect(StoreType.CONFIRMEMAILSTORE).equals(1);
    expect(StoreType.DIALOGSTORE).equals(2);
    expect(StoreType.FORMSTORE).equals(3);
    expect(StoreType.GLOBALSTORE).equals(4);
    expect(StoreType.USERSTORE).equals(5);
    expect(StoreType.SUDOKUSTORE).equals(6);
  });
});
