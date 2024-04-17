import type { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';

export class UpdateUserRequestData implements IUpdateUserRequestData {
  userName: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;

  constructor(
    userName: string | undefined,
    firstName: string | undefined,
    lastName: string | undefined,
    nickName: string | undefined,
    email: string | undefined,
  ) {
    userName ? (this.userName = userName) : (this.userName = '');
    firstName ? (this.firstName = firstName) : (this.firstName = '');
    lastName ? (this.lastName = lastName) : (this.lastName = '');
    nickName ? (this.nickName = nickName) : (this.nickName = '');
    email ? (this.email = email) : (this.email = '');
  }
}
