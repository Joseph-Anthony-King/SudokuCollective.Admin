import { IConfirmUserNameRequestData } from "@/interfaces/requests/iConfrimUserNameRequestData";

export class ConfirmUserNameRequestData implements IConfirmUserNameRequestData {
  email: string;
  
  constructor(email: string) {
    this.email = email;
  }
}
