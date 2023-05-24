import { ReleaseEnvironment } from "@/enums/releaseEnvironment";
import { TimeFrame } from "@/enums/timeFrame";
import { ISmtpServerSettings } from "@/interfaces/domain/ISmtpServerSettings";
import { IApp } from "@/interfaces/domain/iApp";
import { User } from "./user";

export class App implements IApp {
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
	users: User[];
	
	constructor(
		id?: number,
		name?: string,
		license?: string,
		ownerId?: number,
		localUrl?: string,
		stagingUrl?: string,
		qaUrl?: string,
		prodUrl?: string,
		sourceCodeUrl?: string,
		isActive?: boolean,
		environment?: ReleaseEnvironment,
		permitSuperUserAccess?: boolean,
		permitCollectiveLogins?: boolean,
		disableCustomUrls?: boolean,
		customEmailConfirmationAction?: string,
		customPasswordResetAction?: string,
		useCutomSMTPServer?: boolean,
		smtpServerSettings?: ISmtpServerSettings,
		userCount?: number,
		timeFrame?: TimeFrame,
		accessDuration?: number,
		displayInGallery?: boolean,
		dateCreated?: Date,
		dateUpdated?: Date,
		users?: User[]
	) {
		id ? this.id = id : this.id = 0;
		name ? this.name = name : this.name = null;
		license ? this.license = license : this.license = null;
		ownerId ? this.ownerId = ownerId : this.ownerId = 0;
		localUrl ? this.localUrl = localUrl : this.localUrl = null;
		stagingUrl ? this.stagingUrl = stagingUrl : this.stagingUrl = null;
		qaUrl ? this.qaUrl = qaUrl : this.qaUrl = null;
		prodUrl ? this.prodUrl = prodUrl : this.prodUrl = null;
		sourceCodeUrl ? this.sourceCodeUrl = sourceCodeUrl : this.sourceCodeUrl = null;
		isActive ? this.isActive = isActive : this.isActive = false;
		environment ? this.environment = environment : this.environment = ReleaseEnvironment.NULL;
		permitSuperUserAccess ? this.permitSuperUserAccess = permitSuperUserAccess : this.permitSuperUserAccess = false;
		permitCollectiveLogins ? this.permitCollectiveLogins = permitCollectiveLogins : this.permitCollectiveLogins = false;
		disableCustomUrls ? this.disableCustomUrls = disableCustomUrls : this.disableCustomUrls = false;
		customEmailConfirmationAction ? this.customEmailConfirmationAction = customEmailConfirmationAction : this.customEmailConfirmationAction = null;
		customPasswordResetAction ? this.customPasswordResetAction = customPasswordResetAction : this.customPasswordResetAction = null;
		useCutomSMTPServer ? this.useCustomSMTPServer = useCutomSMTPServer : this.useCustomSMTPServer = false;
		smtpServerSettings ? this.smtpServerSettings = smtpServerSettings : this.smtpServerSettings = null;
		userCount ? this.userCount = userCount : this.userCount = 0;
		timeFrame ? this.timeFrame = timeFrame : this.timeFrame = TimeFrame.NULL;
		accessDuration ? this.accessDuration = accessDuration : this.accessDuration = 0;
		displayInGallery ? this.displayInGallery = displayInGallery : this.displayInGallery = false;
		dateCreated ? this.dateCreated = dateCreated : this.dateCreated = null;
		dateUpdated ? this.dateUpdated = dateUpdated : this.dateUpdated = null;
		users ? this.users = users : this.users = [];
	}
}
