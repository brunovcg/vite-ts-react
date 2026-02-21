import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Tooltip } from "./Tooltip.component";

describe("components/Tooltip", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render children", () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("should render tooltip content with role=tooltip", () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByRole("tooltip", { hidden: true })).toBeInTheDocument();
  });

  it("should show tooltip on mouse enter after delay", async () => {
    render(
      <Tooltip content='Help text' delay={300}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole("tooltip", { hidden: true }).closest("[data-component='Tooltip']")!;

    fireEvent.mouseEnter(wrapper);

    // Before delay, should not have visible class
    expect(wrapper.className).not.toContain("tooltip-visible");

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(wrapper.className).toContain("tooltip-visible");
  });

  it("should hide tooltip on mouse leave", async () => {
    render(
      <Tooltip content='Help text' delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole("tooltip", { hidden: true }).closest("[data-component='Tooltip']")!;

    fireEvent.mouseEnter(wrapper);
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    fireEvent.mouseLeave(wrapper);

    expect(wrapper.className).not.toContain("tooltip-visible");
  });

  it("should have aria-describedby linking trigger to tooltip when visible", async () => {
    render(
      <Tooltip content='Help text' delay={0}>
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const tooltipId = tooltip.getAttribute("id");
    const wrapper = tooltip.closest("[data-component='Tooltip']")!;

    fireEvent.mouseEnter(wrapper);
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    const trigger = tooltip.previousElementSibling;
    expect(trigger).toHaveAttribute("aria-describedby", tooltipId);
  });

  it("should not have aria-describedby when hidden", () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    const trigger = tooltip.previousElementSibling;
    expect(trigger).not.toHaveAttribute("aria-describedby");
  });

  it("should not show when disabled", async () => {
    render(
      <Tooltip content='Help text' delay={0} disabled>
        <button>Hover me</button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole("tooltip", { hidden: true }).closest("[data-component='Tooltip']")!;

    fireEvent.mouseEnter(wrapper);
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(wrapper.className).not.toContain("tooltip-visible");
  });

  it("should set data-position attribute", () => {
    render(
      <Tooltip content='Help text' position='bottom'>
        <button>Hover me</button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole("tooltip", { hidden: true }).closest("[data-component='Tooltip']");
    expect(wrapper).toHaveAttribute("data-position", "bottom");
  });

  it("should default position to top", () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>,
    );

    const wrapper = screen.getByRole("tooltip", { hidden: true }).closest("[data-component='Tooltip']");
    expect(wrapper).toHaveAttribute("data-position", "top");
  });

  it("should hide tooltip content from screen readers when not visible", () => {
    render(
      <Tooltip content='Help text'>
        <button>Hover me</button>
      </Tooltip>,
    );

    const tooltip = screen.getByRole("tooltip", { hidden: true });
    expect(tooltip).toHaveAttribute("aria-hidden", "true");
  });
});
