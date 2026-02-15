import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useUploadFile } from "./useUploadFile";

describe("hooks/useUploadFile", () => {
  const createDragEvent = (type: string, files?: File[]) => {
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      dataTransfer: {
        files: files ? Object.assign(files, { length: files.length, item: (i: number) => files[i] }) : [],
      },
    };
    return event;
  };

  it("should initialize with isDragging false and no files", () => {
    const { result } = renderHook(() => useUploadFile());

    expect(result.current.isDragging).toBe(false);
    expect(result.current.selectedFiles).toBeNull();
  });

  it("should set isDragging to true on dragEnter", () => {
    const { result } = renderHook(() => useUploadFile());
    const event = createDragEvent("dragenter");

    act(() => {
      result.current.handleDragEnter(event as never);
    });

    expect(result.current.isDragging).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it("should set isDragging to false on dragLeave", () => {
    const { result } = renderHook(() => useUploadFile());

    act(() => {
      result.current.handleDragEnter(createDragEvent("dragenter") as never);
    });
    expect(result.current.isDragging).toBe(true);

    act(() => {
      result.current.handleDragLeave(createDragEvent("dragleave") as never);
    });
    expect(result.current.isDragging).toBe(false);
  });

  it("should prevent default on dragOver", () => {
    const { result } = renderHook(() => useUploadFile());
    const event = createDragEvent("dragover");

    act(() => {
      result.current.handleDragOver(event as never);
    });

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it("should handle file drop and call onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUploadFile(onChange));
    const files = [new File(["content"], "test.txt", { type: "text/plain" })];
    const event = createDragEvent("drop", files);

    act(() => {
      result.current.handleDrop(event as never);
    });

    expect(result.current.isDragging).toBe(false);
    expect(onChange).toHaveBeenCalled();
  });

  it("should handle file input change", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUploadFile(onChange));
    const files = [new File(["content"], "test.txt", { type: "text/plain" })];

    const event = {
      target: {
        files: Object.assign(files, { length: files.length, item: (i: number) => files[i] }),
      },
    };

    act(() => {
      result.current.handleFileChange(event as never);
    });

    expect(onChange).toHaveBeenCalled();
  });

  it("should not call onChange on drop if no files", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useUploadFile(onChange));
    const event = createDragEvent("drop", []);

    act(() => {
      result.current.handleDrop(event as never);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
