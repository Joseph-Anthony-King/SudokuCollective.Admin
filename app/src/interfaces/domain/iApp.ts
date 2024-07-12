import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import type { ISmtpServerSettings } from '@/interfaces/domain/iSmtpServerSettings';
import { User } from '@/models/domain/user';

export interface IApp {
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
}
