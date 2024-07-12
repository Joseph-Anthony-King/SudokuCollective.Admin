import { describe, expect, it } from 'vitest';
import { TimeFrame } from '@/enums/timeFrame';

describe('The timeFrame enum', () => {
  it('should have the following values', () => {
    expect(TimeFrame.NULL).equals(0);
    expect(TimeFrame.SECONDS).equals(1);
    expect(TimeFrame.MINUTES).equals(2);
    expect(TimeFrame.HOURS).equals(3);
    expect(TimeFrame.DAYS).equals(4);
    expect(TimeFrame.MONTHS).equals(5);
    expect(TimeFrame.YEARS).equals(6);
  });
});
