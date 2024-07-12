import { describe, expect, it } from 'vitest';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';

describe('The releaseEnvironment enum', () => {
  it('should have the following values', () => {
    expect(ReleaseEnvironment.NULL).equals(0);
    expect(ReleaseEnvironment.LOCAL).equals(1);
    expect(ReleaseEnvironment.TEST).equals(2);
    expect(ReleaseEnvironment.STAGING).equals(3);
    expect(ReleaseEnvironment.PROD).equals(4);
  });
});
