import type { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import type { TimeFrame } from '@/enums/timeFrame';
import type { ISmtpServerSettings } from '../domain/iSmtpServerSettings';

export interface IUpdateAppRequestData {
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
}
