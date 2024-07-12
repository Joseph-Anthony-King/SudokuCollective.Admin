import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import type { ISmtpServerSettings } from '@/interfaces/domain/iSmtpServerSettings';
import type { IApp } from '@/interfaces/domain/iApp';
import { User } from './user';

export class App implements IApp {
  id: number | null;
  name: string | null;
  license: string | null;
  ownerId: number | null;
  localUrl: string | null;
  testUrl: string | null;
  stagingUrl: string | null;
  prodUrl: string | null;
  sourceCodeUrl: string | null;
  isActive: boolean | null;
  environment: ReleaseEnvironment | null;
  permitSuperUserAccess: boolean | null;
  permitCollectiveLogins: boolean | null;
  disableCustomUrls: boolean | null;
  customEmailConfirmationAction: string | null;
  customPasswordResetAction: string | null;
  useCustomSMTPServer: boolean | null;
  smtpServerSettings: ISmtpServerSettings | null;
  userCount: number | null;
  timeFrame: TimeFrame | null;
  accessDuration: number | null;
  displayInGallery: boolean | null;
  dateCreated: Date | null;
  dateUpdated: Date | null;
  users: User[] | null;
  isEditing: boolean | null;

  constructor(
    id?: number,
    name?: string,
    license?: string,
    ownerId?: number,
    localUrl?: string,
    testUrl?: string,
    stagingUrl?: string,
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
    timeFrame?: number,
    accessDuration?: number,
    displayInGallery?: boolean,
    dateCreated?: Date,
    dateUpdated?: Date,
    users?: User[],
  ) {
    id ? (this.id = id) : (this.id = null);
    name ? (this.name = name) : (this.name = null);
    license ? (this.license = license) : (this.license = null);
    ownerId ? (this.ownerId = ownerId) : (this.ownerId = null);
    localUrl ? (this.localUrl = localUrl) : (this.localUrl = null);
    testUrl ? (this.testUrl = testUrl) : (this.testUrl = null);
    stagingUrl ? (this.stagingUrl = stagingUrl) : (this.stagingUrl = null);
    prodUrl ? (this.prodUrl = prodUrl) : (this.prodUrl = null);
    sourceCodeUrl ? (this.sourceCodeUrl = sourceCodeUrl) : (this.sourceCodeUrl = null);
    isActive !== undefined ? (this.isActive = isActive) : (this.isActive = null);
    environment ? (this.environment = environment) : (this.environment = null);
    permitSuperUserAccess !== undefined
      ? (this.permitSuperUserAccess = permitSuperUserAccess)
      : (this.permitSuperUserAccess = null);
    permitCollectiveLogins !== undefined
      ? (this.permitCollectiveLogins = permitCollectiveLogins)
      : (this.permitCollectiveLogins = null);
    disableCustomUrls !== undefined
      ? (this.disableCustomUrls = disableCustomUrls)
      : (this.disableCustomUrls = null);
    customEmailConfirmationAction
      ? (this.customEmailConfirmationAction = customEmailConfirmationAction)
      : (this.customEmailConfirmationAction = null);
    customPasswordResetAction
      ? (this.customPasswordResetAction = customPasswordResetAction)
      : (this.customPasswordResetAction = null);
    useCutomSMTPServer !== undefined
      ? (this.useCustomSMTPServer = useCutomSMTPServer)
      : (this.useCustomSMTPServer = null);
    smtpServerSettings
      ? (this.smtpServerSettings = smtpServerSettings)
      : (this.smtpServerSettings = null);
    userCount ? (this.userCount = userCount) : (this.userCount = null);
    timeFrame
      ? timeFrame === 1
        ? (this.timeFrame = TimeFrame.SECONDS)
        : timeFrame === 2
          ? (this.timeFrame = TimeFrame.MINUTES)
          : timeFrame === 3
            ? (this.timeFrame = TimeFrame.HOURS)
            : timeFrame === 4
              ? (this.timeFrame = TimeFrame.DAYS)
              : timeFrame === 5
                ? (this.timeFrame = TimeFrame.MONTHS)
                : (this.timeFrame = TimeFrame.YEARS)
      : (this.timeFrame = null);
    accessDuration ? (this.accessDuration = accessDuration) : (this.accessDuration = null);
    displayInGallery !== undefined
      ? (this.displayInGallery = displayInGallery)
      : (this.displayInGallery = null);
    dateCreated ? (this.dateCreated = dateCreated) : (this.dateCreated = null);
    dateUpdated ? (this.dateUpdated = dateUpdated) : (this.dateUpdated = null);
    users ? (this.users = users) : (this.users = null);
    this.isEditing = false;
  }
}
