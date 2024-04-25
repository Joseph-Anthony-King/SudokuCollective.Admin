export interface ISmtpServerSettings {
  id: number;
  smtpServer: string | null;
  port: number;
  userName: string | null;
  password: string | null;
  fromEmail: string | null;
  appId: number;
}
