import type { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import type { TimeFrame } from '@/enums/timeFrame';
import type { ISmtpServerSettings } from '../domain/iSmtpServerSettings';

export interface IUpdateAppRequestData {
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
  timeFrame: TimeFrame | null;
  accessDuration: number | null;
}
