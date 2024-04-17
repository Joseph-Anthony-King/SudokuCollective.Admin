import { EmailConfirmationType } from '@/enums/emailConfirmationType';
import type { IConfirmEmailResultData } from '@/interfaces/results/iConfirmEmailResultData';

export class ConfirmEmailResultData implements IConfirmEmailResultData {
  confirmationType: EmailConfirmationType;
  userName: string;
  email: string;

  constructor(confirmationType: number, userName: string, email: string) {
    this.confirmationType =
      confirmationType === 1
        ? EmailConfirmationType.NEWPROFILECONFIRMED
        : confirmationType === 2
          ? EmailConfirmationType.OLDEMAILCONFIRMED
          : EmailConfirmationType.NEWEMAILCONFIRMED;
    this.userName = userName;
    this.email = email;
  }
}
