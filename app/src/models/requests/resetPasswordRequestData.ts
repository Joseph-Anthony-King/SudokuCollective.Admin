import type { IResetPasswordRequestData } from '@/interfaces/requests/iResetPasswordRequestData';

export class ResetPasswordRequestData implements IResetPasswordRequestData {
  token: string;
  newPassword: string;

  constructor(token: string, newPassword: string) {
    this.token = token;
    this.newPassword = newPassword;
  }
}
