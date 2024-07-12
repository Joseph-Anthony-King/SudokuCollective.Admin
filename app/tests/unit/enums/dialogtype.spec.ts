import { describe, expect, it } from 'vitest';
import { DialogType } from '@/enums/dialogType';

describe('The dialogType enum', () => {
  it('should have the following values', () => {
    expect(DialogType.OK).equals(0);
    expect(DialogType.CONFIRM).equals(1);
  });
});
