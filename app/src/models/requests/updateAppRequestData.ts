import type { ISmtpServerSettings } from "@/interfaces/domain/iSmtpServerSettings";
import type { IUpdateAppRequestData } from "@/interfaces/requests/iUpdateAppRequestData";
import { ReleaseEnvironment } from "@/enums/releaseEnvironment";
import { TimeFrame } from "@/enums/timeFrame";

export class UpdateAppRequestData implements IUpdateAppRequestData {
  id: number;
  name: string | null;
  license: string | null;
  ownerId: number;
  localUrl: string | null;
  qaUrl: string | null;
  stagingUrl: string | null;
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
  timeFrame: TimeFrame;
  accessDuration: number;
  
  constructor (
    id: number,
    name: string | null,
    license: string | null,
    ownerId: number,
    localUrl: string | null,
    qaUrl: string | null,
    stagingUrl: string | null,
    prodUrl: string | null,
    sourceCodeUrl: string | null,
    isActive: boolean,
    environment: ReleaseEnvironment,
    permitSuperUserAccess: boolean,
    permitCollectiveLogins: boolean,
    disableCustomUrls: boolean,
    customEmailConfirmationAction: string | null,
    customPasswordResetAction: string | null,
    useCustomSMTPServer: boolean,
    smtpServerSettings: ISmtpServerSettings | null,
    timeFrame: TimeFrame,
    accessDuration: number,
  ) {
    id ? (this.id = id) : (this.id = 0);
    name ? (this.name = name) : (this.name = null);
    license ? (this.license = license) : (this.license = null);
    ownerId ? (this.ownerId = ownerId) : (this.ownerId = 0);
    localUrl ? (this.localUrl = localUrl) : (this.localUrl = null);
    qaUrl ? (this.qaUrl = qaUrl) : (this.qaUrl = null);
    stagingUrl ? (this.stagingUrl = stagingUrl) : (this.stagingUrl = null);
    prodUrl ? (this.prodUrl = prodUrl) : (this.prodUrl = null);
    sourceCodeUrl ? (this.sourceCodeUrl = sourceCodeUrl) : (this.sourceCodeUrl = null);
    isActive ? (this.isActive = isActive) : (this.isActive = false);
    environment ? (this.environment = environment) : (this.environment = ReleaseEnvironment.NULL);
    permitSuperUserAccess ? (this.permitSuperUserAccess = permitSuperUserAccess) : (this.permitSuperUserAccess = false);
    permitCollectiveLogins ? (this.permitCollectiveLogins = permitCollectiveLogins) : (this.permitCollectiveLogins = false);
    disableCustomUrls ? (this.disableCustomUrls = disableCustomUrls) : (this.disableCustomUrls = false);
    customEmailConfirmationAction ? (this.customEmailConfirmationAction = customEmailConfirmationAction) : (this.customEmailConfirmationAction = null);
    customPasswordResetAction ? (this.customPasswordResetAction = customPasswordResetAction) : (this.customPasswordResetAction = null);
    useCustomSMTPServer ? (this.useCustomSMTPServer = useCustomSMTPServer) : (this.useCustomSMTPServer = false);
    smtpServerSettings ? (this.smtpServerSettings = smtpServerSettings) : (this.smtpServerSettings = null);
    timeFrame ? (this.timeFrame = timeFrame) : (this.timeFrame = TimeFrame.NULL);
    accessDuration ? (this.accessDuration = accessDuration) : (this.accessDuration = 0);
  }
}
