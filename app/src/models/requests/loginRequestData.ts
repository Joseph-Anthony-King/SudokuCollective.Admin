import type { ILoginRequestData } from '@/interfaces/requests/iLoginRequestData';

export class LoginRequestData implements ILoginRequestData {
  userName: string;
  password: string;
  stayLoggedIn: boolean;

  constructor(userName: string, password: string, stayLoggedIn: boolean) {
    this.userName = userName;
    this.password = password;
    this.stayLoggedIn = stayLoggedIn;
  }
}
