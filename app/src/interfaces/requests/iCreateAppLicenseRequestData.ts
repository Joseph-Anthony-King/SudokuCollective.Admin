export interface ICreateAppLicenseRequestData {
  name: string;
  ownerId: number;
  localUrl?: string;
  testUrl?: string;
  stagingUrl?: string;
  prodUrl?: string;
  sourceCodeUrl?: string;
}
