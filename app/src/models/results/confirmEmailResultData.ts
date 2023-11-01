import { EmailConfirmationType } from "@/enums/emailConfirmationType";
import { IConfirmEmailResultData } from "@/interfaces/results/iConfirmEmailResultData";

export class ConfirmEmailResultData implements IConfirmEmailResultData {
  confirmationType: EmailConfirmationType;
  userName: string;
  email: string;
  isUpdate: boolean;
  newEmailAddressConfirmed: boolean;
  confirmationEmailSuccessfullySent: boolean;
  
  constructor(
    confirmationType: number, 
    userName: string, 
    email: string, 
    isUpdate: boolean, 
    newEmailAddressConfirmed: boolean, 
    confirmationEmailSuccessfullySent: boolean) {
      this.confirmationType = confirmationType === 1 ? 
        EmailConfirmationType.NEWPROFILECONFIRMED : confirmationType === 2 ? 
        EmailConfirmationType.OLDEMAILCONFIRMED : EmailConfirmationType.NEWEMAILCONFIRMED;
      this.userName = userName;
      this.email = email;
      this.isUpdate = isUpdate;
      this.newEmailAddressConfirmed = newEmailAddressConfirmed;
      this.confirmationEmailSuccessfullySent = confirmationEmailSuccessfullySent;
    }
}
