import { describe, it, expect, vi, beforeEach } from "vitest";
import { dialogController } from "./Dialog.controller";

describe("DialogController", () => {
  beforeEach(() => {
    // Close all open dialogs
    const snapshot = dialogController.getSnapshot();
    snapshot.forEach((dialog) => dialogController.close(dialog.id));
  });

  describe("getSnapshot", () => {
    it("should return empty array initially", () => {
      expect(dialogController.getSnapshot()).toEqual([]);
    });
  });

  describe("open", () => {
    it("should add a dialog to the snapshot", () => {
      dialogController.open("UserPreferencesDialog");

      const snapshot = dialogController.getSnapshot();
      expect(snapshot).toHaveLength(1);
      expect(snapshot[0].id).toBe("UserPreferencesDialog");
    });

    it("should de-duplicate dialogs with the same id", () => {
      dialogController.open("UserPreferencesDialog");
      dialogController.open("UserPreferencesDialog");

      const snapshot = dialogController.getSnapshot();
      expect(snapshot).toHaveLength(1);
    });
  });

  describe("close", () => {
    it("should remove a dialog from the snapshot", () => {
      dialogController.open("UserPreferencesDialog");
      dialogController.close("UserPreferencesDialog");

      expect(dialogController.getSnapshot()).toEqual([]);
    });

    it("should handle closing non-existent dialog gracefully", () => {
      expect(() => dialogController.close("UserPreferencesDialog")).not.toThrow();
    });
  });

  describe("subscribe", () => {
    it("should notify listeners on open", () => {
      const listener = vi.fn();
      const unsubscribe = dialogController.subscribe(listener);

      dialogController.open("UserPreferencesDialog");

      expect(listener).toHaveBeenCalledOnce();
      expect(listener).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: "UserPreferencesDialog" })]));

      unsubscribe();
    });

    it("should notify listeners on close", () => {
      dialogController.open("UserPreferencesDialog");
      const listener = vi.fn();
      const unsubscribe = dialogController.subscribe(listener);

      dialogController.close("UserPreferencesDialog");

      expect(listener).toHaveBeenCalledWith([]);

      unsubscribe();
    });

    it("should return unsubscribe function that stops notifications", () => {
      const listener = vi.fn();
      const unsubscribe = dialogController.subscribe(listener);

      unsubscribe();
      dialogController.open("UserPreferencesDialog");

      expect(listener).not.toHaveBeenCalled();
    });
  });
});
