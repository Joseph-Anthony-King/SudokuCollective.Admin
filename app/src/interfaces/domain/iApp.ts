import { ReleaseEnvironment } from "@/enums/releaseEnvironment";
import { TimeFrame } from "@/enums/timeFrame";
import { ISmtpServerSettings } from "@/interfaces/domain/ISmtpServerSettings";
import { User } from "@/models/domain/user";

export interface IApp { 
	id: number;
	name: string | null;
	license: string | null;
	ownerId: number;
	localUrl: string | null;
	stagingUrl: string | null;
	qaUrl: string | null;
	prodUrl: string | null;
	sourceCodeUrl: string | null;
	isActive: boolean;
	environment: ReleaseEnvironment;
	permitSuperUserAccess: boolean;
	permitCollectiveLogins: boolean;
	disableCustomUrls: boolean;
	customEmailConfirmationAction: string | null;
	customPasswordResetAction: string | null;
	useCustomSMTPServer: boolean;
	smtpServerSettings: ISmtpServerSettings | null;
	userCount: number;
	timeFrame: TimeFrame;
	accessDuration: number;
	displayInGallery: boolean;
	dateCreated: Date | null;
	dateUpdated: Date | null;
	users: User[]
}
