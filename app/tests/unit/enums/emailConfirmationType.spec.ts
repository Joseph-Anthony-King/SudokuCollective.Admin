import { describe, expect, it } from 'vitest';
import { EmailConfirmationType } from '@/enums/emailConfirmationType';

describe('The emailConfirmationType enum', () => {
  it('should have the following values', () => {
    expect(EmailConfirmationType.NULL).equals(0);
    expect(EmailConfirmationType.NEWPROFILECONFIRMED).equals(1);
    expect(EmailConfirmationType.OLDEMAILCONFIRMED).equals(2);
    expect(EmailConfirmationType.NEWEMAILCONFIRMED).equals(3);
  });
});
