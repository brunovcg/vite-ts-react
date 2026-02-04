export class Environment {
  public static getEnv(key: string): string {
    return import.meta.env[key];
  }

  public static isDevelopment(): boolean {
    return (
      this.getEnv("VITE_ENVIRONMENT") === "development" || window.location.hostname === "localhost"
    );
  }

  public static isProduction(): boolean {
    return this.getEnv("VITE_ENVIRONMENT") === "production";
  }

  public static isStaging(): boolean {
    return this.getEnv("VITE_ENVIRONMENT") === "staging";
  }
}
