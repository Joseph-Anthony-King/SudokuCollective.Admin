export class StaticMethods {
  static getLicense(): string | undefined {
    return process.env.VUE_APP_LICENSE;
  }
}
