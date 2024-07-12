import type { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';

export class UpdateUserRequestData implements IUpdateUserRequestData {
  userName: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;

  constructor(
    userName: string,
    firstName: string,
    lastName: string,
    nickName: string | null,
    email: string,
  ) {
    this.userName = userName;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nickName = nickName;
    this.email = email;
  }
}
