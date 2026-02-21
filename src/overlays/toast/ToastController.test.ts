import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Toast } from "./ToastControler";

describe("Toast", () => {
  describe("variant shortcuts", () => {
    let openSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      // Mock Toast.open to avoid jsdom limitations with custom elements extending HTMLDialogElement
      openSpy = vi.spyOn(Toast, "open").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call open with success variant", () => {
      Toast.success("Success!");

      expect(openSpy).toHaveBeenCalledWith("Success!", expect.objectContaining({ variant: "success" }));
    });

    it("should call open with error variant", () => {
      Toast.error("Error!");

      expect(openSpy).toHaveBeenCalledWith("Error!", expect.objectContaining({ variant: "error" }));
    });

    it("should call open with warning variant", () => {
      Toast.warning("Warning!");

      expect(openSpy).toHaveBeenCalledWith("Warning!", expect.objectContaining({ variant: "warning" }));
    });

    it("should call open with info variant", () => {
      Toast.info("Info!");

      expect(openSpy).toHaveBeenCalledWith("Info!", expect.objectContaining({ variant: "info" }));
    });

    it("should use default duration of 5000ms", () => {
      Toast.success("Done");

      expect(openSpy).toHaveBeenCalledWith("Done", expect.objectContaining({ duration: 5000 }));
    });

    it("should allow custom duration override", () => {
      Toast.success("Done", { duration: 3000 });

      expect(openSpy).toHaveBeenCalledWith("Done", expect.objectContaining({ duration: 3000 }));
    });

    it("should pass custom id to open", () => {
      Toast.info("Loading", { id: "loading-toast" });

      expect(openSpy).toHaveBeenCalledWith("Loading", expect.objectContaining({ id: "loading-toast", variant: "info" }));
    });
  });

  describe("open", () => {
    let toastRoot: HTMLDivElement;

    beforeEach(() => {
      toastRoot = document.createElement("div");
      toastRoot.id = "toast-root";
      document.body.appendChild(toastRoot);
    });

    afterEach(() => {
      document.body.removeChild(toastRoot);
    });

    it("should not create duplicate toasts with same id", () => {
      // Create an existing toast with the ID
      const existing = document.createElement("dialog");
      existing.id = "unique-toast";
      toastRoot.appendChild(existing);

      // Trying to open a toast with the same id should be a no-op
      Toast.open("Second", { id: "unique-toast", duration: 5000 });

      const dialogs = toastRoot.querySelectorAll("#unique-toast");
      expect(dialogs.length).toBe(1);
    });
  });
});
