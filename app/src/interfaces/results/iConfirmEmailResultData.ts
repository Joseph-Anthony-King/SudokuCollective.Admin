import { EmailConfirmationType } from "@/enums/emailConfirmationType";

export interface IConfirmEmailResultData {
  confirmationType: EmailConfirmationType,
  userName: string,
  email: string,
  isUpdate: boolean
  newEmailAddressConfirmed: boolean,
  confirmationEmailSuccessfullySent: boolean
}
