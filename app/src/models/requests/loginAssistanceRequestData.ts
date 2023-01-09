import { ILoginAssistanceRequestData } from "@/interfaces/requests/ilLoginAssistanceRequestData";

export class LoginAssistanceRequestData implements ILoginAssistanceRequestData {
  email: string;
  
  constructor(email: string) {
    this.email = email;
  }
}
