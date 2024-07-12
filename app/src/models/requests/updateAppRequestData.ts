import type { ISmtpServerSettings } from '@/interfaces/domain/iSmtpServerSettings';
import type { IUpdateAppRequestData } from '@/interfaces/requests/iUpdateAppRequestData';
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';

export class UpdateAppRequestData implements IUpdateAppRequestData {
  id: number;
  name: string | null;
  license: string | null;
  ownerId: number;
  localUrl: string | null;
  testUrl: string | null;
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

  constructor(
    id: number,
    name: string | null,
    license: string | null,
    ownerId: number,
    localUrl: string | null,
    testUrl: string | null,
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
    this.id = id;
    this.name = name;
    this.license = license;
    this.ownerId = ownerId;
    this.localUrl = localUrl;
    this.testUrl = testUrl;
    this.stagingUrl = stagingUrl;
    this.prodUrl = prodUrl;
    this.sourceCodeUrl = sourceCodeUrl;
    this.isActive = isActive;
    this.environment = environment;
    this.permitSuperUserAccess = permitSuperUserAccess;
    this.permitCollectiveLogins = permitCollectiveLogins;
    this.disableCustomUrls = disableCustomUrls;
    this.customEmailConfirmationAction = customEmailConfirmationAction;
    this.customPasswordResetAction = customPasswordResetAction;
    this.useCustomSMTPServer = useCustomSMTPServer;
    this.smtpServerSettings = smtpServerSettings;
    this.timeFrame = timeFrame;
    this.accessDuration = accessDuration;
  }
}
