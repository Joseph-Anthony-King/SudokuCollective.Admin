import { IUpdateUserRequestData } from '@/interfaces/requests/iUpdateUserRequestData';

export class UpdateUserRequestData implements IUpdateUserRequestData {
  userName: string;
  firstName: string;
  lastName: string;
  nickName: string | null;
  email: string;
  
  constructor(
		userName: string | null,
		firstName: string | null,
		lastName: string | null,
		nickName: string | null,
		email: string | null,) {
    userName ? this.userName = userName : this.userName = '';
    firstName ? this.firstName = firstName : this.firstName = '';
    lastName ? this.lastName = lastName : this.lastName = '';
    this.nickName = nickName;
    email ? this.email = email : this.email = '';
  }
}
