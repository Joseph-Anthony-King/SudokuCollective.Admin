export class StaticUtilities {
  static getLicense(): string | undefined {
    return process.env.VUE_APP_LICENSE;
  }
}
