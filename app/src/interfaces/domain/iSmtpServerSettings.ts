export interface ISmtpServerSettings {
  id: number | null;
  smtpServer: string | null;
  port: number | null;
  userName: string | null;
  password: string | null;
  fromEmail: string | null;
  appId: number | null;
}
