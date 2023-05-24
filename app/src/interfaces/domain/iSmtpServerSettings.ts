export interface ISmtpServerSettings {
	id: number;
	smptServer: string | null;
	port: number;
	userName: string | null;
	password: string | null;
	fromEmail: string | null;
	appId: number
}
