import type { ISignupRequestData } from '@/interfaces/requests/iSignupRequestData';

export class SignupRequestData implements ISignupRequestData {
  userName: string;
  firstName: string;
  lastName: string;
  nickName: string;
  email: string;
  password: string;
  stayLoggedIn: boolean;

  constructor(
    userName: string,
    firstName: string,
    lastName: string,
    nickName: string,
    email: string,
    password: string,
    stayLoggedIn: boolean,
  ) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.email = email;
    this.password = password;
    this.stayLoggedIn = stayLoggedIn;
  }
}
