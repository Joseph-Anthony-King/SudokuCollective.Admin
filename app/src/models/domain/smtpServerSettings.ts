import type { ISmtpServerSettings } from '@/interfaces/domain/iSmtpServerSettings';

export class SmtpServerSettings implements ISmtpServerSettings {
  id: number;
  smptServer: string | null;
  port: number;
  userName: string | null;
  password: string | null;
  fromEmail: string | null;
  appId: number;

  constructor(
    id?: number,
    smptServer?: string,
    port?: number,
    userName?: string,
    password?: string,
    fromEmail?: string,
    appId?: number,
  ) {
    id ? (this.id = id) : (this.id = 0);
    smptServer ? (this.smptServer = smptServer) : (this.smptServer = null);
    port ? (this.port = port) : (this.port = 0);
    userName ? (this.userName = userName) : (this.userName = null);
    password ? (this.password = password) : (this.password = null);
    fromEmail ? (this.fromEmail = fromEmail) : (this.fromEmail = null);
    appId ? (this.appId = appId) : (this.appId = 0);
  }
}
