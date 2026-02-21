import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "./Progress.component";

describe("components/Progress", () => {
  it("should render a progressbar", () => {
    render(<Progress value={50} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should set aria-valuenow to current value", () => {
    render(<Progress value={75} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "75");
  });

  it("should set aria-valuemin to 0", () => {
    render(<Progress value={50} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
  });

  it("should set aria-valuemax defaulting to 100", () => {
    render(<Progress value={50} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("should allow custom max value", () => {
    render(<Progress value={3} max={10} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemax", "10");
  });

  it("should generate percentage-based aria-label when value is provided", () => {
    render(<Progress value={50} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "50% complete");
  });

  it("should use custom label when provided", () => {
    render(<Progress value={50} label='Upload progress' />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "Upload progress");
  });

  it("should use fallback label when value is undefined", () => {
    render(<Progress />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "Progress");
  });

  it("should calculate correct percentage with custom max", () => {
    render(<Progress value={25} max={50} />);

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-label", "50% complete");
  });

  it("should render as a progress element", () => {
    render(<Progress value={50} />);

    const bar = screen.getByRole("progressbar");
    expect(bar.tagName).toBe("PROGRESS");
  });
});
