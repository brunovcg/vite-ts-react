import { Environment } from "../environment/Environment.util";

export type LocalStorageKey = "vida-token";

export class LocalStorageUtil {
  private static environmentPrefix = `vida-${Environment.getEnv("VITE_ENVIRONMENT")}`;

  private static setEnvKey(storageKey: string): string {
    return `${LocalStorageUtil.environmentPrefix}-${storageKey}`;
  }

  public static get(storageKey: LocalStorageKey): string | null {
    return localStorage.getItem(LocalStorageUtil.setEnvKey(storageKey));
  }

  public static set(storageKey: LocalStorageKey, value: string): void {
    localStorage.setItem(LocalStorageUtil.setEnvKey(storageKey), value);
  }

  public static remove(storageKey: LocalStorageKey): void {
    localStorage.removeItem(LocalStorageUtil.setEnvKey(storageKey));
  }

  public static clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(LocalStorageUtil.environmentPrefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}
