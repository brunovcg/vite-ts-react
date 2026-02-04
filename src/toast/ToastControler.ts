import { CustomToastDialog, type ToastConfig } from "./toast";

export class Toast {
  static open(text: string, params: Exclude<ToastConfig, "text"> = { duration: 5000 }): void {
    const toastBase = document.getElementById("toast-root") as HTMLDivElement;
    if (params.id && toastBase && toastBase.querySelector(`#${params.id}`)) {
      return;
    }

    const newToast = document.createElement("dialog", {
      is: "toast-dialog",
    }) as unknown as CustomToastDialog;

    toastBase?.appendChild(newToast);
    newToast.open({ text, ...params });
  }

  static success(text: string, params: Exclude<ToastConfig, "text"> = { duration: 5000 }): void {
    Toast.open(text, { ...params, variant: "success" });
  }

  static error(text: string, params: Exclude<ToastConfig, "text"> = { duration: 5000 }): void {
    Toast.open(text, { ...params, variant: "error" });
  }

  static warning(text: string, params: Exclude<ToastConfig, "text"> = { duration: 5000 }): void {
    Toast.open(text, { ...params, variant: "warning" });
  }

  static info(text: string, params: Exclude<ToastConfig, "text"> = { duration: 5000 }): void {
    Toast.open(text, { ...params, variant: "info" });
  }
}
