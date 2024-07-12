import type { ISmtpServerSettings } from '@/interfaces/domain/iSmtpServerSettings';

export class SmtpServerSettings implements ISmtpServerSettings {
  id: number | null;
  smtpServer: string | null;
  port: number | null;
  userName: string | null;
  password: string | null;
  fromEmail: string | null;
  appId: number | null;

  constructor(
    id?: number,
    smtpServer?: string,
    port?: number,
    userName?: string,
    password?: string,
    fromEmail?: string,
    appId?: number,
  ) {
    id ? (this.id = id) : (this.id = null);
    smtpServer ? (this.smtpServer = smtpServer) : (this.smtpServer = null);
    port ? (this.port = port) : (this.port = null);
    userName ? (this.userName = userName) : (this.userName = null);
    password ? (this.password = password) : (this.password = null);
    fromEmail ? (this.fromEmail = fromEmail) : (this.fromEmail = null);
    appId ? (this.appId = appId) : (this.appId = null);
  }
}
